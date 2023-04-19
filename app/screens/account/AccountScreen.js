/* eslint-disable */
/* eslint-disable no-nested-ternary */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import firebase from '@react-native-firebase/app';
import ExpanableList from 'react-native-expandable-section-flatlist';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {format} from 'react-string-format';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';

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

import {getUnreadCount} from '../../api/Notificaitons';

import * as Utility from '../../utils/index';

import images from '../../Constants/ImagePath';
import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
  getQBAccountType,
  QBupdateUser,
} from '../../utils/QuickBlox';

import Header from '../../components/Home/Header';

import {
  prepareUserMenu,
  prepareTeamMenu,
  prepareClubMenu,
} from './prepareMenuData';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {removeFBToken, userActivate} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import TCSwitchProfileRow from './connections/TCSwitchProfileRow';
import AccountMenuRow from './connections/AccountMenuRow';
import SportsListModal from './registerPlayer/modals/SportsListModal';
import {NavigationActions} from 'react-navigation';
import {
  getExcludedSportsList,
  getTitleForRegister,
} from '../../utils/sportsActivityUtils';
import MemberListModal from '../../components/MemberListModal/MemberListModal';
import {getUserIndex} from '../../api/elasticSearch';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import SendNewInvoiceModal from './Invoice/SendNewInvoiceModal';
import TCKeyboardView from '../../components/TCKeyboardView';

