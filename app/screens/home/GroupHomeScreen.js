// @flow
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Alert,
  Text,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {format} from 'react-string-format';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {strings} from '../../../Localization/translation';

import {
  cancelGroupInvite,
  followGroup,
  inviteTeam,
  joinTeam,
  leaveTeam,
  unfollowGroup,
} from '../../api/Groups';

import AuthContext from '../../auth/context';
import GroupHomeHeader from '../../components/Home/GroupHomeHeader';
import PostsTabView from '../../components/Home/PostsTabView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import colors from '../../Constants/Colors';
import Verbs from '../../Constants/Verbs';
import HomeFeed from '../homeFeed/HomeFeed';
import GroupHomeButton from './GroupHomeButton';
import {ErrorCodes} from '../../utils/constant';
import {getGamesList, showAlert} from '../../utils';
import MemberList from '../../components/Home/MemberList';
import {ImageUploadContext} from '../../context/ImageUploadContext';
import {createPost} from '../../api/NewsFeeds';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {getCalendarIndex, getGameIndex} from '../../api/elasticSearch';
import {getSetting} from '../challenge/manageChallenge/settingUtility';
import fonts from '../../Constants/Fonts';
import TCGameCard from '../../components/TCGameCard';
import GroupMembersModal from './GroupMembersModal';
import FollowFollowingModal from './FollowFollowingModal';
import JoinButtonModal from './JoinButtomModal';
import EditGroupProfileModal from './EditGroupProfileModal';
import BottomSheet from '../../components/modals/BottomSheet';
import errorCode from '../../Constants/errorCode';
import {JoinPrivacy} from '../../Constants/GeneralConstants';
import {cancelFollowRequest} from '../../api/Users';
import InviteMemberModal from '../../components/InviteMemberModal';
import ClubInviteTeamModal from './ClubInviteTeamModal';
import images from '../../Constants/ImagePath';

// import BottomSheet from '../../components/modals/BottomSheet';

