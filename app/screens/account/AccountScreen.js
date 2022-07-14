/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
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
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

// import ActionSheet from 'react-native-actionsheet';
// import { useIsDrawerOpen } from '@react-navigation/drawer';
import MarqueeText from 'react-native-marquee';

import firebase from '@react-native-firebase/app';
import ExpanableList from 'react-native-expandable-section-flatlist';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';

import {
  getGroupDetails,
  getJoinedGroups,
  getTeamsOfClub,
  getGroupRequest,
  getTeamPendingRequest,
  groupUnpaused,
} from '../../api/Groups';
import {getGroupIndex} from '../../api/elasticSearch';
import {getUnreadCount} from '../../api/Notificaitons';

import * as Utility from '../../utils/index';

import images from '../../Constants/ImagePath';
import TCNavigationHeader from '../../components/TCNavigationHeader';
import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
  getQBAccountType,
  QBupdateUser,
} from '../../utils/QuickBlox';
import strings from '../../Constants/String';
import Header from '../../components/Home/Header';
import TCGradientButton from '../../components/TCGradientButton';
import TCThinDivider from '../../components/TCThinDivider';
import {getSportIcon} from '../../utils/index';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {userActivate} from '../../api/Users';

export default function AccountScreen({navigation}) {
  const scrollRef = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  console.log('authContext?.sports', authContext);
  // const [isSportCreateModalVisible, setIsSportCreateModalVisible] = useState(
  //   false,
  // );
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [team, setTeam] = useState([]);
  const [club, setClub] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [sportsSelection, setSportsSelection] = useState();
  const [sports, setSports] = useState('');
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [clickedUserType, setClickedUserType] = useState('user');

  console.log(sports);
  console.log('authSports::=>', authContext.sports);

  // for set/get teams
  const [teamList, setTeamList] = useState([]);
  // for set/get clubs
  const [clubList, setClubList] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(false);

  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [createEntity, setCreateEntity] = useState('');

  // Account menu
  const userMenu = [
    {key: 'Reservations'},
    {key: 'Playing', member: [{opetions: 'Add a sport'}]},
    {key: 'Refereeing', member: [{opetions: 'Register as a referee'}]},
    {key: 'Scorekeeping', member: [{opetions: 'Register as a scorekeeper'}]},
    {key: 'Teams', member: [{opetions: 'Create Team'}]},
    {key: 'Clubs', member: [{opetions: 'Create Club'}]},
    // {key: 'My Leagues', member:[{opetions: 'Create a League'}]},
    // {key: 'Register as a Referee'},
    // {key: 'Register as a personal player'},
    // {key: 'Create Group'},
    // {key: 'Reservations'},
    {
      key: 'Payment & Payout',
      member: [
        {opetions: 'Payment Method'},
        {opetions: 'Payout Method'},
        {opetions: 'Invoices'},
        {opetions: 'Transactions'},
      ],
    },
    // { key: 'Currency' },
    {key: 'Settings'},
  ];
  const teamMenu = [
    {key: 'Reservations'},
    {key: 'Challenge Settings'},
    {key: 'Members'},

    {key: 'Clubs', member: [{opetions: 'Create Club'}]},
    // {key: 'Leagues',member: [{ opetions: 'Create League' }]},
    {
      key: 'Payment & Payout',
      member: [
        {opetions: 'Payment Method'},
        {opetions: 'Payout Method'},
        {opetions: 'Invoicing'},
        {opetions: 'Transactions'},
      ],
    },
    {key: 'Settings'},
  ];
  const clubMenu = [
    {key: 'Members'},
    {key: 'Teams', member: [{opetions: 'Create Team'}]},
    // {key: 'My Leagues'},
    // {key: 'Invite Teams'},
    {
      key: 'Payment & Payout',
      member: [
        {opetions: 'Payment Method'},
        {opetions: 'Payout Method'},
        {opetions: 'Transactions'},
      ],
    },
    {key: 'Settings'},
  ];

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      console.log('its called....', authContext.entity.role);
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
          onPress={() => {
            navigation.navigate('NotificationsListScreen');
          }}
          hitSlop={Utility.getHitSlop(15)}>
          <ImageBackground
            source={
              notificationCounter > 0
                ? images.notificationBell
                : images.tab_notification
            }
            style={styles.headerRightImg}>
            {notificationCounter > 0 && (
              <View
                style={
                  notificationCounter > 9
                    ? styles.eclipseBadge
                    : styles.roundBadge
                }>
                <Text style={styles.notificationCounterStyle}>
                  {notificationCounter > 9 ? '9+' : notificationCounter}
                </Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    ),
    [isAccountDeactivated, navigation, notificationCounter, pointEvent],
  );

  const getData = () =>
    new Promise((resolve, reject) => {
      setloading(true);
      console.log('get data Promise Called..');
      const entity = authContext.entity;
      const promises = [
        getNotificationUnreadCount(entity),
        getTeamsList(entity),
      ];
      if (entity.role !== 'club') promises.push(getClubList(entity));
      Promise.all(promises)
        .then(() => {
          resolve(true);

          console.log('get data Promise resolved Called..');
        })

        // eslint-disable-next-line prefer-promise-reject-errors
        .catch(() => reject('error'));
    });

  // useEffect(() => {
  //   if (isFocused) {
  //     onSwitchProfile(authContext?.entity)
  //   }
  // }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [authContext, isFocused]);

  // useEffect(() => {
  //   if (
  //     authContext.entity?.obj?.entity_type === 'team' &&
  //     authContext.entity?.obj?.parent_groups?.length > 0
  //   ) {
  //     getJoinedClubListOfTeam(authContext.entity?.obj?.parent_groups);
  //   }
  // });

  // useEffect(() => {
  //   if (route?.params?.createdSportName) {
  //     setIsSportCreateModalVisible(true);
  //   }
  // }, [route?.params?.createdSportName]);

  const getParentClub = useCallback(
    async (item) => {
      console.log('parent club  Called..');
      getGroupDetails(item.group_id, authContext)
        .then((response) => {
          if (!response?.payload?.club) {
            setParentGroup(response?.payload?.club);
          } else {
            setParentGroup();
          }
          console.log('parent club done Called..');
        })
        .catch((e) => {
          setloading(false);
          console.log('6');
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
  );

  const getNotificationUnreadCount = useCallback(
    async (currentEntity) => {
      console.log('unread api  Called..');

      getUnreadCount(authContext)
        .then((response) => {
          console.log('unread api  Called..', response.payload);

          const {teams} = response.payload;
          const {clubs} = response.payload;
          const {user} = response.payload;
          const switchEntityObject = [{...user}, ...clubs, ...teams].filter(
            (e) =>
              e.group_id === authContext.entity.uid ||
              e.user_id === authContext.entity.uid,
          );
          setTeam(teams);
          setClub(clubs);
          setNotificationCounter(switchEntityObject?.[0]?.unread);
          if (currentEntity.role === 'user') {
            setGroupList([...clubs, ...teams]);
          } else if (currentEntity.role === 'team') {
            const updatedTeam = teams.filter(
              (item) => item.group_id !== authContext.entity.uid,
            );
            setGroupList([{...user}, ...clubs, ...updatedTeam]);
          } else if (authContext.entity.role === 'club') {
            const updatedClub = clubs.filter(
              (item) => item.group_id !== authContext.entity.uid,
            );
            setGroupList([{...user}, ...updatedClub, ...teams]);
          }
          setloading(false);

          // if (authContext?.entity?.QB) {
          //   setloading(false);
          // } else {
          //   onSwitchProfile(authContext?.entity)
          // }

          console.log('unread api done Called..');
        })
        .catch((e) => {
          console.log('catch -> Account Screen unread count api');
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
  );

  const getTeamsList = useCallback(
    async (currentEntity) => {
      console.log('team list api Called..');
      console.log('currentEntity ==>', currentEntity);
      setloading(true);
      if (currentEntity.role === 'club') {
        console.log('team of club api Called..');

        getTeamsOfClub(authContext.entity.uid, authContext)
          .then((response) => {
            setTeamList(response.payload);
            console.log('team list api done Called..', response.payload);
          })
          .catch((e) => {
            setloading(false);
            console.log('2');
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        console.log('join group api Called..');

        getTeamData();
        // getJoinedGroups('team', authContext)
        //   .then((response) => {
        //     console.log('join group api done Called..');
        //   })
        //   .catch((e) => {
        //     setloading(false);
        //     console.log('1');
        //     setTimeout(() => {
        //       Alert.alert(strings.alertmessagetitle, e.message);
        //     }, 10);
        //   });
      }
    },
    [authContext],
  );

  const getTeamData = () =>
    new Promise((resolve, reject) => {
      setloading(true);
      console.log('get data Promise Called..');
      const promises = [
        getJoinedGroups('team', authContext),
        getTeamPendingRequest(authContext),
      ];
      Promise.all(promises)
        .then(([res1, res2]) => {
          setloading(false);
          resolve(true);
          setTeamList([...res1.payload, ...res2.payload]);
          console.log('Joined groups', res1.payload);
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        .catch(() => reject('error'));
    });
  const getJoinedClubListOfTeam = useCallback((ids) => {
    console.log('groupsIds==>', ids);
    const body = {
      query: {
        terms: {
          _id: ids,
        },
      },
    };
    console.log('query body ==>', JSON.stringify(body));
    getGroupIndex(body).then((clubs) => {
      console.log('Joined club list::=>', clubs);
      setClubList(clubs);
    });
  }, []);

  const getClubList = useCallback(
    async (entity) => {
      console.log('club list api Called..');
      if (entity.role === 'user') {
        // called user club list
        getJoinedGroups('club', authContext)
          .then((response) => {
            setClubList(response.payload);
            console.log('club list api done Called..', response.payload);
          })
          .catch((e) => {
            setloading(false);
            console.log('4');
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else if (entity.role !== 'club') {
        // fetch team club list from elastic search
        const ids = entity?.obj?.parent_groups;
        getJoinedClubListOfTeam(ids);
      }
    },
    [authContext, getJoinedClubListOfTeam],
  );

  const oncalcelTeamRequest = (type, requestID) => {
    setloading(true);
    getGroupRequest(type, requestID, authContext)
      .then((response) => {
        setloading(false);
        if (response.status) {
          setTimeout(() => {
            Alert.alert('Your team request cancelled.');
          }, 10);
        } else {
          setTimeout(() => {
            Alert.alert('Something wrong with your request, please try again.');
          }, 10);
        }
        getTeamsList(authContext.entity);

        // }
      })
      .catch((e) => {
        setloading(false);
        console.log('3');
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const switchProfile = useCallback(
    async (item) => {
      setloading(true);
      console.log('switch profile Called..');

      let currentEntity = authContext.entity;
      // delete currentEntity?.QB;
      if (item?.entity_type === 'player' || item?.entity_type === 'user') {
        if (currentEntity.obj.entity_type === 'team') {
          team.push(currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.push(currentEntity.obj);
        }
        // setGroupList([...club, ...team]);
        currentEntity = {
          ...currentEntity,
          uid: item?.user_id,
          role: 'user',
          obj: item,
        };
        setParentGroup();
      } else if (item?.entity_type === 'team') {
        const i = team.indexOf(item);
        if (
          currentEntity.obj.entity_type === 'player' ||
          currentEntity.obj.entity_type === 'user'
        ) {
          team.splice(i, 1);
        } else if (currentEntity.obj.entity_type === 'team') {
          team.splice(i, 1, currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.push(currentEntity.obj);
        }
        currentEntity = {
          ...currentEntity,
          uid: item?.group_id,
          role: 'team',
          obj: item,
        };
        getParentClub(item);
      } else if (item?.entity_type === 'club') {
        const i = club.indexOf(item);
        if (
          currentEntity.obj.entity_type === 'player' ||
          currentEntity.obj.entity_type === 'user'
        ) {
          club.splice(i, 1);
        } else if (currentEntity.obj.entity_type === 'team') {
          club.splice(i, 1);
          team.push(currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.splice(i, 1, currentEntity.obj);
        }
        currentEntity = {
          ...currentEntity,
          uid: item?.group_id,
          role: 'club',
          obj: item,
        };
        setParentGroup();
        setGroup(item);
      }
      // authContext.setEntity({ ...currentEntity });
      // await Utility.setStorage('authContextEntity', { ...currentEntity });
      console.log('switch profile done Called..');

      return currentEntity;
    },
    [authContext, club, getParentClub, team],
  );

  const switchQBAccount = useCallback(
    (accountData, entity) => {
      setloading(true);
      console.log('switch QB Called..');

      let currentEntity = entity;
      const entityType = accountData?.entity_type;
      const uid =
        entityType === 'player' || entityType === 'user'
          ? 'user_id'
          : 'group_id';
      QBLogout()
        .then(() => {
          const {USER, CLUB, LEAGUE, TEAM} = QB_ACCOUNT_TYPE;
          let accountType = USER;
          if (entityType === 'club') accountType = CLUB;
          else if (entityType === 'team') accountType = TEAM;
          else if (entityType === 'league') accountType = LEAGUE;
          QBlogin(
            accountData[uid],
            {
              ...accountData,
              full_name: accountData.group_name,
            },
            accountType,
          )
            .then((res) => {
              currentEntity = {
                ...currentEntity,
                QB: {...res.user, connected: true, token: res?.session?.token},
              };
              QBconnectAndSubscribe(currentEntity)
                .then(async (qbRes) => {
                  authContext.setEntity({...currentEntity});
                  await Utility.setStorage('authContextEntity', {
                    ...currentEntity,
                  });
                  setloading(false);
                  console.log('switch QB done Called..');
                  if (qbRes?.error) console.log(strings.appName, qbRes?.error);
                })
                .catch(async () => {
                  authContext.setEntity({...currentEntity});
                  await Utility.setStorage('authContextEntity', {
                    ...currentEntity,
                  });
                  setloading(false);
                });
            })
            .catch(async () => {
              authContext.setEntity({...currentEntity});
              await Utility.setStorage('authContextEntity', {...currentEntity});
              setloading(false);
            });
        })
        .catch((error) => {
          console.log('QB Issue', error);
          setloading(false);
        });
    },
    [authContext],
  );

  const onSwitchProfile = useCallback(
    ({item}) => {
      console.log('on switch profile  Called..');
      switchProfile(item)
        .then((currentEntity) => {
          scrollRef.current.scrollTo({x: 0, y: 0});
          console.log('switch currentEntity', currentEntity);
          authContext.setEntity({...currentEntity});
          Utility.setStorage('authContextEntity', {...currentEntity});
          switchQBAccount(item, currentEntity);
        })
        .catch((e) => {
          setloading(false);
          console.log('5');
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [switchProfile, switchQBAccount],
  );

  const onLogout = useCallback(async () => {
    QBLogout();
    await firebase.auth().signOut();
    await Utility.clearStorage();
    await authContext.setUser(null);
    await authContext.setEntity(null);
  }, [authContext]);

  const handleLogOut = useCallback(async () => {
    Alert.alert(
      strings.appName,
      'Are you sure want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onLogout,
        },
      ],
      {cancelable: false},
    );
  }, [onLogout]);

  const handleSections = async (section) => {
    if (section === 'Reservations') {
      navigation.navigate('ReservationNavigator', {
        screen: 'ReservationScreen',
      });
    } else if (section === 'Register as a Referee') {
      navigation.navigate('RegisterReferee');
    } else if (section === 'Register as a personal player') {
      navigation.navigate('RegisterPlayer');
    } else if (section === 'Register as a scorekeeper') {
      navigation.navigate('RegisterScorekeeper');
    } else if (section === 'Create Club') {
      navigation.navigate('CreateClubForm1');
    } else if (section === 'Settings') {
      const entity = authContext.entity;
      if (entity.role === 'user') {
        navigation.navigate('UserSettingPrivacyScreen');
      } else {
        console.log('clubs==>', club);
        console.log('clubs list==>', clubList);
        navigation.navigate('GroupSettingPrivacyScreen', {
          groups: authContext?.entity?.role === 'team' ? clubList : teamList,
        });
      }
    } else if (section === 'Members') {
      const entity = authContext.entity;
      navigation.navigate('GroupMembersScreen', {groupID: entity.uid});
    } else if (section === 'Challenge Settings') {
      setClickedUserType('user');
      const entity = authContext.entity;

      if (entity.role === 'user') {
        if (entity?.obj?.registered_sports?.length > 0) {
          setVisibleSportsModal(true);
        } else {
          Alert.alert('There is no registerd sports.');
        }
      } else {
        console.log('entity?.obj?.sport1:=>', entity?.obj);
        navigation.navigate('ManageChallengeScreen', {
          groupObj: authContext.entity.obj,
          sportName: entity?.obj?.sport,
          sportType: entity?.obj?.sport_type,
        });
      }
    } else if (section === 'Referee Reservation Settings') {
      setClickedUserType('referee');

      const entity = authContext.entity;
      console.log('entity?.objentity?.obj-->', entity?.obj, entity?.obj?.sport);
      if (entity.role === 'user') {
        if (entity?.obj?.referee_data?.length > 0) {
          setVisibleSportsModal(true);
        } else {
          Alert.alert('There is no registerd sports as a referee.');
        }
      } else {
        navigation.navigate('RefereeReservationSetting', {
          sportName: entity?.obj?.sport,
        });
      }
    } else if (section === 'Scorekeeper Reservation Settings') {
      setClickedUserType('scorekeeper');

      const entity = authContext.entity;

      if (entity.role === 'user') {
        if (entity?.obj?.scorekeeper_data?.length > 0) {
          setVisibleSportsModal(true);
        } else {
          Alert.alert('There is no registerd sports as a scorekeeper.');
        }
      } else {
        navigation.navigate('ScorekeeperReservationSetting', {
          sportName: entity?.obj?.sport,
        });
      }
    } else if (section === 'Log out') {
      handleLogOut();
    }
  };

  const handleOptions = useCallback(
    (options) => {
      // navigation.closeDrawer();
      if (options === 'Register as a referee') {
        navigation.navigate('RegisterReferee');
      } else if (options === 'Register as a scorekeeper') {
        navigation.navigate('RegisterScorekeeper');
      } else if (options === 'Add a sport') {
        navigation.navigate('RegisterPlayer');
      } else if (options === 'Create Team') {
        setCreateEntity('team');

        const entity = authContext.entity;
        if (entity.role === 'user') {
          setIsRulesModalVisible(false);
          navigation.navigate('CreateTeamForm1');
        } else {
          setIsRulesModalVisible(true);
        }
      } else if (options === 'Create Club') {
        const entity = authContext.entity;
        setCreateEntity('club');
        if (entity.role === 'user') {
          navigation.navigate('CreateClubForm1');
        } else {
          setIsRulesModalVisible(true);
        }
      } else if (options === 'Payment Method') {
        navigation.navigate('Account', {
          screen: 'PaymentMethodsScreen',
          params: {
            comeFrom: 'AccountScreen',
          },
        });
      } else if (options === 'Payout Method') {
        // navigation.navigate('PayoutMethodScreen');
        navigation.navigate('PayoutMethodList', {comeFrom: 'AccountScreen'});
      } else if (options === 'Invoicing') {
        navigation.navigate('InvoiceScreen');
        // navigation.navigate('MembersDetailScreen');
      } else if (options === 'Invoices') {
        navigation.navigate('UserInvoiceScreen');
      } else if (options === 'Transactions') {
        // navigation.navigate('InvoiceScreen');
        Alert.alert('Transaction section');
      }
    },
    [authContext.entity, navigation],
  );

  console.log('authContext?.entity?.obj', authContext?.entity?.obj);

  const renderSportsList = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          console.log('renderSportsList', item);
          navigation.navigate('SportAccountSettingScreen', {
            type: 'player',
            sport: item,
          });
        }}>
        <View style={styles.entityTextContainer}>
          <Image
            source={getSportIcon(item.sport)}
            style={styles.accountSportIcon}
          />
          <Text style={styles.entityName}>
            {Utility.getSportName(item, authContext)}
          </Text>
        </View>
        <Image source={images.settingSport} style={styles.nextArrow} />
      </TouchableOpacity>
    ),
    [authContext, navigation],
  );

  const renderRefereesList = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          console.log('renderRefereesList', item);
          navigation.navigate('SportAccountSettingScreen', {
            type: 'referee',
            sport: item,
          });
        }}>
        <View style={styles.entityTextContainer}>
          <Image
            source={getSportIcon(item.sport)}
            style={styles.accountSportIcon}
          />
          <Text style={styles.entityName}>
            {Utility.getSportName(item, authContext)}
          </Text>
        </View>
        <Image source={images.settingSport} style={styles.nextArrow} />
      </TouchableOpacity>
    ),
    [authContext, navigation],
  );

  const renderScorekeepersList = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          console.log('renderSportsList', item);
          navigation.navigate('SportAccountSettingScreen', {
            type: 'scorekeeper',
            sport: item,
          });
        }}>
        <View style={styles.entityTextContainer}>
          <Image
            source={getSportIcon(item.sport)}
            style={styles.accountSportIcon}
          />
          <Text style={styles.entityName}>
            {Utility.getSportName(item, authContext)}
          </Text>
        </View>
        <Image source={images.settingSport} style={styles.nextArrow} />
      </TouchableOpacity>
    ),
    [],
  );

  const keyExtractorID = useCallback((item, index) => index.toString(), []);

  const renderSwitchProfile = useCallback(
    ({item}) => (
      <TouchableWithoutFeedback
        style={styles.switchProfileListContainer}
        onPress={() => {
          onSwitchProfile({item});
        }}>
        <View>
          {item.entity_type === 'player' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.profilePlaceHolder
                }
                style={
                  item.thumbnail ? styles.playerProfileImg : styles.playerImg
                }
              />
            </View>
          )}
          {item.entity_type === 'club' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.clubPlaceholder
                }
                style={
                  item.thumbnail ? styles.entityProfileImg : styles.entityImg
                }
              />
              {item.thumbnail ? null : (
                <Text style={styles.oneCharacterText}>
                  {item.group_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          {item.entity_type === 'team' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.teamPlaceholder
                }
                style={
                  item.thumbnail ? styles.entityProfileImg : styles.entityImg
                }
              />
              {item.thumbnail ? null : (
                <Text style={styles.oneCharacterText}>
                  {item.group_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          {/*
          {item.unread > 0 && (
            <View
              style={
                item.thumbnail
                  ? [styles.badgeView, { right: 10, top: 15 }]
                  : [
                      styles.badgeView,
                      {
                        right: 10,
                        top: 10,

                      },
              ]
              }>
              <Text
                style={{
                  ...styles.badgeCounter,
                  ...(item.unread > 9 ? { paddingHorizontal: 5 } : { width: 15 }),
                }}>
                {item.unread > 9 ? `+${9}` : item.unread}
              </Text>
            </View>
          )} */}

          {item.unread > 0 && (
            <View
              style={
                item.thumbnail
                  ? [styles.badgeView, {right: 10, top: 15}]
                  : [
                      styles.badgeView,
                      {
                        right: 10,
                        top: 10,
                      },
                    ]
              }>
              <Text
                style={{
                  ...styles.badgeCounter,
                  ...(item.unread > 9 ? {paddingHorizontal: 5} : {width: 15}),
                }}>
                {item.unread > 9 ? `+${9}` : item.unread}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          {item.entity_type === 'player' && (
            <Text style={styles.entityNameText}>{item.full_name}</Text>
          )}
          {item.entity_type === 'team' && (
            <Text style={styles.entityNameText}>{item.group_name}</Text>
          )}
          {item.entity_type === 'club' && (
            <Text style={styles.entityNameText}>{item.group_name}</Text>
          )}
          <Text style={styles.entityLocationText}>
            {item.city},{item.state_abbr}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ),
    [onSwitchProfile],
  );

  const renderEntityList = useCallback(
    ({item}) => (
      <View>
        <TouchableWithoutFeedback
          disabled={!item?.group_id}
          style={styles.listContainer}
          onPress={() => {
            const uid =
              item?.entity_type === 'player' ? item?.user_id : item?.group_id;
            if (uid && item?.entity_type) {
              navigation.navigate('HomeScreen', {
                uid,
                backButtonVisible: true,
                role:
                  item?.entity_type === 'player' ? 'user' : item?.entity_type,
              });
            }
          }}>
          <View style={styles.entityTextContainer}>
            <View style={styles.smallProfileContainer}>
              {item?.entity_type === 'team' && (
                <Image
                  source={
                    item?.thumbnail
                      ? {uri: item?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={styles.smallProfileImg}
                />
              )}
              {item?.entity_type === 'club' && (
                <Image
                  source={
                    item.thumbnail
                      ? {uri: item.thumbnail}
                      : images.clubPlaceholder
                  }
                  style={styles.smallProfileImg}
                />
              )}
            </View>

            <Text
              style={
                item?.group_name?.length > 26
                  ? [styles.entityName, {width: wp('50%')}]
                  : styles.entityName
              }
              numberOfLines={1}>
              {item?.group_name}
            </Text>
            <Text style={styles.teamSportView}>
              {' '}
              {Utility.getSportName(item, authContext)}
            </Text>
          </View>
          {/* <Image source={images.nextArrow} style={styles.nextArrow} /> */}
        </TouchableWithoutFeedback>
        {!item?.group_id && (
          <TouchableWithoutFeedback
            onPress={() => oncalcelTeamRequest('cancel', item?.request_id)}>
            <View style={styles.buttonView}>
              <Text style={styles.textStyle} numberOfLines={1}>
                Cancel request
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    ),
    [navigation],
  );

  const renderTeamsList = useCallback(
    ({item}) => (
      <TouchableWithoutFeedback
        style={styles.listContainer}
        onPress={() => {
          console.log('Pressed Team..');
          navigation.navigate('HomeScreen', {
            uid: item.group_id,
            role: item.entity_type,
            backButtonVisible: true,
            menuBtnVisible: false,
          });
        }}>
        <View style={styles.entityTextContainer}>
          <View style={styles.smallProfileContainer}>
            <Image
              source={
                item.thumbnail ? {uri: item.thumbnail} : images.teamPlaceholder
              }
              style={styles.smallProfileImg}
            />
          </View>
          <Text style={styles.entityName}>{item?.group_name}</Text>
          <Text
            style={
              item.entity_type === 'team'
                ? styles.teamSportView
                : styles.clubSportView
            }>
            {' '}
            {item.sport}
          </Text>
        </View>
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const renderMenuItems = useCallback(
    (rowItem, rowId, sectionId) => (
      <View>
        {authContext.entity.role === 'user' &&
          sectionId === 1 &&
          !isAccountDeactivated && (
            <FlatList
              style={{marginVertical: 10}}
              data={authContext?.entity?.obj?.registered_sports?.filter(
                (obj) => obj?.sport && obj?.sport_type,
              )}
              keyExtractor={keyExtractorID}
              renderItem={renderSportsList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}
        {authContext.entity.role === 'user' &&
          sectionId === 2 &&
          !isAccountDeactivated && (
            <FlatList
              style={{marginVertical: 10}}
              data={authContext?.entity?.obj?.referee_data}
              keyExtractor={keyExtractorID}
              renderItem={renderRefereesList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}
        {authContext.entity.role === 'user' &&
          sectionId === 3 &&
          !isAccountDeactivated && (
            <FlatList
              style={{marginVertical: 10}}
              data={authContext?.entity?.obj?.scorekeeper_data}
              keyExtractor={keyExtractorID}
              renderItem={renderScorekeepersList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}
        {authContext.entity.role === 'user' &&
          !isAccountDeactivated &&
          (sectionId === 4 || sectionId === 5) && (
            <FlatList
              style={{marginVertical: 10}}
              data={sectionId === 4 ? teamList : clubList}
              keyExtractor={keyExtractorID}
              renderItem={renderEntityList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}
        {authContext.entity.role === 'team' &&
          !isAccountDeactivated &&
          sectionId === 3 && (
            <FlatList
              style={{marginVertical: 10}}
              data={clubList}
              keyExtractor={keyExtractorID}
              renderItem={renderEntityList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}

        {authContext.entity.role === 'club' &&
          sectionId === 1 &&
          !isAccountDeactivated && (
            <FlatList
              style={{marginVertical: 10}}
              data={teamList}
              keyExtractor={keyExtractorID}
              renderItem={renderTeamsList}
              ItemSeparatorComponent={() => (
                <View style={styles.subItemSeparator} />
              )}
              scrollEnabled={false}
            />
          )}

        {!isAccountDeactivated && (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => {
              handleOptions(rowItem.opetions);
            }}>
            {rowItem.opetions === 'Add a sport' && (
              <Image source={images.addSport} style={styles.subMenuItem} />
            )}
            {rowItem.opetions === 'Register as a referee' && (
              <Image
                source={images.registerReferee}
                style={styles.subMenuItem}
              />
            )}
            {rowItem.opetions === 'Register as a scorekeeper' && (
              <Image
                source={images.registerScorekeeper}
                style={styles.subMenuItem}
              />
            )}
            {rowItem.opetions === 'Create Team' && (
              <Image source={images.createTeam} style={styles.subMenuItem} />
            )}
            {rowItem.opetions === 'Create Club' && (
              <Image source={images.createClub} style={styles.subMenuItem} />
            )}
            {rowItem.opetions === 'Create a League' && (
              <Image source={images.createLeague} style={styles.subMenuItem} />
            )}
            <View style={{marginVertical: 5}}>
              {rowItem.opetions === 'Payment Method' && (
                <Image
                  source={images.Payment_method}
                  style={{...styles.subMenuItem}}
                />
              )}

              {rowItem.opetions === 'Payout Method' && (
                <Image
                  source={images.Payout_method}
                  style={{...styles.subMenuItem}}
                />
              )}
              {rowItem.opetions === 'Invoicing' && (
                <Image
                  source={images.Invoicing}
                  style={{...styles.subMenuItem}}
                />
              )}
              {rowItem.opetions === 'Invoices' && (
                <Image
                  source={images.Invoicing}
                  style={{...styles.subMenuItem}}
                />
              )}
              {rowItem.opetions === 'Transactions' && (
                <Image
                  source={images.Transations}
                  style={{...styles.subMenuItem}}
                />
              )}
            </View>
            <Text style={styles.listItems}>{rowItem.opetions}</Text>
            <Image source={images.nextArrow} style={styles.nextArrow} />
          </TouchableWithoutFeedback>
        )}
      </View>
    ),
    [
      authContext.entity?.obj?.referee_data,
      authContext.entity?.obj?.registered_sports,
      authContext.entity?.obj?.scorekeeper_data,
      authContext.entity.role,
      clubList,
      handleOptions,
      isAccountDeactivated,
      keyExtractorID,
      renderEntityList,
      renderRefereesList,
      renderScorekeepersList,
      renderSportsList,
      renderTeamsList,
      teamList,
    ],
  );

  let placeHolder = images.teamSqure;
  if (authContext.entity.role === 'club') {
    placeHolder = images.clubPlaceholderSmall;
  } else if (authContext.entity.role === 'team') {
    placeHolder = images.teamPlaceholderSmall;
  } else {
    placeHolder = images.profilePlaceHolder;
  }

  const onNextPressed = () => {
    setIsRulesModalVisible(false);
    const entity = authContext.entity;
    if (createEntity === 'team') {
      if (entity.role === 'user') {
        navigation.navigate('CreateTeamForm1');
      } else {
        navigation.navigate('CreateTeamForm1', {clubObject: group});
      }
    }
    if (createEntity === 'club') {
      navigation.navigate('CreateClubForm1');
    }
  };

  const renderSports = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        setVisibleSportsModal(false);
        setSports(item?.sport);
        setTimeout(() => {
          console.log('Sport name:=>', item?.sport, item?.sport_type);
          if (clickedUserType === 'user') {
            navigation.navigate('ManageChallengeScreen', {
              groupObj: authContext.entity.obj,
              sportName: item.sport,
              sportType: item.sport_type,
            });
          }
          if (clickedUserType === 'referee') {
            navigation.navigate('RefereeReservationSetting', {
              sportName: item.sport,
            });
          }
          if (clickedUserType === 'scorekeeper') {
            navigation.navigate('ScorekeeperReservationSetting', {
              sportName: item.sport,
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
          {sportsSelection?.sport === item?.sport &&
          sportsSelection?.sport_type === item?.sport_type ? (
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

  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then((response) => {
        setIsAccountDeactivated(false);
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
          });
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
      .then((response) => {
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
          });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <Header
        leftComponent={<Text style={styles.eventTitleTextStyle}>Account</Text>}
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
              `Are you sure you want to ${
                authContext?.entity?.obj?.is_pause === true
                  ? 'unpause'
                  : 'reactivate'
              } this account?`,
              '',
              [
                {
                  text: 'Cancel',
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
      <ScrollView style={styles.mainContainer} ref={scrollRef}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {parentGroup ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={images.clubLable} style={styles.clubLableView} />
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                }}>
                <TCNavigationHeader
                  name={parentGroup?.group_name}
                  groupType={'club'}
                  image={parentGroup?.thumbnail}
                />
              </View>
            </View>
          ) : (
            <View />
          )}
          {/* <View>
            <TouchableOpacity onPress={() => {
              // navigation.closeDrawer()
            }} >
              <Image source={images.menuClose} style={styles.closeMenu}/>
            </TouchableOpacity>
          </View> */}
        </View>
        {authContext.entity.role === 'user' && (
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
                onPress={() => {
                  navigation.navigate('HomeScreen', {
                    uid: authContext.entity.uid,
                    role: 'user',
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
                    <MarqueeText
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
                      }
                      duration={3000}
                      marqueeOnStart
                      loop={true}
                      // marqueeDelay={0}
                      // marqueeResetDelay={1000}
                    >
                      {authContext?.entity?.obj?.full_name || ''}
                    </MarqueeText>

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
                    {authContext?.entity?.obj?.city || ''},{' '}
                    {authContext?.entity?.obj?.state_abbr || ''}
                  </Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}
        {(authContext.entity.role === 'team' ||
          authContext.entity.role === 'club') && (
          <View style={styles.profileView}>
            <ImageBackground
              source={
                authContext?.entity?.obj?.background_thumbnail
                  ? {uri: authContext?.entity?.obj?.background_thumbnail}
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
                        style={{...styles.profileImg, resizeMode: 'contain'}}
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
                    <MarqueeText
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
                      }
                      duration={3000}
                      marqueeOnStart
                      loop={true}>
                      {authContext?.entity?.obj?.group_name}
                    </MarqueeText>

                    <Image
                      source={
                        authContext.entity.role === 'team'
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
                    {authContext?.entity?.obj?.city},{' '}
                    {authContext?.entity?.obj?.state_abbr}
                  </Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}

        <ExpanableList
          dataSource={
            (authContext.entity.role === 'team' && teamMenu) ||
            (authContext.entity.role === 'club' && clubMenu) ||
            (authContext.entity.role === 'user' && userMenu)
          }
          style={{marginTop: 15}}
          headerKey={'key'}
          memberKey="member"
          renderRow={renderMenuItems}
          ItemSeparatorComponent={() => (
            <View style={styles.halfSeparatorLine} />
          )}
          renderSectionHeaderX={(section, sectionID, isSectionOpen) => {
            const secData = userMenu?.find((item) => item.key === section);
            return (
              <View
                style={{
                  opacity:
                    isAccountDeactivated && section !== 'Settings' ? 0.5 : 1,
                }}>
                <TouchableWithoutFeedback
                  disabled={isAccountDeactivated && section !== 'Settings'}
                  style={styles.listContainer}
                  onPress={() => {
                    handleSections(section);
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {section === 'Reservations' && (
                      <Image
                        source={images.accountMySchedule}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Playing' && (
                      <Image
                        source={images.accountMySports}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Refereeing' && (
                      <Image
                        source={images.accountMyRefereeing}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Scorekeeping' && (
                      <Image
                        source={images.accountMyScoreKeeping}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Teams' && (
                      <Image
                        source={images.accountMyTeams}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Clubs' && (
                      <Image
                        source={images.accountMyClubs}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Leagues' && (
                      <Image
                        source={images.accountMyLeagues}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Challenge Settings' && (
                      <Image
                        source={images.manageChallengeIcon}
                        style={styles.menuItem}
                      />
                    )}

                    {section === 'Payment & Payout' && (
                      <Image
                        source={images.accountPaymentPayout}
                        style={{...styles.menuItem}}
                      />
                    )}

                    {section === 'Settings' && (
                      <Image
                        source={images.accountSettingPrivacy}
                        style={{...styles.menuItem}}
                      />
                    )}

                    {section === 'Log out' && (
                      <Image
                        source={images.logoutIcon}
                        style={{...styles.menuItem}}
                      />
                    )}
                    {section === 'Members' && (
                      <Image
                        source={images.Members}
                        style={{...styles.menuItem}}
                      />
                    )}
                  </View>
                  <Text style={styles.listItems}>{section}</Text>
                  {section !== 'Log out' && (
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
                  )}
                </TouchableWithoutFeedback>
              </View>
            );
          }}
        />

        {groupList.length > 0 && (
          <>
            <View style={styles.separatorView}></View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={images.switchAccount}
                style={styles.switchAccountIcon}
              />
              <Text style={styles.switchAccount}>Switch Account</Text>
            </View>
          </>
        )}
        <FlatList
          data={groupList}
          keyExtractor={keyExtractorID}
          renderItem={renderSwitchProfile}
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
          <Text style={styles.switchAccount}>Log out</Text>
        </TouchableWithoutFeedback>

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
          <SafeAreaView
            style={{
              height: Dimensions.get('window').height / 1.7,
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
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {createEntity === 'club' ? 'Create Club' : 'Create Team'}
              </Text>
            </View>
            <View style={styles.separatorLine} />
            <View style={{flex: 1}}>
              <Text style={[styles.rulesText, {margin: 15}]}>
                {'When your team creates a club:'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {'\n• your team will belong to the club initially.'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {'\n• your team can leave the club anytime later.'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {
                  '\n• the admins of your team will be the admins of the club initially.'
                }
              </Text>
            </View>
            <TCGradientButton
              title={strings.nextTitle}
              onPress={onNextPressed}
            />
          </SafeAreaView>
        </Modal>

        {/* Rules notes modal */}

        <Modal
          isVisible={visibleSportsModal}
          onBackdropPress={() => setVisibleSportsModal(false)}
          onRequestClose={() => setVisibleSportsModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
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
                Sports
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
              data={
                (clickedUserType === 'user' &&
                  authContext?.entity?.obj?.registered_sports?.filter(
                    (obj) =>
                      obj?.sport &&
                      obj?.sport_type &&
                      obj.sport_type === 'single',
                  )) ||
                (clickedUserType === 'referee' &&
                  authContext?.entity?.obj?.referee_data) ||
                (clickedUserType === 'scorekeeper' &&
                  authContext?.entity?.obj?.scorekeeper_data)
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSports}
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badgeCounter: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  badgeView: {
    backgroundColor: colors.darkThemeColor,
    borderRadius: 10,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 3,
  },

  clubLableView: {
    height: 34,
    width: 230,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    position: 'absolute',
    alignSelf: 'center',
    // marginLeft:20,
  },

  clubSportView: {
    color: colors.greeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },

  entityImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  entityProfileImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 36,
    margin: 15,
    resizeMode: 'cover',
    width: 36,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
    marginTop: 5,
  },
  entityName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },

  entityTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 20,
    // width: wp('86%'),
  },
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
  switchProfileListContainer: {
    flex: 1,
    marginLeft: 20,
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

  oneCharacterText: {
    // alignSelf:'center',
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    height: 40,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    margin: 15,
    width: 40,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
  },
  playerImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 3,
    height: 40,
    margin: 15,
    resizeMode: 'cover',
    width: 40,
  },
  playerProfileImg: {
    alignSelf: 'center',
    borderRadius: 20,
    height: 36,
    margin: 15,
    resizeMode: 'cover',
    width: 36,
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
  // closeMenu: {
  //   height: 14,
  //   width: 14,
  //   resizeMode: 'cover',
  //   alignSelf: 'center',
  //   marginRight: 20,
  // },

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
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    marginVertical: 5,
    width: wp('90%'),
  },
  separatorView: {
    alignSelf: 'center',
    backgroundColor: colors.grayBackgroundColor,
    height: 7,
    width: wp('100%'),
  },
  smallProfileContainer: {
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    margin: 15,
    alignSelf: 'center',
    borderRadius: 15,
    height: 23,
    width: 23,
    resizeMode: 'cover',
    shadowColor: colors.blackColor,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1.5},
    shadowRadius: 3,
    elevation: 1.5,
  },
  smallProfileImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 15,

    borderWidth: 1,
    height: 20,
    margin: 15,
    resizeMode: 'cover',
    width: 20,
  },
  accountSportIcon: {
    alignSelf: 'center',
    height: 40,
    margin: 15,
    marginRight: 5,
    resizeMode: 'contain',
    width: 40,
  },
  subMenuItem: {
    alignSelf: 'center',
    height: 40,
    marginLeft: 45,
    resizeMode: 'contain',
    width: 40,
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
  teamSportView: {
    color: colors.greeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  textContainer: {
    height: 80,
    justifyContent: 'center',
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
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    width: 100,
  },
  separateLine: {
    borderColor: colors.veryLightGray,
    borderWidth: 0.5,
  },

  rulesText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
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
  subItemSeparator: {
    marginLeft: 40,
    marginRight: 20,
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 25,
    width: '30%',
    marginBottom: 5,
    marginLeft: 80,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
});