// FIXME: fix all warning in useCallBack()
export default function AccountScreen({navigation, route}) {
  const scrollRef = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [group, setGroup] = useState({});
  // managedEntities are list of all accounts user control. Teams, clubs and user itself
  const [managedEntities, setManagedEntityList] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleSportsModalForTeam, setVisibleSportsModalForTeam] =
    useState(false);
  const [visibleSportsModalForClub, setVisibleSportsModalForClub] =
    useState(false);
  const [teamList, setTeamList] = useState([]);
  const [clubList, setClubList] = useState([]);
  const [accountMenu, setAccountMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [createEntity, setCreateEntity] = useState('');
  const [sports, setSports] = useState([]);
  const [sportsData, setSportsData] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [selectedMenuOptionType, setSelectedMenuOptionType] = useState(
    Verbs.entityTypePlayer,
  );
  const [doubleSport, setDoubleSport] = useState();
  const [memberListModal, setMemberListModal] = useState(false);
  const [sendNewInvoice, SetSendNewInvoice] = useState(false);
  const navigations = useNavigation();
  const [players, setPlayers] = useState([]);
  const [pageFrom, setPageFrom] = useState(0);
  const [pageSize] = useState(200);
  const [doubleExist, setDoubleExist] = useState(true);
  const [Visiblealert, setVisibleAlert] = useState(false);
  const [CustomeAlertTitle, setCustomeAlertTitle] = useState();
  const [grpIdforTermination, setGrpIdForTermination] = useState();
  const [onlyteamSport, setOnlyTeamSport] = useState();
  const [showOnlyTeamSport, setShowOnlyTeamSport] = useState(false);

  useEffect(() => {
    if (route.params?.switchToUser === 'fromMember') {
      const entityTobeUpdated = switchProfile(route.params?.authFromMember);

      authContext.setEntity({...entityTobeUpdated});

      navigations.setParams({
        switchToUser: '',
      });

      const SetParamsoptions = NavigationActions.setParams({
        params: {
          switchToUser: '',
          key: 'AccountScreen',
        },
      });
      Alert.alert(
        Platform.OS === 'android'
          ? ''
          : format(strings.adminremoved, route.params?.grpname?.obj.group_name),
        Platform.OS === 'android'
          ? format(strings.adminremoved, route.params?.grpname?.obj.group_name)
          : '',

        [
          {
            text: 'OK',
            onPress: () => navigations.dispatch(SetParamsoptions),
          },
        ],
        {cancelable: false},
      );
    }
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      setShowOnlyTeamSport(false);
      Utility.getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);

    //sorting the list alphabetically
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );

    setSportsData([...sportArr]);

    let OnlyTeamSport = sportsData.filter(
      (item) => item.sport === item.sport_type,
    );

    setOnlyTeamSport(OnlyTeamSport);

    // get only team sport
  }, [
    authContext,
    selectedMenuOptionType,
    showOnlyTeamSport,
    visibleSportsModalForClub,
  ]);

  const [navigationOptions, setNavigationOptions] = useState({});

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

  const renderTopRightNotificationButton = useCallback(
    () => (
      <View
        style={{opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <TouchableOpacity
          testID="notification-bell-button"
          onPress={() => {
            navigation.navigate('NotificationsListScreen');
          }}
          hitSlop={Utility.getHitSlop(15)}>
          <ImageBackground
            source={
              unreadNotificationCount > 0
                ? images.notificationBell
                : images.tab_notification
            }
            style={styles.headerRightImg}>
            {unreadNotificationCount > 0 && (
              <View
                style={
                  unreadNotificationCount > 9
                    ? styles.eclipseBadge
                    : styles.roundBadge
                }>
                <Text style={styles.notificationCounterStyle}>
                  {unreadNotificationCount > 9
                    ? strings.ninePlus
                    : unreadNotificationCount}
                </Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    ),
    [isAccountDeactivated, navigation, unreadNotificationCount, pointEvent],
  );

  useEffect(() => {
    const entity = authContext.entity;
    const promises = [getUnreadNotificationCount(entity), getTeamsList(entity)];
    if (entity.role !== Verbs.entityTypeClub) {
      promises.push(getClubList(entity));
    }
    Promise.all(promises)
      .then(() => {
        getAccountMenu();
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, isFocused, imageBaseUrl]);

  const getAccountMenu = useCallback(() => {
    let menu = [];
    if (authContext.entity.role === Verbs.entityTypeClub) {
      menu = prepareClubMenu(authContext, teamList, clubList);
    } else if (authContext.entity.role === Verbs.entityTypeTeam) {
      menu = prepareTeamMenu(authContext, teamList, clubList);
    } else {
      menu = prepareUserMenu(authContext, teamList, clubList, imageBaseUrl);
    }
    setAccountMenu(menu);
  }, [teamList, clubList, imageBaseUrl, authContext]);

  const getUnreadNotificationCount = useCallback(() => {
    getUnreadCount(authContext)
      .then((response) => {
        const {teams, clubs, user} = response.payload;
        // This API return list of all clubs and teams managed by logged-in user.
        const allAccounts = [{...user}, ...clubs, ...teams];
        const switchEntityObject = allAccounts.filter(
          (e) =>
            e.group_id === authContext.entity.uid ||
            e.user_id === authContext.entity.uid,
        );
        setUnreadNotificationCount(switchEntityObject?.[0]?.unread);

        setManagedEntityList(
          allAccounts.filter(
            (item) =>
              item.group_id !== authContext.entity.uid &&
              item.user_id !== authContext.entity.uid,
          ),
        );
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  const getTeamsList = useCallback(
    (currentEntity) => {
      if (currentEntity.role === Verbs.entityTypeClub) {
        getTeamsOfClub(authContext.entity.uid, authContext)
          .then((response) => {
            setTeamList(response.payload);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        const promises = [
          getJoinedGroups(Verbs.entityTypeTeam, authContext),
          getTeamPendingRequest(authContext),
        ];
        Promise.all(promises).then(([res1, res2]) => {
          setTeamList([...res1.payload, ...res2.payload]);
        });
      }
      setLoading(false);
    },
    [authContext],
  );

  const getClubList = useCallback(() => {
    getJoinedGroups(Verbs.entityTypeClub, authContext)
      .then((response) => {
        setClubList(response.payload);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, clubList]);

  const actionOnTeamRequest = (type, requestID, authContext) => {
    setLoading(true);

    actionOnGroupRequest(type, requestID, authContext)
      .then((response) => {
        setLoading(false);

        // check type

        if (type === Verbs.cancelVerb) {
          getTeamsList(authContext.entity);
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

  const switchProfile = useCallback(
    (switchTo) => {
      let currentEntity = authContext.entity;

      delete currentEntity?.QB;
      if (
        switchTo?.entity_type === Verbs.entityTypePlayer ||
        switchTo?.entity_type === Verbs.entityTypeUser
      ) {
        currentEntity = {
          ...currentEntity,
          uid: switchTo?.user_id,
          role: Verbs.entityTypeUser,
          obj: switchTo,
        };
      } else if (switchTo?.entity_type === Verbs.entityTypeTeam) {
        currentEntity = {
          ...currentEntity,
          uid: switchTo?.group_id,
          role: Verbs.entityTypeTeam,
          obj: switchTo,
        };
      } else if (switchTo?.entity_type === Verbs.entityTypeClub) {
        currentEntity = {
          ...currentEntity,
          uid: switchTo?.group_id,
          role: Verbs.entityTypeClub,
          obj: switchTo,
        };
        // setGroup(switchTo);
      }
      return currentEntity;
    },
    [authContext],
  );

  const onSwitchProfile = useCallback(({item}) => {
    const currentEntity = switchProfile(item);

    scrollRef.current.scrollTo({x: 0, y: 0});

    authContext.setEntity({...currentEntity});
    Utility.setStorage('authContextEntity', {...currentEntity});
  }, []);

  const onLogout = useCallback(async () => {
    QBLogout();
    await removeFBToken(authContext);
    await firebase.auth().signOut();
    await Utility.clearStorage();
    await authContext.setUser(null);
    await authContext.setEntity(null);
  }, [authContext]);

  const handleLogOut = useCallback(async () => {
    Alert.alert(
      strings.appName,
      strings.logoutText,
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.okTitleText,
          onPress: onLogout,
        },
      ],
      {cancelable: false},
    );
  }, [onLogout]);

  const handleSectionClick = async (rowObj) => {
    navigation.navigate(rowObj.navigateTo.screenName, rowObj.navigateTo.data);
    if (rowObj.option === 'Log out') {
      handleLogOut();
    }
  };

  const handleSectionMemberClick = useCallback(
    (rowObj) => {
      const option = rowObj.option;

      switch (option) {
        case strings.createTeamText:
          if (authContext.entity.role !== Verbs.entityTypeUser) {
            setCreateEntity(Verbs.entityTypeTeam);
            setIsRulesModalVisible(true);

            setNavigationOptions({
              screenName: rowObj?.navigateTo?.screenName,
              data: rowObj?.navigateTo?.data,
            });
          } else {
            setCreateEntity(Verbs.entityTypeTeam);
            setVisibleSportsModalForTeam(true);
            setNavigationOptions({
              screenName: rowObj?.navigateTo?.screenName,
              data: rowObj?.navigateTo?.data,
            });

            setSelectedMenuOptionType(Verbs.entityTypeTeam);
          }

          break;

        case strings.createClubText:
          setCreateEntity(Verbs.entityTypeClub);
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
          if (
            authContext.entity.role === Verbs.entityTypeUser &&
            rowObj.sport
          ) {
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
    },
    [authContext.entity, navigation],
  );

  const keyExtractorID = useCallback((item, index) => index.toString(), []);

  const renderSwitchProfileRows = ({item}) => (
    <TCSwitchProfileRow
      item={item}
      onPress={() => {
        setTimeout(() => {
          setLoading(true);
        }, 10);
        setAccountMenu([]);
        onSwitchProfile({item});
      }}
    />
  );

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

  const onCancelTermination = (authContext, group_id) => {
    const caller_id = group_id;
    const caller = Verbs.entityTypeTeam;

    const headers = [caller_id, caller];

    groupUnpaused(authContext, headers)
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

  const onResendRequest = (player1, player2, sport, sport_type, request_id) => {
    const obj = {
      player1,
      player2,
      sport,
      sport_type,
      entity_type: Verbs.entityTypeTeam,
      request_id: request_id,
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
        if (typeof response.payload == 'boolean' && response.payload) {
          setDoubleExist(false);
          setLoading(false);
        } else if (
          response.payload.error_code === Verbs.REQUESTALREADYEXIST &&
          response.payload.hasOwnProperty('action')
        ) {
          setLoading(false);

          const {player1, player2, sport, sport_type, request_id} =
            response.payload.data;

          // show custom Alert

          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',

            [
              {
                text: strings.goBack,
                onPress: () => console.log('PRessed'),
              },
              {
                text: strings.resendRequest,
                onPress: () =>
                  onResendRequest(
                    player1,
                    player2,
                    sport,
                    sport_type,
                    request_id,
                  ),
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
                    teamObject: teamObject,
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
            actionOnTeamRequest(
              Verbs.cancelVerb,
              rowItem?.option?.request_id,
              authContext,
            ),
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

  const renderAccountMenuRows = useCallback(
    (rowItem) =>
      rowItem.option ? (
        <AccountMenuRow
          item={rowItem}
          isAccountDeactivated={isAccountDeactivated}
          onPressSetting={() => {
            navigation.navigate(
              rowItem.navigateTo.screenName,
              rowItem.navigateTo.data,
            );
          }}
          onPressCancelRequest={() => onCancelRequest(rowItem)}
          onPressSport={() => {
            handleSectionMemberClick(rowItem);
          }}
        />
      ) : null,
    [handleSectionMemberClick, isAccountDeactivated, authContext],
  );

  let placeHolder = images.teamSqure;
  if (authContext.entity.role === Verbs.entityTypeClub) {
    placeHolder = images.clubPlaceholderSmall;
  } else if (authContext.entity.role === Verbs.entityTypeTeam) {
    placeHolder = images.teamPlaceholderSmall;
  } else {
    placeHolder = images.profilePlaceHolder;
  }

  const onNextPressOnRuleModal = () => {
    setIsRulesModalVisible(false);
    setShowOnlyTeamSport(true);

    setTimeout(() => setVisibleSportsModalForTeam(true), 1000);
  };

  const unPauseGroup = () => {
    setLoading(true);
    groupUnpaused(authContext)
      .then(async (response) => {
        setIsAccountDeactivated(false);
        await Utility.setAuthContextData(response.payload, authContext);
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setLoading(false);
          });
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setLoading(true);
    userActivate(authContext)
      .then((response) => {
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setLoading(false);
          });
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  useEffect(() => {
    const list = [
      {
        label: strings.allType,
        value: strings.allType,
      },
    ];
    authContext.sports.map((obj) => {
      const sportName = Utility.getSportName(obj, authContext);
      const dataSource = {
        label: sportName,
        value: sportName,
      };
      list.push(dataSource);
    });

    setSports(list);
  }, [authContext]);

  const getUsers = () => {
    const generalsQuery = {
      size: 100,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [{match: {entity_type: 'player'}}],
              },
            },
            {
              bool: {
                should: [],
              },
            },
          ],
        },
      },
    };

    if (authContext.entity.auth.user?.city) {
      generalsQuery.query.bool.must[1].bool.should.push({
        match: {
          city: {query: authContext.entity.auth.user.city, boost: 4},
        },
      });
    }

    if (authContext.entity.auth.user?.state) {
      generalsQuery.query.bool.must[1].bool.should.push({
        match: {
          state_abbr: {
            query: authContext.entity.auth.user.state,
            boost: 3,
          },
        },
      });
    }

    if (authContext.entity.auth.user?.country) {
      generalsQuery.query.bool.must[1].bool.should.push({
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
            // eslint-disable-next-line no-param-reassign
            obj.isChecked = false;
            return obj;
          });

          const filteredResult = result.filter(
            (e) => e.user_id !== authContext.entity.auth.user.user_id,
          );

          setPlayers([...filteredResult]);
          setPageFrom(pageFrom + pageSize);
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer} testID="account-screen">
      <ActivityLoader visible={loading} />

      <Header
        leftComponent={
          <Text style={styles.eventTitleTextStyle}>{strings.account}</Text>
        }
        showBackgroundColor={true}
        rightComponent={renderTopRightNotificationButton()}
      />
      <View style={styles.separateLine} />

      {isAccountDeactivated && (
        <TCAccountDeactivate
          type={
            authContext?.entity?.obj?.is_pause === true
              ? 'pause'
              : authContext?.entity?.obj?.under_terminate === true
              ? 'terminate'
              : 'deactivate'
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
                      ? 'Unpause'
                      : 'Reactivate',
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
      <ScrollView
        style={styles.mainContainer}
        ref={scrollRef}
        testID="account-scroll">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View />
        </View>
        {authContext.entity.role === Verbs.entityTypeUser && (
          <View style={styles.profileView}>
            <ImageBackground
              source={
                authContext?.entity?.obj?.background_thumbnail
                  ? {uri: authContext?.entity?.obj?.background_thumbnail}
                  : images?.ImageBackground
              }
              style={styles.profileView}
              blurRadius={10}>
              <TouchableOpacity
                testID="move-to-user-home"
                onPress={() => {
                  navigation.navigate('HomeScreen', {
                    uid: authContext.entity.uid,
                    role: Verbs.entityTypeUser,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  marginLeft: 25,
                  marginRight: 25,
                }}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={
                      authContext?.entity?.obj?.thumbnail || ''
                        ? {uri: authContext.entity.obj.thumbnail}
                        : placeHolder
                    }
                    style={styles.profileImg}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 15,
                    width: Dimensions.get('window').width / 1.6,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <Text
                      style={
                        authContext?.entity?.obj?.background_thumbnail
                          ? [styles.nameText, {alignSelf: 'flex-start'}]
                          : [
                              styles.nameText,
                              {
                                alignSelf: 'flex-start',
                                color: colors.lightBlackColor,
                              },
                            ]
                      }>
                      {authContext?.entity?.obj?.full_name || ''}
                    </Text>
                    <Text>
                      {authContext?.entity?.obj?.background_thumbnail}
                    </Text>
                    <Image
                      source={images.arrowGraterthan}
                      style={{
                        height: 14,
                        width: 8,
                        marginLeft: 5,
                        resizeMode: 'cover',
                        tintColor: authContext?.entity?.obj
                          ?.background_thumbnail
                          ? colors.whiteColor
                          : colors.lightBlackColor,
                      }}
                    />
                  </View>
                  <Text
                    style={
                      authContext?.entity?.obj?.background_thumbnail
                        ? [styles.locationText, {alignSelf: 'flex-start'}]
                        : [
                            styles.locationText,
                            {
                              alignSelf: 'flex-start',
                              color: colors.lightBlackColor,
                            },
                          ]
                    }>
                    {Utility.getCityStateCountry(authContext)}
                  </Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}
        {(authContext.entity.role === Verbs.entityTypeTeam ||
          authContext.entity.role === Verbs.entityTypeClub) && (
          <View style={styles.profileView}>
            {authContext?.entity?.obj?.background_thumbnail ? (
              <ImageBackground
                source={
                  authContext?.entity?.obj?.background_thumbnail
                    ? {
                        uri:
                          authContext?.entity?.obj?.background_thumbnail ?? '',
                      }
                    : images.ImageBackground
                }
                style={styles.profileView}
                blurRadius={10}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HomeScreen', {
                      uid: authContext.entity.uid,
                      role: authContext.entity.role,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginRight: 20,
                    alignContent: 'center',
                  }}>
                  <View style={styles.profileImageContainer}>
                    {authContext?.entity?.obj?.thumbnail ? (
                      <Image
                        source={{uri: authContext?.entity?.obj?.thumbnail}}
                        style={styles.profileImg}
                      />
                    ) : (
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={placeHolder}
                          style={{
                            ...styles.profileImg,
                            resizeMode: 'contain',
                          }}
                        />
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                          }}>
                          <Text
                            style={{
                              marginTop: -5,
                              textAlign: 'center',
                              color: colors.whiteColor,
                              fontFamily: fonts.RBold,
                              fontSize: 16,
                            }}>
                            {authContext?.entity?.obj?.group_name[0]}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      marginLeft: 15,
                      width: Dimensions.get('window').width / 1.6,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                      <Text
                        style={
                          authContext?.entity?.obj?.background_thumbnail
                            ? [styles.nameText, {alignSelf: 'flex-start'}]
                            : [
                                styles.nameText,
                                {
                                  alignSelf: 'flex-start',
                                  color: colors.lightBlackColor,
                                },
                              ]
                        }>
                        {' '}
                        {authContext?.entity?.obj?.group_name}
                      </Text>

                      <Image
                        source={
                          authContext.entity.role === Verbs.entityTypeTeam
                            ? images.teamPatch
                            : images.clubPatch
                        }
                        style={{
                          height: 15,
                          width: 15,
                          marginLeft: 5,
                          resizeMode: 'cover',
                        }}
                      />
                      <Image
                        source={images.arrowGraterthan}
                        style={{
                          height: 14,
                          width: 8,
                          marginLeft: 5,
                          resizeMode: 'cover',
                          tintColor: authContext?.entity?.obj
                            ?.background_thumbnail
                            ? colors.whiteColor
                            : colors.lightBlackColor,
                        }}
                      />
                    </View>
                    <Text
                      style={
                        authContext?.entity?.obj?.background_thumbnail
                          ? [styles.locationText, {alignSelf: 'flex-start'}]
                          : [
                              styles.locationText,
                              {
                                alignSelf: 'flex-start',
                                color: colors.lightBlackColor,
                              },
                            ]
                      }>
                      {Utility.getCityStateCountry(authContext)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            ) : (
              <View style={styles.profileView} blurRadius={10}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HomeScreen', {
                      uid: authContext.entity.uid,
                      role: authContext.entity.role,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginRight: 20,
                    alignContent: 'center',
                  }}>
                  <View style={styles.profileImageContainer}>
                    {authContext?.entity?.obj?.thumbnail ? (
                      <Image
                        source={{uri: authContext?.entity?.obj?.thumbnail}}
                        style={styles.profileImg}
                      />
                    ) : (
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={placeHolder}
                          style={{
                            ...styles.profileImg,
                            resizeMode: 'contain',
                          }}
                        />
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                          }}>
                          <Text
                            style={{
                              marginTop: -5,
                              textAlign: 'center',
                              color: colors.whiteColor,
                              fontFamily: fonts.RBold,
                              fontSize: 16,
                            }}>
                            {authContext?.entity?.obj?.group_name[0]}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      marginLeft: 15,
                      width: Dimensions.get('window').width / 1.6,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                      <Text
                        style={
                          authContext?.entity?.obj?.background_thumbnail
                            ? [styles.nameText, {alignSelf: 'flex-start'}]
                            : [
                                styles.nameText,
                                {
                                  alignSelf: 'flex-start',
                                  color: colors.lightBlackColor,
                                },
                              ]
                        }>
                        {' '}
                        {authContext?.entity?.obj?.group_name}
                      </Text>

                      <Image
                        source={
                          authContext.entity.role === Verbs.entityTypeTeam
                            ? images.teamPatch
                            : images.clubPatch
                        }
                        style={{
                          height: 15,
                          width: 15,
                          marginLeft: 5,
                          resizeMode: 'cover',
                        }}
                      />
                      <Image
                        source={images.arrowGraterthan}
                        style={{
                          height: 14,
                          width: 8,
                          marginLeft: 5,
                          resizeMode: 'cover',
                          tintColor: authContext?.entity?.obj
                            ?.background_thumbnail
                            ? colors.whiteColor
                            : colors.lightBlackColor,
                        }}
                      />
                    </View>
                    <Text
                      style={
                        authContext?.entity?.obj?.background_thumbnail
                          ? [styles.locationText, {alignSelf: 'flex-start'}]
                          : [
                              styles.locationText,
                              {
                                alignSelf: 'flex-start',
                                color: colors.lightBlackColor,
                              },
                            ]
                      }>
                      {Utility.getCityStateCountry(authContext)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <ExpanableList
          dataSource={accountMenu}
          style={{marginTop: 15}}
          headerKey={'key'}
          memberKey="member"
          renderRow={renderAccountMenuRows}
          ItemSeparatorComponent={() => (
            <View style={styles.halfSeparatorLine} />
          )}
          renderSectionHeaderX={(section, sectionID, isSectionOpen) => {
            const secData = accountMenu.find((item) => item.key === section);
            return (
              <View
                style={{
                  opacity:
                    isAccountDeactivated &&
                    section !== strings.settingsTitleText
                      ? 0.5
                      : 1,
                }}>
                <TouchableWithoutFeedback
                  testID={`account-section${sectionID}`}
                  disabled={
                    isAccountDeactivated &&
                    section !== strings.settingsTitleText
                  }
                  style={styles.listContainer}
                  onPress={() => {
                    handleSectionClick(secData);
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={secData?.icon}
                      style={{...styles.menuItem}}
                    />
                  </View>
                  <Text accessibilityLabel={section} style={styles.listItems}>
                    {section}
                  </Text>
                  {
                    <>
                      {secData?.member ? (
                        <Image
                          source={images.nextArrow}
                          style={{
                            ...styles.nextArrow,
                            transform: [
                              {rotateZ: isSectionOpen ? '270deg' : '90deg'},
                            ],
                          }}
                        />
                      ) : (
                        <Image
                          source={images.nextArrow}
                          style={styles.nextArrow}
                        />
                      )}
                    </>
                  }
                </TouchableWithoutFeedback>
              </View>
            );
          }}
        />

        {managedEntities.length > 0 && (
          <>
            <View style={styles.separatorView}></View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={images.switchAccount}
                style={styles.switchAccountIcon}
              />
              <Text style={styles.switchAccount}>{strings.switchAccount}</Text>
            </View>
          </>
        )}
        <FlatList
          data={managedEntities}
          keyExtractor={keyExtractorID}
          renderItem={renderSwitchProfileRows}
          scrollEnabled={false}
        />
        <View style={styles.separatorView} />
        {/* Log out section */}
        <TouchableWithoutFeedback
          style={{flexDirection: 'row'}}
          onPress={() => {
            handleLogOut();
          }}>
          <Image source={images.logoutIcon} style={styles.switchAccountIcon} />
          <Text style={styles.switchAccount}>{strings.logOut}</Text>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* ios Alert Custom */}

      {/* Rules notes modal */}

      <Modal
        isVisible={isRulesModalVisible}
        onBackdropPress={() => setIsRulesModalVisible(false)}
        onRequestClose={() => setIsRulesModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
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
              //  marginBottom: 15,
            }}>
            <Text style={styles.rulesText}>{strings.teamCreateClubsText}</Text>
          </View>

          <View
            style={{
              marginLeft: 25,
              //  marginBottom: 35,
              marginRight: 27,
            }}>
            <View style={styles.rulesTitleContainer}>
              <View style={styles.rulesDots} />
              <Text style={[styles.rulesText]}>
                {strings.yourTeamWillBelogText}
              </Text>
            </View>
            <View style={styles.rulesTitleContainer}>
              <View style={styles.rulesDots} />
              <Text style={[styles.rulesText]}>
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
              <Text style={[styles.rulesText]}>
                {strings.adminOfTeamWillClubAdminText}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onNextPressOnRuleModal}
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
      </Modal>

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

            sport.grp_id = authContext.entity.obj.group_id;

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
            authContext,
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
}

const styles = StyleSheet.create({
  halfSeparatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayBackgroundColor,
    height: 0.5,
    marginRight: 20,
    marginVertical: 5,
    width: wp(90),
  },
  listContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  listItems: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  locationText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  menuItem: {
    alignSelf: 'center',
    marginLeft: 20,
    resizeMode: 'contain',
    height: 40,
    width: 40,
  },
  nameText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 20,
  },
  nextArrow: {
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
  },

  profileImageContainer: {
    height: 55,
    width: 55,
    backgroundColor: colors.whiteColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {height: 1.5, width: 0},
    shadowRadius: 3,
    shadowOpacity: 0.16,
    elevation: 3,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 25,
  },
  profileView: {
    height: 100,
    justifyContent: 'center',
    backgroundColor: colors.offwhite,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 1.5,
    elevation: 1.5,
  },
  separatorLine: {
    backgroundColor: colors.thinDividerColor,
    height: 2,
  },
  separatorView: {
    alignSelf: 'center',
    backgroundColor: colors.grayBackgroundColor,
    height: 7,
    width: wp('100%'),
  },

  switchAccount: {
    fontFamily: fonts.RRegular,
    flex: 1,
    padding: 15,
    paddingLeft: 10,
    fontSize: 16,
    // fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  switchAccountIcon: {
    alignSelf: 'center',
    height: 40,
    marginLeft: 20,
    resizeMode: 'contain',
    width: 40,
  },

  headerRightImg: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  roundBadge: {
    backgroundColor: 'red',
    height: 16,
    width: 16,
    borderRadius: 8,
    left: 15,
    bottom: 2,
  },
  eclipseBadge: {
    backgroundColor: 'red',
    height: 16,
    width: 22,
    borderRadius: 8,
    left: 15,
    bottom: 2,
  },
  notificationCounterStyle: {
    fontSize: 11,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    alignSelf: 'center',
  },
  eventTitleTextStyle: {
    width: 120,
    textAlign: 'center',
    fontFamily: fonts.Roboto,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 18,
    paddingTop: 5,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separateLine: {
    borderColor: colors.veryLightGray,
    borderWidth: 0.5,
  },
  rulesText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 24,
    marginBottom: 10,
    textAlignVertical: 'center',
  },
  modalViewContainer: {
    height: Dimensions.get('window').height / 2.3,
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
    //marginVertical: 20,
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginTop: 25,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  rulesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesDots: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: colors.blackColor,
    marginRight: 5,
    alignSelf: 'center',
    marginTop: -7,
  },
});
