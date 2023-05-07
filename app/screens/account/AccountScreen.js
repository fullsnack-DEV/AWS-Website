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
import {getStorage, onLogout, setAuthContextData} from '../../utils';
import {userActivate} from '../../api/Users';
import SwitchAccountModal from '../../components/account/SwitchAccountModal';
import AccountMenuList from './components/AccountMenuList';
import {
  getJoinedGroups,
  getTeamsOfClub,
  actionOnGroupRequest,
  getTeamPendingRequest,
  groupUnpaused,
  groupValidate,
  joinTeam,
  getGroupDetails,
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
import SportsListModal from './registerPlayer/modals/SportsListModal';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import SendNewInvoiceModal from './Invoice/SendNewInvoiceModal';
import MemberListModal from '../../components/MemberListModal/MemberListModal';
import {getUserIndex} from '../../api/elasticSearch';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import AccountShimmer from '../../components/shimmer/account/AccountShimmer';
import {getUnreadCount} from '../../api/Notificaitons';
import ActivityLoader from '../../components/loader/ActivityLoader';

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
  const [doubleSport, setDoubleSport] = useState();
  const [memberListModal, setMemberListModal] = useState(false);
  const [doubleExist, setDoubleExist] = useState(true);
  const [Visiblealert, setVisibleAlert] = useState(false);
  const [CustomeAlertTitle, setCustomeAlertTitle] = useState();
  const [grpIdforTermination, setGrpIdForTermination] = useState();
  const [players, setPlayers] = useState([]);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    if (
      isFocused &&
      (authContext.entity.obj?.is_pause === true ||
        authContext.entity.obj?.is_deactivate === true)
    ) {
      setIsAccountDeactivated(true);
    }
  }, [isFocused, authContext]);

  const getUsers = useCallback(() => {
    const generalsQuery = {
      size: 100,
      query: {bool: {must: [{bool: {should: []}}]}},
    };

    if (authContext.entity.auth.user?.city) {
      generalsQuery.query.bool.must[0].bool.should.push({
        match: {
          city: {query: authContext.entity.auth.user.city, boost: 4},
        },
      });
    }

    if (authContext.entity.auth.user?.state) {
      generalsQuery.query.bool.must[0].bool.should.push({
        match: {
          state: {
            query: authContext.entity.auth.user.state,
            boost: 3,
          },
        },
      });
    }

    if (authContext.entity.auth.user?.state_abbr) {
      generalsQuery.query.bool.must[0].bool.should.push({
        match: {
          state_abbr: {
            query: authContext.entity.auth.user.state_abbr,
            boost: 3,
          },
        },
      });
    }

    if (authContext.entity.auth.user?.country) {
      generalsQuery.query.bool.must[0].bool.should.push({
        match: {
          country: {
            query: authContext.entity.auth.user?.country,
            boost: 2,
          },
        },
      });
    }

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
            (e) => e.user_id !== authContext.entity.auth.user.user_id,
          );

          setPlayers([...filteredResult]);
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(error.message);
      });
  }, [authContext]);

  const getAccountMenu = useCallback(
    (teams = [], clubs = [], imgBaseUrl = '') => {
      switch (authContext.entity.role) {
        case Verbs.entityTypeClub:
          return prepareClubMenu(authContext, teams);

        case Verbs.entityTypeTeam:
          return prepareTeamMenu(authContext, clubs);

        default:
          return prepareUserMenu(authContext, teams, clubs, imgBaseUrl);
      }
    },
    [authContext],
  );

  useEffect(() => {
    if (
      isFocused &&
      route.params?.isSearchPlayerForDoubles &&
      route.params?.sportType === Verbs.doubleSport
    ) {
      getUsers();
      setMemberListModal(true);
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
      list.push(getJoinedGroups(Verbs.entityTypeClub, authContext));
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
          fetchedClubs = response[0].payload;
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
          Alert.alert(strings.alertmessagetitle, e.message);
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
          count = obj.unread ?? 0;
        } else if (
          authContext.entity.obj.entity_type === Verbs.entityTypeTeam
        ) {
          const obj = teams.find(
            (item) => item.group_id === authContext.entity.uid,
          );
          count = obj.unread ?? 0;
        } else {
          count = user.unread ?? 0;
        }
        authContext.setTotalNotificationCount(
          response.payload.totalUnread ?? 0,
        );
        setUnreadNotificationCount(count);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
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
  }, [authContext, getNotificationCount, isFocused, getUsers, getLists]);

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
        // setCreateEntity(Verbs.entityTypeClub);
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

      case strings.sendnewinvoice:
        SetSendNewInvoice(true);
        break;

      default:
        if (authContext.entity.role === Verbs.entityTypeUser && rowObj.sport) {
          navigation.navigate('SportActivityHome', {
            sport: rowObj.sport.sport,
            sportType: rowObj.sport.sport_type ?? '',
            uid: authContext.entity.obj.user_id,
            selectedTab: strings.infoTitle,
            entityType: rowObj.sport.type,
            backScreen: 'AccountScreen',
          });
        } else {
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

  const onResendRequest = (player1, player2, sport, sport_type, request_id) => {
    const obj = {
      player1,
      player2,
      sport,
      sport_type,
      entity_type: Verbs.entityTypeTeam,
      request_id,
    };
    setLoading(true);

    groupValidate(obj, authContext)
      .then(() => {
        setLoading(false);

        Alert.alert(
          Platform.OS === 'android' ? '' : strings.requestSent,
          Platform.OS === 'android' ? strings.requestSent : '',

          [
            {
              text: strings.OkText,
              onPress: () => setMemberListModal(false),
            },
          ],
          {cancelable: false},
        );
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onJoinTeamPress = (grp_id) => {
    setLoading(true);
    const params = {};

    joinTeam(params, grp_id, authContext)
      .then(() => {
        setLoading(false);

        setMemberListModal(false);
        getGroupDetails(grp_id, authContext)
          .then((response) => {
            setLoading(false);

            navigation.push('HomeScreen', {
              uid: response.payload.group_id,
              role: response.payload.entity_type,
              backButtonVisible: false,
              menuBtnVisible: false,
              isEntityCreated: true,

              groupName: response.payload.group_name,
              entityObj: response.payload,
              userJoinTeam: true,
            });
          })
          .catch((e) => {
            setLoading(false);
            Alert.alert(
              e.message,
              '',
              [
                {
                  text: strings.OkText,
                  onPress: () => console.log('PRessed'),
                },
              ],
              {cancelable: false},
            );
          });
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert(
          e.message,
          '',
          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );
      });
  };

  const onCancelTermination = (context, group_id) => {
    const caller_id = group_id;
    const caller = Verbs.entityTypeTeam;

    const headers = [caller_id, caller];

    groupUnpaused(context, headers)
      .then(() => {})
      .catch((e) => {
        Alert.alert(
          e.message,
          '',
          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );
      });
  };

  const actionOnTeamRequest = (type, requestID) => {
    setLoading(true);
    actionOnGroupRequest(type, requestID, authContext)
      .then((response) => {
        setLoading(false);

        // check type
        if (type === Verbs.cancelVerb) {
          // getTeamsList();
          Alert.alert(strings.teamRequestCancelledText);
        } else if (type === Verbs.acceptVerb) {
          setMemberListModal(false);
          navigation.push('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: false,
            menuBtnVisible: false,
            isEntityCreated: true,
            groupName: response.payload.group_name,
            entityObj: response.payload,
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
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const validateIfDoubleExist = (p1, p2, _sport) => {
    const obj = {
      player1: p1,
      player2: p2.user_id,
      sport: _sport.sport,
      sport_type: _sport.sport_type,
      entity_type: Verbs.entityTypeTeam,
    };

    setLoading(true);
    groupValidate(obj, authContext)
      .then((response) => {
        if (typeof response.payload === 'boolean' && response.payload) {
          setDoubleExist(false);
          setLoading(false);
        } else if (
          response.payload.error_code === Verbs.REQUESTALREADYEXIST &&
          'action' in response.payload
        ) {
          setLoading(false);

          const {player1, player2, sport, sport_type, request_id} =
            response.payload.data;

          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',

            [
              {
                text: strings.resendRequest,
                onPress: () => {
                  onResendRequest(
                    player1,
                    player2,
                    sport,
                    sport_type,
                    request_id,
                  );
                },
              },
              {
                text: strings.goBack,
                onPress: () => console.log('Pressed'),
              },
            ],
            {cancelable: false},
          );
        } else if (response.payload.error_code === Verbs.REQUESTALREADYEXIST) {
          setLoading(false);

          // show custom Alert
          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',
            [
              {
                text: strings.respondToRequest,
                onPress: () => {
                  setMemberListModal(false);
                  const teamObject = response.payload.data;

                  delete teamObject.player1;
                  delete teamObject.player2;

                  teamObject.player1 = {
                    full_name: p2.full_name,

                    thumbnail: p2.thumbnail,
                  };

                  teamObject.player2 = {
                    full_name: authContext.entity.obj.full_name,
                    thumbnail: authContext.entity.obj.thumbnail,
                  };
                  teamObject.group_id = response.payload.data.request_id;

                  navigation.navigate('RespondToInviteScreen', {
                    teamObject,
                  });
                },
              },

              {
                text: strings.cancel,
                onPress: () => console.log('PRessed'),
              },
            ],
            {cancelable: false},
          );
        } else if (response.payload.error_code === Verbs.GROUPTERMINATION) {
          setLoading(false);
          setCustomeAlertTitle(response.payload.user_message);

          setGrpIdForTermination(response.payload.data.group_id);
          setVisibleAlert(true);
        } else if (
          response.payload?.data.player_leaved === true &&
          response.payload.error_code === 102
        ) {
          setLoading(false);
          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',
            [
              {
                text: strings.cancel,
                onPress: () => console.log('PRessed'),
                style: 'destructive',
              },
              {
                text: strings.rejoin,
                onPress: () => onJoinTeamPress(response.payload?.data.group_id),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((e) => {
        Alert.alert(
          Platform.OS === 'android' ? '' : e.message,
          Platform.OS === 'android' ? e.message : '',

          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );

        setLoading(false);
      });
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

  const getDeactivationType = () => {
    if (authContext.entity.obj?.is_pause === true) {
      return Verbs.pauseVerb;
    }
    if (authContext.entity.obj?.under_terminate === true) {
      return Verbs.terminate;
    }
    return Verbs.deactivateVerb;
  };

  const reActivateUser = () => {
    setLoading(true);
    userActivate(authContext)
      .then(async (response) => {
        setIsAccountDeactivated(false);
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const unPauseGroup = () => {
    setLoading(true);
    groupUnpaused(authContext)
      .then(async (response) => {
        setIsAccountDeactivated(false);
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const handleAccountActivation = () => {
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
              ? 'Unpause'
              : 'Reactivate',
          style: 'destructive',
          onPress: () => {
            if (authContext.entity.obj?.is_pause === true) {
              unPauseGroup();
            } else {
              reActivateUser();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  //
  return (
    <SafeAreaView style={{flex: 1}}>
      <AccountHeader
        notificationCount={unreadNotificationCount}
        onPressNotification={() =>
          navigation.navigate('NotificationsListScreen')
        }
      />
      <ActivityLoader visible={onLoad} />
      {loading && accountMenu.length === 0 ? (
        <AccountShimmer />
      ) : (
        <>
          <AccountEntity
            entity={authContext.entity.obj}
            onSwitchAccount={() => setShowSwitchAccountModal(true)}
            onPress={() => {
              navigation.navigate('HomeScreen', {
                uid: authContext.entity.uid,
                role: authContext.entity.role,
                backButtonVisible: true,
                menuBtnVisible: false,
              });
            }}
          />
          {isAccountDeactivated && (
            <TCAccountDeactivate
              type={getDeactivationType()}
              onPress={handleAccountActivation}
            />
          )}

          <AccountMenuList
            menuList={accountMenu}
            isAccountDeactivated={isAccountDeactivated}
            onPressSetting={(rowItem) => {
              navigation.navigate(
                rowItem.navigateTo.screenName,
                rowItem.navigateTo.data,
              );
            }}
            onPressSport={(rowItem) => {
              handleSectionMemberClick(rowItem);
            }}
            onPressCancelRequest={(rowItem) => {
              onCancelRequest(rowItem);
            }}
            onLogout={handleLogout}
          />
        </>
      )}

      <SwitchAccountModal
        isVisible={showSwitchAccountModal}
        closeModal={() => setShowSwitchAccountModal(false)}
        onCreate={(option) => {
          console.log({option});
        }}
      />

      <CustomModalWrapper
        isVisible={isRulesModalVisible}
        closeModal={() => setIsRulesModalVisible(false)}
        modalType={ModalTypes.style2}
        containerStyle={{
          padding: 0,
        }}>
        <View style={styles.modalViewContainer}>
          <View
            style={{
              width: 40,
              height: 5,
              alignSelf: 'center',
              borderRadius: 5,
              backgroundColor: colors.graySeparater,
              marginTop: 10,
            }}
          />
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{strings.createTeamText}</Text>
          </View>
          <View
            style={{
              marginLeft: 20,
              marginTop: 25,
              marginBottom: 15,
            }}>
            <Text style={styles.rulesText}>{strings.teamCreateClubsText}</Text>
          </View>

          <View
            style={{
              marginLeft: 25,

              marginRight: 27,
            }}>
            <View style={styles.rulesTitleContainer}>
              <View style={styles.rulesDots} />
              <Text style={styles.rulesText}>
                {strings.yourTeamWillBelogText}
              </Text>
            </View>
            <View style={styles.rulesTitleContainer}>
              <View style={styles.rulesDots} />
              <Text style={styles.rulesText}>
                {strings.teamCanLeaveClubText}
              </Text>
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
          </View>
          <Pressable
            onPress={() => {
              setIsRulesModalVisible(false);
              setShowOnlyTeamSport(true);
              setTimeout(() => setVisibleSportsModalForTeam(true), 1000);
            }}
            style={{
              width: 345,
              height: 40,
              borderRadius: 22,
              backgroundColor: colors.reservationAmountColor,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
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
          navigation.navigate(navigationOptions.screenName, sport);
        }}
      />

      <SportsListModal
        isVisible={visibleSportsModalForTeam}
        closeList={() => setVisibleSportsModalForTeam(false)}
        title={strings.createTeamText}
        sportsList={showOnlyTeamSport ? onlyteamSport : sportsData}
        onNext={(sport) => {
          if (
            sport.sport_type === Verbs.doubleSport &&
            authContext?.entity?.role ===
              (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ) {
            setVisibleSportsModalForTeam(false);
            setDoubleSport(sport);

            setTimeout(() => {
              setMemberListModal(true);
            }, 10);
          } else if (authContext.entity.role !== Verbs.entityTypeUser) {
            setVisibleSportsModalForTeam(false);
            // also have to pass the club id to it
            const obj = {...sport};
            obj.grp_id = authContext.entity.obj.group_id;

            navigation.navigate('CreateTeamForm1', sport);
          } else {
            setVisibleSportsModalForTeam(false);
            navigation.navigate(navigationOptions.screenName, sport);
          }
        }}
      />

      {/* sport, group */}
      <SportListMultiModal
        isVisible={visibleSportsModalForClub}
        closeList={() => setVisibleSportsModalForClub(false)}
        title={strings.createClubText}
        sportsList={sportsData}
        onNext={(sports) => {
          setVisibleSportsModalForClub(false);
          navigation.navigate(navigationOptions.screenName, sports);
        }}
      />

      <MemberListModal
        isVisible={memberListModal}
        title={strings.createTeamText}
        loading={loading}
        closeList={() => setMemberListModal(false)}
        onNext={(doublePlayer) => {
          if (!doubleExist) {
            setMemberListModal(false);
            navigation.navigate(navigationOptions.screenName, {
              sports: doubleSport,
              double_Player: doublePlayer,
              showDouble: true,
            });
          }
        }}
        onGoBack={() => setVisibleAlert(false)}
        titleAlert={CustomeAlertTitle}
        visibleAlert={Visiblealert}
        onCancetTerminationPress={() =>
          onCancelTermination(authContext, grpIdforTermination)
        }
        onItemPress={(item) => {
          validateIfDoubleExist(
            authContext.entity.auth.user.user_id,
            item,
            doubleSport,
          );
        }}
        sportsList={players}
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
  modalViewContainer: {
    height: Dimensions.get('window').height / 2.4,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  modalView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginTop: 25,
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
  },
});