const GroupHomeScreen = ({
  navigation,
  route,
  groupId,
  isAdmin = false,
  pointEvent = 'auto',
  isAccountDeactivated = false,
  groupData = {},
  restrictReturn = false,
  pulltoRefresh = () => {},
  routeParams = {},
}) => {
  const authContext = useContext(AuthContext);

  const [currentUserData, setCurrentUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const mainFlatListRef = useRef();
  const [options, setOptions] = useState([]);

  const renderImageProgress = useMemo(() => <ImageProgress />, []);
  const handleMainRefOnScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: mainFlatListFromTop}}}],
    {useNativeDriver: false},
  );
  const galleryRef = useRef();
  const imageUploadContext = useContext(ImageUploadContext);
  const gameListRefereeModalRef = useRef();
  const [refereeOfferModalVisible, setRefereeOfferModalVisible] =
    useState(false);
  const gameListScorekeeperModalRef = useRef();
  const [scorekeeperOfferModalVisible, setScorekeeperOfferModalVisible] =
    useState(false);
  const [matchData, setMatchData] = useState([]);
  const [refereeSettingObject, setRefereeSettingObject] = useState();
  const [scorekeeperSettingObject, setScorekeeperSettingObject] = useState();

  const [refreshMemberModal, setRefreshMemberModal] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const [visibleEditProfileModal, setVisibleEditProfileModal] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showMembershipInviteModal, setShowMembershipInviteModal] =
    useState(false);
  const [showClubInviteTeamModal, setShoeclubInviteTeamModal] = useState(false);
  const [forTeamJoinClub, setForTeamJoinClub] = useState(false);
  const [visibleChallengesheet, setvisibleChallengeSheet] = useState(false);
  const bottomSheetRef = useRef(null);
  const followModalRef = useRef(null);

  const backButtonHandler = useCallback(() => {
    if (route.params.comeFrom === Verbs.INCOMING_CHALLENGE_SCREEN) {
      navigation.navigate('Account', {
        screen: 'AccountScreen',
      });
    } else if (!restrictReturn) {
      navigation.goBack();
    }

    return true;
  }, [navigation, route.params.comeFrom, restrictReturn]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    if (groupData?.group_id) {
      setCurrentUserData(groupData);
    }
  }, [groupData]);

  const createPostAfterUpload = (dataParams) => {
    let body = dataParams;

    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      body = {
        ...dataParams,
        group_id: authContext.entity.uid,
      };
    }
    createPost({...body, is_gallery: true}, authContext)
      .then(() => {
        if (galleryRef?.current?.refreshGallery) {
          galleryRef.current.refreshGallery();
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callthis = (
    data,
    postDesc,
    tagsOfEntity,
    who_can_see,
    format_tagged_data = [],
  ) => {
    if (postDesc?.trim()?.length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        tagged: tagsOfEntity ?? [],
        who_can_see,
        format_tagged_data,
        user_id: currentUserData.user_id,
      };
      createPostAfterUpload(dataParams);
    } else if (data) {
      const imageArray = data.map((dataItem) => dataItem);
      const dataParams = {
        user_id: currentUserData.user_id,
        text: postDesc && postDesc,
        attachments: [],
        tagged: tagsOfEntity ?? [],
        who_can_see,
        format_tagged_data,
      };
      imageUploadContext.uploadData(
        authContext,
        dataParams,
        imageArray,
        createPostAfterUpload,
      );
    }
  };

  const handleTabOptions = (option) => {
    switch (option) {
      case strings.infoTitle:
        navigation.navigate('EntityInfoScreen', {
          uid: groupId,
          isAdmin,
        });
        break;
      case strings.scheduleTitle:
        navigation.navigate('HomeScheduleScreen', {
          uid: groupId,
          isAdmin,
          isFromHomeScreen: true,
          role: route.params?.role ?? authContext.entity.role,
        });
        break;
      case strings.scoreboard:
        navigation.navigate('EntityScoreboardScreen', {
          uid: groupId,
          isAdmin,
          entityType: groupData.entity_type,
          groupData,
        });
        break;
      case strings.stats:
        navigation.navigate('EntityStatScreen', {
          entityData: currentUserData,
        });
        break;
      case strings.reviews:
        navigation.navigate('EntityReviewScreen', {
          entityData: currentUserData,
        });
        break;
      case strings.galleryTitle:
        navigation.navigate('EntityGallaryScreen', {
          currentUserData,
          isAdmin,
          galleryRef,
          entityType: route?.params?.role ?? authContext.entity?.role,
          entityID: route?.params?.uid ?? authContext.entity?.uid,
          callFunction: () => callthis,
        });
        break;

      default:
        break;
    }
  };

  const ListHeader = () => (
    <>
      <GroupHomeHeader
        groupData={currentUserData}
        sportList={authContext.sports}
        isAdmin={isAdmin}
        onClickMembers={() => {
          if (isAdmin) {
            navigation.navigate('App', {
              screen: 'Members',
              params: {
                groupObj: groupData,
                groupID: groupId,
                fromProfile: true,
                showBackArrow: true,
                comeFrom: 'HomeScreen',
                routeParams: {
                  uid: groupId,
                  role: groupData.entity_type,
                },
              },
            });
          } else {
            bottomSheetRef.current?.present();
          }
        }}
        onClickFollowers={() => {
          followModalRef.current?.present();
        }}
      />
      <MemberList
        list={currentUserData.joined_members}
        isAdmin={isAdmin}
        containerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 25,
        }}
        onPressMember={(groupObject = {}) => {
          if (groupObject?.is_player) {
            navigation.navigate('SportActivityHome', {
              sport: groupData.sport,
              sportType: groupData.sport_type,
              uid: groupObject.user_id,
              entityType: Verbs.entityTypePlayer,
              backScreen: 'HomeScreen',
              backScreenParams: {
                uid: groupData.group_id,
                role: groupData.entity_type,
              },
            });
          } else {
            navigation.push('HomeScreen', {
              uid: groupObject.user_id ?? groupObject.group_id,
              role: groupObject.entity_type ?? Verbs.entityTypePlayer,
            });
          }
        }}
        onPressMore={() => {
          navigation.navigate('App', {
            screen: 'Members',
            params: {
              groupObj: groupData,
              groupID: groupId,
              fromProfile: true,
              showBackArrow: true,
              comeFrom: 'HomeScreen',
              routeParams: {
                uid: groupId,
                role: groupData.entity_type,
              },
            },
          });
        }}
        addMember={() => {
          navigation.navigate('MebmersStack', {
            screen: 'CreateMemberProfileForm1',
            params: {
              showBackArrow: true,
              comeFrom: 'HomeScreen',
              routeParams: {
                uid: groupId,
                role: groupData.entity_type,
              },
            },
          });
        }}
        isDoubleTeam={currentUserData.sport_type === Verbs.doubleSport}
      />
      <GroupHomeButton
        groupData={currentUserData}
        loggedInEntity={authContext.entity}
        isAdmin={isAdmin}
        onPress={handleGroupActions}
      />
      <View style={styles.separator} />
      <PostsTabView
        list={
          groupData?.entity_type === Verbs.entityTypeTeam
            ? [
                strings.infoTitle,
                strings.scheduleTitle,
                strings.scoreboard,
                strings.stats,
                strings.reviews,
              ]
            : [strings.infoTitle, strings.galleryTitle]
        }
        onPress={(option) => {
          handleTabOptions(option);
        }}
      />
    </>
  );

  const callCancelReq = async () => {
    const params = {
      follower_id: currentUserData.follow_request.follower_id,
      following_id: currentUserData.follow_request.following_id,
      activity_id: currentUserData.follow_request.activity_id,
    };

    setLoading(true);
    cancelFollowRequest(params, authContext)
      .then(() => {
        showAlert(strings.followReqCanceled);
        const obj = {
          ...currentUserData,
        };
        delete obj.follow_request;

        setCurrentUserData(obj);

        setLoading(false);
      })
      .catch((error) => {
        showAlert(error.message);
        setLoading(false);
      });
  };

  const callFollowGroup = async (silentlyCall = false) => {
    if (currentUserData.is_pause) {
      showAlert(
        format(strings.thisGroupIsPausedText, currentUserData.entity_type),
      );
      return;
    }

    const params = {
      entity_type: currentUserData.entity_type,
    };
    setLoading(true);
    followGroup(params, groupId, authContext)
      .then((res) => {
        if (res.payload.error_code === errorCode.invitePlayerToJoin) {
          const {user_message} = res.payload;

          showAlert(user_message);

          setLoading(false);
        } else if (res.payload.is_request) {
          setLoading(false);

          const obj = {
            ...currentUserData,
            follow_request: {
              activity_id: res.payload.id,
              follower_id: res.payload.foreign_id,
              following_id: res.payload.target_uid,
            },
          };

          setCurrentUserData(obj);
        } else {
          setRefreshMemberModal(true);
          const obj = {
            ...currentUserData,
            is_following: true,
            follower_count: currentUserData.follower_count + 1,
          };
          setCurrentUserData(obj);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (!silentlyCall) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        }
      });
  };

  const callUnfollowGroup = async () => {
    const params = {
      entity_type: currentUserData.follow_request,
    };
    setLoading(true);
    unfollowGroup(params, groupId, authContext)
      .then(() => {
        setRefreshMemberModal(true);
        const obj = {
          ...currentUserData,
          is_following: false,
          follower_count:
            currentUserData.follower_count > 0
              ? currentUserData.follower_count - 1
              : 0,
        };
        setCurrentUserData(obj);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const inviteToChallenge = () => {
    const obj = groupData.setting;
    const myGroupDetail =
      authContext.entity.role === Verbs.entityTypeTeam
        ? authContext.entity.obj
        : {};
    if (
      myGroupDetail.sport_type === Verbs.doubleSport &&
      (!('player_deactivated' in myGroupDetail) ||
        !myGroupDetail?.player_deactivated) &&
      (!('player_leaved' in currentUserData) ||
        !currentUserData?.player_leaved) &&
      (!('player_leaved' in myGroupDetail) || !myGroupDetail?.player_leaved)
    ) {
      if (
        (obj?.game_duration || obj?.score_rules) &&
        obj?.availibility &&
        obj?.special_rules !== undefined &&
        obj?.general_rules !== undefined &&
        obj?.responsible_for_referee &&
        obj?.responsible_for_scorekeeper &&
        obj?.game_fee &&
        obj?.venue &&
        obj?.refund_policy &&
        obj?.home_away &&
        obj?.game_type
      ) {
        if (myGroupDetail.is_pause === true) {
          Alert.alert(
            format(strings.groupPaused, myGroupDetail.group_name, [
              {text: strings.okTitleText},
            ]),
          );
        } else {
          navigation.navigate('InviteChallengeScreen', {
            setting: obj,
            sportName: currentUserData?.sport,
            sportType: currentUserData?.sport_type,
            groupObj: currentUserData,
          });
        }
      } else {
        setTimeout(() => {
          Alert.alert(
            strings.completeSettingBeforeInvite,
            '',
            [
              {
                text: strings.cancel,
                onPress: () => console.log('Cancel Pressed!'),
              },
              {
                text: strings.okTitleText,
                onPress: () => {
                  if (currentUserData?.is_pause === true) {
                    Alert.alert(strings.yourTeamPaused, '', [
                      {text: strings.okTitleText},
                    ]);
                  } else {
                    navigation.navigate('ManageChallengeScreen', {
                      groupObj: currentUserData,
                      sportName: currentUserData.sport,
                      sportType: currentUserData?.sport_type,
                    });
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }, 1000);
      }
    } else if (myGroupDetail.sport_type === Verbs.doubleSport) {
      if (
        'player_deactivated' in myGroupDetail &&
        myGroupDetail?.player_deactivated
      ) {
        Alert.alert(strings.playerDeactivatedSport, '', [
          {text: strings.okTitleText},
        ]);
      } else if (
        'player_leaved' in currentUserData ||
        currentUserData?.player_leaved
      ) {
        Alert.alert(
          format(strings.groupHaveNo2Player, currentUserData?.group_name),
          '',
          [{text: strings.okTitleText}],
        );
      } else if (
        'player_leaved' in myGroupDetail ||
        myGroupDetail?.player_leaved
      ) {
        Alert.alert(strings.youHaveNo2Player, '', [
          {text: strings.okTitleText},
        ]);
      }
    } else if (myGroupDetail.is_pause === true) {
      Alert.alert(strings.yourTeamPaused, '', [{text: strings.okTitleText}]);
    } else {
      navigation.navigate('InviteChallengeScreen', {
        setting: obj,
        sportName: currentUserData?.sport,
        sportType: currentUserData?.sport_type,
        groupObj: currentUserData,
      });
    }
  };

  const continueToChallenge = () => {
    const obj = groupData.setting;
    const myGroupDetail =
      authContext.entity.role === Verbs.entityTypeTeam
        ? authContext.entity.obj
        : {};
    if (
      currentUserData.sport_type === Verbs.doubleSport &&
      (!('player_deactivated' in currentUserData) ||
        !currentUserData?.player_deactivated) &&
      (!('player_leaved' in currentUserData) ||
        !currentUserData?.player_leaved) &&
      (!('player_leaved' in myGroupDetail) || !myGroupDetail?.player_leaved)
    ) {
      if (
        (obj?.game_duration || obj?.score_rules) &&
        obj?.availibility &&
        obj?.special_rules !== undefined &&
        obj?.general_rules !== undefined &&
        obj?.responsible_for_referee &&
        obj?.responsible_for_scorekeeper &&
        obj?.game_fee &&
        obj?.venue &&
        obj?.refund_policy &&
        obj?.home_away &&
        obj?.game_type
      ) {
        navigation.navigate('ChallengeScreen', {
          setting: obj,
          sportName: currentUserData?.sport,
          sportType: currentUserData?.sport_type,
          groupObj: currentUserData,
        });
      } else {
        Alert.alert(strings.teamHaveNoCompletedSetting, '', [
          {text: strings.okTitleText},
        ]);
      }
    } else if (currentUserData.sport_type === Verbs.doubleSport) {
      if (
        'player_deactivated' in currentUserData &&
        currentUserData?.player_deactivated
      ) {
        Alert.alert(strings.playerDeactivatedSport, '', [
          {text: strings.okTitleText},
        ]);
      } else if (
        'player_leaved' in currentUserData &&
        currentUserData?.player_leaved
      ) {
        Alert.alert(
          format(strings.groupHaveNo2Player, currentUserData?.group_name),
          '',
          [{text: strings.okTitleText}],
        );
      } else if (
        'player_leaved' in myGroupDetail &&
        myGroupDetail?.player_leaved
      ) {
        Alert.alert(strings.youHaveNo2Player, '', [
          {text: strings.okTitleText},
        ]);
      }
    } else {
      navigation.navigate('ChallengeScreen', {
        setting: obj,
        sportName: currentUserData?.sport,
        sportType: currentUserData?.sport_type,
        groupObj: currentUserData,
      });
    }
  };

  const cancelGroupInvitation = (option) => {
    setLoading(true);
    const params = {
      group_id: currentUserData.invite_request.group_id,
      invited_id: currentUserData.invite_request.invited_id,
      activity_id: currentUserData.invite_request.activity_id,
    };
    cancelGroupInvite(params, authContext)
      .then(() => {
        setLoading(false);
        const obj = {
          ...currentUserData,
          invite_request: {
            ...currentUserData.invite_request,
            action: Verbs.declineVerb,
          },
        };
        setCurrentUserData(obj);
        let label = '';

        if (option === strings.cancelInvite) {
          label = strings.inviteCanceled;
        }
        if (option === strings.cancelRequestText) {
          label = strings.alertTitle4;
        }
        if (option === strings.cancelMemberShipInvitationText) {
          label = strings.memberShipInvitationCancelledTextSent;
        }
        setTimeout(() => {
          Alert.alert(label, '', [{text: strings.okTitleText}]);
        }, 10);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const setCurrentGroupData = (type = Verbs.joinVerb) => {
    const obj = {
      ...currentUserData,
    };
    if (currentUserData.entity_type === Verbs.entityTypeClub) {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        if (type === Verbs.joinVerb) {
          obj.joined_teams =
            currentUserData.joined_teams?.length > 0
              ? [...currentUserData.joined_teams, authContext.entity.obj]
              : [authContext.entity.obj];
        }
        if (type === Verbs.leaveVerb) {
          obj.joined_teams = currentUserData.joined_teams.filter(
            (item) => item.group_id !== authContext.entity.uid,
          );
        }
      } else if (
        authContext.entity.role === Verbs.entityTypePlayer ||
        authContext.entity.role === Verbs.entityTypeUser
      ) {
        if (type === Verbs.joinVerb) {
          obj.is_joined = true;
          obj.is_following = true;
          obj.member_count += 1;
          obj.joined_members =
            currentUserData.joined_members?.length > 0
              ? [...currentUserData.joined_members, authContext.entity.obj]
              : [authContext.entity.obj];
        }
        if (type === Verbs.leaveVerb) {
          obj.is_joined = false;
          obj.member_count =
            currentUserData.member_count > 0
              ? currentUserData.member_count - 1
              : 0;
          obj.joined_members = currentUserData.joined_members.filter(
            (item) => item.user_id !== authContext.entity.uid,
          );
        }
      }
    } else if (currentUserData.entity_type === Verbs.entityTypeTeam) {
      if (
        authContext.entity.role === Verbs.entityTypePlayer ||
        authContext.entity.role === Verbs.entityTypeUser
      ) {
        if (type === Verbs.joinVerb) {
          obj.is_joined = true;
          obj.member_count += 1;
          if (
            authContext.entity.role === Verbs.entityTypePlayer ||
            authContext.entity.role === Verbs.entityTypeUser
          ) {
            obj.is_following = true;
          }
        }
        if (type === Verbs.leaveVerb) {
          obj.is_joined = false;
          obj.member_count =
            currentUserData.member_count > 0
              ? currentUserData.member_count - 1
              : 0;
        }
      } else if (authContext.entity.role === Verbs.entityTypeClub) {
        if (type === Verbs.leaveVerb) {
          obj.parent_groups = currentUserData.parent_groups.filter(
            (item) => item !== authContext.entity.uid,
          );
        }
      }
    }

    setCurrentUserData(obj);
  };

  const userJoinGroup = (message = '', isMemberAlreadyExists = false) => {
    setLoading(true);

    const params = {};
    if (isMemberAlreadyExists) {
      params.is_confirm = true;
    }

    if (currentUserData.who_can_join_for_member === JoinPrivacy.acceptedByMe) {
      params.message = message;
    }

    joinTeam(params, groupId, authContext)
      .then((response) => {
        setRefreshMemberModal(true);

        setShowJoinModal(false);

        const inviteRequest = response.payload.data?.action
          ? {...response.payload.data}
          : {
              action: response.payload?.action,
              entity_type: authContext.entity.role,
              invited_id: response.payload?.foreign_id,
              group_id: groupData.group_id,
              activity_id: response.payload?.id,
            };

        if (response.payload.error_code) {
          const obj = {
            ...currentUserData,
            invite_request: inviteRequest,
          };
          setCurrentUserData(obj);
          if (
            response.payload.error_code ===
            ErrorCodes.MEMBERALREADYINVITEERRORCODE
          ) {
            setLoading(false);

            Alert.alert('', response.payload.user_message, [
              {text: strings.okTitleText},
            ]);
          } else if (
            response.payload.error_code ===
            ErrorCodes.MEMBERALREADYREQUESTERRORCODE
          ) {
            setLoading(false);

            Alert.alert('', response.payload.user_message, [
              {text: strings.okTitleText},
            ]);
          } else if (
            response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE
          ) {
            setLoading(false);
            Alert.alert('', response.payload.user_message, [
              {text: strings.cancel},
              {
                text: strings.join,
                onPress: () => userJoinGroup('message', true),
              },
            ]);
          } else {
            setLoading(false);
            Alert.alert('', response.payload.user_message, [
              {text: strings.okTitleText},
            ]);
          }
        } else if (response.payload.action === Verbs.requestVerb) {
          const obj = {
            ...currentUserData,
            invite_request: inviteRequest,
          };
          setCurrentUserData(obj);
          setLoading(false);
          Alert.alert(
            strings.alertmessagetitle,
            format(strings.alreadySendRequestMsg, groupData.group_name),
            [{text: strings.okTitleText}],
          );
        } else {
          setCurrentGroupData(Verbs.joinVerb);
          setLoading(false);
          Alert.alert(
            strings.alertmessagetitle,
            format(strings.alertTitle1, groupData.group_name),
            [{text: strings.okTitleText}],
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userLeaveGroup = () => {
    setLoading(true);
    const params = {};
    leaveTeam(params, groupId, authContext)
      .then(() => {
        setCurrentGroupData(Verbs.leaveVerb);

        setLoading(false);
        setRefreshMemberModal(true);

        showAlert(format(strings.youHaveLeftTheteam, groupData.entity_type));
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteTeam = async () => {
    setLoading(true);

    const params = [groupId];
    inviteTeam(params, authContext.entity.uid, authContext)
      .then((response) => {
        const request = response.payload.length > 0 ? response.payload[0] : {};
        const inviteRequest = {
          activity_id: request.id,
          entity_type: authContext.entity.role,
          group_id: authContext.entity.uid,
          invited_id: groupId,
          action: request.action,
        };

        if (request.error_code) {
          const obj = {
            ...currentUserData,
            invite_request: inviteRequest,
          };
          setCurrentUserData(obj);
          setLoading(false);

          Alert.alert('', request.user_message, [{text: strings.okTitleText}]);
        } else {
          const obj = {...currentUserData, invite_request: inviteRequest};
          setCurrentUserData(obj);
          setLoading(false);
          setTimeout(() => {
            showAlert(strings.memberShipInvitationTextSent);
          }, 10);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const getAlertTitle = () => {
    if (
      groupData.entity_type === Verbs.entityTypeClub &&
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      return strings.alertTitle6;
    }

    if (
      groupData.entity_type === Verbs.entityTypeTeam &&
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      return strings.alertTitle7;
    }

    return strings.alertTitle1;
  };

  const onAccept = (requestId, isMemberAlreadyExists = false) => {
    setLoading(true);
    const params = {};
    if (isMemberAlreadyExists) {
      params.is_confirm = true;
    }
    acceptRequest(params, requestId, authContext)
      .then((response) => {
        setRefreshMemberModal(true);

        setIsInvited(false);

        setShowMembershipInviteModal(false);
        if (
          response.payload?.error_code &&
          response.payload?.error_code === ErrorCodes.MEMBEREXISTERRORCODE
        ) {
          setLoading(false);
          Alert.alert('', response.payload.user_message, [
            {text: strings.cancel},
            {text: strings.join, onPress: () => onAccept(requestId, true)},
          ]);
        } else {
          const group = {
            ...currentUserData,
            is_joined: true,
          };
          if (
            currentUserData?.entity_type === Verbs.entityTypeClub &&
            authContext.entity.role === Verbs.entityTypeTeam
          ) {
            group.joined_teams = [
              ...group.joined_teams,
              authContext.entity.obj,
            ];
          }
          if (
            currentUserData?.entity_type === Verbs.entityTypeTeam &&
            authContext.entity.role === Verbs.entityTypeClub
          ) {
            group.parent_groups = [
              ...group.parent_groups,
              authContext.entity.uid,
            ];
          }
          setCurrentUserData(group);
          setLoading(false);
          setTimeout(() => {
            Alert.alert(
              strings.alertmessagetitle,
              format(getAlertTitle(), groupData.group_name),
              [{text: strings.okTitleText}],
            );
          }, 10);
        }
      })
      .catch((error) => {
        setLoading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setLoading(true);
    declineRequest(requestId, authContext)
      .then(() => {
        setShowMembershipInviteModal(false);
        setLoading(false);
        setCurrentUserData({
          ...currentUserData,
          invite_request: {
            ...currentUserData.invite_request,
            action: Verbs.declineVerb,
          },
        });
        setTimeout(() => {
          Alert.alert(strings.alertTitle5, '', [{text: strings.okTitleText}]);
        }, 10);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const getGamesForReferee = async (refereeId, teamId) => {
    const gameListWithFilter = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {term: {'home_team.keyword': teamId}},
                  {term: {'away_team.keyword': teamId}},
                ],
              },
            },
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'status.keyword': 'accepted'}},
            {
              term: {
                'challenge_referee.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    const refereeList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': refereeId}},
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'cal_type.keyword': Verbs.eventVerb}},
            {match: {blocked: true}},
          ],
        },
      },
    };

    const promiseArr = [
      getGameIndex(gameListWithFilter),
      getCalendarIndex(refereeList),
    ];

    Promise.all(promiseArr)
      .then(async ([gameList, eventList]) => {
        setLoading(false);
        for (const game of gameList) {
          game.isAvailable = true;
          eventList.forEach((slot) => {
            // check if slot start time comes between the game time
            if (
              game.start_datetime <= slot.start_datetime &&
              game.end_datetime >= slot.start_datetime
            ) {
              game.isAvailable = false;
            }

            // check if slot end time comes between the game time
            if (
              game.start_datetime <= slot.end_datetime &&
              game.end_datetime >= slot.end_datetime
            ) {
              game.isAvailable = false;
            }

            // Check if game is under the blocked time
            if (
              slot.start_datetime <= game.start_datetime &&
              slot.end_datetime >= game.start_datetime
            ) {
              game.isAvailable = false;
            }
          });
        }

        const gamedata = await getGamesList(gameList);
        return gamedata;
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };

  const getRefereeGames = () => {
    setLoading(true);
    const headers = {};
    headers.caller_id = currentUserData?.group_id;
    const promiseArr = [
      getGamesForReferee(authContext.entity.uid, groupId),
      getSetting(
        authContext.entity.uid,
        Verbs.entityTypeReferee,
        currentUserData?.sport,
        authContext,
      ),
    ];

    Promise.all(promiseArr)
      .then(([gameList, refereeSetting]) => {
        setLoading(false);
        if (gameList) {
          setMatchData([...gameList]);
        }

        if (
          refereeSetting?.referee_availibility &&
          refereeSetting?.game_fee &&
          refereeSetting?.refund_policy &&
          refereeSetting?.available_area
        ) {
          gameListRefereeModalRef.current.open();
          setRefereeSettingObject(refereeSetting);
        } else {
          setTimeout(() => {
            Alert.alert(strings.configureYourRefereeSetting, '', [
              {text: strings.okTitleText},
            ]);
          }, 10);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getGamesForScorekeeper = async (scorekeeperId, teamId) => {
    const gameListWithFilter = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {term: {'home_team.keyword': teamId}},
                  {term: {'away_team.keyword': teamId}},
                ],
              },
            },
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'status.keyword': 'accepted'}},
            {
              term: {
                'challenge_scorekeepers.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    const scorekeeperList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': scorekeeperId}},
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'cal_type.keyword': Verbs.eventVerb}},
            {match: {blocked: true}},
          ],
        },
      },
    };

    const promiseArr = [
      getGameIndex(gameListWithFilter),
      getCalendarIndex(scorekeeperList),
    ];

    return Promise.all(promiseArr)
      .then(async ([gameList, eventList]) => {
        setLoading(false);

        for (const game of gameList) {
          game.isAvailable = true;
          eventList.forEach((slot) => {
            // check if slot start time comes between the game time
            if (
              game.start_datetime <= slot.start_datetime &&
              game.end_datetime >= slot.start_datetime
            ) {
              game.isAvailable = false;
            }

            // check if slot end time comes between the game time
            if (
              game.start_datetime <= slot.end_datetime &&
              game.end_datetime >= slot.end_datetime
            ) {
              game.isAvailable = false;
            }

            // Check if game is under the blocked time
            if (
              slot.start_datetime <= game.start_datetime &&
              slot.end_datetime >= game.start_datetime
            ) {
              game.isAvailable = false;
            }
          });
        }

        const gamedata = await getGamesList(gameList);
        return gamedata;
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };

  const getScorekeeperGames = () => {
    setLoading(true);
    const headers = {};
    headers.caller_id = currentUserData?.group_id;

    const promiseArr = [
      getGamesForScorekeeper(authContext.entity.uid, groupId),
      getSetting(
        authContext.entity.uid,
        Verbs.entityTypeScorekeeper,
        currentUserData?.sport,
        authContext,
      ),
    ];

    Promise.all(promiseArr).then(([gameList, scorekeeperSetting]) => {
      setLoading(false);

      if (gameList.length > 0) {
        setMatchData([...gameList]);
      }
      if (
        scorekeeperSetting?.scorekeeper_availibility &&
        scorekeeperSetting?.game_fee &&
        scorekeeperSetting?.refund_policy &&
        scorekeeperSetting?.available_area
      ) {
        gameListScorekeeperModalRef.current.open();
        setScorekeeperSettingObject(scorekeeperSetting);
      } else {
        setTimeout(() => {
          Alert.alert(strings.cannotSendOfferSettingConfigure, '', [
            {text: strings.okTitleText},
          ]);
        }, 10);
      }
    });
  };

  const ModalRefereeHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text
        style={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
          marginLeft: 15,
        }}>
        {strings.chooseGameForreferee}
      </Text>
    </View>
  );

  const ModalScorekeeperHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text
        style={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
          marginLeft: 15,
        }}>
        {strings.chooseGameForScorekeeper}
      </Text>
    </View>
  );

  const renderRefereeGames = ({item}) => (
    <TCGameCard
      data={item}
      cardWidth={'88%'}
      onPress={() => {
        const message = '';
        if (message === '') {
          gameListRefereeModalRef.current.close();
          navigation.navigate('RefereeBookingDateAndTime', {
            gameData: item,
            settingObj: refereeSettingObject,
            userData: currentUserData,
            isHirer: true,
            sportName: groupData.sport,
          });
        } else {
          setTimeout(() => Alert.alert(strings.appName, message));
        }
      }}
    />
  );

  const renderScorekeeperGames = ({item}) => (
    <TCGameCard
      data={item}
      cardWidth={'88%'}
      onPress={() => {
        gameListScorekeeperModalRef.current.close();
        navigation.navigate('ScorekeeperBookingDateAndTime', {
          gameData: item,
          settingObj: scorekeeperSettingObject,
          userData: currentUserData,
          isHirer: true,
          navigationName: 'HomeScreen',
          sportName: groupData.sport,
        });
      }}
    />
  );

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{strings.noGamesYet}</Text>
    </View>
  );

  const flatListRefereeProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never',
    bounces: false,
    data: matchData,
    renderItem: renderRefereeGames,
    keyExtractor: (item) => item.group_id,
    ListEmptyComponent: listEmptyComponent,
    style: {marginTop: 15},
  };

  const flatListScorekeeperProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never',
    bounces: false,
    data: matchData,
    renderItem: renderScorekeeperGames,
    keyExtractor: (index) => index.toString(),
    ListEmptyComponent: listEmptyComponent,
    style: {marginTop: 15},
  };

  const handleGroupJoinModal = () => {
    if (currentUserData?.who_can_join_for_member === JoinPrivacy.inviteOnly) {
      showAlert(
        format(strings.thisGroupIsInviteOnly, currentUserData.entity_type),
      );
    } else {
      setShowJoinModal(true);
    }
  };

  const handleGroupActions = (action) => {
    switch (action) {
      case strings.editprofiletitle:
        setVisibleEditProfileModal(true);

        break;

      case strings.removeTeamFromClub:
      case strings.joining:
      case strings.leaveClub:
        if (authContext.entity.role === Verbs.entityTypeTeam) {
          setForTeamJoinClub(true);
          setShoeclubInviteTeamModal(true);
        } else {
          userLeaveGroup();
        }

        break;
      case strings.leaveTeam:
        userLeaveGroup();
        break;

      case strings.invite:
        setShoeclubInviteTeamModal(true);

        break;

      case strings.join:
        handleGroupJoinModal();
        break;

      case strings.following:
      case strings.unfollowText:
        callUnfollowGroup();
        break;

      case strings.followReqSentText:
        // Alert.alert('From Alert');
        setOptions([strings.cancelFollowReqText, strings.cancel]);
        setShowModal(true);
        break;

      case strings.follow:
        callFollowGroup();
        break;

      case strings.challenge:
        continueToChallenge();
        break;

      case strings.refereeOffer:
        getRefereeGames();
        break;

      case strings.scorekeeperOffer:
        getScorekeeperGames();
        break;

      case strings.inviteToChallenge:
        inviteToChallenge();
        break;

      case strings.acceptInvite:
      case strings.acceptRequest:
      case strings.acceptRequet:
        setIsInvited(true);
        setShowMembershipInviteModal(true);

        break;

      case strings.declineInvite:
        onDecline(currentUserData.invite_request.activity_id);
        break;

      case strings.acceptInvitateRequest:
        onAccept(currentUserData.invite_request.activity_id);
        break;

      case strings.declineMemberRequest:
        onDecline(currentUserData.invite_request.activity_id);
        break;

      case strings.cancelInvite:
      case strings.cancelRequestText:
      case strings.cancelMemberShipInvitationText:
        cancelGroupInvitation(action);
        break;
      case strings.inviteMemberText:
        setShowInviteMember(true);
        break;

      default:
        break;
    }
  };

  const handleOptions = (option) => {
    setShowModal(false);

    if (option === strings.cancelFollowReqText) {
      callCancelReq();
    }
  };

  const onChallengePress = () => {
    navigation.navigate('HomeStack', {
      screen: 'ChallengeScreen',
      params: {
        setting: currentUserData.setting,
        sportName: currentUserData?.sport,
        sportType: currentUserData?.sport_type,
        groupObj: currentUserData,
      },
    });
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          opacity: isAccountDeactivated ? 0.5 : 1,
        }}
        pointerEvents={pointEvent}>
        <ActivityLoader visible={loading} />
        <View style={{flex: 1}}>
          <HomeFeed
            onFeedScroll={handleMainRefOnScroll}
            refs={mainFlatListRef}
            userID={route.params.uid ?? authContext.entity.uid}
            navigation={navigation}
            currentUserData={currentUserData}
            isAdmin={route.params.uid === authContext.entity.uid}
            homeFeedHeaderComponent={ListHeader}
            currentTab={0}
            pulltoRefresh={() => {
              setRefreshMemberModal(true);
              pulltoRefresh();
            }}
            routeParams={routeParams}
          />
        </View>

        {renderImageProgress}
      </View>
      <Portal>
        <Modalize
          visible={refereeOfferModalVisible}
          onOpen={() => setRefereeOfferModalVisible(true)}
          snapPoint={hp(50)}
          withHandle={false}
          overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          onPositionChange={(position) => {
            if (position === 'top') {
              setRefereeOfferModalVisible(false);
            }
          }}
          ref={gameListRefereeModalRef}
          HeaderComponent={ModalRefereeHeader}
          flatListProps={flatListRefereeProps}
        />
      </Portal>
      {/* Scorekeeper offer */}
      <Portal>
        <Modalize
          visible={scorekeeperOfferModalVisible}
          onOpen={() => setScorekeeperOfferModalVisible(true)}
          snapPoint={hp(50)}
          withHandle={false}
          overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          onPositionChange={(position) => {
            if (position === 'top') {
              setScorekeeperOfferModalVisible(false);
            }
          }}
          ref={gameListScorekeeperModalRef}
          HeaderComponent={ModalScorekeeperHeader}
          flatListProps={flatListScorekeeperProps}
        />
      </Portal>

      <GroupMembersModal
        bottomSheetRef={bottomSheetRef}
        visibleMemberModal={refreshMemberModal}
        closeModal={() => setRefreshMemberModal(false)}
        groupID={groupId}
        showMember={groupData.show_members}
      />

      <FollowFollowingModal
        followModalRef={followModalRef}
        visibleMemberModal={refreshMemberModal}
        closeModal={() => setRefreshMemberModal(false)}
        groupID={groupId}
        showFollower={groupData.show_followers}
      />
      <JoinButtonModal
        isVisible={showJoinModal}
        closeModal={() => setShowJoinModal(false)}
        currentUserData={currentUserData}
        onJoinPress={(message) => userJoinGroup(message)}
        onAcceptPress={() =>
          onAccept(currentUserData.invite_request.activity_id)
        }
        isInvited={isInvited}
      />

      <JoinButtonModal
        isVisible={showMembershipInviteModal}
        closeModal={() => setShowMembershipInviteModal(false)}
        currentUserData={currentUserData}
        onAcceptPress={() =>
          onAccept(currentUserData.invite_request.activity_id)
        }
        hideMessageBox={true}
        title={strings.memberShipInvitationText}
        forUserRespond={true}
        isInvited={isInvited}
        onDecline={() => onDecline(currentUserData.invite_request.activity_id)}
      />

      <InviteMemberModal
        isVisible={showInviteMember}
        closeModal={() => setShowInviteMember(false)}
        forUser={true}
        currentUserData={currentUserData}
      />

      <EditGroupProfileModal
        visible={visibleEditProfileModal}
        closeModal={() => setVisibleEditProfileModal(false)}
      />

      <ClubInviteTeamModal
        visible={showClubInviteTeamModal}
        closeModal={() => setShoeclubInviteTeamModal()}
        inviteTeamCall={() => clubInviteTeam()}
        leaveClubCall={() => userLeaveGroup()}
        forTeamJoinClub={forTeamJoinClub}
      />

      <BottomSheet
        isVisible={showModal}
        type="ios"
        closeModal={() => setShowModal(false)}
        optionList={options}
        onSelect={handleOptions}
      />
      <BottomSheet
        isVisible={visibleChallengesheet}
        type="ios"
        optionList={[strings.inviteToChallenge, strings.cancel]}
        optionSubTextsList={[strings.challengeSubtext]}
        textStyle={{
          textAlign: 'center',
          color: colors.blueTextcolor,
          fontSize: 20,
        }}
        subTextStyle={{
          textAlign: 'center',
          color: colors.blueTextcolor,
          fontSize: 12,
        }}
        closeModal={() => setvisibleChallengeSheet(false)}
        onSelect={() => {
          setvisibleChallengeSheet(false);
        }}
      />

      {/* if sport is same Dispplay the Botton challege buton */}

      {authContext.entity.role === Verbs.entityTypeTeam &&
        currentUserData.am_i_admin !== true &&
        currentUserData.entity_type === Verbs.entityTypeTeam &&
        currentUserData.sport === authContext.entity.obj.sport &&
        !isAdmin && (
          <View style={styles.bottomButtonContainer}>
            <View
              style={{
                marginTop: 15,
              }}>
              <Text style={{marginBottom: 5}}>
                <Text
                  style={{
                    fontFamily: fonts.RBold,
                    fontSize: 16,
                  }}>
                  {currentUserData.setting.game_fee.fee}
                </Text>{' '}
                <Text style={{fontSize: 16, fontFamily: fonts.RMedium}}>
                  {`${currentUserData.setting.game_fee.currency_type}`}/
                  {strings.match}
                </Text>
              </Text>
              <Text> {strings.AllLevelesText}</Text>
            </View>
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => onChallengePress()}
                style={styles.challengeButtonContainer}>
                <Text style={styles.challengeText}>{strings.challenge}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setvisibleChallengeSheet(true)}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 5,
                  backgroundColor: colors.grayBackgroundColor,
                  marginLeft: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  source={images.horizontaldots}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 25,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: colors.borderlinecolor,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    zIndex: -10,
    marginBottom: 12,
  },
  challengeButtonContainer: {
    height: 40,
    backgroundColor: colors.themeColor,
    justifyContent: 'center',

    alignItems: 'center',
    paddingHorizontal: 23,
    borderRadius: 8,
  },
  challengeText: {
    fontFamily: fonts.RBold,
    lineHeight: 24,
    fontSize: 14,
    color: colors.whiteColor,
  },
});
export default GroupHomeScreen;
