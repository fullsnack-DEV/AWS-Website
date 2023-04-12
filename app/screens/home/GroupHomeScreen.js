// @flow
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Alert, Text} from 'react-native';
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
import {getGamesList, setAuthContextData, setStorage} from '../../utils';
import MemberList from '../../components/Home/MemberList';
import {ImageUploadContext} from '../../context/ImageUploadContext';
import {createPost} from '../../api/NewsFeeds';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {getCalendarIndex, getGameIndex} from '../../api/elasticSearch';
import {getSetting} from '../challenge/manageChallenge/settingUtility';
import fonts from '../../Constants/Fonts';
import TCGameCard from '../../components/TCGameCard';
// import BottomSheet from '../../components/modals/BottomSheet';

const GroupHomeScreen = ({
  navigation,
  route,
  groupId,
  isAdmin = false,
  pointEvent = 'auto',
  isAccountDeactivated = false,
  groupData = {},
}) => {
  const authContext = useContext(AuthContext);

  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const mainFlatListRef = useRef();

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
        break;
      case strings.scoreboard:
        navigation.navigate('EntityScoreboardScreen', {
          uid: groupId,
          isAdmin,
        });
        break;
      case strings.stats:
        navigation.navigate('EntityStatScreen', {
          entityData: currentUserData,
        });
        break;
      case strings.reviews:
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
      />
      <MemberList
        list={groupData.joined_members}
        isAdmin={isAdmin}
        containerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 25,
        }}
        onPressMember={(groupObject) => {
          navigation.push('HomeScreen', {
            uid: groupObject?.group_id,
            role: groupObject?.entity_type,
          });
        }}
        onPressMore={() => {
          navigation.navigate('GroupMembersScreen', {
            groupObj: groupData,
            groupID: groupId,
            fromProfile: true,
          });
        }}
      />
      <GroupHomeButton
        groupData={currentUserData}
        loggedInEntity={authContext.entity}
        isAdmin={isAdmin}
        onPress={() => handleGroupActions()}
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
            : [
                strings.infoTitle,
                strings.scheduleTitle,
                strings.scoreboard,
                strings.stats,
                strings.galleryTitle,
              ]
        }
        onPress={(option) => {
          handleTabOptions(option);
        }}
      />
    </>
  );

  const callFollowGroup = async (silentlyCall = false) => {
    const obj = {
      ...currentUserData,
      is_following: true,
      follower_count: currentUserData.follower_count + 1,
    };
    setCurrentUserData(obj);

    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, groupId, authContext)
      .then(() => {})
      .catch((error) => {
        const group = {
          ...currentUserData,
          is_following: false,
          follower_count: currentUserData.follower_count - 1,
        };
        setCurrentUserData(group);
        if (!silentlyCall) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        }
      });
  };

  const callUnfollowGroup = async () => {
    const obj = {
      ...currentUserData,
      is_following: false,
      follower_count:
        currentUserData.follower_count > 0
          ? currentUserData.follower_count - 1
          : 0,
    };
    setCurrentUserData(obj);
    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, groupId, authContext)
      .then(() => {})
      .catch((error) => {
        const group = {
          ...currentUserData,
          is_following: false,
          follower_count:
            currentUserData.follower_count > 0
              ? currentUserData.follower_count - 1
              : 0,
        };
        setCurrentUserData(group);
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
          Alert.alert(format(strings.groupPaused, myGroupDetail.group_name));
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
                    Alert.alert(strings.yourTeamPaused);
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
        Alert.alert(strings.playerDeactivatedSport);
      } else if (
        'player_leaved' in currentUserData ||
        currentUserData?.player_leaved
      ) {
        Alert.alert(
          format(strings.groupHaveNo2Player, currentUserData?.group_name),
        );
      } else if (
        'player_leaved' in myGroupDetail ||
        myGroupDetail?.player_leaved
      ) {
        Alert.alert(strings.youHaveNo2Player);
      }
    } else if (myGroupDetail.is_pause === true) {
      Alert.alert(strings.yourTeamPaused);
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
        Alert.alert(strings.teamHaveNoCompletedSetting);
      }
    } else if (currentUserData.sport_type === Verbs.doubleSport) {
      if (
        'player_deactivated' in currentUserData &&
        currentUserData?.player_deactivated
      ) {
        Alert.alert(strings.playerDeactivatedSport);
      } else if (
        'player_leaved' in currentUserData &&
        currentUserData?.player_leaved
      ) {
        Alert.alert(
          format(strings.groupHaveNo2Player, currentUserData?.group_name),
        );
      } else if (
        'player_leaved' in myGroupDetail &&
        myGroupDetail?.player_leaved
      ) {
        Alert.alert(strings.youHaveNo2Player);
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

  const cancelGroupInvitation = () => {
    setLoading(true);
    const params = {
      group_id: groupData.invite_request.group_id,
      invited_id: groupData.invite_request.invited_id,
      activity_id: groupData.invite_request.activity_id,
    };
    cancelGroupInvite(params, authContext)
      .then(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userJoinGroup = () => {
    setLoading(true);
    const params = {};
    joinTeam(params, groupId, authContext)
      .then((response) => {
        if (response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE) {
          setLoading(false);
          Alert.alert(
            '',
            response.payload.user_message,
            [
              {
                text: 'Join',
                onPress: () => {
                  joinTeam({...params, is_confirm: true}, groupId, authContext)
                    .then(() => {
                      // Succefully join case
                      currentUserData.is_joined = true;
                      currentUserData.member_count += 1;
                      if (currentUserData.is_following === false) {
                        callFollowGroup(true);
                      }
                      setCurrentUserData(currentUserData);
                    })
                    .catch((error) => {
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, error.message);
                      }, 10);
                    });
                },
                style: 'destructive',
              },
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERALREADYERRORCODE
        ) {
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
          setLoading(false);
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYINVITEERRORCODE
        ) {
          const messageStr = response.payload.user_message;
          setLoading(false);
          Alert.alert(messageStr, '', [
            {
              text: strings.cancelRequestTitle,
              style: 'destructive',
              onPress: () => cancelGroupInvitation(),
            },
            {
              text: strings.cancel,
              style: 'cancel',
              onPress: () => {},
            },
          ]);
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYREQUESTERRORCODE
        ) {
          setLoading(false);
          const messageStr = response.payload.user_message;
          Alert.alert(messageStr, '', [
            {
              text: strings.cancelRequestTitle,
              style: 'destructive',
              // onPress:()=> cancelGroupInvitation()
            },
            {
              text: strings.cancel,
              style: 'cancel',
              onPress: () => {},
            },
          ]);
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERINVITEONLYERRORCODE
        ) {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
        } else if (response.payload.action === Verbs.joinVerb) {
          // Succefully Join case
          setLoading(false);
          currentUserData.is_joined = true;
          currentUserData.member_count += 1;
          if (currentUserData.is_following === false) {
            callFollowGroup(true);
          }
          setCurrentUserData({...currentUserData});
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        } else if (response.payload.action === Verbs.requestVerb) {
          currentUserData.joinBtnTitle = strings.joinRequested;
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, strings.sendRequest);
        } else {
          // Succefully Join case
          currentUserData.is_joined = true;
          currentUserData.member_count += 1;
          if (currentUserData.is_following === false) {
            callFollowGroup(true);
          }
          setCurrentUserData({...currentUserData});
          setLoading(false);

          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
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
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1;
    }
    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, groupId, authContext)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;

        setCurrentUserData({...currentUserData});
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubJoinTeam = () => {
    setLoading(true);
    const e = authContext.entity;
    const tempIds = [];
    tempIds.push(currentUserData.group_id);
    e.obj.parent_groups = tempIds;

    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(e.obj);
    } else {
      currentUserData.joined_teams = [e.obj];
    }

    setCurrentUserData({...currentUserData});
    joinTeam({}, groupId, authContext)
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
      })
      .catch((error) => {
        delete e.obj.parent_group_id;

        if (currentUserData.joined_teams) {
          currentUserData.joined_teams = currentUserData.joined_teams.filter(
            (team) => team.group_id !== e.uid,
          );
        }
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        setStorage('authContextEntity', {...e});
        setCurrentUserData({...currentUserData});
        setLoading(false);
      });
  };

  const clubLeaveTeam = () => {
    setLoading(true);
    const e = authContext.entity;
    e.obj.parent_groups = [];
    authContext.setEntity({...e});
    setStorage('authContextEntity', {...e});
    if (currentUserData.parent_groups) {
      currentUserData.parent_groups = currentUserData.parent_groups.filter(
        (team) => team.group_id !== groupId,
      );
    }

    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, groupId, authContext)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        e.obj.parent_group_id = groupId;
        authContext.setEntity({...e});
        setStorage('authContextEntity', {...e});
        if (currentUserData.joined_teams) {
          currentUserData.joined_teams.push(e.obj);
        } else {
          currentUserData.joined_teams = [e.obj];
        }

        setCurrentUserData({...currentUserData});
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        setStorage('authContextEntity', {...e});
        setCurrentUserData({...currentUserData});
        setLoading(false);
      });
  };

  const clubInviteTeam = async () => {
    setLoading(true);
    const params = [groupId];
    inviteTeam(params, authContext.entity.uid, authContext)
      .then(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`,
          );
        }, 10);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onAccept = (requestId) => {
    setLoading(true);
    acceptRequest({}, requestId, authContext)
      .then(() => {
        // Succefully join case
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;
        setCurrentUserData({
          ...currentUserData,
          is_joined: true,
          member_count: currentUserData.member_count + 1,
        });
        if (currentUserData.is_following === false) {
          callFollowGroup(true);
        }
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }, 10);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setLoading(true);
    declineRequest(requestId, authContext)
      .then(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
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
      .then(([gameList, eventList]) => {
        setLoading(false);
        console.log({gameList, eventList});
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

        return getGamesList(gameList).then((gamedata) => gamedata);
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
            Alert.alert(strings.configureYourRefereeSetting);
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
      .then(([gameList, eventList]) => {
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

        return getGamesList(gameList).then((gamedata) => gamedata);
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
          Alert.alert(strings.cannotSendOfferSettingConfigure);
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
  const handleGroupActions = (action) => {
    switch (action) {
      case strings.editprofiletitle:
        navigation.navigate('EditGroupProfileScreen', {
          placeholder:
            authContext.entity.role === Verbs.entityTypeTeam
              ? strings.teamNamePlaceholder
              : strings.clubNameplaceholder,
          nameTitle:
            authContext.entity.role === Verbs.entityTypeTeam
              ? strings.teamName
              : strings.clubName,
          sportType:
            authContext.entity.role === Verbs.entityTypeTeam
              ? currentUserData.sport_type
              : currentUserData.sports_string,
          isEditProfileTitle: true,
        });
        break;

      // case strings.member:
      //   clubLeaveTeam();
      //   break;

      case strings.joining:
        if (
          authContext.entity.role === Verbs.entityTypePlayer ||
          authContext.entity.role === Verbs.entityTypeUser
        ) {
          userLeaveGroup();
        } else {
          clubLeaveTeam();
        }
        break;

      // case strings.requestSent:
      //   break;

      // case strings.invitePending:
      //   break;

      case strings.invite:
        clubInviteTeam();
        break;

      case strings.join:
        if (
          authContext.entity.role === Verbs.entityTypePlayer ||
          authContext.entity.role === Verbs.entityTypeUser
        ) {
          userJoinGroup();
        } else {
          clubJoinTeam();
        }
        break;

      case strings.following:
        callUnfollowGroup();
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
        onAccept(groupData.invite_request.activity_id);
        break;

      case strings.declineInvite:
        onDecline(groupData.invite_request.activity_id);
        break;

      case strings.acceptInvitateRequest:
        onAccept(groupData.invite_request.activity_id);
        break;

      case strings.declineMemberRequest:
        onDecline(groupData.invite_request.activity_id);
        break;

      case strings.leaveTeamFromClub:
        clubLeaveTeam();
        break;

      default:
        break;
    }
  };

  return (
    <>
      <View
        style={{flex: 1, opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <ActivityLoader visible={loading} />
        <View style={{flex: 1}}>
          <HomeFeed
            onFeedScroll={handleMainRefOnScroll}
            refs={mainFlatListRef}
            homeFeedHeaderComponent={ListHeader}
            currentTab={0}
            currentUserData={currentUserData}
            isAdmin={route.params.uid === authContext.entity.uid}
            navigation={navigation}
            setGalleryData={() => {}}
            userID={route.params.uid ?? authContext.entity.uid}
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
    </>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 25,
  },
});
export default GroupHomeScreen;
