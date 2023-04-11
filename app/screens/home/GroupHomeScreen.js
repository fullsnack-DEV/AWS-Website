// @flow
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  FlatList,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {format} from 'react-string-format';
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
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import HomeFeed from '../homeFeed/HomeFeed';
import GroupHomeButton from './GroupHomeButton';
import {ErrorCodes} from '../../utils/constant';
import {setAuthContextData, setStorage} from '../../utils';
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
  const handleMainRefOnScroll = Animated.event([
    {nativeEvent: {contentOffset: {y: mainFlatListFromTop}}},
  ]);
  // const [showBottomSheet, setShowBottomSheet] = useState(false);
  // const [options, setOptions] = useState([]);

  useEffect(() => {
    if (groupData?.group_id) {
      setCurrentUserData(groupData);
    }
  }, [groupData]);

  const renderMemberList = () => {
    if (groupData.joined_members?.length > 0) {
      return (
        <FlatList
          data={groupData.joined_members}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={{paddingLeft: 15, paddingBottom: 25}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={styles.memberIcon}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.image}
              />
              {groupData.joined_members.length > 9 &&
                index === groupData.joined_members.length - 1 && (
                  <Pressable style={styles.maskView}>
                    <Text style={styles.moreDots}>···</Text>
                  </Pressable>
                )}
            </View>
          )}
          ListFooterComponent={() => {
            if (isAdmin && groupData.joined_members.length < 9) {
              return (
                <View style={styles.addIcon}>
                  <Image source={images.plus} style={styles.image} />
                </View>
              );
            }
            return null;
          }}
        />
      );
    }
    return null;
  };

  const ListHeader = () => (
    <>
      <GroupHomeHeader
        groupData={currentUserData}
        loggedInUser={authContext.entity}
        sportList={authContext.sports}
      />
      {renderMemberList()}
      <GroupHomeButton
        groupData={currentUserData}
        loggedInEntity={authContext.entity}
        isAdmin={isAdmin}
        onPress={handleGroupActions}
      />
      <View style={styles.separator} />
      <PostsTabView
        list={[
          strings.infoTitle,
          strings.scheduleTitle,
          strings.scoreboard,
          strings.stats,
          strings.reviews,
        ]}
        onPress={(option) => {
          console.log({option});
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

      // case strings.refereeOffer:
      //   break;

      // case strings.scorekeeperOffer:
      //   break;

      case strings.inviteToChallenge:
        inviteToChallenge();
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
      {/* <BottomSheet /> */}
    </>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 25,
  },
  memberIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.whiteColor,
    padding: 1,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.16,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  addIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.textFieldBackground,
    padding: 10,
  },
  maskView: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.modalBackgroundColor,
    position: 'absolute',
  },
  moreDots: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
});
export default GroupHomeScreen;
