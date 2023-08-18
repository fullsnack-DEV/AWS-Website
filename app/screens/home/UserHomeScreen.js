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
import {followUser, unfollowUser, inviteUser} from '../../api/Users';
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

const UserHomeScreen = ({
  navigation,
  route,
  userID,
  isAdmin = false,
  pointEvent = 'auto',
  isAccountDeactivated = false,
  userData = {},
}) => {
  const authContext = useContext(AuthContext);
  const galleryRef = useRef();
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(false);
  const [addSportActivityModal, setAddSportActivityModal] = useState(false);

  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const mainFlatListRef = useRef();

  useEffect(() => {
    if (userData?.user_id) {
      setCurrentUserData(userData);
    }
  }, [userData]);

  const callFollowUser = useCallback(async () => {
    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    setloading(true);
    followUser(params, userID, authContext)
      .then(() => {
        const obj = {
          ...currentUserData,
          is_following: true,
          follower_count: currentUserData.follower_count + 1,
        };
        setCurrentUserData(obj);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userID]);

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
  }, [authContext, currentUserData, userID]);

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

  const onAccept = useCallback(
    (requestId) => {
      setloading(true);
      acceptRequest({}, requestId, authContext)
        .then(() => {
          // Succefully join case
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

  const removeUserFromGroup = useCallback(() => {
    setloading(true);

    deleteMember(authContext.entity.uid, userID, authContext)
      .then(() => {
        const obj = {...currentUserData};

        if (authContext.entity.role === Verbs.entityTypeTeam) {
          obj.joined_teams = (currentUserData.joined_teams ?? []).filter(
            (item) => item.group_id !== authContext.entity.uid,
          );
        } else if (authContext.entity.role === Verbs.entityTypeClub) {
          obj.joined_clubs = (currentUserData.joined_clubs ?? []).filter(
            (item) => item.group_id !== authContext.entity.uid,
          );
        }
        setCurrentUserData(obj);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, userID, currentUserData]);

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
          onAccept(currentUserData.invite_request.activity_id);
          break;

        case strings.declineMemberRequest:
        case strings.declineRequest:
          onDecline(currentUserData.invite_request.activity_id);
          break;

        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);
          break;

        case Verbs.editVerb:
          navigation.navigate('PersonalInformationScreen', {
            isEditProfile: true,
          });
          break;

        case strings.removeMemberFromTeamText:
          removeUserFromGroup();
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
      onMessageButtonPress,
      onAccept,
      onDecline,
      cancelGroupInvitation,
      removeUserFromGroup,
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
        navigation.navigate('RegisterPlayer');
      } else if (type === Verbs.entityTypeReferee) {
        navigation.navigate('RegisterReferee');
      } else if (type === Verbs.entityTypeScorekeeper) {
        navigation.navigate('RegisterScorekeeper');
      }
    }
  };

  const handleSportActivityOption = (option) => {
    setAddSportActivityModal(false);
    switch (option) {
      case strings.addPlaying:
        navigation.navigate('RegisterPlayer', {comeFrom: 'HomeScreen'});
        break;

      case strings.addRefereeing:
        navigation.navigate('RegisterReferee');
        break;

      case strings.addScorekeeping:
        navigation.navigate('RegisterScorekeeper');
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
        onConnectionButtonPress={(tab = '') => {
          const entityType = route.params.role ?? authContext.entity.role;
          const userId = route.params.uid ?? authContext.entity.uid;
          navigation.navigate('UserConnections', {
            entityType,
            userId,
            userName: currentUserData.full_name,
            tab,
          });
        }}
        onAction={onUserAction}
        isAdmin={isAdmin}
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
            navigation.navigate('ScheduleScreen', {
              isAdmin,
              isFromHomeScreen: true,
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
        ]}
        onSelect={handleSportActivityOption}
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
