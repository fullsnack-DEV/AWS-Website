import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import FastImage from 'react-native-fast-image';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
  Dimensions,
  Animated,
  ImageBackground,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {format} from 'react-string-format';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {getScroreboardGameDetails, getTeamReviews} from '../../api/Games';

import AuthContext from '../../auth/context';
import {
  getUserDetails,
  followUser,
  unfollowUser,
  inviteUser,
  userActivate,
  sendInvitationInGroup,
} from '../../api/Users';
import {createPost} from '../../api/NewsFeeds';
import {
  getGroupDetails,
  getTeamsOfClub,
  getGroupMembers,
  followGroup,
  unfollowGroup,
  joinTeam,
  leaveTeam,
  inviteTeam,
  groupUnpaused,
  cancelGroupInvite,
} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import ClubHomeTopSection from '../../components/Home/Club/ClubHomeTopSection';
import TeamHomeTopSection from '../../components/Home/Team/TeamHomeTopSection';
import {strings} from '../../../Localization/translation';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import CreateEventButton from '../../components/Schedule/CreateEventButton';
import ReviewSection from '../../components/Home/ReviewSection';

import * as Utility from '../../utils';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';

import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';
import TCSearchBox from '../../components/TCSearchBox';
import TCThinDivider from '../../components/TCThinDivider';
import HomeFeed from '../homeFeed/HomeFeed';
import ProfileScreenShimmer from '../../components/shimmer/account/ProfileScreenShimmer';
import {ImageUploadContext} from '../../context/GetContexts';
import UserHomeHeader from '../../components/Home/UserHomeHeader';
import TCProfileButton from '../../components/TCProfileButton';
import UserProfileScreenShimmer from '../../components/shimmer/account/UserProfileScreenShimmer';
import TCGameCard from '../../components/TCGameCard';
import * as settingUtils from '../challenge/manageChallenge/settingUtility';
import {
  getCalendarIndex,
  getGameIndex,
  getGroupIndex,
} from '../../api/elasticSearch';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {league_Data, history_Data, ErrorCodes} from '../../utils/constant';
import Verbs from '../../Constants/Verbs';
import CongratulationsModal from '../account/registerPlayer/modals/CongratulationsModal';
import OrderedSporList from '../../components/Home/OrderedSporList';
import EntityStatus from '../../Constants/GeneralConstants';

