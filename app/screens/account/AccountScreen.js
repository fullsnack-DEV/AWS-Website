import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {format} from 'react-string-format';

import {useIsFocused} from '@react-navigation/native';
import AccountHeader from './components/AccountHeader';
import AuthContext from '../../auth/context';
import AccountEntity from './components/AccountEntity';
import {getStorage, onLogout} from '../../utils';
import SwitchAccountModal from '../../components/account/SwitchAccountModal';
import AccountMenuList from './components/AccountMenuList';

import {
  getJoinedGroups,
  getTeamsOfClub,
  actionOnGroupRequest,
  getTeamPendingRequest,
} from '../../api/Groups';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';
import {
  prepareClubMenu,
  prepareTeamMenu,
  prepareUserMenu,
} from './prepareMenuData';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  getExcludedSportsList,
  getTitleForRegister,
} from '../../utils/sportsActivityUtils';

import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import SendNewInvoiceModal from './Invoice/SendNewInvoiceModal';
import MemberListModal from '../../components/MemberListModal/MemberListModal';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import AccountShimmer from '../../components/shimmer/account/AccountShimmer';
import {getUnreadCount} from '../../api/Notificaitons';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {onResendRequest} from '../../utils/accountUtils';
import SportsListModal from './registerPlayer/modals/SportsListModal';
import {getUserSettings} from '../../api/Users';
import {getActivityLogCount} from '../../api/ActivityLog';
import {useTabBar} from '../../context/TabbarContext';
// eslint-disable-next-line import/order
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AccountScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountMenu, setAccountMenu] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [navigationOptions, setNavigationOptions] = useState({});
  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [visibleSportsModalForTeam, setVisibleSportsModalForTeam] =
    useState(false);
  const [selectedMenuOptionType, setSelectedMenuOptionType] = useState(
    Verbs.entityTypePlayer,
  );
  const [visibleSportsModalForClub, setVisibleSportsModalForClub] =
    useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [sendNewInvoice, SetSendNewInvoice] = useState(false);
  const [showOnlyTeamSport, setShowOnlyTeamSport] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [onlyteamSport, setOnlyTeamSport] = useState();
  // this is for the DoubleSport when we come from search Player on congratulationsModal
  const [doubleSport, setdoubleSport] = useState();

  const [memberListModalForDoubles, setMemberListModalForDoubles] =
    useState(false);

  const [players, setPlayers] = useState([]);
  const [onLoad, setOnLoad] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);
  const [showRedDotForLog, setShowRedDotForLog] = useState(false);

  const {toggleTabBar} = useTabBar();

  useEffect(() => {
    // Set TabBar visibility to true when this screen mounts
    toggleTabBar(true);

    return () => {
      // Set TabBar visibility to false when this screen unmounts
      toggleTabBar(false);
    };
  }, [isFocused, toggleTabBar]);

  useEffect(() => {
    if (isFocused) {
      getUserSettings(authContext)
        .then((response) => {
          const lastActivityTimeStamp =
            response.payload.user?.last_activity_log_timestamp[
              authContext.entity.uid
            ];

          if (lastActivityTimeStamp) {
            getActivityLogCount(lastActivityTimeStamp, authContext)
              .then((res) => {
                setShowRedDotForLog(res?.payload > 0);
              })
              .catch((err) => {
                console.log({err});
              });
          } else {
            setShowRedDotForLog(false);
          }
        })
        .catch((err) => {
          console.log('err-->', err);
        });
    }
  }, [isFocused, authContext]);

  const getUsers = useCallback(() => {
    const generalsQuery = {
      size: 100,
      query: {bool: {must: [{bool: {should: []}}]}},
    };

    getUserIndex(generalsQuery)
      .then((response) => {
        setLoading(false);
        if (response.length > 0) {
          const result = response.map((obj) => {
            const newObj = {
              ...obj,
              isChecked: false,
            };
            return newObj;
          });

          const filteredResult = result.filter(
            (e) =>
              e.user_id !== authContext.entity.auth.user.user_id &&
              e.who_can_invite_for_doubles_team !==
                Verbs.DOUBLE_TEAM_INVITE_NONE,
          );

          setPlayers([...filteredResult]);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
        // Alert.alert(error.message);
      });
  }, [authContext]);

  const getAccountMenu = useCallback(
    (teams = [], clubs = [], imgBaseUrl = '') => {
      switch (authContext.entity.role) {
        case Verbs.entityTypeClub:
          return prepareClubMenu(teams);

        case Verbs.entityTypeTeam:
          return prepareTeamMenu(authContext, clubs);

        default:
          return prepareUserMenu(authContext, teams, clubs, imgBaseUrl);
      }
    },
    [authContext],
  );

  useEffect(() => {
    if (route.params?.switchToUser) {
      Alert.alert(
        Platform.OS === 'android'
          ? ''
          : format(strings.adminremoved, route.params?.grpName),
        Platform.OS === 'android'
          ? format(strings.adminremoved, route.params?.grpName)
          : '',
        [
          {
            text: strings.OkText,
            onPress: () => console.log('Pressed'),
          },
        ],
        {cancelable: false},
      );
      setLoading(false);
    }
  }, [route.params?.switchToUser, route.params?.grpName]);

  useEffect(() => {
    if (
      isFocused &&
      route.params?.isSearchPlayerForDoubles &&
      route.params?.sportType === Verbs.doubleSport
    ) {
      getUsers();
      setdoubleSport(route.params?.doubleSport);

      setMemberListModalForDoubles(true);
    }
  }, [route.params, getUsers, isFocused]);

  const getLists = useCallback(() => {
    const list = [];
    if (authContext.entity.role === Verbs.entityTypeClub) {
      list.push(getTeamsOfClub(authContext.entity.uid, authContext));
    } else if (
      authContext.entity.role === Verbs.entityTypePlayer ||
      authContext.entity.role === Verbs.entityTypeUser
    ) {
      list.push(getJoinedGroups(Verbs.entityTypeTeam, authContext));
      list.push(getTeamPendingRequest(authContext));
      list.push(getJoinedGroups(Verbs.entityTypeClub, authContext));
    } else if (authContext.entity.role === Verbs.entityTypeTeam) {
      const parentIds = authContext.entity.obj.parent_groups ?? [];
      if (parentIds.length > 0) {
        const query = {
          size: 1000,
          from: 0,
          query: {
            terms: {
              'group_id.keyword': [...parentIds],
            },
          },
        };
        list.push(getGroupIndex(query));
      }
    }
    setLoading(true);
    Promise.all(list)
      .then(async (response) => {
        let fetchedTeams = [];
        let fetchedClubs = [];
        if (authContext.entity.role === Verbs.entityTypeClub) {
          fetchedTeams = response[0].payload;
        } else if (
          authContext.entity.role === Verbs.entityTypePlayer ||
          authContext.entity.role === Verbs.entityTypeUser
        ) {
          fetchedTeams = [...response[0].payload, ...response[1].payload];
          fetchedClubs = response[2].payload;
        } else if (authContext.entity.role === Verbs.entityTypeTeam) {
          fetchedClubs =
            (authContext.entity.obj.parent_groups ?? []).length > 0
              ? response[0]
              : [];
        }

        const menu = await getAccountMenu(
          fetchedTeams,
          fetchedClubs,
          imageBaseUrl,
        );

        setAccountMenu(menu);

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          console.log(e.message);
          // Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, getAccountMenu, imageBaseUrl]);

  const getNotificationCount = useCallback(() => {
    getUnreadCount(authContext)
      .then((response) => {
        const {teams, clubs, user} = response.payload;
        let count = 0;
        if (authContext.entity.obj.entity_type === Verbs.entityTypeClub) {
          const obj = clubs.find(
            (item) => item.group_id === authContext.entity.uid,
          );
          count = obj ? obj.unread : 0;
        } else if (
          authContext.entity.obj.entity_type === Verbs.entityTypeTeam
        ) {
          const obj = teams.find(
            (item) => item.group_id === authContext.entity.uid,
          );
          count = obj ? obj.unread : 0;
        } else {
          count = user.unread ?? 0;
        }
        authContext.setTotalNotificationCount(
          response.payload.totalUnread ?? 0,
        );
        setUnreadNotificationCount(count);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          console.log(e.message);
          // Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  useEffect(() => {
    if (isFocused && authContext.tokenData) {
      getUsers();
      getLists();
      getNotificationCount();
      setShowOnlyTeamSport(false);
    }
  }, [
    authContext,
    getNotificationCount,
    isFocused,
    getUsers,
    getLists,
    route.params.switchToUser,
  ]);

  useEffect(() => {
    if (isFocused) {
      getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });
    }
  }, [isFocused]);

  const handleLogout = async () => {
    setOnLoad(true);
    await onLogout(authContext);
    GoogleSignin.signOut();
    setOnLoad(false);
  };

  const handleSectionMemberClick = (rowObj) => {
    const option = rowObj.option;

    switch (option) {
      case strings.createTeamText:
        if (authContext.entity.role !== Verbs.entityTypeUser) {
          setIsRulesModalVisible(true);

          setNavigationOptions({
            screenName: rowObj?.navigateTo?.screenName,
            data: rowObj?.navigateTo?.data,
          });
        } else {
          setVisibleSportsModalForTeam(true);
          setNavigationOptions({
            screenName: rowObj?.navigateTo?.screenName,
            data: rowObj?.navigateTo?.data,
          });

          setSelectedMenuOptionType(Verbs.entityTypeTeam);
        }

        break;

      case strings.createClubText:
        setVisibleSportsModalForClub(true);
        setSelectedMenuOptionType(Verbs.entityTypeClub);
        setNavigationOptions({
          screenName: rowObj.navigateTo.screenName,
          data: rowObj.navigateTo.data,
        });

        break;

      case strings.addSportsTitle:
        setNavigationOptions({
          screenName: rowObj.navigateTo.screenName,
          data: rowObj.navigateTo.data,
        });
        setSelectedMenuOptionType(rowObj.menuOptionType);
        setVisibleSportsModal(true);

        break;
      // case strings.addScoreKeeperTitle:
      //   setNavigationOptions({
      //     screenName: rowObj.navigateTo.screenName,
      //     data: rowObj.navigateTo.data,
      //   });
      //   setSelectedMenuOptionType(rowObj.menuOptionType);
      //   setVisibleSportsModal(true);

      //   break;

      // case strings.addRefreeTitle:
      //   setNavigationOptions({
      //     screenName: rowObj.navigateTo.screenName,
      //     data: rowObj.navigateTo.data,
      //   });
      //   setSelectedMenuOptionType(rowObj.menuOptionType);
      //   setVisibleSportsModal(true);

      //   break;
      case strings.sendnewinvoice:
        SetSendNewInvoice(true);
        break;

      default:
        if (authContext.entity.role === Verbs.entityTypeUser && rowObj.sport) {
          navigation.navigate('HomeStack', {
            screen: 'SportActivityHome',
            params: {
              sport: rowObj.sport.sport,
              sportType: rowObj.sport.sport_type ?? Verbs.sportTypeSingle,
              uid: authContext.entity.obj.user_id,
              selectedTab: strings.infoTitle,
              entityType: rowObj.sport.type,
              parentStack: 'App',
              backScreen: 'Account',
            },
          });
        } else if (rowObj.navigateTo?.screenName) {
          navigation.navigate(
            rowObj.navigateTo.screenName,
            rowObj.navigateTo.data,
          );
        }
        break;
    }
  };

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );

    setSportsData([...sportArr]);
    const OnlyTeamSport = sportArr.filter(
      (item) => item.sport === item.sport_type,
    );

    setOnlyTeamSport(OnlyTeamSport);
  }, [
    authContext,
    selectedMenuOptionType,
    showOnlyTeamSport,
    visibleSportsModalForClub,
  ]);

  const actionOnTeamRequest = (type, requestID) => {
    setLoading(true);
    actionOnGroupRequest(type, requestID, authContext)
      .then((response) => {
        setLoading(false);

        // check type
        if (type === Verbs.cancelVerb) {
          Alert.alert(strings.teamRequestCancelledText);
        } else if (type === Verbs.acceptVerb) {
          // setMemberListModal(false);
          navigation.push('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: response.payload.group_id,
              role: response.payload.entity_type,
              backButtonVisible: false,
              menuBtnVisible: false,
              isEntityCreated: true,
              groupName: response.payload.group_name,
              entityObj: response.payload,
              comeFrom: 'App',
              routeParams: {
                screen: 'Account',
              },
            },
          });
        } else if (type === Verbs.declineVerb) {
          Alert.alert(
            strings.requestWasDeclined,
            '',
            [
              {
                text: strings.OkText,
                onPress: () => navigation.goBack(),
              },
            ],
            {cancelable: false},
          );
        }

        // }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          console.log(e.message);
          // Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  // Valdate Dobule Team Functions

  const seLoaderHandler = (val) => {
    setLoading(val);
  };
  const handleMemberModal = (val) => {
    setMemberListModalForDoubles(val);
  };

  const onWithdrawRequest = (rowItem) => {
    Alert.alert(
      strings.areYouSureTouWantToWithdrawRequest,
      '',
      [
        {
          text: strings.cancel,
          onPress: () => console.log('PRessed'),
        },
        {
          text: strings.withDrawRequest,
          onPress: () =>
            actionOnTeamRequest(Verbs.cancelVerb, rowItem?.option?.request_id),
        },
      ],

      {cancelable: true},
    );
  };

  const onCancelRequest = (rowItem) => {
    Alert.alert(
      Platform.OS === 'android' ? '' : strings.teamWillbeCreatedAcceptRequest,
      Platform.OS === 'android' ? strings.teamWillbeCreatedAcceptRequest : '',
      [
        {
          text: strings.resendRequest,
          onPress: () =>
            onResendRequest(
              rowItem.option.player1,
              rowItem.option.player2,
              rowItem.option.sport,
              rowItem.option.sport_type,
              rowItem.option.request_id,
              seLoaderHandler,
              handleMemberModal,
              authContext,
            ),
        },
        {
          text: strings.withDrawRequest,
          onPress: () => onWithdrawRequest(rowItem),
        },
        {
          text: strings.cancel,
          onPress: () => console.log('PRessed'),
          style: 'destructive',
        },
      ],

      {cancelable: true},
    );
  };

  const handleSettings = () => {
    switch (authContext.entity.role) {
      case Verbs.entityTypePlayer:
      case Verbs.entityTypeUser:
        navigation.navigate('AccountStack', {
          screen: 'UserSettingPrivacyScreen',
        });
        break;

      case Verbs.entityTypeTeam:
      case Verbs.entityTypeClub:
        navigation.navigate('AccountStack', {
          screen: 'GroupSettingPrivacyScreen',
        });
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <AccountHeader
        notificationCount={unreadNotificationCount}
        onPressNotification={() =>
          navigation.navigate('NotificationNavigator', {
            screen: 'NotificationsListScreen',
            params: {
              parentStack: 'Account',
              screen: 'AccountScreen',
            },
          })
        }
        onPressSettings={handleSettings}
      />
      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      <ActivityLoader visible={onLoad} />

      {accountMenu.length === 0 ? (
        <AccountShimmer />
      ) : (
        <>
          <AccountEntity
            entity={authContext.entity.obj}
            onSwitchAccount={() => setShowSwitchAccountModal(true)}
            onPress={() => {
              navigation.navigate('HomeStack', {
                screen: 'HomeScreen',
                params: {
                  uid: authContext.entity.uid,
                  role: authContext.entity.role,
                  backButtonVisible: true,
                  menuBtnVisible: false,
                  comeFrom: 'App',
                  routeParams: {
                    screen: 'Account',
                  },
                },
              });
            }}
          />

          <AccountMenuList
            menuList={accountMenu}
            isAccountDeactivated={authContext.isAccountDeactivated}
            onPressSetting={(rowItem) => {
              switch (rowItem.option) {
                case strings.createTeamText:
                case strings.createClubText:
                case strings.addSportsTitle:
                  // case strings.sendnewinvoice:
                  handleSectionMemberClick(rowItem);
                  break;

                default:
                  navigation.navigate(
                    rowItem.navigateTo.screenName,
                    rowItem.navigateTo.data,
                  );
                  break;
              }
            }}
            onPressSport={(rowItem) => {
              if (
                rowItem.key === strings.clubstitle &&
                rowItem.member.length === 0
              ) {
                return;
              }
              handleSectionMemberClick(rowItem);
            }}
            onPressCancelRequest={(rowItem) => {
              onCancelRequest(rowItem);
            }}
            onLogout={handleLogout}
            showLogBadge={showRedDotForLog}
          />
        </>
      )}

      <SwitchAccountModal
        isVisible={showSwitchAccountModal}
        closeModal={() => setShowSwitchAccountModal(false)}
        onCreate={(option) => {
          setShowSwitchAccountModal(false);

          if (option === strings.team) {
            setNavigationOptions({
              screenName: 'CreateTeamForm1',
            });

            setTimeout(() => setVisibleSportsModalForTeam(true), 500);
            setSelectedMenuOptionType(Verbs.entityTypeTeam);
          } else if (option === strings.club) {
            setNavigationOptions({
              screenName: 'CreateClubForm1',
            });
            setTimeout(() => setVisibleSportsModalForClub(true), 500);
          } else {
            console.log({option});
          }
        }}
      />

      <CustomModalWrapper
        isVisible={isRulesModalVisible}
        closeModal={() => setIsRulesModalVisible(false)}
        modalType={ModalTypes.style2}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([
              '50%',
              contentHeight,
              Dimensions.get('window').height - 40,
            ]);
          }}>
          <Text style={styles.modalTitle}>{strings.createTeamText}</Text>
          <Text style={[styles.rulesText, {marginBottom: 15}]}>
            {strings.teamCreateClubsText}
          </Text>
          <View style={styles.rulesTitleContainer}>
            <View style={styles.rulesDots} />
            <Text style={styles.rulesText}>
              {strings.yourTeamWillBelogText}
            </Text>
          </View>
          <View style={styles.rulesTitleContainer}>
            <View style={styles.rulesDots} />
            <Text style={styles.rulesText}>{strings.teamCanLeaveClubText}</Text>
          </View>

          <View style={styles.rulesTitleContainer}>
            <View
              style={[
                styles.rulesDots,
                {marginTop: 10, alignSelf: 'flex-start'},
              ]}
            />
            <Text style={styles.rulesText}>
              {strings.adminOfTeamWillClubAdminText}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setIsRulesModalVisible(false);
              setShowOnlyTeamSport(true);
              setTimeout(() => setVisibleSportsModalForTeam(true), 1000);
            }}
            style={{
              height: 40,
              borderRadius: 22,
              backgroundColor: colors.reservationAmountColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 35,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RBold,
                lineHeight: 24,
                color: colors.whiteColor,
              }}>
              {strings.nextTitle}
            </Text>
          </Pressable>
        </View>
      </CustomModalWrapper>

      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={getTitleForRegister(selectedMenuOptionType)}
        sportsList={sportsData}
        onNext={(sport) => {
          setVisibleSportsModal(false);
          navigation.navigate(navigationOptions.screenName, {
            screen: navigationOptions.data.screen,
            params: sport,
          });
        }}
      />

      <SportsListModal
        isVisible={visibleSportsModalForTeam}
        playerList={players}
        closeList={() => setVisibleSportsModalForTeam(false)}
        title={strings.createTeamText}
        sportsList={showOnlyTeamSport ? onlyteamSport : sportsData}
        forTeam={true}
        authContext={authContext}
      />

      <MemberListModal
        isVisible={memberListModalForDoubles}
        title={strings.createTeamText}
        closeList={() => {
          setMemberListModalForDoubles(false);
        }}
        doubleSport={doubleSport}
        sportsList={players}
        loading={loading}
      />

      {/* sport, group */}
      <SportListMultiModal
        isVisible={visibleSportsModalForClub}
        closeList={() => setVisibleSportsModalForClub(false)}
        title={strings.createClubText}
        onNext={(sports) => {
          setVisibleSportsModalForClub(false);

          navigation.navigate(navigationOptions.screenName, {
            screen: navigationOptions.data.screen,
            params: sports,
          });
        }}
      />
      <SendNewInvoiceModal
        isVisible={sendNewInvoice}
        onClose={() => SetSendNewInvoice(false)}
      />
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    textAlign: 'center',
    marginBottom: 15,
  },

  rulesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rulesDots: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: colors.blackColor,
    marginRight: 5,
    alignSelf: 'center',
    marginTop: 2,
  },
  rulesText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
