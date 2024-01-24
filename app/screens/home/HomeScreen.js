import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Pressable,
  BackHandler,
  Platform,
} from 'react-native';
import {format} from 'react-string-format';

import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

import AuthContext from '../../auth/context';

import {getUserDetails, sendInvitationInGroup} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import {getGroupIndex} from '../../api/elasticSearch';
import Verbs from '../../Constants/Verbs';
import UserHomeScreen from './UserHomeScreen';
import BottomSheet from '../../components/modals/BottomSheet';
import UserProfileScreenShimmer from '../../components/shimmer/account/UserProfileScreenShimmer';
import ProfileScreenShimmer from '../../components/shimmer/account/ProfileScreenShimmer';
import {
  getGroupDetails,
  getGroupMembers,
  getTeamsOfClub,
} from '../../api/Groups';
import GroupHomeScreen from './GroupHomeScreen';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import CongratulationsModal from '../account/registerPlayer/modals/CongratulationsModal';
import * as Utility from '../../utils';
import SwitchAccountModal from '../../components/account/SwitchAccountModal';
import useStreamChatUtils from '../../hooks/useStreamChatUtils';
import ActivityLoader from '../../components/loader/ActivityLoader';
import InviteMemberModal from '../../components/InviteMemberModal';
import {getDataForNextScreen} from '../localhome/LocalHomeUtils';
import {locationType} from '../../utils/constant';
import SportActivitiesModal from './components/SportActivitiesModal';
import RecruitingMemberModal from './RecruitingMemberModal';
import usePrivacySettings from '../../hooks/usePrivacySettings';
import {
  BinaryPrivacyOptionsEnum,
  GroupDefalutPrivacyOptionsEnum,
  GroupDefaultPrivacyOptionsForDoubleTeamEnum,
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
} from '../../Constants/PrivacyOptionsConstant';

const personalPrivacyKeyArr = [
  PrivacyKeyEnum.SportActivityList,
  PrivacyKeyEnum.Slogan,
  PrivacyKeyEnum.Posts,
  PrivacyKeyEnum.Gallery,
  PrivacyKeyEnum.FollowingAndFollowers,
  PrivacyKeyEnum.Events,
  PrivacyKeyEnum.InviteForTeam,
  PrivacyKeyEnum.InviteForClub,
  PrivacyKeyEnum.Chats,
];

const groupPrivacyKeyArr = [
  PrivacyKeyEnum.Posts,
  PrivacyKeyEnum.PostWrite,
  PrivacyKeyEnum.Events,
  PrivacyKeyEnum.ViewYourGroupMembers,
  PrivacyKeyEnum.Followers,
  PrivacyKeyEnum.Chats,
  PrivacyKeyEnum.Gallery,
];

const HomeScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {createChannel, isCreatingChannel} = useStreamChatUtils();

  const [pointEvent] = useState('auto');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [moreOptions, setMoreOptions] = useState([]);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [visibleInviteMember, setVisibleInviteMember] = useState(false);
  const [settingObject, setSettingObject] = useState();
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);
  const [loggedInGroupMembers, setLoggedInGroupMembers] = useState([]);
  const [visibleSportActivities, setVisibleSportAcitivities] = useState(false);
  const [visibleRecrutingModal, setVisibleRecrutingModal] = useState(false);
  const [personalPrivacyObject, setPersonalPrivacyObject] = useState({});
  const [groupPrivacyObject, setGroupPrivacyObject] = useState({});
  const [showChatActionSheet, setShowChatActionSheet] = useState(false);
  const [chatActions, setChatActions] = useState([]);

  const {getPrivacyStatus} = usePrivacySettings();

  useEffect(() => {
    if (isFocused && currentUserData?.entity_type) {
      if (
        [Verbs.entityTypeTeam, Verbs.entityTypeClub].includes(
          currentUserData.entity_type,
        )
      ) {
        const obj = {};
        groupPrivacyKeyArr.forEach((key) => {
          const isDoubleSportTeam =
            currentUserData.sport_type === Verbs.doubleSport;
          const privacyVal = isDoubleSportTeam
            ? GroupDefaultPrivacyOptionsForDoubleTeamEnum[currentUserData[key]]
            : GroupDefalutPrivacyOptionsEnum[currentUserData[key]];

          obj[key] = getPrivacyStatus(privacyVal, currentUserData);
        });
        setGroupPrivacyObject(obj);
      } else {
        const obj = {};
        personalPrivacyKeyArr.forEach((item) => {
          let privacyVal = PersonalUserPrivacyEnum[currentUserData[item]];
          if (
            item === PrivacyKeyEnum.InviteForTeam ||
            item === PrivacyKeyEnum.InviteForClub
          ) {
            privacyVal = BinaryPrivacyOptionsEnum[currentUserData[item]];
          }

          obj[item] = getPrivacyStatus(privacyVal, currentUserData);
        });

        setPersonalPrivacyObject(obj);
      }
    }
  }, [isFocused, currentUserData]);

  const getUserData = (uid) => {
    setLoading(true);

    getUserDetails(uid, authContext, true)
      .then((res1) => {
        const userDetails = res1.payload;
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

          setLoading(false);
        });
      })
      .catch((errResponse) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, errResponse.message);
        }, 10);
        navigation.goBack();
      });
  };

  const fetchGroupDetails = (userId, role, admin, fromRefresh = false) => {
    setLoading(!fromRefresh);

    const promises = [
      getGroupDetails(userId, authContext, !admin),
      getGroupMembers(userId, authContext),
    ];
    if (role === Verbs.entityTypeClub) {
      promises.push(getTeamsOfClub(userId, authContext));
    }
    Promise.all(promises)
      .then(([res1, res2, res3]) => {
        setCurrentUserData(res1.payload);
        const groupDetails = {...res1.payload};
        groupDetails.joined_members = res2.payload;
        if (role === Verbs.entityTypeClub) {
          groupDetails.joined_teams = res3.payload;
        }
        setCurrentUserData({...groupDetails});

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getLoggedinGroupMembers = (userId) => {
    getGroupMembers(userId, authContext)
      .then((res) => {
        setLoggedInGroupMembers(res.payload);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const loginEntity = authContext.entity;

    const uid = route.params.uid ?? loginEntity.uid;

    const admin = loginEntity.uid === uid;
    const role = route.params.role ?? '';

    setIsAdmin(loginEntity.uid === uid);

    if (role === Verbs.entityTypePlayer || role === Verbs.entityTypeUser) {
      getUserData(uid, admin);
    }
    if (role === Verbs.entityTypeClub || role === Verbs.entityTypeTeam) {
      fetchGroupDetails(uid, role, admin);
    }

    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      getLoggedinGroupMembers(authContext.entity.uid);
    }
  }, [
    authContext.entity,
    route.params?.role,
    route.params.uid,
    route.params?.comeFrom,
  ]);

  useEffect(() => {
    if (isFocused && route.params?.isEntityCreated && route.params?.entityObj) {
      setCongratulationsModal(true);
      setCurrentUserData(route.params.entityObj);
      setSettingObject(route.params.entityObj);

      navigation.setParams({isEntityCreated: false});
    }

    if (route.params?.userJoinTeam) {
      Alert.alert(
        format(strings.userJoinTeam, route.params?.entityObj?.group_name),
        '',
        [
          {
            text: strings.OkText,
            onPress: () => console.log('PRessed'),
          },
        ],
        {cancelable: false},
      );
    }
  }, [route.params]);

  const handleMoreOptions = (option) => {
    setShowMoreOptionsModal(false);

    switch (option) {
      case strings.sportActivity:
        setVisibleSportAcitivities(true);

        break;

      case strings.recruitingMembers:
        setVisibleRecrutingModal(true);

        break;

      case strings.blockThisAccount:
      case strings.reportThisAccount:
        break;

      default:
        break;
    }
  };

  const getShimmer = () => {
    if (loading) {
      if (
        route.params.role === Verbs.entityTypePlayer ||
        route.params.role === Verbs.entityTypeUser
      ) {
        return <UserProfileScreenShimmer />;
      }
      return <ProfileScreenShimmer />;
    }
    return null;
  };

  const renderScreen = () => {
    if (loading) return null;
    if (
      route.params.role === Verbs.entityTypePlayer ||
      route.params.role === Verbs.entityTypeUser
    ) {
      return (
        <UserHomeScreen
          navigation={navigation}
          route={route}
          userID={route.params.uid ?? authContext.entity.uid}
          isAdmin={isAdmin}
          pointEvent={pointEvent}
          isAccountDeactivated={authContext.isAccountDeactivated}
          userData={currentUserData}
          pulltoRefresh={() => {
            const loginEntity = authContext.entity;

            const uid = route.params.uid ?? loginEntity.uid;

            getUserData(uid);
          }}
          routeParams={route.params}
          loggedInGroupMembers={loggedInGroupMembers}
          privacyObj={personalPrivacyObject}
        />
      );
    }

    if (
      route.params.role === Verbs.entityTypeClub ||
      route.params.role === Verbs.entityTypeTeam
    ) {
      return (
        <GroupHomeScreen
          navigation={navigation}
          route={route}
          groupId={route.params.uid ?? authContext.entity.uid}
          isAdmin={isAdmin}
          pointEvent={pointEvent}
          isAccountDeactivated={authContext.isAccountDeactivated}
          groupData={currentUserData}
          restrictReturn={route.params?.restrictReturn}
          pulltoRefresh={() => {
            const loginEntity = authContext.entity;

            const uid = route.params.uid ?? loginEntity.uid;

            const admin = loginEntity.uid === uid;
            const role = route.params.role ?? '';
            const fromRefresh = true;
            fetchGroupDetails(uid, role, admin, fromRefresh);
          }}
          routeParams={route.params}
          privacyObj={groupPrivacyObject}
        />
      );
    }
    return null;
  };

  const handleCreateChannel = (entityData = {}) => {
    if (entityData.joined_members?.length > 0) {
      const invitee = [
        {
          id: entityData.group_id ?? entityData.user_id,
          name: entityData.group_name ?? entityData.full_name,
          image: entityData.full_image ?? entityData.thumbnail,
          entityType: entityData.entity_type,
          city: entityData.city,
        },
      ];

      if (invitee[0]?.id) {
        createChannel(invitee)
          .then(async (channel) => {
            if (channel) {
              await channel.watch();
              const routeParams = {...route.params};
              if (route.params?.comeFrom === 'EntitySearchScreen') {
                routeParams.comeFrom = 'EntitySearchScreen';
              }

              navigation.navigate('MessageStack', {
                screen: 'MessageChatScreen',
                params: {
                  channel,
                  comeFrom: 'HomeScreen',
                  routeParams,
                },
              });
            }
          })
          .catch((err) => {
            Alert.alert(strings.alertmessagetitle, err.message);
          });
      }
    } else if (
      entityData.entity_type === Verbs.entityTypePlayer ||
      entityData.entity_type === Verbs.entityTypeUser
    ) {
      const invitee = [
        {
          id: entityData.group_id ?? entityData.user_id,
          name: entityData.group_name ?? entityData.full_name,
          image: entityData.full_image ?? entityData.thumbnail,
          entityType: entityData.entity_type,
          city: entityData.city,
        },
      ];

      if (invitee[0]?.id) {
        createChannel(invitee)
          .then(async (channel) => {
            if (channel) {
              await channel.watch();
              const routeParams = {...route.params};
              if (route.params?.comeFrom === 'EntitySearchScreen') {
                routeParams.comeFrom = 'EntitySearchScreen';
              }

              navigation.navigate('MessageStack', {
                screen: 'MessageChatScreen',
                params: {
                  channel,
                  comeFrom: 'HomeScreen',
                  routeParams,
                },
              });
            }
          })
          .catch((err) => {
            Alert.alert(strings.alertmessagetitle, err.message);
          });
      }
    } else {
      Alert.alert('', strings.alretMessageForEmptyTeam);
    }
  };

  const sendInvitation = (userids) => {
    setListLoading(true);
    const entity = authContext.entity;
    const obj = {
      entity_type: entity.role,
      userIds: userids,
      uid: entity.uid,
    };

    sendInvitationInGroup(obj, authContext)
      .then(() => {
        setListLoading(false);
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
        setListLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const setKebabButtonOptions = () => {
    if (
      route.params.role === Verbs.entityTypePlayer ||
      route.params.role === Verbs.entityTypeUser
    ) {
      setShowMoreOptionsModal(true);
      if (isAdmin && personalPrivacyObject[PrivacyKeyEnum.SportActivityList]) {
        setMoreOptions([strings.sportActivity]);
      } else if (personalPrivacyObject[PrivacyKeyEnum.SportActivityList]) {
        setMoreOptions([
          strings.sportActivity,
          strings.reportThisAccount,
          strings.blockThisAccount,
        ]);
      } else {
        setMoreOptions([strings.reportThisAccount, strings.blockThisAccount]);
      }
    } else if (
      route.params.role === Verbs.entityTypeClub ||
      route.params.role === Verbs.entityTypeTeam
    ) {
      setShowMoreOptionsModal(true);
      if (isAdmin) {
        if (Platform.OS === 'ios') {
          setMoreOptions([strings.recruitingMembers]);
        } else {
          setMoreOptions([strings.recruitingMembers, strings.cancel]);
        }
      } else {
        setMoreOptions([strings.reportThisAccount, strings.blockThisAccount]);
      }
    } else {
      setShowMoreOptionsModal(true);
      if (!isAdmin) {
        setMoreOptions([strings.reportThisAccount, strings.blockThisAccount]);
      }
    }
  };

  const handleBackPress = useCallback(() => {
    if (
      route.params?.comeFrom === 'IncomingChallengeSettings' ||
      route.params?.comeFrom === 'IncomingChallengeScreen' ||
      route.params?.comeFrom === 'GroupMemberScreen'
    ) {
      navigation.navigate('App', {screen: 'Account'});
    } else if (route.params?.comeFrom === 'EntitySearchScreen') {
      navigation.navigate('UniversalSearchStack', {
        screen: route.params.backScreen,
        params: {
          parentStack: route.params?.parentStack,
          screen: route.params.screen,
        },
      });
    } else if (route.params?.comeFrom === 'MessageChatScreen') {
      navigation.navigate('MessageStack', {
        screen: 'MessageChatScreen',
        params: {channel: route.params.routeParams},
      });
    } else if (route.params?.comeFrom === 'createClub') {
      navigation.navigate('App', {screen: 'Account'});
    } else if (route.params?.comeFrom === 'ScheduleScreen') {
      navigation.navigate('App', {screen: 'Account'});
    } else if (route.params?.isEntityCreated) {
      navigation.navigate('App', {
        screen: 'Account',
      });
    } else if (route.params?.comeFrom === 'LocalHomeScreen') {
      navigation.navigate('LocalHomeStack', {
        screen: 'JoinTeamScreen',
      });
    } else if (route.params?.comeFrom === 'UserTagSelectionListScreen') {
      navigation.navigate('NewsFeedStack', {
        screen: 'UserTagSelectionListScreen',
        params: {
          ...route.params.routeParams,
        },
      });
    } else if (route.params?.comeFrom) {
      navigation.navigate(route.params.comeFrom, {
        ...route.params.routeParams,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, [handleBackPress]);

  const chatPrivacyStatus = [
    Verbs.entityTypeTeam,
    Verbs.entityTypeClub,
  ].includes(currentUserData.entity_type)
    ? groupPrivacyObject[PrivacyKeyEnum.Chats]
    : personalPrivacyObject[PrivacyKeyEnum.Chats];

  const handleChatButtonPress = () => {
    if (currentUserData.entity_type === Verbs.entityTypeTeam) {
      const chatOptions = [
        format(strings.toGroupName, currentUserData.group_name),
      ];

      const userIdList = (currentUserData.joined_members ?? []).map(
        (item) => item.user_id,
      );

      if (
        [Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(
          authContext.entity.role,
        ) &&
        userIdList.includes(authContext.entity.uid)
      ) {
        chatOptions.push(strings.withAllMember);
      }

      setChatActions(chatOptions);
      setShowChatActionSheet(true);
    } else if (currentUserData.entity_type === Verbs.entityTypeClub) {
      const chatOptions = [
        format(strings.toGroupName, currentUserData.group_name),
      ];
      const userIdList = (currentUserData.joined_members ?? []).map(
        (item) => item.user_id,
      );

      if (
        [Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(
          authContext.entity.role,
        ) &&
        userIdList.includes(authContext.entity.uid)
      ) {
        chatOptions.push(strings.withAllMember);
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        const groupIdList = (currentUserData.joined_members ?? []).map(
          (item) => item.group_id,
        );
        if (groupIdList.includes(authContext.entity.uid)) {
          chatOptions.push(strings.withAllMember);
        }
      }

      setChatActions(chatOptions);
      setShowChatActionSheet(true);
    } else {
      handleCreateChannel(currentUserData);
    }
  };

  const openGroupChannel = async () => {
    const filter = {
      type: 'messaging',
      id: {$eq: currentUserData.group_id},
    };

    const channels = await authContext.chatClient.queryChannels(filter);
    setShowChatActionSheet(false);
    if (channels?.length > 0) {
      await channels[0].watch();
      const routeParams = {...route.params};
      if (route.params?.comeFrom === 'EntitySearchScreen') {
        routeParams.comeFrom = 'EntitySearchScreen';
      }

      navigation.navigate('MessageStack', {
        screen: 'MessageChatScreen',
        params: {
          channel: channels[0],
          comeFrom: 'HomeScreen',
          routeParams,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.headerRow, {width: '100%'}]}>
        <View style={[styles.row, {flex: 1}]}>
          <Pressable
            style={styles.imageContainer}
            onPress={() => handleBackPress()}>
            <Image
              source={images.backIconBigger}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          </Pressable>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              {!loading && (
                <Text style={styles.title} numberOfLines={1}>
                  {currentUserData.full_name ?? currentUserData.group_name}
                </Text>
              )}
            </View>
            {isAdmin ? (
              <Pressable
                style={[styles.dropDownImage, {marginLeft: 5}]}
                onPress={() => setShowSwitchAccountModal(true)}>
                <Image source={images.path} style={styles.image} />
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={[styles.row, {marginLeft: 22}]}>
          {!isAdmin && chatPrivacyStatus ? (
            <Pressable
              style={styles.imageContainer}
              onPress={handleChatButtonPress}>
              <Image
                source={images.newchatIcon}
                style={{width: 18, height: 18, marginTop: 4}}
              />
            </Pressable>
          ) : null}

          <Pressable
            style={styles.imageContainer}
            onPress={() => {
              setKebabButtonOptions();
            }}>
            <Image
              source={images.chat3Dot}
              style={[styles.image, {marginLeft: 5}]}
            />
          </Pressable>
        </View>
      </View>
      <ActivityLoader visible={isCreatingChannel} />
      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      {getShimmer()}
      {renderScreen()}

      <BottomSheet
        isVisible={showMoreOptionsModal}
        closeModal={() => setShowMoreOptionsModal(false)}
        optionList={moreOptions}
        onSelect={handleMoreOptions}
      />

      <BottomSheet
        isVisible={showChatActionSheet}
        closeModal={() => setShowChatActionSheet(false)}
        optionList={chatActions}
        onSelect={(option) => {
          if (option === strings.withAllMember) {
            openGroupChannel();
          } else {
            handleCreateChannel(currentUserData);
            setShowChatActionSheet(false);
          }
        }}
      />

      {/* Modals */}

      {authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub ? (
        <>
          <CongratulationsModal
            isVisible={congratulationsModal}
            settingsObj={settingObject}
            listloading={listLoading}
            title={route?.params?.entityObj?.group_name}
            subtitle={format(
              strings.congratesSubTitle,
              route.params?.entityObj?.group_name,
            )}
            fromCreateTeam={authContext.entity.role === Verbs.entityTypeTeam}
            fromCreateClub={authContext.entity.role === Verbs.entityTypeClub}
            closeModal={() => {
              setCongratulationsModal(false);
            }}
            sportName={
              authContext.entity.role === Verbs.entityTypeTeam
                ? route.params.entityObj?.setting?.sport
                : route.params.entityObj?.sports?.[0]?.sport
            }
            sport={
              authContext.entity.role === Verbs.entityTypeTeam
                ? route.params.entityObj?.setting?.sport
                : route.params.entityObj?.sports?.[0]?.sport
            }
            sportType={
              authContext.entity.role === Verbs.entityTypeTeam
                ? route.params.entityObj?.setting?.sport
                : Verbs.sportTypeSingle
            }
            searchTeam={(filters) => {
              const teamData = getDataForNextScreen(
                Verbs.TEAM_DATA,
                filters,
                filters.location,
                locationType.WORLD,
                authContext,
              );

              navigation.navigate('AccountStack', {
                screen: 'LookingForChallengeScreen',
                params: {
                  filters: teamData.filters,
                  teamSportData: teamData.teamSportData,
                  registerFavSports: filters.sport,
                },
              });
            }}
            searchPlayer={() => {
              setCongratulationsModal(false);
              setVisibleInviteMember(true);
            }}
            goToSportActivityHome={() => {
              setCongratulationsModal(false);
              if (authContext.entity.role === Verbs.entityTypeTeam) {
                setVisibleInviteMember(true);
              }
            }}
            onInviteClick={(item) => {
              const userIds = [];
              userIds.push(item.user_id);

              sendInvitation(userIds);
            }}
          />
        </>
      ) : null}

      <InviteMemberModal
        isVisible={visibleInviteMember}
        closeModal={() => setVisibleInviteMember(false)}
      />

      <SwitchAccountModal
        isVisible={showSwitchAccountModal}
        closeModal={(obj) => {
          if (obj) {
            navigation.setParams({...obj});
          }
          setShowSwitchAccountModal(false);
        }}
        onCreate={(option) => {
          console.log({option});
        }}
      />

      <SportActivitiesModal
        isVisible={visibleSportActivities}
        onCloseModal={() => setVisibleSportAcitivities(false)}
        isAdmin={isAdmin}
        uid={route.params?.uid ?? authContext.uid}
      />
      <RecruitingMemberModal
        visible={visibleRecrutingModal}
        onClose={() => setVisibleRecrutingModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 15,
    paddingBottom: 14,
    borderBottomWidth: 1,

    borderBottomColor: colors.writePostSepratorColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  dropDownImage: {
    width: 10,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