let entityObject = {};

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const galleryRef = useRef();
  const gameListRefereeModalRef = useRef(null);
  const gameListScorekeeperModalRef = useRef(null);

  const imageUploadContext = useContext(ImageUploadContext);
  const isFocused = useIsFocused();
  const mainFlatListRef = useRef();
  const confirmationRef = useRef();
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');

  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const [isUserHome, setIsUserHome] = useState(false);
  const [isClubHome, setIsClubHome] = useState(false);
  const [isTeamHome, setIsTeamHome] = useState(false);
  const [reviewerDetailModalVisible, setReviewerDetailModalVisible] =
    useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [myGroupDetail] = useState(
    authContext.entity.role === Verbs.entityTypeTeam && authContext.entity.obj,
  );
  const [loading, setloading] = useState(false);
  const [userID, setUserID] = useState('');
  const [currentTab] = useState(0);
  const [teamReviewData, setTeamReviewData] = useState();
  const [averageTeamReview, setAverageTeamReview] = useState();
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [scoreboardGameData, setScoreboardGameData] = useState([]);
  const [filterScoreboardGameData, setFilterScoreboardGameData] = useState([]);
  const [scoreboardSearchText, setScoreboardSearchText] = useState([]);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [sportName, setSportName] = useState('');
  const [currentPlayInObject, setCurrentPlayInObject] = useState(null);

  const [challengePopup, setChallengePopup] = useState(false);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState();

  const [settingObject, setSettingObject] = useState();
  const [mySettingObject, setMySettingObject] = useState();
  const [refereeSettingObject, setRefereeSettingObject] = useState();
  const [scorekeeperSettingObject, setScorekeeperSettingObject] = useState();

  const [refereeOfferModalVisible, setRefereeOfferModalVisible] = useState();
  const [scorekeeperOfferModalVisible, setScorekeeperOfferModalVisible] =
    useState();

  const [isDoubleSportTeamCreatedVisible, setIsDoubleSportTeamCreatedVisible] =
    useState(false);

  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [matchData, setMatchData] = useState();
  const [hideScore, SetHideScore] = useState();

  const addRoleActionSheet = useRef();
  const manageChallengeActionSheet = useRef();
  const offerActionSheet = useRef();
  const options =
    authContext.entity.role === Verbs.entityTypeUser
      ? [
          strings.manageChallengeShhetItem,
          strings.sportActivity,
          strings.cancel,
        ]
      : [
          strings.manageChallengeShhetItem,
          // strings.sportActivity,
          strings.cancel,
        ];
  const actionSheet = useRef();
  const [actionSheetTitle, setActionSheetTitle] = useState('');
  const cancelReqActionSheet = useRef();
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [actionObject] = useState({
    activity_id: '',
    entity_type: '',
    group_id: '',
    invited_id: '',
    action: '',
  });
  const createActionObject = useCallback(
    (type, groupId, activityID, invitedId, action) => {
      actionObject.entity_type = type;
      actionObject.group_id = groupId;
      actionObject.activity_id = activityID;
      actionObject.action = action;
      actionObject.invited_id = invitedId;
    },
    [actionObject],
  );

  useEffect(() => {
    setTimeout(() => {
      SetHideScore(true);
    }, 100000);
  }, []);

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    pointEvent,
    isAccountDeactivated,
    isFocused,
  ]);

  const switchQBAccount = useCallback(
    async (accountData, entity) => {
      let currentEntity = entity;
      const entity_type = accountData?.entity_type;
      const uid =
        entity_type === Verbs.entityTypePlayer ? 'user_id' : 'group_id';
      QBLogout()
        .then(() => {
          const {USER, CLUB, TEAM} = QB_ACCOUNT_TYPE;
          let accountType = USER;
          if (entity_type === Verbs.entityTypeClub) accountType = CLUB;
          else if (entity_type === Verbs.entityTypeTeam) accountType = TEAM;

          QBlogin(
            accountData[uid],
            {
              ...accountData,
              full_name: accountData.group_name,
            },
            accountType,
          )
            .then(async (res) => {
              currentEntity = {
                ...currentEntity,
                QB: {...res.user, connected: true, token: res?.session?.token},
              };
              authContext.setEntity({...currentEntity});
              await Utility.setStorage('authContextEntity', {...currentEntity});
              QBconnectAndSubscribe(currentEntity)
                .then((qbRes) => {
                  setloading(false);
                  if (qbRes?.error) {
                    console.log(strings.appName, qbRes?.error);
                  }
                })
                .catch(() => {
                  setloading(false);
                });
            })
            .catch(() => {
              setloading(false);
            });
        })
        .catch(() => {
          setloading(false);
        });
    },
    [authContext],
  );

  const switchProfile = useCallback(
    async (item) => {
      let currentEntity = authContext.entity;

      if (item.entity_type === Verbs.entityTypePlayer) {
        currentEntity = {
          ...currentEntity,
          uid: item.user_id,
          role: Verbs.entityTypeUser,
          obj: item,
        };
      } else if (item.entity_type === Verbs.entityTypeTeam) {
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: Verbs.entityTypeTeam,
          obj: item,
        };
      } else if (item.entity_type === Verbs.entityTypeClub) {
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: Verbs.entityTypeClub,
          obj: item,
        };
      }
      authContext.setEntity({...currentEntity});
      await Utility.setStorage('authContextEntity', {...currentEntity});

      return currentEntity;
    },
    [authContext],
  );

  const onSwitchProfile = useCallback(
    async (item) => {
      switchProfile(item)
        .then((currentEntity) => {
          switchQBAccount(item, currentEntity);

          // show congrats modal when team is created according to new flow

          // show alert when club is created

          // if (authContext.entity.role === Verbs.entityTypeClub) {

          //   Alert.alert(
          //     format(route?.params?.groupName),
          //     strings.clubIsCreated,
          //     authContext.entity.role === Verbs.entityTypeClub
          //       ? strings.clubIsCreatedSub
          //       : strings.teamCreatedSub,

          //     [
          //       {
          //         text: 'OK',
          //         onPress: () => console.log('pressed'),
          //       },
          //     ],
          //     {cancelable: false},
          //   );
          // }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [switchProfile, switchQBAccount],
  );

  useEffect(() => {
    if (route.params?.isEntityCreated) {
      onSwitchProfile(route?.params?.entityObj);
      setCongratulationsModal(true);
    }
  }, [route.params, onSwitchProfile]);

  useEffect(() => {
    if (route?.params?.isDoubleSportTeamCreated) {
      setIsDoubleSportTeamCreatedVisible(true);
    }
  }, [route?.params?.isDoubleSportTeamCreated]);

  useEffect(() => {
    if (isFocused) {
      const entity = authContext.entity;
      const uid = route?.params?.uid || entity.uid || entity.auth.user_id;

      getScroreboardGameDetails(uid, authContext)
        .then((res) => {
          setScoreboardGameData(res.payload);
        })
        .catch((error) => {
          console.log('error :-', error);
        });
    }
  }, [isFocused, authContext, route.params?.uid]);

  useEffect(() => {
    if (route?.params?.fromAccountScreen) {
      const navigateScreen = route?.params?.navigateToScreen;
      const params = route?.params?.homeNavigateParams;
      const allParams = route?.params ?? {};
      delete allParams?.fromAccountScreen;
      delete allParams?.navigateToScreen;
      delete allParams?.homeNavigateParams;
      navigation.setParams(allParams);
      navigation.push(navigateScreen, params);
    }
  }, [route?.params, navigation]);

  const getSettingOfBoth = useCallback(
    (details) => {
      settingUtils
        .getSetting(
          route?.params?.uid ?? authContext.entity.uid,
          authContext.entity.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer)
            ? Verbs.entityTypeUser
            : Verbs.entityTypeTeam,
          details.sport,
          authContext,
          authContext.entity.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer)
            ? details.sport_type
            : '',
        )
        .then((res3) => {
          setSettingObject(res3);
        })
        .catch(() => {
          setFirstTimeLoading(false);

          // navigation.goBack();
        });

      settingUtils
        .getSetting(
          authContext?.entity?.uid,
          authContext.entity.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer)
            ? Verbs.entityTypeUser
            : Verbs.entityTypeTeam,
          authContext.entity.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer)
            ? currentPlayInObject?.sport
            : currentUserData?.sport,
          authContext,
          authContext.entity.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer)
            ? currentPlayInObject?.sport_type
            : currentUserData?.sport_type,
        )
        .then((res4) => {
          setMySettingObject(res4);
        })
        .catch(() => {
          setFirstTimeLoading(false);

          // navigation.goBack();
        });
    },
    [authContext, currentPlayInObject, currentUserData, route.params.uid],
  );

  const getUserData = useCallback(
    (uid, admin) => {
      // setloading(true);

      getUserDetails(uid, authContext, !admin)
        .then((res1) => {
          const userDetails = res1.payload;
          // Team to user case for invite Functionality
          if (!admin && userDetails.invite_request) {
            createActionObject(
              userDetails.invite_request.entity_type,
              userDetails.invite_request.group_id,
              userDetails.invite_request.activity_id,
              userDetails.invite_request.invited_id,
              userDetails.invite_request.action,
            );
            if (
              userDetails.invite_request.entity_type === Verbs.entityTypeUser
            ) {
              userDetails.inviteBtnTitle = strings.inviteRequested;
            } else if (
              userDetails.invite_request.entity_type === Verbs.entityTypeClub ||
              userDetails.invite_request.entity_type === Verbs.entityTypeTeam
            ) {
              userDetails.inviteBtnTitle = strings.invited;
            }
          } else {
            userDetails.inviteBtnTitle = strings.invite;
          }
          const groupQuery = {
            query: {
              terms: {
                _id: [
                  ...(res1?.payload?.teamIds ?? []),
                  ...(res1?.payload?.clubIds ?? []),
                ],
              },
            },
          };
          getGroupIndex(groupQuery).then((res2) => {
            const data = {
              ...userDetails,
              joined_teams: res2.filter(
                (obj) => obj.entity_type === Verbs.entityTypeTeam,
              ),
              joined_clubs: res2.filter(
                (obj) => obj.entity_type === Verbs.entityTypeClub,
              ),
            };

            setCurrentUserData(data);
            entityObject = data;
            setIsClubHome(false);
            setIsTeamHome(false);
            setIsUserHome(true);
            setUserID(uid);
            setFirstTimeLoading(false);
          });
        })
        .catch((errResponse) => {
          setFirstTimeLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, errResponse);
          }, 10);
          navigation.goBack();
        });
    },
    [authContext, createActionObject, navigation],
  );

  const getData = useCallback(
    async (uid, role, admin) => {
      const userHome = role === Verbs.entityTypeUser;
      const clubHome = role === Verbs.entityTypeClub;
      const teamHome = role === Verbs.entityTypeTeam;

      // setloading(true);
      if (userHome) {
        getUserData(uid, admin);
      } else {
        const promises = [
          getGroupDetails(uid, authContext, !admin),
          getGroupMembers(uid, authContext),
        ];
        if (clubHome) {
          promises.push(getTeamsOfClub(uid, authContext));
        }
        Promise.all(promises)
          .then(([res1, res2, res3]) => {
            const groupDetails = {...res1.payload};
            setCurrentUserData(res1.payload);

            if (res1?.payload?.avg_review) {
              let array = Object.keys(res1?.payload?.avg_review);
              array = array.filter((e) => e !== 'total_avg');
              const teamProperty = [];

              for (let i = 0; i < array.length; i++) {
                const obj = {
                  [array[i]]: res1?.payload?.avg_review[array[i]],
                };
                teamProperty.push(obj);
              }

              setAverageTeamReview(teamProperty);
            } else {
              setAverageTeamReview();
            }
            groupDetails.joined_leagues = league_Data;
            groupDetails.history = history_Data;
            groupDetails.joined_members = res2.payload;
            if (clubHome) {
              groupDetails.joined_teams = res3.payload;
            }
            if (groupDetails.invite_request) {
              createActionObject(
                groupDetails.invite_request.entity_type,
                uid,
                groupDetails.invite_request.activity_id,
                groupDetails.invite_request.invited_id,
                groupDetails.invite_request.action,
              );

              if (
                groupDetails.invite_request.entity_type === Verbs.entityTypeUser
              ) {
                groupDetails.joinBtnTitle = strings.joinRequested;
              } else if (
                groupDetails.invite_request.entity_type ===
                  Verbs.entityTypeClub ||
                groupDetails.invite_request.entity_type === Verbs.entityTypeTeam
              ) {
                groupDetails.joinBtnTitle = strings.invited;
              }
            } else {
              groupDetails.joinBtnTitle = strings.join;
            }
            entityObject = groupDetails;
            setCurrentUserData({...groupDetails});
            setIsClubHome(clubHome);
            setIsTeamHome(teamHome);
            setIsUserHome(userHome);
            setUserID(uid);
            setFirstTimeLoading(false);
            getSettingOfBoth(groupDetails);
          })
          .catch(() => {
            setFirstTimeLoading(false);

            // navigation.goBack();
          });
      }
    },
    [authContext, createActionObject, getSettingOfBoth, getUserData],
  );

  useEffect(() => {
    setFirstTimeLoading(true);
    const loginEntity = authContext.entity;
    const uid = route.params.uid ?? loginEntity.uid;
    const role = route.params.role ?? loginEntity.role;
    let admin = false;
    if (loginEntity.uid === uid) {
      admin = true;
      setIsAdmin(true);
    }

    getData(uid, role, admin);
  }, [authContext.entity, route?.params, getData]);

  useEffect(() => {
    if (isTeamHome) {
      getTeamReviews(
        route?.params?.uid || authContext.entity.uid,
        true,
        authContext,
      )
        .then((res) => {
          if (res?.payload) {
            // setAverageTeamReview(teamProperty);
            setTeamReviewData(res?.payload);
          } else {
            setAverageTeamReview([]);
            setTeamReviewData();
          }
        })
        .catch((error) =>
          Alert.alert(strings.alertmessagetitle, error.message),
        );
    }
  }, [authContext, isTeamHome, route?.params?.uid]);

  const reSetActionObject = () => {
    actionObject.entity_type = '';
    actionObject.group_id = '';
    actionObject.activity_id = '';
    actionObject.action = '';
    actionObject.invited_id = '';
  };

  const renderHeader = useMemo(
    () => (
      <Header
        showBackgroundColor={true}
        mainContainerStyle={{
          paddingBottom: 0,
        }}
        leftComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: 270,
              width: width - 100,
            }}>
            {route?.params?.backButtonVisible === true && (
              <TouchableOpacity
                onPress={() => {
                  if (route.params?.comeFrom === 'IncomingChallengeSettings') {
                    navigation.navigate('AccountScreen');
                  } else if (
                    route?.params?.isEntityCreated &&
                    route?.params?.backButtonVisible
                  ) {
                    navigation.pop(4);
                  } else {
                    navigation.goBack();
                  }
                }}
                hitSlop={Utility.getHitSlop(20)}
                // disabled={!route?.params?.backButtonVisible}
              >
                <Image
                  source={images.backArrow}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: colors.lightBlackColor,
                    marginRight: 15,
                  }}
                />
              </TouchableOpacity>
            )}
            <Text numberOfLines={1} style={styles.userNavigationTextStyle}>
              {currentUserData?.full_name || currentUserData?.group_name}
            </Text>
            <Image source={images.path} style={styles.downArrowImage} />
          </View>
        }
        leftContainerStyle={{flex: 1}}
        centerComponent={<View></View>}
        rightComponent={
          <View>
            {authContext.entity.uid !== currentUserData.group_id &&
              authContext.entity.uid !== currentUserData?.user_id && (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      currentUserData.entity_type === Verbs.entityTypePlayer ||
                      currentUserData.entity_type === Verbs.entityTypeUser
                    ) {
                      onUserAction('message');
                    } else if (
                      currentUserData.entity_type === Verbs.entityTypeClub
                    ) {
                      onClubAction('message');
                    } else if (
                      currentUserData.entity_type === Verbs.entityTypeTeam
                    ) {
                      onTeamAction('message');
                    }
                  }}
                  style={styles.statusInnerViewStyle}>
                  <Image
                    style={styles.messageImage}
                    source={images.tab_message}
                  />
                </TouchableOpacity>
              )}
            {isAdmin && (isUserHome || isTeamHome) && (
              <View
                style={{opacity: isAccountDeactivated ? 0.5 : 1}}
                pointerEvents={pointEvent}>
                <TouchableOpacity
                  hitSlop={Utility.getHitSlop(25)}
                  onPress={() => {
                    manageChallengeActionSheet.current.show();
                  }}>
                  <Image
                    source={images.threeDotIcon}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: colors.lightBlackColor,
                      resizeMode: 'contain',
                      // marginRight: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />
    ),
    [currentUserData, isAdmin, isUserHome, isTeamHome],
  );

  const createPostAfterUpload = useCallback(
    (dataParams) => {
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
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext],
  );

  const callthis = useCallback(
    (data, postDesc, tagsOfEntity, who_can_see, format_tagged_data = []) => {
      if (postDesc?.trim()?.length > 0 && data?.length === 0) {
        const dataParams = {
          text: postDesc,
          tagged: tagsOfEntity ?? [],
          who_can_see,
          format_tagged_data,
        };
        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
        const dataParams = {
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
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  const callFollowUser = async () => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    followUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callUnfollowUser = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    unfollowUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteUser = async () => {
    setloading(true);
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, userID, authContext)
      .then((response) => {
        currentUserData.inviteBtnTitle = strings.invited;
        entityObject = currentUserData;
        setloading(false);
        createActionObject(
          authContext.entity.role,
          authContext.entity.uid,
          response.payload.id,
          userID,
          Verbs.inviteVerb,
        );
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            format(
              strings.entityInvitedSuccessfully,
              `${currentUserData.first_name} ${currentUserData.last_name}`,
            ),
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callFollowGroup = useCallback(
    async (silentlyCall = false) => {
      currentUserData.is_following = true;
      currentUserData.follower_count += 1;
      entityObject = currentUserData;

      setCurrentUserData({...currentUserData});

      const params = {
        entity_type: currentUserData.entity_type,
      };
      followGroup(params, userID, authContext)
        .then(() => {})
        .catch((error) => {
          currentUserData.is_following = false;
          currentUserData.follower_count -= 1;
          entityObject = currentUserData;

          setCurrentUserData({...currentUserData});
          if (silentlyCall === false) {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error.message);
            }, 10);
          }
        });
    },
    [authContext, currentUserData, userID],
  );

  const callUnfollowGroup = useCallback(async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userID]);

  const userJoinGroup = useCallback(() => {
    setloading(true);
    const params = {};
    joinTeam(params, userID, authContext)
      .then((response) => {
        /*
        if (response.payload.error_code === 101) {
          Alert.alert(
            '',
            response.payload.user_message,
            [
              {
                text: 'Join',
                onPress: () => {
                  joinTeam({...params, is_confirm: true}, userID, authContext)
                    .then(() => {})
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
        }
        */
        if (response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE) {
          Alert.alert(
            '',
            response.payload.user_message,
            [
              {
                text: 'Join',
                onPress: () => {
                  joinTeam({...params, is_confirm: true}, userID, authContext)
                    .then(() => {
                      // Succefully join case
                      currentUserData.is_joined = true;
                      currentUserData.member_count += 1;
                      if (currentUserData.is_following === false) {
                        callFollowGroup(true);
                      }
                      entityObject = currentUserData;
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
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYINVITEERRORCODE
        ) {
          setloading(false);
          const messageStr = response.payload.user_message;
          setActionSheetTitle(messageStr);
          setloading(false);
          setTimeout(() => {
            actionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYREQUESTERRORCODE
        ) {
          setloading(false);
          const messageStr = response.payload.user_message;
          setActionSheetTitle(messageStr);
          setTimeout(() => {
            cancelReqActionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERINVITEONLYERRORCODE
        ) {
          setloading(false);
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
        } else if (response.payload.action === Verbs.joinVerb) {
          // Succefully Join case
          setloading(false);
          currentUserData.is_joined = true;
          currentUserData.member_count += 1;
          if (currentUserData.is_following === false) {
            callFollowGroup(true);
          }
          entityObject = currentUserData;
          setCurrentUserData({...currentUserData});
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        } else if (response.payload.action === Verbs.requestVerb) {
          createActionObject(
            authContext.entity.role,
            currentUserData.group_id,
            response.payload.id,
            authContext.entity.uid,
            response.payload.action,
          );
          currentUserData.joinBtnTitle = strings.joinRequested;
          entityObject = currentUserData;
          setloading(false);
          Alert.alert(strings.alertmessagetitle, strings.sendRequest);
        } else {
          // Succefully Join case
          currentUserData.is_joined = true;
          setloading(false);
          currentUserData.member_count += 1;
          if (currentUserData.is_following === false) {
            callFollowGroup(true);
          }
          entityObject = currentUserData;
          setCurrentUserData({...currentUserData});
          createActionObject(
            authContext.entity.role,
            currentUserData.group_id,
            response.payload.id,
            authContext.entity.uid,
            response.payload.action,
          );
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [
    authContext,
    callFollowGroup,
    createActionObject,
    currentUserData,
    userID,
  ]);

  const userLeaveGroup = useCallback(() => {
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, userID, currentUserData]);

  const clubInviteTeam = useCallback(async () => {
    setloading(true);
    const params = [userID];
    inviteTeam(params, authContext.entity.uid, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userID]);

  const clubJoinTeam = () => {
    const e = authContext.entity;
    const tempIds = [];
    tempIds.push(currentUserData.group_id);
    e.obj.parent_groups = tempIds;

    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(e.obj);
    } else {
      currentUserData.joined_teams = [e.obj];
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    joinTeam({}, userID, authContext)
      .then(async (response) => {
        const entity = authContext.entity;

        entity.auth.user = response.payload;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        authContext.setUser(response.payload);
        await Utility.setStorage('authContextUser', response.payload);
        await Utility.setStorage('authContextEntity', {...entity});
      })
      .catch((error) => {
        delete e.obj.parent_group_id;

        if (currentUserData.joined_teams) {
          currentUserData.joined_teams = currentUserData.joined_teams.filter(
            (team) => team.group_id !== e.uid,
          );
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
      });
  };

  const onMessageButtonPress = useCallback(
    (user) => {
      const uid =
        user?.entity_type === Verbs.entityTypePlayer ||
        user?.entity_type === Verbs.entityTypeUser
          ? user?.user_id
          : user?.group_id;

      // navigation.navigate('MessageChat', {userId: uid});
      navigation.push('MessageChat', {
        screen: 'MessageChat',
        params: {userId: uid},
      });
    },
    [navigation],
  );
  const onDotPress = () => {
    offerActionSheet.current.show();
  };
  const clubLeaveTeam = () => {
    const e = authContext.entity;
    e.obj.parent_groups = [];
    authContext.setEntity({...e});
    Utility.setStorage('authContextEntity', {...e});
    if (currentUserData.parent_groups) {
      currentUserData.parent_groups = currentUserData.parent_groups.filter(
        (team) => team.group_id !== userID,
      );
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        e.obj.parent_group_id = userID;
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        if (currentUserData.joined_teams) {
          currentUserData.joined_teams.push(e.obj);
        } else {
          currentUserData.joined_teams = [e.obj];
        }
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        entityObject = currentUserData;
        setCurrentUserData({...currentUserData});
      });
  };

  const onUserAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowUser();
          break;
        case Verbs.unfollowVerb:
          callUnfollowUser();
          break;
        case Verbs.inviteVerb:
          if (actionObject.action === Verbs.requestVerb) {
            //
          } else if (actionObject.action === Verbs.inviteVerb) {
            setActionSheetTitle(
              format(strings.alreadySendRequestMsg, currentUserData.full_name),
            );
            setTimeout(() => {
              cancelReqActionSheet.current.show();
            }, 10);
          } else {
            clubInviteUser();
          }
          break;
        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);
          break;
        case Verbs.editVerb:
          // navigation.navigate('EditPersonalProfileScreen');
          // navigation.navigate('PersonalInformationScreen');
          navigation.navigate('PersonalInformationScreen', {
            isEditProfile: true,
          });
          break;
        default:
      }
    },
    [
      callFollowUser,
      callUnfollowUser,
      clubInviteUser,
      currentUserData,
      navigation,
      onMessageButtonPress,
    ],
  );

  const onClubAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowGroup();
          break;
        case Verbs.unfollowVerb:
          callUnfollowGroup();
          break;
        case Verbs.joinVerb:
          userJoinGroup();
          break;
        case Verbs.leaveVerb:
          userLeaveGroup();
          break;
        case Verbs.joinTeamVerb:
          // console.log('authContext?.entity?.obj?.parent_groups',authContext?.entity?.obj?.parent_groups);
          // console.log('currentUserData?.group_id',currentUserData?.group_id);
          // if (
          //   authContext?.entity?.obj?.parent_groups?.includes(
          //     currentUserData?.group_id,
          //   )
          // ) {
          //   clubJoinTeam();
          //   Alert.alert(
          //     strings.alertmessagetitle,
          //     strings.alreadyjoinclubmessage,
          //   );
          // } else {
          //   clubJoinTeam();
          // }
          clubJoinTeam();
          break;
        case Verbs.leaveTeamVerb:
          clubLeaveTeam();
          break;
        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);
          break;
        case Verbs.editVerb:
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamName
                : strings.clubName,
            sportType: currentUserData.sports_string,
            isEditProfileTitle: true,
          });
          break;
        default:
      }
    },
    [
      authContext.entity.obj.parent_groups,
      authContext.entity.role,
      callFollowGroup,
      callUnfollowGroup,
      clubJoinTeam,
      clubLeaveTeam,
      currentUserData,
      navigation,
      onMessageButtonPress,
      userJoinGroup,
      userLeaveGroup,
    ],
  );

  const onTeamAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowGroup();
          break;
        case Verbs.unfollowVerb:
          callUnfollowGroup();
          break;
        case Verbs.joinVerb:
          if (actionObject.action === Verbs.requestVerb) {
            setActionSheetTitle(
              format(strings.alreadySendRequestMsg, currentUserData.group_name),
            );
            setTimeout(() => {
              cancelReqActionSheet.current.show();
            }, 10);
          } else if (actionObject.action === Verbs.inviteVerb) {
            setActionSheetTitle(
              format(strings.alreadyInviteMsg, currentUserData.group_name),
            );
            setTimeout(() => {
              actionSheet.current.show();
            }, 10);
          } else {
            userJoinGroup();
          }
          break;
        case Verbs.leaveVerb:
          userLeaveGroup();
          break;
        case Verbs.inviteVerb:
          clubInviteTeam();
          break;
        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);

          break;
        case Verbs.dotVerb:
          onDotPress();
          break;
        case Verbs.editVerb:
          // edit code here
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamName
                : strings.clubName,
            sportType: currentUserData.sport_type,
            isEditProfileTitle: true,
          });
          break;
        default:
      }
    },
    [
      authContext.entity.role,
      callFollowGroup,
      callUnfollowGroup,
      clubInviteTeam,
      currentUserData,
      navigation,
      onMessageButtonPress,
      userJoinGroup,
      userLeaveGroup,
      actionObject,
    ],
  );

  const onTeamPress = useCallback(
    (groupObject) => {
      navigation.push('HomeScreen', {
        uid: groupObject?.group_id,
        backButtonVisible: true,
        role: groupObject?.entity_type,
      });
    },
    [navigation],
  );

  const onGroupListPress = useCallback(
    (groupList, type) => {
      navigation.push('GroupListScreen', {
        groups: groupList,
        entity_type: type,
      });
    },
    [navigation],
  );

  const scorekeeperInModal = useCallback(
    (scorekeeperInObject) => {
      if (scorekeeperInObject) {
        if (currentUserData) {
          const scorekeeperSport = (
            currentUserData.scorekeeper_data ?? []
          ).find(
            (scorekeeperItem) =>
              scorekeeperItem.sport === scorekeeperInObject.sport,
          );

          navigation.navigate('SportActivityHome', {
            sport: scorekeeperSport?.sport,
            sportType: scorekeeperSport?.sport_type,
            uid: route.params?.uid ?? authContext.uid,
            entityType: Verbs.entityTypeScorekeeper,
            showPreview: true,
          });
        }
      } else {
        navigation.navigate('RegisterScorekeeper');
      }
    },
    [authContext, route?.params, currentUserData, navigation],
  );

  const refereesInModal = useCallback(
    (refereeInObject) => {
      if (refereeInObject) {
        if (currentUserData) {
          const refereeSport = (currentUserData.referee_data ?? []).find(
            (refereeItem) => refereeItem.sport === refereeInObject.sport,
          );

          navigation.navigate('SportActivityHome', {
            sport: refereeSport?.sport,
            sportType: refereeSport?.sport_type,
            uid: route.params?.uid ?? authContext.uid,
            entityType: Verbs.entityTypeReferee,
            showPreview: true,
          });
        }
      } else {
        navigation.navigate('RegisterReferee');
      }
    },
    [authContext, route?.params, currentUserData, navigation],
  );

  const playInModel = useCallback(
    (playInObject) => {
      if (playInObject) {
        setSportName(Utility.getSportName(playInObject, authContext));
        setTimeout(() => {
          setCurrentPlayInObject({...playInObject});

          navigation.navigate('SportActivityHome', {
            sport: playInObject?.sport,
            sportType: playInObject?.sport_type,
            uid: route.params?.uid ?? authContext.uid,
            entityType: Verbs.entityTypePlayer,
            showPreview: true,
          });
        }, 10);
      } else {
        navigation.navigate('RegisterPlayer');
      }
    },
    [navigation, authContext, route.params],
  );

  const onAddRolePress = useCallback(() => {
    addRoleActionSheet.current.show();
  }, [addRoleActionSheet]);

  const onMoreRolePress = useCallback(() => {
    navigation.navigate('SportActivitiesScreen', {
      isAdmin,
      uid: route.params?.uid ?? authContext.uid,
    });
  }, [authContext.uid, route.params?.uid, isAdmin, navigation]);

  const reviewerDetailModal = useCallback(() => {
    setReviewerDetailModalVisible(!reviewerDetailModalVisible);
  }, [reviewerDetailModalVisible]);

  const onConnectionButtonPress = useCallback(
    (tab) => {
      let entity_type = authContext?.entity?.role;
      let user_id = authContext?.entity?.uid;
      if (route?.params?.role) entity_type = route?.params?.role;
      if (route?.params?.uid) user_id = route?.params?.uid;

      if (tab === Verbs.followingVerb) {
        if (
          entity_type === Verbs.entityTypeTeam ||
          entity_type === Verbs.entityTypeClub
        ) {
          navigation.navigate('JoinedTeamsScreen', {
            uid: route?.params?.uid,
            role: route?.params?.role,
          });
        } else {
          navigation.navigate('UserConnections', {tab, entity_type, user_id});
        }
      } else if (tab === Verbs.privacyTypeFollowers) {
        navigation.navigate('UserConnections', {tab, entity_type, user_id});
      } else if (tab === Verbs.privacyTypeMembers) {
        navigation.navigate('GroupMembersScreen', {
          groupID: user_id,
          groupObj: currentUserData,
        });
      }
    },
    [authContext.entity, navigation, route.params, currentUserData],
  );

  const onScoreboardSearchTextChange = useCallback(
    (text) => {
      setScoreboardSearchText(text);
      const result = scoreboardGameData.filter(
        (x) =>
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())) ||
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())),
      );
      setFilterScoreboardGameData(result);
    },
    [scoreboardGameData],
  );

  const moveToMainInfoTab = useCallback(() => {
    navigation.navigate('EntityInfoScreen', {
      uid: route?.params?.uid || authContext.entity.uid,
      isAdmin: route?.params?.uid === authContext.entity.uid,
      onGroupListPress: () => onGroupListPress,
      onTeamPress: () => onTeamPress,
      refereesInModal: () => refereesInModal,
      playInModel: () => playInModel,
      onMemberPress: (memberObject) =>
        console.log('memberObject', memberObject),
    });
  }, [
    authContext,
    route.params,
    onTeamPress,
    onGroupListPress,
    refereesInModal,
    playInModel,
    navigation,
  ]);

  const moveToScoreboardTab = useCallback(() => {
    navigation.navigate('EntityScoreboardScreen', {
      uid: route?.params?.uid || authContext.entity.uid,
      isAdmin,
    });
  }, [route.params?.uid, authContext.entity, navigation, isAdmin]);

  const renderMainScoreboardTab = useCallback(
    () => (
      <View style={{flex: 1}}>
        <TCSearchBox
          onChangeText={onScoreboardSearchTextChange}
          marginTop={20}
          marginBottom={5}
          alignSelf={'center'}
          width={wp('94%')}
          borderRadius={0}
          backgroundColor={colors.grayBackgroundColor}
          height={40}
          shadowOpacity={0}
        />
        <ScoreboardSportsScreen
          sportsData={
            scoreboardSearchText.length > 0
              ? filterScoreboardGameData
              : scoreboardGameData
          }
          navigation={navigation}
          onItemPress={() => {
            // setRefereeMatchModalVisible(false);
          }}
        />
      </View>
    ),
    [
      filterScoreboardGameData,
      navigation,
      onScoreboardSearchTextChange,
      scoreboardGameData,
      scoreboardSearchText,
    ],
  );

  const renderHomeMainReviewTab = useMemo(
    () => (
      <View>
        <ReviewSection
          isTeamReviewSection={true}
          reviewsData={averageTeamReview}
          reviewsFeed={teamReviewData}
          onFeedPress={() => Alert.alert(5)}
          onReadMorePress={() => {
            reviewerDetailModal();
          }}
        />
      </View>
    ),
    [averageTeamReview, reviewerDetailModal, teamReviewData],
  );
  const moveToSchedule = useCallback(() => {
    navigation.navigate('ScheduleScreen', {
      isBackVisible: true,
      uid: route?.params?.uid || authContext?.entity?.uid,
      role: route?.params?.role || authContext?.entity?.role,
    });
  }, [navigation, route.params, authContext.entity]);

  const moveToGallary = useCallback(() => {
    navigation.navigate('EntityGallaryScreen', {
      currentUserData,
      isAdmin,
      galleryRef,
      entityType: route?.params?.role ?? authContext.entity?.role,
      entityID: route?.params?.uid ?? authContext.entity?.uid,
      callFunction: () => callthis,
    });
  }, [
    navigation,
    currentUserData,
    isAdmin,
    galleryRef,
    authContext.entity,
    route.params,
    callthis,
  ]);
  const moveToReview = useCallback(() => {
    navigation.navigate('EntityReviewScreen', {
      averageTeamReview,
      teamReviewData,
      userID,
    });
  }, [averageTeamReview, teamReviewData, userID, navigation]);

  const moveToStats = useCallback(() => {
    navigation.navigate('EntityStatScreen', {
      entityData: entityObject,
    });
  }, [navigation]);

  const renderHomeMainTabContain = useMemo(
    () => (
      <View style={{flex: 1}}>
        {currentTab === 1 && moveToMainInfoTab()}
        {currentTab === 2 && renderMainScoreboardTab()}
        {currentTab === 3 && moveToSchedule()}
        {currentTab === 4 && moveToGallary()}
        {currentTab === 5 && isTeamHome && renderHomeMainReviewTab}
      </View>
    ),
    [
      currentTab,
      isTeamHome,
      moveToGallary,
      moveToSchedule,
      moveToMainInfoTab,
      renderMainScoreboardTab,
      renderHomeMainReviewTab,
    ],
  );

  const handleMainRefOnScroll = Animated.event([
    {nativeEvent: {contentOffset: {y: mainFlatListFromTop}}},
  ]);

  const offerOpetions = useCallback(() => {
    const opetionArray = [];
    let a = [];
    let b = [];

    a = authContext?.entity?.obj?.referee_data?.filter(
      (obj) =>
        obj.sport === currentUserData?.sport &&
        obj.sport_type === currentUserData?.sport_type,
    );
    b = authContext?.entity?.obj?.scorekeeper_data?.filter(
      (obj) =>
        obj.sport === currentUserData?.sport &&
        obj.sport_type === currentUserData?.sport_type,
    );

    if (a?.length > 0) {
      opetionArray.push(strings.refereeOffer);
    }
    if (b?.length > 0) {
      opetionArray.push(strings.scorekeeperOffer);
    }
    if (a?.length > 0 || b?.length > 0) {
      opetionArray.push(strings.cancel);
    }

    return opetionArray;
  }, [authContext.entity, currentUserData]);

  const renderBackground = (bgImage) => {
    if (bgImage) {
      return (
        <View style={{marginLeft: 10, marginRight: 10}}>
          <FastImage
            source={{uri: bgImage}}
            resizeMode={'cover'}
            style={styles.bgImageStyle}>
            {currentUserData.entity_type !== Verbs.entityTypeClub &&
              !hideScore && (
                <ImageBackground
                  source={images.profileLevel}
                  style={{
                    height: 58,
                    width: 93,

                    resizeMode: 'contain',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}>
                    <FastImage
                      source={images.tc_message_top_icon}
                      resizeMode={'contain'}
                      style={{height: 35, width: 35}}
                    />
                    <View
                      style={{flexDirection: 'column', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: fonts.RBold,
                          fontSize: 16,
                          color: colors.lightBlackColor,
                        }}>
                        {currentUserData?.point ?? 0}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.RMedium,
                          fontSize: 10,
                          color: colors.lightBlackColor,
                        }}>
                        {strings.points}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              )}
          </FastImage>
        </View>
      );
    }
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <View style={styles.bgImageStyle}>
          {currentUserData.entity_type !== Verbs.entityTypeClub && !hideScore && (
            <ImageBackground
              source={images.profileLevel}
              style={{
                height: 58,
                width: 93,
                resizeMode: 'contain',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}>
                <FastImage
                  source={images.tc_message_top_icon}
                  resizeMode={'contain'}
                  style={{height: 35, width: 35}}
                />
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.RBold,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                    {currentUserData?.point ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.RMedium,
                      fontSize: 10,
                      color: colors.lightBlackColor,
                    }}>
                    {strings.points}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          )}
        </View>
      </View>
    );
  };

  const renderHeaderBackgroundProfile = useMemo(
    () => (
      <BackgroundProfile
        currentUserData={currentUserData}
        onConnectionButtonPress={onConnectionButtonPress}
      />
    ),
    [currentUserData, onConnectionButtonPress],
  );

  const renderHeaderBackgroundUserProfile = useMemo(
    () => (
      <UserHomeHeader
        currentUserData={currentUserData}
        onConnectionButtonPress={onConnectionButtonPress}
        onAction={onUserAction}
        isAdmin={isAdmin}
        loggedInEntity={authContext.entity}
      />
    ),
    [
      authContext.entity,
      currentUserData,
      isAdmin,
      onConnectionButtonPress,
      onUserAction,
    ],
  );

  const renderHeaderUserHomeTopSection = useMemo(
    () =>
      isUserHome && (
        <OrderedSporList
          user={currentUserData}
          type="horizontal"
          isAdmin={isAdmin}
          onCardPress={(sport, type) => {
            switch (type) {
              case EntityStatus.addNew:
                onAddRolePress();
                break;

              case EntityStatus.moreActivity:
                onMoreRolePress();
                break;

              case Verbs.entityTypePlayer:
                playInModel(sport);
                break;

              case Verbs.entityTypeReferee:
                refereesInModal(sport);
                break;

              case Verbs.entityTypeScorekeeper:
                scorekeeperInModal(sport);
                break;

              default:
                break;
            }
          }}
        />
      ),
    [
      isUserHome,
      isAdmin,
      onAddRolePress,
      refereesInModal,
      scorekeeperInModal,
      playInModel,
      currentUserData,
      onMoreRolePress,
    ],
  );

  const renderHeaderClubHomeTopSection = useMemo(
    () =>
      isClubHome && (
        <ClubHomeTopSection
          clubDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAction={onClubAction}
        />
      ),
    [authContext.entity, currentUserData, isAdmin, isClubHome, onClubAction],
  );

  const renderHeaderTeamHomeTopSection = useMemo(
    () =>
      isTeamHome && (
        <TeamHomeTopSection
          teamDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAction={onTeamAction}
          isThreeDotShow={offerOpetions().length > 0}
        />
      ),
    [
      isTeamHome,
      authContext.entity,
      currentUserData,
      isAdmin,
      onTeamAction,
      offerOpetions,
    ],
  );

  const renderMainHeaderComponent = useMemo(
    () => (
      <View>
        {isUserHome
          ? renderHeaderBackgroundUserProfile
          : renderHeaderBackgroundProfile}

        <View style={{flex: 1}}>
          {renderHeaderUserHomeTopSection}
          {renderHeaderTeamHomeTopSection}
          {renderHeaderClubHomeTopSection}
        </View>
      </View>
    ),
    [
      isUserHome,
      renderHeaderBackgroundProfile,
      renderHeaderBackgroundUserProfile,
      renderHeaderClubHomeTopSection,
      renderHeaderTeamHomeTopSection,
      renderHeaderUserHomeTopSection,
    ],
  );

  const sendInvitation = (userids) => {
    setloading(true);
    const entity = authContext.entity;
    const obj = {
      entity_type: entity.role,
      userIds: userids,
      uid: entity.uid,
    };

    sendInvitationInGroup(obj, authContext)
      .then(() => {
        setTimeout(() => {
          Utility.showAlert(
            strings.invitationSent,

            () => {
              console.log('ok');
            },
          );
        }, 10);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderHomeTabs = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        style={{margin: 10}}
        onPress={() => {
          if (index === 0) {
            moveToMainInfoTab();
          }
          if (index === 1) {
            moveToScoreboardTab();
          }
          //   if (index === 2) {
          //     moveToSchedule();
          //   }
          if (index === 2) {
            moveToGallary();
          }
          if (index === 3) {
            moveToReview();
          }
          if (index === 4) {
            moveToStats();
          }
        }}>
        <View
          style={{
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            height: 25,
            justifyContent: 'center',
            backgroundColor: colors.grayBackgroundColor,
            paddingHorizontal: 10,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
              // backgroundColor: colors.redColor,
            }}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [
      moveToGallary,
      moveToMainInfoTab,
      moveToReview,
      moveToScoreboardTab,
      moveToStats,
    ],
  );

  const challengeButtonType = useCallback(() => {
    if (
      mySettingObject !== null &&
      settingObject !== null &&
      settingObject?.availibility === Verbs.on &&
      mySettingObject?.availibility === strings.on
    ) {
      return Verbs.bothVerb;
    }
    if (settingObject === null && mySettingObject === null) {
      return Verbs.inviteVerb;
    }
    if (
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData.sport.toLowerCase() &&
      (settingObject?.game_duration || settingObject?.score_rules) &&
      settingObject?.availibility &&
      settingObject?.availibility === strings.on &&
      (mySettingObject?.availibility === undefined ||
        mySettingObject?.availibility === Verbs.off) &&
      settingObject?.special_rules !== undefined &&
      settingObject?.general_rules !== undefined &&
      settingObject?.responsible_for_referee &&
      settingObject?.responsible_for_scorekeeper &&
      settingObject?.game_fee &&
      settingObject?.venue &&
      settingObject?.refund_policy &&
      settingObject?.home_away &&
      settingObject?.game_type
    ) {
      return Verbs.challengeVerb;
    }
    if (
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData.sport.toLowerCase() &&
      mySettingObject !== undefined &&
      (settingObject?.availibility === undefined ||
        settingObject?.availibility === Verbs.off) &&
      (mySettingObject?.game_duration || mySettingObject?.score_rules) &&
      (mySettingObject?.availibility !== undefined ||
        mySettingObject?.availibility === strings.on) &&
      mySettingObject?.special_rules !== undefined &&
      mySettingObject?.general_rules !== undefined &&
      mySettingObject?.responsible_for_referee &&
      mySettingObject?.responsible_for_scorekeeper &&
      mySettingObject?.game_fee &&
      mySettingObject?.venue &&
      mySettingObject?.refund_policy &&
      mySettingObject?.home_away &&
      mySettingObject?.game_type
    ) {
      return Verbs.inviteVerb;
    }
    return Verbs.challengeVerb;
  }, [authContext.entity, mySettingObject, currentUserData, settingObject]);

  const onChallengePress = useCallback(() => {
    if (challengeButtonType() === Verbs.bothVerb) {
      setChallengePopup(true);
    } else if (challengeButtonType() === Verbs.challengeVerb) {
      setChallengePopup(true);

      // navigation.navigate('ChallengeScreen', {
      //   setting: settingObject,
      //   sportName: currentUserData.sport,
      //   groupObj: currentUserData,
      // });
    } else if (challengeButtonType() === Verbs.inviteVerb) {
      if (settingObject.availibility === Verbs.on) {
        if (
          myGroupDetail.sport_type === Verbs.doubleSport &&
          (!('player_deactivated' in myGroupDetail) ||
            !myGroupDetail?.player_deactivated) &&
          (!('player_leaved' in currentUserData) ||
            !currentUserData?.player_leaved) &&
          (!('player_leaved' in myGroupDetail) || !myGroupDetail?.player_leaved)
        ) {
          if (myGroupDetail.is_pause === true) {
            Alert.alert(format(strings.groupPaused, myGroupDetail.group_name));
          } else {
            navigation.navigate('InviteChallengeScreen', {
              setting: mySettingObject,
              sportName: currentUserData?.sport,
              sportType: currentUserData?.sport_type,
              groupObj: currentUserData,
            });
          }
        } else {
          console.log('in else');
          if (myGroupDetail.sport_type === Verbs.doubleSport) {
            if (
              'player_deactivated' in myGroupDetail &&
              myGroupDetail?.player_deactivated
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
            console.log('invite block');
            if (myGroupDetail.is_pause === true) {
              Alert.alert(
                format(strings.groupPaused, myGroupDetail.group_name),
              );
            } else {
              navigation.navigate('InviteChallengeScreen', {
                setting: mySettingObject,
                sportName: currentUserData?.sport,
                sportType: currentUserData?.sport_type,
                groupObj: currentUserData,
              });
            }
          }
        }
      } else {
        console.log('manage block');
        if (currentUserData?.is_pause === true) {
          Alert.alert(strings.yourTeamPaused);
        } else if (
          currentUserData?.player_deactivated === true &&
          currentUserData.sport_type === Verbs.doubleSport
        ) {
          Alert.alert(
            format(
              strings.groupSportActivityDeactivated,
              currentUserData.group_name,
            ),
          );
        } else {
          navigation.navigate('ManageChallengeScreen', {
            groupObj: currentUserData,
            sportName: currentUserData?.sport,
            sportType: currentUserData?.sport_type,
          });
        }
      }
    }
  }, [
    challengeButtonType,
    navigation,
    currentUserData,
    settingObject,
    myGroupDetail,
    mySettingObject,
  ]);

  const challengeButton = useCallback(() => {
    if (
      !loading &&
      isTeamHome &&
      authContext.entity.role === Verbs.entityTypeTeam &&
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData?.sport?.toLowerCase()
    ) {
      return (
        <View style={styles.challengeButtonStyle}>
          {authContext.entity.obj.group_id !== currentUserData.group_id && (
            <View styles={[styles.outerContainerStyle, {height: 25}]}>
              <TouchableOpacity onPress={onChallengePress}>
                <LinearGradient
                  colors={[colors.darkThemeColor, colors.themeColor]}
                  style={[
                    styles.containerStyle,
                    {
                      justifyContent: 'center',
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {(challengeButtonType() === Verbs.bothVerb ||
                      challengeButtonType() === Verbs.challengeVerb) && (
                      <Text style={styles.challengeButtonTitle}>
                        {strings.challenge}
                        {settingObject?.game_fee?.fee && (
                          <Text>{` $${settingObject.game_fee.fee} ${
                            settingObject.game_fee.currency_type ??
                            strings.defaultCurrency
                          } ${strings.perMatch}`}</Text>
                        )}
                      </Text>
                    )}
                    {challengeButtonType() === Verbs.inviteVerb && (
                      <Text style={styles.challengeButtonTitle}>
                        {strings.inviteToChallenge}
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
    return null;
  }, [
    authContext.entity,
    currentUserData,
    challengeButtonType,
    isTeamHome,
    loading,
    onChallengePress,
    settingObject,
  ]);

  const renderMainFlatList = useMemo(
    () => (
      <View
        style={{
          margin: 15,
          marginTop: 25,
          marginBottom: 0,
        }}>
        {challengeButton()}
        {isUserHome ? (
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                alignItems: 'center',
              }}>
              {strings.postsTitleText}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                marginBottom: 20,
              }}>
              <TCProfileButton
                title={strings.galleryTitle}
                style={{
                  marginRight: 15,
                  alignItems: 'center',
                  backgroundColor: colors.grayBackgroundColor,
                }}
                showArrow={false}
                textStyle={styles.buttonTextStyle}
                onPressProfile={() => {
                  navigation.navigate('UserGalleryScreen', {
                    isAdmin,
                    galleryRef,
                    entityType: route?.params?.role ?? authContext.entity?.role,
                    entityID: route?.params?.uid ?? authContext.entity?.uid,
                    currentUserData,
                    callFunction: () => callthis,
                  });
                }}
              />
              <TCProfileButton
                title={strings.event}
                showArrow={false}
                textStyle={styles.buttonTextStyle}
                style={{backgroundColor: colors.grayBackgroundColor}}
                onPressProfile={() => {}}
              />
            </View>
            <TCThinDivider width={'100%'} />
          </View>
        ) : (
          <>
            <View style={styles.sepratorView} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                // marginTop: 0,
                marginLeft: 4,
              }}>
              Timeline
            </Text>

            <FlatList
              showsHorizontalScrollIndicator={false}
              data={
                isTeamHome
                  ? [
                      strings.infoTitle,
                      strings.scoreboard,
                      strings.galleryTitle,
                      strings.reviewTitle,
                      strings.statsTitle,
                    ]
                  : [
                      strings.infoTitle,
                      strings.scoreboard,
                      strings.galleryTitle,
                    ]
              }
              horizontal
              renderItem={renderHomeTabs}
              keyExtractor={(index) => index.toString()}
            />
          </>
        )}
      </View>
    ),
    [
      isUserHome,
      isTeamHome,
      navigation,
      isAdmin,
      route.params,
      authContext.entity,
      currentUserData,
      callthis,
      challengeButton,
      renderHomeTabs,
    ],
  );

  const MainHeaderComponent = () => (
    <>
      {!isUserHome && renderBackground()}
      {renderMainHeaderComponent}
      <TCThinDivider width={'100%'} />
      {renderMainFlatList}
      {renderHomeMainTabContain}
    </>
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const renderSports = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        setVisibleSportsModal(false);

        setTimeout(() => {
          if (currentUserData?.is_pause === true) {
            Alert.alert(strings.yourTeamPaused);
          } else {
            navigation.navigate('ManageChallengeScreen', {
              groupObj: currentUserData,
              sportName: item.sport,
              sportType: currentUserData?.sport_type,
            });
          }
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {Utility.getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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

  const renderRefereeGames = useCallback(
    ({item}) => (
      <TCGameCard
        data={item}
        cardWidth={'88%'}
        onPress={() => {
          // const game = item;
          // console.log('Selected game:=>', item);
          // let isSameReferee = false;
          // const sameRefereeCount = game?.referees?.filter(
          //   (gameReferee) => gameReferee?.user_id === currentUserData?.user_id,
          // );
          // if (sameRefereeCount?.length > 0) isSameReferee = true;
          // const isCheif = currentUserData?.chief_referee;
          // const cheifCnt = game?.referees?.filter(
          //   (chal_ref) => chal_ref?.chief_referee,
          // )?.length;
          // const assistantCnt = game?.referees?.filter(
          //   (chal_ref) => !chal_ref?.chief_referee,
          // )?.length;

          // if (isSameReferee) {
          //   message = 'This referee is already booked for this game.';
          // } else if (!game.isAvailable) {
          //   message = 'There is no available slot of a referee who you can book in this game.';
          // } else if ((game?.referees?.count ?? 0) >= 3) {
          //   message = 'There is no available slot of a referee who you can book in this game.';
          // } else if (isCheif && cheifCnt >= 1) {
          //   message = 'There is no available slot of a chief referee who you can book in this game.';
          // } else if (!isCheif && assistantCnt >= 2) {
          //   message = 'There is no available slot of an assistant referee who you can book in this game.';
          // }
          const message = '';
          if (message === '') {
            gameListRefereeModalRef.current.close();
            navigation.navigate('RefereeBookingDateAndTime', {
              gameData: item,
              settingObj: refereeSettingObject,
              userData: currentUserData,
              isHirer: true,
              sportName,
            });
          } else {
            setTimeout(() => Alert.alert(strings.appName, message));
          }
        }}
      />
    ),
    [currentUserData, navigation, refereeSettingObject, sportName],
  );

  const renderScorekeeperGames = useCallback(
    ({item}) => (
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
            sportName,
          });
        }}
      />
    ),
    [currentUserData, navigation, scorekeeperSettingObject, sportName],
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
    keyExtractor: (index) => index.toString(),
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

    return Promise.all(promiseArr)
      .then(([gameList, eventList]) => {
        setloading(false);

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

        return Utility.getGamesList(gameList).then((gamedata) => gamedata);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
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
        setloading(false);

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

        return Utility.getGamesList(gameList).then((gamedata) => gamedata);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };
  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then(async (response) => {
        setIsAccountDeactivated(false);
        setloading(false);
        await Utility.setAuthContextData(response.payload, authContext);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setloading(true);
    userActivate(authContext)
      .then(async (response) => {
        setloading(false);
        await Utility.setAuthContextData(response.payload, authContext);
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest({}, requestId, authContext)
      .then(() => {
        // Succefully join case
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;
        if (currentUserData.is_following === false) {
          callFollowGroup(true);
        }
        entityObject = currentUserData;
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);
    declineRequest(requestId, authContext)
      .then(() => {
        currentUserData.joinBtnTitle = strings.join;
        entityObject = currentUserData;
        reSetActionObject();
        setloading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const cancelGroupInvitation = () => {
    setloading(true);
    const params = {
      group_id: actionObject.group_id,
      invited_id: actionObject.invited_id,
      activity_id: actionObject.activity_id,
    };
    cancelGroupInvite(params, authContext)
      .then(() => {
        currentUserData.joinBtnTitle = strings.join;
        currentUserData.inviteBtnTitle = strings.invite;
        entityObject = currentUserData;
        reSetActionObject();
        setloading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };
  return (
    <View style={styles.mainContainer}>
      {renderHeader}

      {isAccountDeactivated && (
        <TCAccountDeactivate
          type={
            authContext?.entity?.obj?.is_pause === true
              ? Verbs.pauseVerb
              : Verbs.deactivateVerb
          }
          onPress={() => {
            Alert.alert(
              format(
                strings.pauseUnpauseAccountText,
                authContext?.entity?.obj?.is_pause === true
                  ? Verbs.unpauseVerb
                  : Verbs.reactivateVerb,
              ),
              '',
              [
                {
                  text: strings.cancel,
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? Verbs.unpauseVerb
                      : Verbs.reactivateVerb,
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_pause === true) {
                      unPauseGroup();
                    } else {
                      reActivateUser();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      )}
      <View
        style={{flex: 1, opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <ActionSheet
          ref={addRoleActionSheet}
          options={[
            strings.addPlaying,
            strings.addRefereeing,
            strings.addScorekeeping,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              // Add Playing
              navigation.navigate('RegisterPlayer', {comeFrom: 'HomeScreen'});
            } else if (index === 1) {
              // Add Refereeing
              navigation.navigate('RegisterReferee');
            } else if (index === 2) {
              // Add Scorekeeper
              navigation.navigate('RegisterScorekeeper');
            }
          }}
        />
        <ActionSheet
          ref={manageChallengeActionSheet}
          // options={[
          //   strings.manageChallengeShhetItem,
          //    strings.sportActivity,
          //   strings.cancel,
          // ]}
          options={options}
          cancelButtonIndex={
            authContext.entity.role === Verbs.entityTypeUser ? 2 : 1
          }
          onPress={(index) => {
            if (index === 0) {
              // Add Playing

              const entity = authContext.entity;

              if (entity.role === Verbs.entityTypeUser) {
                if (entity?.obj?.registered_sports?.length > 0) {
                  setVisibleSportsModal(true);
                } else {
                  Alert.alert(strings.noregisterdSportValication);
                }
              }
              if (entity.role === Verbs.entityTypeTeam) {
                if (currentUserData?.is_pause === true) {
                  Alert.alert(strings.yourTeamPaused);
                } else {
                  navigation.navigate('ManageChallengeScreen', {
                    groupObj: currentUserData,
                    sportName: currentUserData?.sport,
                    sportType: currentUserData?.sport_type,
                  });
                }
              }
            } else if (index === 1) {
              // navigation.navigate('SportActivityScreen');
              if (authContext.entity.role === Verbs.entityTypeUser) {
                navigation.navigate('SportActivitiesScreen', {
                  isAdmin,
                  uid: route.params?.uid ?? authContext.uid,
                });
              }
            }
          }}
        />
        <ActionSheet
          ref={offerActionSheet}
          options={offerOpetions()}
          cancelButtonIndex={offerOpetions().length - 1}
          onPress={(index) => {
            if (offerOpetions()[index] === strings.refereeOffer) {
              setloading(true);
              const headers = {};
              headers.caller_id = currentUserData?.group_id;

              const promiseArr = [
                // getGameSlots(
                //   'referees',
                //   authContext?.entity?.uid,
                //   `status=accepted&sport=${currentUserData?.sport}&refereeDetail=true`,
                //   headers,
                //   authContext,
                // ),
                getGamesForReferee(
                  authContext?.entity?.uid,
                  currentUserData?.group_id,
                ),
                settingUtils.getSetting(
                  authContext?.entity?.uid,
                  Verbs.entityTypeReferee,
                  currentUserData?.sport,
                  authContext,
                ),
              ];

              Promise.all(promiseArr).then(([gameList, refereeSetting]) => {
                setloading(false);

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
              });
            } else if (offerOpetions()[index] === strings.scorekeeperOffer) {
              setloading(true);
              const headers = {};
              headers.caller_id = currentUserData?.group_id;

              const promiseArr = [
                // getGameSlots(
                //   'referees',
                //   authContext?.entity?.uid,
                //   `status=accepted&sport=${currentUserData?.sport}&refereeDetail=true`,
                //   headers,
                //   authContext,
                // ),
                getGamesForScorekeeper(
                  authContext?.entity?.uid,
                  currentUserData?.group_id,
                ),
                settingUtils.getSetting(
                  authContext?.entity?.uid,
                  Verbs.entityTypeScorekeeper,
                  currentUserData?.sport,
                  authContext,
                ),
              ];

              Promise.all(promiseArr).then(([gameList, scorekeeperSetting]) => {
                setloading(false);

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
            } else if (offerOpetions()[index] === strings.cancel) {
              //
            }
          }}
        />
        <ActionSheet
          ref={actionSheet}
          title={actionSheetTitle}
          options={[
            strings.acceptInvite,
            strings.declineInvite,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              onAccept(actionObject.activity_id);
            } else if (index === 1) {
              onDecline(actionObject.activity_id);
            }
          }}
        />
        <ActionSheet
          ref={cancelReqActionSheet}
          title={actionSheetTitle}
          options={[strings.cancelRequestTitle, strings.cancel]}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              cancelGroupInvitation();
            }
          }}
        />
        <ActivityLoader visible={loading} />
        <View style={{flex: 1}}>
          {/* renderUserTopFixedButtons */}
          {/* {!isUserHome && renderTopFixedButtons} */}
          {/* {!isUserHome && fixedHeader} */}
          {firstTimeLoading &&
            (route?.params?.role === Verbs.entityTypeUser ??
              authContext?.entity?.role === Verbs.entityTypeUser) && (
              <UserProfileScreenShimmer />
            )}
          {firstTimeLoading &&
            (route?.params?.role !== Verbs.entityTypeUser ??
              authContext?.entity?.role !== Verbs.entityTypeUser) && (
              <ProfileScreenShimmer />
            )}
          {!firstTimeLoading && (
            <HomeFeed
              onFeedScroll={handleMainRefOnScroll}
              refs={mainFlatListRef}
              homeFeedHeaderComponent={MainHeaderComponent}
              currentTab={currentTab}
              currentUserData={currentUserData}
              isAdmin={route?.params?.uid === authContext.entity.uid}
              navigation={navigation}
              setGalleryData={() => {}}
              userID={route?.params?.uid ?? authContext.entity?.uid}
            />
          )}
        </View>

        {/* Entity create modal */}
        <Portal>
          <Modalize
            disableScrollIfPossible={true}
            withHandle={false}
            modalStyle={{
              margin: 0,
              justifyContent: 'flex-end',
              backgroundColor: colors.blackOpacityColor,
              flex: 1,
            }}
            ref={confirmationRef}>
            <View style={styles.modalContainerViewStyle}>
              <Image style={styles.background} source={images.orangeLayer} />
              <Image
                style={styles.background}
                source={images.entityCreatedBG}
              />
              <TouchableOpacity
                onPress={() => confirmationRef.current.close()}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  source={images.cancelWhite}
                  style={{
                    marginTop: 25,
                    marginRight: 25,
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                    tintColor: colors.whiteColor,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <ImageBackground
                  source={
                    (route?.params?.entityObj?.thumbnail && {
                      uri: route?.params?.entityObj?.thumbnail,
                    }) ||
                    route?.params?.role === Verbs.entityTypeClub
                      ? images.clubPlaceholder
                      : images.teamGreenPH
                  }
                  style={styles.groupsImg}>
                  <Text
                    style={{
                      color: colors.whiteColor,
                      fontSize: 20,
                      fontFamily: fonts.RBlack,
                      marginBottom: 4,
                    }}>{`${route?.params?.groupName
                    ?.charAt(0)
                    ?.toUpperCase()}`}</Text>
                </ImageBackground>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.foundText, {fontFamily: fonts.RBold}]}>
                    {`${route?.params?.groupName}  `}
                  </Text>
                  <View
                    style={{
                      height: 22,
                      width: 22,
                      borderRadius: 44,
                      borderColor: colors.whiteColor,
                      borderWidth: 2,
                      marginLeft: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        route?.params?.role === Verbs.entityTypeTeam
                          ? images.teamPatch
                          : images.clubPatch
                      }
                      style={styles.entityPatchImage}
                    />
                  </View>
                </View>
                <Text style={[styles.foundText, {fontFamily: fonts.RRegular}]}>
                  {strings.hasBeenCreated}
                </Text>
                <Text style={[styles.manageChallengeDetailTitle, {margin: 15}]}>
                  {format(strings.accountSwitchWith, route?.params?.groupName)}
                </Text>
              </View>

              {route?.params?.role === Verbs.entityTypeTeam && (
                <Text style={styles.manageChallengeDetailTitle}>
                  {strings.manageChallengeDetailText}
                </Text>
              )}
              <TouchableOpacity
                style={styles.goToProfileButton}
                onPress={() => {
                  confirmationRef.current.close();
                  if (route?.params?.role !== Verbs.entityTypeClub) {
                    if (currentUserData?.is_pause === true) {
                      Alert.alert(strings.yourTeamPaused);
                    } else {
                      navigation.navigate('ManageChallengeScreen', {
                        groupObj: currentUserData,
                        sportName: route?.params?.entityObj?.sport,
                        sportType: currentUserData?.sport_type,
                      });
                    }
                  }
                }}>
                <Text style={styles.goToProfileTitle}>
                  {route?.params?.role === Verbs.entityTypeClub
                    ? strings.okTitleText
                    : strings.manageChallengeText}
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </Portal>
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
        <Modal
          isVisible={isDoubleSportTeamCreatedVisible} // isDoubleSportTeamCreatedVisible
          backdropColor="black"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.blackOpacityColor,
            flex: 1,
          }}
          hasBackdrop
          onBackdropPress={() => {
            navigation.popToTop();
            setTimeout(() => {
              setIsDoubleSportTeamCreatedVisible(false);
            }, 10);
          }}
          backdropOpacity={0}>
          <View style={styles.modalContainerViewStyle}>
            <Image style={styles.background} source={images.orangeLayer} />
            <Image style={styles.background} source={images.entityCreatedBG} />
            <TouchableOpacity
              onPress={() => {
                navigation.popToTop();
                setTimeout(() => {
                  setIsDoubleSportTeamCreatedVisible(false);
                }, 10);
              }}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={images.cancelWhite}
                style={{
                  marginTop: 25,
                  marginRight: 25,
                  height: 15,
                  width: 15,
                  resizeMode: 'contain',
                  tintColor: colors.whiteColor,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.doubleSportCreatedText,
                  {fontFamily: fonts.RRegular},
                ]}>
                {format(strings.inviteSendTo, route?.params?.name)}
              </Text>

              <Text style={styles.inviteText}>
                {strings.when}
                <Text style={{fontFamily: fonts.RBold}}>
                  {' '}
                  {route?.params?.name}{' '}
                </Text>
                {strings.acceptYourInvite}
              </Text>
              <Image
                source={images.doubleTeamCreated}
                style={styles.doubleTeamImage}
              />
            </View>

            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                navigation.popToTop();
                setTimeout(() => {
                  setIsDoubleSportTeamCreatedVisible(false);
                }, 10);
              }}>
              <Text style={styles.goToProfileTitle}>{strings.okTitleText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Entity create modal */}
        {/* Create Challenge modal */}
        <Modal
          onBackdropPress={() => setChallengePopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={challengePopup}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setChallengePopup(false)}
                style={styles.cancelText}>
                {strings.cancel}
              </Text>
              <Text style={styles.locationText}>{strings.challenge}</Text>
              <Text style={styles.locationText}> </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedChallengeOption(0);
                const obj = settingObject;
                if (obj?.availibility === Verbs.on) {
                  if (
                    currentUserData.sport_type === Verbs.doubleSport &&
                    (!('player_deactivated' in currentUserData) ||
                      !currentUserData?.player_deactivated) &&
                    (!('player_leaved' in currentUserData) ||
                      !currentUserData?.player_leaved) &&
                    (!('player_leaved' in myGroupDetail) ||
                      !myGroupDetail?.player_leaved)
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
                      setChallengePopup(false);
                      navigation.navigate('ChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    } else {
                      Alert.alert(strings.teamHaveNoCompletedSetting);
                    }
                  } else {
                    console.log('in else continue :', currentUserData);
                    if (currentUserData.sport_type === Verbs.doubleSport) {
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
                          format(
                            strings.groupHaveNo2Player,
                            currentUserData?.group_name,
                          ),
                        );
                      } else if (
                        'player_leaved' in myGroupDetail &&
                        myGroupDetail?.player_leaved
                      ) {
                        Alert.alert(strings.youHaveNo2Player);
                      }
                    } else {
                      setChallengePopup(false);

                      navigation.navigate('ChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  }
                } else {
                  Alert.alert(strings.oppTeamNotForChallenge);
                }
                // setTimeout(() => {
                //   setChallengePopup(false);
                //   navigation.navigate('ChallengeScreen', {
                //     sportName: currentUserData.sport,
                //     groupObj: currentUserData,
                //   });
                // }, 300);
              }}>
              {selectedChallengeOption === 0 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text
                    style={[
                      styles.curruentLocationText,
                      {color: colors.whiteColor},
                    ]}>
                    {strings.continueToChallenge}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.curruentLocationText}>
                    {strings.continueToChallenge}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedChallengeOption(1);

                const obj = mySettingObject;
                if (obj?.availibility === Verbs.on) {
                  if (
                    myGroupDetail.sport_type === Verbs.doubleSport &&
                    (!('player_deactivated' in myGroupDetail) ||
                      !myGroupDetail?.player_deactivated) &&
                    (!('player_leaved' in currentUserData) ||
                      !currentUserData?.player_leaved) &&
                    (!('player_leaved' in myGroupDetail) ||
                      !myGroupDetail?.player_leaved)
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
                      setChallengePopup(false);
                      if (myGroupDetail.is_pause === true) {
                        Alert.alert(
                          format(strings.groupPaused, myGroupDetail.group_name),
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
                        format(
                          strings.groupHaveNo2Player,
                          currentUserData?.group_name,
                        ),
                      );
                    } else if (
                      'player_leaved' in myGroupDetail ||
                      myGroupDetail?.player_leaved
                    ) {
                      Alert.alert(strings.youHaveNo2Player);
                    }
                  } else {
                    setChallengePopup(false);
                    if (myGroupDetail.is_pause === true) {
                      Alert.alert(strings.yourTeamPaused);
                    } else {
                      setChallengePopup(false);
                      navigation.navigate('InviteChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  }
                } else {
                  Alert.alert(strings.availibilityOff);
                }
              }}>
              {selectedChallengeOption === 1 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                    {strings.inviteToChallenge}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.myCityText}>
                    {strings.inviteToChallenge}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        {/* Create Challenge modal */}
        {/* Sports list  modal */}
        <Modal
          isVisible={visibleSportsModal}
          backdropColor="black"
          onBackdropPress={() => setVisibleSportsModal(false)}
          onRequestClose={() => setVisibleSportsModal(false)}
          backdropOpacity={0}
          style={{
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 1.3,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleSportsModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {strings.sportsEventsTitle}
              </Text>

              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={authContext?.entity?.obj?.registered_sports?.filter(
                (obj) => obj?.type,
              )}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSports}
            />
          </View>
        </Modal>
        {!createEventModal && currentTab === 3 && (
          <CreateEventButton
            source={images.plus}
            onPress={() => setCreateEventModal(true)}
          />
        )}

        {renderImageProgress}
      </View>
      <CongratulationsModal
        isVisible={congratulationsModal}
        settingsObj={settingObject}
        title={route?.params?.entityObj?.group_name}
        subtitle={format(
          strings.congratesSubTitle,
          route?.params?.entityObj?.group_name,
        )}
        fromCreateTeam={authContext.entity.role === Verbs.entityTypeTeam}
        fromCreateClub={authContext.entity.role === Verbs.entityTypeClub}
        closeModal={() => {
          setCongratulationsModal(false);
        }}
        sportName={
          authContext.entity.role === Verbs.entityTypeTeam
            ? route?.params?.entityObj?.setting.sport
            : route?.params?.entityObj?.sports[0].sport
        }
        sport={
          authContext.entity.role === Verbs.entityTypeTeam
            ? route?.params.entityObj?.setting.sport
            : route?.params?.entityObj?.sports[0].sport
        }
        sportType={
          authContext.entity.role === Verbs.entityTypeTeam
            ? Verbs.sportTypeTeam
            : Verbs.sportTypeSingle
        }
        searchTeam={(filters) => {
          navigation.navigate('LookingForChallengeScreen', {
            filters: {
              ...filters,
              groupTeam: strings.teamstitle,
            },
          });
        }}
        searchPlayer={() => {
          setCongratulationsModal(false);
          navigation.navigate('InviteMembersBySearchScreen');
        }}
        goToSportActivityHome={() => {
          setCongratulationsModal(false);
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            navigation.navigate('InviteMembersBySearchScreen');
          }
        }}
        onInviteClick={(item) => {
          const userIds = [];
          userIds.push(item.user_id);

          sendInvitation(userIds);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bgImageStyle: {
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  challengeButtonStyle: {
    width: '100%',
    height: 25,
    marginBottom: 15,
  },
  outerContainerStyle: {
    height: 45,
    width: '100%',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1.0,
    shadowRadius: 4,
    elevation: 2,
  },
  containerStyle: {
    flexDirection: 'row',
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  challengeButtonTitle: {
    color: colors.whiteColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.whiteColor,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  foundText: {
    color: colors.whiteColor,
    fontSize: 25,
  },
  doubleSportCreatedText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RBold,
    margin: 15,
    textAlign: 'center',
  },
  groupsImg: {
    height: 75,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
  },

  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,
    marginBottom: wp('15%'),
    width: '92%',
  },
  manageChallengeDetailTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  inviteText: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    margin: 15,
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  entityPatchImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  doubleTeamImage: {
    height: 150,
    width: 212,

    resizeMode: 'contain',
  },

  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },

  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  userNavigationTextStyle: {
    // width: width - 100,
    fontSize: 18,
    fontFamily: fonts.RBold,
    textAlign: 'left',
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '20%',
  },
  sepratorView: {
    top: 0,
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    width: wp('100%'),
    marginBottom: 15,
    marginTop: 15,
    left: -15,
  },
  messageImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  downArrowImage: {
    width: 10,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 11,
    marginTop: 2,
  },
  buttonTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
});

export default HomeScreen;
