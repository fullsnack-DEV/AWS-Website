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
import {cancelGroupInvite, followGroup} from '../../api/Groups';
import {createPost} from '../../api/NewsFeeds';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import {strings} from '../../../Localization/translation';
import {ImageUploadContext} from '../../context/GetContexts';
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
  const imageUploadContext = useContext(ImageUploadContext);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(false);
  const [addSportActivityModal, setAddSportActivityModal] = useState(false);

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
  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const mainFlatListRef = useRef();

  useEffect(() => {
    if (userData?.user_id) {
      setCurrentUserData(userData);
    }
  }, [userData]);

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
    },
    [authContext, createPostAfterUpload, imageUploadContext, currentUserData],
  );

  const callFollowUser = useCallback(async () => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    // entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    followUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        // entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  }, [authContext, currentUserData, userID]);

  const callUnfollowUser = useCallback(async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1;
    }
    // entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    unfollowUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        // entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
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
        // currentUserData.inviteBtnTitle = strings.invited;
        // entityObject = currentUserData;
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
  }, [authContext, currentUserData, userID, createActionObject]);

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

  const callFollowGroup = useCallback(
    async (silentlyCall = false) => {
      currentUserData.is_following = true;
      currentUserData.follower_count += 1;

      const params = {
        entity_type: currentUserData.entity_type,
      };
      followGroup(params, userID, authContext)
        .then(() => {
          setCurrentUserData({...currentUserData});
        })
        .catch((error) => {
          currentUserData.is_following = false;
          currentUserData.follower_count -= 1;

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

  const onAccept = useCallback(
    (requestId) => {
      setloading(true);
      acceptRequest({}, requestId, authContext)
        .then(() => {
          // Succefully join case
          currentUserData.is_joined = true;
          currentUserData.member_count += 1;
          if (currentUserData.is_following === false) {
            callFollowGroup(true);
          }

          setloading(false);
          setTimeout(() => {
            Alert.alert(
              strings.alertmessagetitle,
              strings.acceptRequestMessage,
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
    [authContext, currentUserData, callFollowGroup],
  );

  const onDecline = useCallback(
    (requestId) => {
      setloading(true);
      declineRequest(requestId, authContext)
        .then(() => {
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
    },
    [authContext],
  );

  const cancelGroupInvitation = useCallback(() => {
    setloading(true);
    const params = {
      group_id: currentUserData.invite_request.group_id,
      invited_id: currentUserData.invite_request.invited_id,
      activity_id: currentUserData.invite_request.activity_id,
    };
    cancelGroupInvite(params, authContext)
      .then(() => {
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
          Alert.alert(
            format(strings.alreadySendRequestMsg, currentUserData.full_name),
            '',
            [
              {
                text: strings.cancelRequestTitle,
                onPress: () => cancelGroupInvitation(),
              },
              {
                text: strings.cancel,
              },
            ],
          );
          break;

        case strings.acceptInvitateRequest:
          onAccept(currentUserData.invite_request.activity_id);
          break;

        case strings.declineMemberRequest:
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
    ],
  );

  const onConnectionButtonPress = useCallback(
    (tab) => {
      const entity_type = route.params.role ?? authContext.entity.role;
      const user_id = route.params.uid ?? authContext.entity.uid;

      if (tab === Verbs.followingVerb) {
        if (
          entity_type === Verbs.entityTypeTeam ||
          entity_type === Verbs.entityTypeClub
        ) {
          navigation.navigate('JoinedTeamsScreen', {
            uid: user_id,
            role: entity_type,
          });
        } else {
          navigation.navigate('UserConnections', {tab, entity_type, user_id});
        }
      } else if (tab === Verbs.privacyTypeFollowers) {
        navigation.navigate('UserConnections', {tab, entity_type, user_id});
      }
    },
    [authContext.entity, navigation, route.params],
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

  const handleMainRefOnScroll = Animated.event([
    {nativeEvent: {contentOffset: {y: mainFlatListFromTop}}},
  ]);

  const userDetailsSection = () => (
    <>
      <UserHomeHeader
        currentUserData={currentUserData}
        onConnectionButtonPress={onConnectionButtonPress}
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
              callFunction: () => callthis,
            });
          } else if (option === strings.event) {
            //
          }
        }}
      />
    </>
  );

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
            homeFeedHeaderComponent={userDetailsSection}
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
