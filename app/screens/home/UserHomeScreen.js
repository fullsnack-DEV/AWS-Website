import React, {
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {StyleSheet, View, Alert, Animated} from 'react-native';
import {format} from 'react-string-format';
import colors from '../../Constants/Colors';

import AuthContext from '../../auth/context';
import {
  followUser,
  unfollowUser,
  inviteUser,
  cancelFollowRequest,
} from '../../api/Users';
import {cancelGroupInvite, deleteMember} from '../../api/Groups';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import {strings} from '../../../Localization/translation';
import UserHomeHeader from '../../components/Home/UserHomeHeader';
import Verbs from '../../Constants/Verbs';
import OrderedSporList from '../../components/Home/OrderedSporList';
import EntityStatus from '../../Constants/GeneralConstants';
import BottomSheet from '../../components/modals/BottomSheet';
import {getEntitySport} from '../../utils/sportsActivityUtils';
import PostsTabView from '../../components/Home/PostsTabView';
import HomeFeed from '../homeFeed/HomeFeed';
import UserConnectionModal from './UserConnectionsModal';
import errorCode from '../../Constants/errorCode';
import SwitchAccountLoader from '../../components/account/SwitchAccountLoader';
import images from '../../Constants/ImagePath';
import useSwitchAccount from '../../hooks/useSwitchAccount';
import {showAlert} from '../../utils';
import JoinRequestModal from '../../components/notificationComponent/JoinRequestModal';

const UserHomeScreen = ({
  navigation,
  route,
  userID,
  isAdmin = false,
  pointEvent = 'auto',
  isAccountDeactivated = false,
  userData = {},
  pulltoRefresh,
  routeParams = {},
  loggedInGroupMembers = [],
}) => {
  const authContext = useContext(AuthContext);
  const galleryRef = useRef();
  const JoinRequestModalRef = useRef(null);
  const [Groupmembers] = useState(
    routeParams.Groupmembers || loggedInGroupMembers,
  );
  const [messageText, setMessageText] = useState('');
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(false);
  const [switchUser, setSwitchUser] = useState({});
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);
  const [followRequestSent, setFollowRequestSent] = useState(false);
  const [addSportActivityModal, setAddSportActivityModal] = useState(false);

  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const [refreshModal, setRefreshModal] = useState(false);
  const [tab, setTab] = useState('');
  const mainFlatListRef = useRef();
  const ModalRef = useRef();

  const {onSwitchProfile} = useSwitchAccount();

  useEffect(() => {
    if (userData?.user_id) {
      setCurrentUserData(userData);
    }

    const entity = authContext.entity;
    setSwitchUser(entity);
  }, [authContext.entity, userData]);

  const callFollowUser = useCallback(async () => {
    if (userData.is_deactivate) {
      showAlert(strings.userAccountdeactivated);
      return;
    }
    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    setloading(true);
    followUser(params, userID, authContext)
      .then((res) => {
        if (res.payload.error_code === errorCode.invitePlayerToJoin) {
          const {user_message} = res.payload;
          setFollowRequestSent(true);
          showAlert(user_message);

          setloading(false);
        } else if (res.payload.is_request) {
          const obj = {
            ...currentUserData,
            follow_request: {
              activity_id: res.payload.id,
              follower_id: res.payload.foreign_id,
              following_id: res.payload.target_uid,
            },
          };

          setCurrentUserData(obj);
          setloading(false);
        } else if (typeof res.payload === 'boolean') {
          const obj = {
            ...currentUserData,
            is_following: true,
            follower_count: currentUserData.follower_count + 1,
          };
          setCurrentUserData(obj);
          setRefreshModal(true);
          setloading(false);
        }
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userData.is_deactivate, userID]);

  const callUnfollowUser = useCallback(async () => {
    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    setloading(true);
    unfollowUser(params, userID, authContext)
      .then(() => {
        const obj = {
          ...currentUserData,
          is_following: false,
          follower_count:
            currentUserData.follower_count > 0
              ? currentUserData.follower_count - 1
              : 0,
        };

        setCurrentUserData(obj);
        setRefreshModal(true);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userID]);

  const clubInviteUser = useCallback(async () => {
    setloading(true);
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, userID, authContext)
      .then((response) => {
        setloading(false);

        const inviteRequest = {
          activity_id: response.payload.id,
          entity_type: authContext.entity.role,
          group_id: authContext.entity.uid,
          invited_id: userID,
          action: Verbs.inviteVerb,
        };

        const obj = {...currentUserData, invite_request: inviteRequest};

        setCurrentUserData(obj);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            format(
              strings.entityInvitedSuccessfully,
              `${currentUserData.first_name} ${currentUserData.last_name}`,
            ),
            [{text: strings.okTitleText}],
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message, [
            {
              text: strings.okTitleText,
              onPress: () => navigation.goBack(),
            },
          ]);
        }, 10);
      });
  }, [authContext, currentUserData, userID, navigation]);

  const onAccept = useCallback(
    (requestId) => {
      setloading(true);
      acceptRequest({}, requestId, authContext)
        .then(() => {
          // Succefully join case
          JoinRequestModalRef.current.close();
          mainFlatListRef.current.close();
          const obj = {...currentUserData};
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            obj.joined_teams = [
              ...currentUserData.joined_teams,
              authContext.entity.obj,
            ];
          } else if (authContext.entity.role === Verbs.entityTypeClub) {
            obj.joined_clubs = [
              ...currentUserData.joined_clubs,
              authContext.entity.obj,
            ];
          }
          setCurrentUserData(obj);
          setloading(false);
          setTimeout(() => {
            Alert.alert(
              strings.alertmessagetitle,
              strings.acceptRequestMessage,
              [{text: strings.okTitleText}],
            );
          }, 10);
        })
        .catch((error) => {
          setloading(false);
          mainFlatListRef.current.close();
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, currentUserData],
  );

  const onDecline = useCallback(
    (requestId) => {
      setloading(true);
      declineRequest(requestId, authContext)
        .then(() => {
          JoinRequestModalRef.current.close();
          const obj = {
            ...currentUserData,
            invite_request: {
              ...currentUserData.invite_request,
              action: Verbs.declineVerb,
            },
          };
          setCurrentUserData(obj);
          setloading(false);
          setTimeout(() => {
            Alert.alert(
              strings.alertmessagetitle,
              strings.declinedRequestMessage,
              [{text: strings.okTitleText}],
            );
          }, 10);
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, currentUserData],
  );

  const deleteMemberValidations = (groupId, memberId) => {
    const adminCount = Groupmembers?.filter((item) => item.is_admin === true);

    if (
      Groupmembers.length === 1 &&
      adminCount.length === 1 &&
      userID === authContext.entity.auth.user_id
    ) {
      Alert.alert(
        strings.appName,

        format(strings.lastmember, authContext.entity.role),
        [
          {
            text: strings.cancel,
            onPress: () => console.log('PRessed'),
          },
          {
            text: strings.remove,
            onPress: () => {
              const toaccount = true;
              setloading(true);

              onDeleteMemberProfile(groupId, memberId, toaccount);
            },
          },
        ],
      );
    } else if (
      userID === authContext.entity.auth.user_id &&
      Groupmembers.length > 1 &&
      adminCount.length >= 2
    ) {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.doYouWantToRemoText_dy,
          userData.first_name,
          userData.last_name,
          switchUser.obj?.group_name,
        ),

        [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel cancel'),
            style: 'cancel',
          },
          {
            text: strings.removeTextTitle,
            style: 'destructive',
            onPress: () => {
              const toaccount = true;
              setloading(true);
              onDeleteMemberProfile(groupId, memberId, toaccount);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (
      userID === authContext.entity.auth.user_id &&
      Groupmembers.length > 1 &&
      adminCount.length === 1
    ) {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.onlyAdmin,
          userData.first_name,
          switchUser.obj.group_name,
        ),

        [
          {
            text: strings.OkText,
            onPress: () => console.log('PRessed'),
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.doYouWantToRemoText_dy,
          userData.first_name,
          userData.last_name,
          switchUser.obj.group_name,
        ),

        [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel cancel'),
            style: 'cancel',
          },
          {
            text: strings.removeTextTitle,
            style: 'destructive',
            onPress: () => {
              setloading(true);
              onDeleteMemberProfile(groupId, memberId);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  const onDeleteMemberProfile = (groupId, memberId, toaccount = false) => {
    if (userData?.teams?.length > 0) {
      setloading(false);
      Alert.alert(
        strings.appName,
        strings.childMemberError,
        [
          {
            text: strings.OkText,
            onPress: () => console.log('PRessed'),
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if (toaccount) {
      setShowSwitchScreen(true);
    } else {
      setloading(true);
    }

    deleteMember(groupId, memberId, authContext)
      .then(async (response) => {
        const validator = errorCode.ChildMemberError;

        if (toaccount && Object.keys(response.payload).length === 0) {
          const updatedManagedEntities = authContext.managedEntities.filter(
            (item) => item.group_id !== groupId,
          );
          onSwitchProfile(authContext.managedEntities[0]);
          navigation.navigate('Account', {
            screen: 'AccountScreen',
            params: {
              switchToUser: true,
              grpName: switchUser.obj.group_name,
            },
          });

          await authContext.setentityList(updatedManagedEntities);

          setShowSwitchScreen(false);
        } else if (response.payload.error_code === validator) {
          setloading(false);
          Alert.alert(
            strings.appName,
            strings.childMemberError,
            [
              {
                text: strings.OkText,
                onPress: () => console.log('PRessed'),
              },
            ],
            {cancelable: false},
          );
        } else {
          setloading(false);

          const obj = {...currentUserData};
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            obj.teamIds = (currentUserData.teamIds ?? []).filter(
              (item) => item !== authContext.entity.uid,
            );
          } else if (authContext.entity.role === Verbs.entityTypeClub) {
            obj.clubIds = (currentUserData.clubIds ?? []).filter(
              (item) => item !== authContext.entity.uid,
            );
          }

          setCurrentUserData(obj);
        }
      })
      .catch((e) => {
        setloading(false);
        setShowSwitchScreen(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const cancelGroupInvitation = useCallback(() => {
    setloading(true);
    const params = {
      group_id: currentUserData.invite_request.group_id,
      invited_id: currentUserData.invite_request.invited_id,
      activity_id: currentUserData.invite_request.activity_id,
    };
    cancelGroupInvite(params, authContext)
      .then(() => {
        const obj = {
          ...currentUserData,
          invite_request: {
            ...currentUserData.invite_request,
            action: Verbs.cancelVerb,
          },
        };
        setCurrentUserData(obj);
        setloading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
            [{text: strings.okTitleText}],
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData]);

  const callCancelReq = async () => {
    const params = {
      follower_id: currentUserData?.follow_request.follower_id,
      following_id: currentUserData?.follow_request.following_id,
      activity_id: currentUserData?.follow_request.activity_id,
    };

    setloading(true);

    cancelFollowRequest(params, authContext)
      .then(() => {
        showAlert(strings.followReqCanceled);
        const obj = {
          ...currentUserData,
        };
        delete obj.follow_request;

        setCurrentUserData(obj);
        setloading(false);
      })
      .catch((error) => {
        showAlert(error.message);
        setloading(false);
      });
  };

  const onUserAction = useCallback(
    (action) => {
      switch (action) {
        case strings.requestPendingText:
          setMessageText(currentUserData?.invite_request?.message);
          JoinRequestModalRef.current.present();
          break;

        case strings.cancelFollowReqText:
          callCancelReq();
          break;

        case Verbs.followVerb:
          callFollowUser();
          break;

        case Verbs.unfollowVerb:
          callUnfollowUser();
          break;

        case Verbs.inviteVerb:
          clubInviteUser();
          break;

        case strings.cancelMembershipInvitation:
        case strings.cancelRequestText:
          Alert.alert(
            '',
            format(strings.alreadySendRequestMsg, currentUserData.full_name),
            [
              {
                text: strings.cancelRequestTitle,
                onPress: () => cancelGroupInvitation(),
                style: 'destructive',
              },
              {
                text: strings.cancel,
                style: 'cancel',
              },
            ],
          );
          break;

        case strings.acceptInvitateRequest:
        case strings.acceptRequet:
          // onAccept(currentUserData.invite_request.activity_id);
          break;

        case strings.declineMemberRequest:
        case strings.declineRequest:
          onDecline(currentUserData.invite_request.activity_id);
          break;

        case Verbs.editVerb:
          navigation.navigate('AccountStack', {
            screen: 'PersonalInformationScreen',
            params: {
              isEditProfile: true,
            },
          });
          break;

        case format(
          strings.removeMemberFromTeamText,
          authContext.entity.role === Verbs.entityTypeTeam
            ? Verbs.entityTypeTeam
            : Verbs.entityTypeClub,
        ):
          deleteMemberValidations(authContext.entity.uid, userID);
          break;

        default:
          break;
      }
    },
    [
      callFollowUser,
      callUnfollowUser,
      clubInviteUser,
      currentUserData,
      navigation,
      onAccept,
      onDecline,
      navigation,
      cancelGroupInvitation,

      authContext.entity.role,
      authContext.entity.uid,

      userID,
      cancelGroupInvitation,
    ],
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const handleSportActivityPress = (sport, type) => {
    if (type === EntityStatus.addNew) {
      setAddSportActivityModal(true);
    } else if (type === EntityStatus.moreActivity) {
      navigation.navigate('SportActivitiesScreen', {
        isAdmin,
        uid: route.params?.uid ?? authContext.uid,
      });
    } else {
      const sportDetails = getEntitySport({
        user: currentUserData,
        role: type,
        sportType: sport?.sport_type,
        sport: sport.sport,
      });

      if (sportDetails?.sport) {
        navigation.navigate('SportActivityHome', {
          sport: sportDetails.sport,
          sportType: sportDetails?.sport_type,
          uid: route.params.uid ?? authContext.uid,
          entityType: type,
          showPreview: true,
        });
      } else if (type === Verbs.entityTypePlayer) {
        navigation.navigate('AccountStack', {screen: 'RegisterPlayer'});
      } else if (type === Verbs.entityTypeReferee) {
        navigation.navigate('AccountStack', {screen: 'RegisterReferee'});
      } else if (type === Verbs.entityTypeScorekeeper) {
        navigation.navigate('AccountStack', {screen: 'RegisterScorekeeper'});
      }
    }
  };

  const handleSportActivityOption = (option) => {
    setAddSportActivityModal(false);
    switch (option) {
      case strings.addPlaying:
        navigation.navigate('AccountStack', {
          screen: 'RegisterPlayer',
          params: {comeFrom: 'HomeScreen'},
        });
        break;

      case strings.addRefereeing:
        navigation.navigate('AccountStack', {screen: 'RegisterReferee'});
        break;

      case strings.addScorekeeping:
        navigation.navigate('AccountStack', {screen: 'RegisterScorekeeper'});
        break;

      case strings.cancel:
        setAddSportActivityModal(false);
        break;

      default:
        break;
    }
  };

  const handleMainRefOnScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: mainFlatListFromTop}}}],
    {useNativeDriver: false},
  );

  const userDetailsSection = () => (
    <>
      <UserHomeHeader
        currentUserData={currentUserData}
        onConnectionButtonPress={(tabs = '') => {
          setTab(tabs);

          ModalRef.current.present();
        }}
        onAction={onUserAction}
        isAdmin={isAdmin}
        followRequestSent={followRequestSent}
        loggedInEntity={authContext.entity}
      />
      <View style={styles.activityList}>
        <OrderedSporList
          user={currentUserData}
          type="horizontal"
          isAdmin={isAdmin}
          onCardPress={handleSportActivityPress}
        />
      </View>
      <PostsTabView
        list={[strings.event, strings.galleryTitle]}
        onPress={(option) => {
          if (option === strings.galleryTitle) {
            navigation.navigate('UserGalleryScreen', {
              isAdmin,
              galleryRef,
              entityType: route?.params?.role ?? authContext.entity?.role,
              entityID: route?.params?.uid ?? authContext.entity?.uid,
              currentUserData,
            });
          } else if (option === strings.event) {
            navigation.navigate('App', {
              screen: 'Schedule',
              params: {
                isAdmin,
                isFromHomeScreen: true,
                role: route.params?.role ?? authContext.entity.role,
                uid: route.params?.uid ?? authContext.entity.uid,
              },
            });
          }
        }}
      />
    </>
  );

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
            homeFeedHeaderComponent={userDetailsSection}
            currentTab={0}
            pulltoRefresh={pulltoRefresh}
            routeParams={routeParams}
          />
        </View>

        {renderImageProgress}
      </View>
      <BottomSheet
        isVisible={addSportActivityModal}
        closeModal={() => {
          setAddSportActivityModal(false);
        }}
        optionList={[
          strings.addPlaying,
          strings.addRefereeing,
          strings.addScorekeeping,
          strings.cancel,
        ]}
        onSelect={handleSportActivityOption}
      />
      <UserConnectionModal
        ModalRef={ModalRef}
        refreshModal={refreshModal}
        closeModal={() => setRefreshModal(false)}
        entityType={route.params.role ?? authContext.entity.role}
        userId={route.params.uid ?? authContext.entity.uid}
        userName={currentUserData.full_name}
        tab={tab}
      />

      <SwitchAccountLoader
        isVisible={showSwitchScreen}
        entityName={authContext.managedEntities[0]?.full_name}
        entityType={Verbs.entityTypePlayer}
        entityImage={
          authContext.managedEntities[0]?.thumbnail
            ? {uri: authContext.managedEntities[0].thumbnail}
            : images.profilePlaceHolder
        }
        stopLoading={() => {}}
      />

      <JoinRequestModal
        JoinRequestModalRef={JoinRequestModalRef}
        currentUserData={currentUserData}
        onAcceptPress={() =>
          onAccept(currentUserData.invite_request.activity_id)
        }
        onDeclinePress={() =>
          onDecline(currentUserData.invite_request.activity_id)
        }
        messageText={messageText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  activityList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 25,
    marginBottom: 20,
    borderColor: colors.grayBackgroundColor,
  },
});

export default UserHomeScreen;
