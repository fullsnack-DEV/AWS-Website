import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Pressable,
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

const HomeScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [pointEvent] = useState('auto');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [moreOptions, setMoreOptions] = useState([]);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const [settingObject, setSettingObject] = useState();
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getUserData = useCallback(
    (uid, admin) => {
      setLoading(true);
      getUserDetails(uid, authContext, !admin)
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
            Alert.alert(strings.alertmessagetitle, errResponse);
          }, 10);
          navigation.goBack();
        });
    },
    [authContext, navigation],
  );

  const fetchGroupDetails = useCallback(
    (userId, role, admin) => {
      setLoading(true);
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
    },
    [authContext],
  );

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
  }, [authContext.entity, route.params, getUserData, fetchGroupDetails]);

  useEffect(() => {
    if (isFocused && route.params?.isEntityCreated && route.params?.entityObj) {
      setCurrentUserData(route.params.entityObj);
      setSettingObject(route.params.entityObj);
      setCongratulationsModal(true);
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
  }, [route.params, isFocused]);

  const handleMoreOptions = (option) => {
    setShowMoreOptionsModal(false);

    switch (option) {
      case strings.sportActivity:
        navigation.navigate('SportActivitiesScreen', {
          isAdmin,
          uid: route.params?.uid ?? authContext.uid,
        });
        break;

      case strings.recruitingMembers:
        navigation.navigate('GroupMembersScreen', {
          groupID: route.params.uid,
          groupObj: currentUserData,
        });
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
        />
      );
    }
    return null;
  };

  const onMessageButtonPress = (entityId) => {
    navigation.push('MessageChat', {
      screen: 'MessageChat',
      params: {userId: entityId},
    });
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
      if (isAdmin) {
        setMoreOptions([strings.sportActivity]);
      } else {
        setMoreOptions([
          strings.sportActivity,
          strings.reportThisAccount,
          strings.blockThisAccount,
        ]);
      }
    } else if (
      route.params.role === Verbs.entityTypeClub ||
      route.params.role === Verbs.entityTypeTeam
    ) {
      setShowMoreOptionsModal(true);
      if (isAdmin) {
        setMoreOptions([strings.recruitingMembers]);
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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerRow}>
        <View style={styles.row}>
          <Pressable
            style={styles.imageContainer}
            onPress={() => {
              if (route.params?.comeFrom === 'IncomingChallengeSettings') {
                navigation.navigate('AccountScreen');
              } else if (route.params?.isEntityCreated) {
                navigation.pop(4);
              } else {
                navigation.goBack();
              }
            }}>
            <Image source={images.backArrow} style={styles.image} />
          </Pressable>
          <View style={{marginHorizontal: 5}}>
            <Text style={styles.title}>
              {currentUserData.full_name ?? currentUserData.group_name}
            </Text>
          </View>
          <Pressable
            style={styles.dropDownImage}
            onPress={() => setShowSwitchAccountModal(true)}>
            <Image source={images.path} style={styles.image} />
          </Pressable>
        </View>
        <View style={styles.row}>
          {!isAdmin ? (
            <Pressable
              style={[styles.imageContainer, {marginRight: 10}]}
              onPress={() => {
                const id =
                  route.params.role === Verbs.entityTypePlayer ||
                  route.params.role === Verbs.entityTypeUser
                    ? currentUserData.user_id
                    : currentUserData.group_id;
                onMessageButtonPress(id);
              }}>
              <Image source={images.tab_message} style={styles.image} />
            </Pressable>
          ) : null}

          <Pressable
            style={styles.imageContainer}
            onPress={() => {
              setKebabButtonOptions();
            }}>
            <Image source={images.chat3Dot} style={styles.image} />
          </Pressable>
        </View>
      </View>
      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      {getShimmer()}
      {renderScreen()}

      <BottomSheet
        isVisible={showMoreOptionsModal}
        closeModal={() => setShowMoreOptionsModal(false)}
        optionList={moreOptions}
        onSelect={handleMoreOptions}
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
                : route.params.entityObj?.sports?.[0]?.sport
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
        </>
      ) : null}

      <SwitchAccountModal
        isVisible={showSwitchAccountModal}
        closeModal={() => {
          setShowSwitchAccountModal(false);
          navigation.navigate('AccountScreen');
        }}
        onCreate={(option) => {
          console.log({option});
        }}
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
    paddingLeft: 10,
    paddingTop: 8,
    paddingRight: 15,
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
    alignItems: 'center',
    justifyContent: 'center',
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
