/* eslint-disable array-callback-return */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
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
import _ from 'lodash';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

// import ActionSheet from 'react-native-actionsheet';
// import { useIsDrawerOpen } from '@react-navigation/drawer';
import MarqueeText from 'react-native-marquee';
import firebase from '@react-native-firebase/app';
import ExpanableList from 'react-native-expandable-section-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';

import {
  getGroupDetails,
  getJoinedGroups,
  getTeamsOfClub,
} from '../../api/Groups';

import { getUnreadCount } from '../../api/Notificaitons';

import * as Utility from '../../utils/index';

import images from '../../Constants/ImagePath';
import TCNavigationHeader from '../../components/TCNavigationHeader';
import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';
import strings from '../../Constants/String';
import Header from '../../components/Home/Header';
import TCGradientButton from '../../components/TCGradientButton';
import TCThinDivider from '../../components/TCThinDivider';

export default function AccountScreen({ navigation, route }) {
  const scrollRef = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [isSportCreateModalVisible, setIsSportCreateModalVisible] = useState(
    false,
  );
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [team, setTeam] = useState([]);
  const [club, setClub] = useState([]);

  const [sportsSelection, setSportsSelection] = useState();
  const [sports, setSports] = useState('');
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  // for set/get teams
  const [teamList, setTeamList] = useState([]);
  // for set/get clubs
  const [clubList, setClubList] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(false);

  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [createEntity, setCreateEntity] = useState('');

  // Account menu opetions
  const userMenu = [
    { key: 'Reservations' },
    { key: 'Manage Challenge' },
    { key: 'Sports', member: [{ opetions: 'Add a sport' }] },
    { key: 'Refereeing', member: [{ opetions: 'Register as a referee' }] },
    { key: 'Scorekeeping', member: [{ opetions: 'Register as a scorekeeper' }] },
    { key: 'Teams', member: [{ opetions: 'Create Team' }] },
    { key: 'Clubs', member: [{ opetions: 'Create Club' }] },
    // {key: 'My Leagues', member:[{opetions: 'Create a League'}]},
    // {key: 'Register as a Referee'},
    // {key: 'Register as a personal player'},
    // {key: 'Create Group'},
    // {key: 'Reservations'},
    {
      key: 'Payment & Payout',
      member: [
        { opetions: 'Payment Method' },
        { opetions: 'Payout Method' },
        { opetions: 'Invoicing' },
        { opetions: 'Transactions' },
      ],
    },
    // { key: 'Currency' },
    { key: 'Setting & Privacy' },
  ];
  const teamMenu = [
    { key: 'Reservations' },
    { key: 'Manage Challenge' },
    { key: 'Members' },
    // {key: 'My Leagues'},
    // { key: 'Clubs', member: [{ opetions: 'Create Club' }] },
    {
      key: 'Payment & Payout',
      member: [
        { opetions: 'Payment Method' },
        { opetions: 'Payout Method' },
        { opetions: 'Invoicing' },
        { opetions: 'Transactions' },
      ],
    },
  ];
  const clubMenu = [
    { key: 'Reservations' },
    { key: 'Members' },
    { key: 'Teams', member: [{ opetions: 'Create Team' }] },
    // {key: 'My Leagues'},
    // {key: 'Invite Teams'},
    {
      key: 'Payment & Payout',
      member: [
        { opetions: 'Payment Method' },
        { opetions: 'Payout Method' },
        { opetions: 'Transactions' },
      ],
    },
  ];

  const renderTopRightNotificationButton = useMemo(
    () => (
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
    ),
    [navigation, notificationCounter],
  );

  const getData = () => new Promise((resolve, reject) => {
      const entity = authContext.entity;
      const promises = [
        getNotificationUnreadCount(entity),
        getTeamsList(entity),
      ];
      if (entity.role !== 'club') promises.push(getClubList(entity));
      Promise.all(promises)
        .then(() => resolve(true))
        // eslint-disable-next-line prefer-promise-reject-errors
        .catch(() => reject('error'));
    });

  useEffect(() => {
    console.log('Auth:=>', authContext?.entity);
    if (isFocused) {
      setloading(true);
      getData().then(() => {
        setloading(false);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (route?.params?.createdSportName) {
      setIsSportCreateModalVisible(true);
    }
  }, [route?.params?.createdSportName]);

  useEffect(() => {
    getData();
  }, []);

  const getParentClub = useCallback(
    (item) => {
      getGroupDetails(item.group_id, authContext)
        .then((response) => {
          if (!response?.payload?.club) {
            setParentGroup(response?.payload?.club);
          } else {
            setParentGroup();
          }
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
  );

  const getNotificationUnreadCount = useCallback(
    (currentEntity) => {
      getUnreadCount(authContext)
        .then((response) => {
          const { teams } = response.payload;
          const { clubs } = response.payload;
          const switchEntityObject = [...clubs, ...teams].filter(
            (e) => e.group_id === authContext.entity.uid,
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
            setGroupList([currentEntity.auth.user, ...clubs, ...updatedTeam]);
          } else if (authContext.entity.role === 'club') {
            const updatedClub = clubs.filter(
              (item) => item.group_id !== authContext.entity.uid,
            );
            setGroupList([currentEntity.auth.user, ...updatedClub, ...teams]);
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
  );

  const getTeamsList = useCallback(
    (currentEntity) => {
      if (currentEntity.role === 'club') {
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
        getJoinedGroups(authContext.entity.uid, authContext)
          .then((response) => {
            setTeamList(response.payload.teams);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    },
    [authContext],
  );

  const getClubList = useCallback(() => {
    getJoinedGroups(authContext.entity.uid, authContext)
      .then((response) => {
        setClubList(response.payload.clubs);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  const switchProfile = useCallback(
    async (item) => {
      let currentEntity = authContext.entity;
      delete currentEntity?.QB;
      if (item.entity_type === 'player') {
        if (currentEntity.obj.entity_type === 'team') {
          team.push(currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.push(currentEntity.obj);
        }
        // setGroupList([...club, ...team]);
        currentEntity = {
          ...currentEntity,
          uid: item.user_id,
          role: 'user',
          obj: item,
        };
        setParentGroup();
      } else if (item.entity_type === 'team') {
        const i = team.indexOf(item);
        if (currentEntity.obj.entity_type === 'player') {
          team.splice(i, 1);
        } else if (currentEntity.obj.entity_type === 'team') {
          team.splice(i, 1, currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.push(currentEntity.obj);
        }
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: 'team',
          obj: item,
        };
        getParentClub(item);
      } else if (item.entity_type === 'club') {
        const i = club.indexOf(item);
        if (currentEntity.obj.entity_type === 'player') {
          club.splice(i, 1);
        } else if (currentEntity.obj.entity_type === 'team') {
          club.splice(i, 1);
          team.push(currentEntity.obj);
        } else if (currentEntity.obj.entity_type === 'club') {
          club.splice(i, 1, currentEntity.obj);
        }
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: 'club',
          obj: item,
        };
        setParentGroup();
        setGroup(item);
      }
      authContext.setEntity({ ...currentEntity });
      await Utility.setStorage('authContextEntity', { ...currentEntity });
      return currentEntity;
    },
    [authContext, club, getParentClub, team],
  );

  const switchQBAccount = useCallback(
    async (accountData, entity) => {
      let currentEntity = entity;
      const entityType = accountData?.entity_type;
      const uid = entityType === 'player' ? 'user_id' : 'group_id';
      QBLogout()
        .then(() => {
          const {
 USER, CLUB, LEAGUE, TEAM,
 } = QB_ACCOUNT_TYPE;
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
            .then(async (res) => {
              currentEntity = {
                ...currentEntity,
                QB: { ...res.user, connected: true, token: res?.session?.token },
              };
              QBconnectAndSubscribe(currentEntity)
                .then(async (qbRes) => {
                  authContext.setEntity({ ...currentEntity });
                  await Utility.setStorage('authContextEntity', {
                    ...currentEntity,
                  });
                  setloading(false);
                  if (qbRes?.error) console.log('Towns Cup', qbRes?.error);
                })
                .catch(async () => {
                  authContext.setEntity({ ...currentEntity });
                  await Utility.setStorage('authContextEntity', {
                    ...currentEntity,
                  });
                  setloading(false);
                });
            })
            .catch(async () => {
              authContext.setEntity({ ...currentEntity });
              await Utility.setStorage('authContextEntity', { ...currentEntity });
              setloading(false);
            });
        })
        .catch(async (error) => {
          console.log('QB Issue', error);
          setloading(false);
        });
    },
    [authContext],
  );

  const onSwitchProfile = useCallback(
    async ({ item }) => {
      setloading(true);
      switchProfile(item)
        .then((currentEntity) => {
          scrollRef.current.scrollTo({ x: 0, y: 0 });
          setloading(false);
          authContext.setEntity({ ...currentEntity });
          Utility.setStorage('authContextEntity', { ...currentEntity });
          switchQBAccount(item, currentEntity);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext, switchProfile, switchQBAccount],
  );

  const onLogout = useCallback(async () => {
    QBLogout();
    firebase.auth().signOut();
    await Utility.clearStorage();
    await authContext.setUser(null);
    await authContext.setEntity(null);
  }, [authContext]);

  const handleLogOut = useCallback(async () => {
    Alert.alert(
      'Towns Cup',
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
      { cancelable: false },
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
    } else if (section === 'Setting & Privacy') {
      const entity = authContext.entity;
      if (entity.role === 'user') {
        navigation.navigate('UserSettingPrivacyScreen');
      } else {
        navigation.navigate('GroupSettingPrivacyScreen', {
          role: entity.role,
        });
      }
    } else if (section === 'Members') {
      const entity = authContext.entity;
      navigation.navigate('GroupMembersScreen', { groupID: entity.uid });
    } else if (section === 'Manage Challenge') {
      const entity = authContext.entity;
      if (entity.role === 'user') {
        console.log('sections');
        setVisibleSportsModal(true);
      } else {
        navigation.navigate('ManageChallengeScreen');
      }
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
        setIsRulesModalVisible(true);
      } else if (options === 'Create Club') {
        setCreateEntity('club');
        setIsRulesModalVisible(true);
      } else if (options === 'Payment Method') {
        navigation.navigate('Account', {
          screen: 'PaymentMethodsScreen',
          params: {
            comeFrom: 'AccountScreen',
          },
        });
      } else if (options === 'Payout Method') {
        navigation.navigate('PayoutMethodScreen');
      }
    },
    [authContext.entity, group, navigation],
  );

  const renderSportsList = useCallback(
    ({ item }) => (
      <View
        style={styles.listContainer}
        onPress={() => {
          // navigation.closeDrawer();
          // alert('Game Pressed');
        }}>
        <View style={styles.entityTextContainer}>
          <Image source={images.mySports} style={styles.smallProfileImg} />
          <Text style={styles.entityName}>{item.sport_name}</Text>
        </View>
      </View>
    ),
    [],
  );

  const renderRefereesList = useCallback(
    ({ item }) => (
      <View
        style={styles.listContainer}
        onPress={() => {
          // navigation.closeDrawer();
          // alert('Referee Pressed');
        }}>
        <View style={styles.entityTextContainer}>
          <Image source={images.myRefereeing} style={styles.smallProfileImg} />
          <Text style={styles.entityName}>{_.startCase(item?.sport_name)}</Text>
        </View>
      </View>
    ),
    [],
  );

  const renderScorekeepersList = useCallback(
    ({ item }) => (
      <View
        style={styles.listContainer}
        onPress={() => {
          // navigation.closeDrawer();
          // alert('Referee Pressed');
        }}>
        <View style={styles.entityTextContainer}>
          <Image source={images.myRefereeing} style={styles.smallProfileImg} />
          <Text style={styles.entityName}>{_.startCase(item?.sport_name)}</Text>
        </View>
      </View>
    ),
    [],
  );

  const keyExtractorID = useCallback((item, index) => index.toString(), []);

  const renderSwitchProfile = useCallback(
    ({ item, index }) => (
      <TouchableWithoutFeedback
        style={styles.listContainer}
        onPress={() => {
          setloading(true);
          onSwitchProfile({ item, index });
        }}>
        <View>
          {item.entity_type === 'player' && (
            <View style={styles.imageContainer}>
              <Image
                source={
                  item.thumbnail
                    ? { uri: item.thumbnail }
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
                    ? { uri: item.thumbnail }
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
                    ? { uri: item.thumbnail }
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
              <Text style={styles.badgeCounter}>{item.unread}</Text>
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
    ({ item }) => (
      <TouchableWithoutFeedback
        style={styles.listContainer}
        onPress={() => {
          const uid = item?.entity_type === 'player' ? item?.user_id : item?.group_id;
          if (uid && item?.entity_type) {
            navigation.navigate('HomeScreen', {
              uid,
              backButtonVisible: true,
              role: item?.entity_type === 'player' ? 'user' : item?.entity_type,
            });
          }
        }}>
        <View style={styles.entityTextContainer}>
          {item.entity_type === 'team' && (
            <Image
              source={
                item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder
              }
              style={styles.smallProfileImg}
            />
          )}
          {item.entity_type === 'club' && (
            <Image
              source={
                item.thumbnail ? { uri: item.thumbnail } : images.clubPlaceholder
              }
              style={styles.smallProfileImg}
            />
          )}
          <Text
            style={
              item.group_name.length > 26
                ? [styles.entityName, { width: wp('50%') }]
                : styles.entityName
            }
            numberOfLines={1}>
            {item.group_name}
          </Text>
          <Text style={styles.teamSportView}> {item.sport}</Text>
        </View>
      </TouchableWithoutFeedback>
    ),
    [group.entity_type, group.group_id, navigation],
  );

  const renderTeamsList = useCallback(
    ({ item }) => (
      <TouchableWithoutFeedback
        style={styles.listContainer}
        onPress={() => {
          console.log('Pressed Team..');
        }}>
        <View style={styles.entityTextContainer}>
          <Image
            source={
              item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder
            }
            style={styles.smallProfileImg}
          />
          <Text style={styles.entityName}>{item.group_name}</Text>
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
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const renderMenuItems = useCallback(
    (rowItem, rowId, sectionId) => (
      <>
        {authContext.entity.role === 'user' && sectionId === 2 && (
          <FlatList
            data={authContext?.entity?.auth?.user?.registered_sports}
            keyExtractor={keyExtractorID}
            renderItem={renderSportsList}
            scrollEnabled={false}
          />
        )}
        {authContext.entity.role === 'user' && sectionId === 3 && (
          <FlatList
            data={authContext?.entity?.auth?.user?.referee_data}
            keyExtractor={keyExtractorID}
            renderItem={renderRefereesList}
            scrollEnabled={false}
          />
        )}
        {authContext.entity.role === 'user' && sectionId === 4 && (
          <FlatList
            data={authContext?.entity?.auth?.user?.scorekeeper_data}
            keyExtractor={keyExtractorID}
            renderItem={renderScorekeepersList}
            scrollEnabled={false}
          />
        )}
        {authContext.entity.role === 'user'
          && (sectionId === 5 || sectionId === 6) && (
            <FlatList
              data={sectionId === 5 ? teamList : clubList}
              keyExtractor={keyExtractorID}
              renderItem={renderEntityList}
              scrollEnabled={false}
            />
          )}
        {authContext.entity.role === 'club' && sectionId === 2 && (
          <FlatList
            data={teamList}
            keyExtractor={keyExtractorID}
            renderItem={renderTeamsList}
            scrollEnabled={false}
          />
        )}

        <View style={styles.halfSeparatorLine} />

        <TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={() => {
            handleOptions(rowItem.opetions);
          }}>
          {rowItem.opetions === 'Add a sport' && (
            <Image source={images.addSport} style={styles.subMenuItem} />
          )}
          {rowItem.opetions === 'Register as a referee' && (
            <Image source={images.registerReferee} style={styles.subMenuItem} />
          )}
          {rowItem.opetions === 'Register as a scorekeeper' && (
            <Image source={images.registerReferee} style={styles.subMenuItem} />
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
          {rowItem.opetions === 'Payment Method' && (
            <Image source={images.Payment_method} style={styles.subMenuItem} />
          )}

          {rowItem.opetions === 'Payout Method' && (
            <Image source={images.Payout_method} style={styles.subMenuItem} />
          )}
          {rowItem.opetions === 'Invoicing' && (
            <Image source={images.Invoicing} style={styles.subMenuItem} />
          )}
          {rowItem.opetions === 'Transactions' && (
            <Image source={images.Transations} style={styles.subMenuItem} />
          )}

          <Text style={styles.listItems}>{rowItem.opetions}</Text>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </TouchableWithoutFeedback>
        <View style={styles.halfSeparatorLine} />
      </>
    ),
    [
      authContext.entity?.auth?.user?.referee_data,
      authContext.entity?.auth?.user?.registered_sports,
      authContext.entity?.auth?.user?.scorekeeper_data,
      authContext.entity.role,
      clubList,
      handleOptions,
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
    placeHolder = images.club_ph;
  } else if (authContext.entity.role === 'team') {
    placeHolder = images.team_ph;
  } else {
    placeHolder = images.profilePlaceHolder;
  }
  const renderTopHeader = useMemo(
    () => (
      <>
        <Header
          leftComponent={
            <View>
              <FastImage
                source={images.tc_message_top_icon}
                resizeMode={'contain'}
                style={styles.backImageStyle}
              />
            </View>
          }
          showBackgroundColor={true}
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Account</Text>
          }
          rightComponent={renderTopRightNotificationButton}
        />
        <View style={styles.separateLine} />
      </>
    ),
    [renderTopRightNotificationButton],
  );

  const onNextPressed = () => {
    setIsRulesModalVisible(false);
    const entity = authContext.entity;
    if (createEntity === 'team') {
      if (entity.role === 'user') {
        navigation.navigate('CreateTeamForm1');
      } else {
        navigation.navigate('CreateTeamForm1', { clubObject: group });
      }
    }
    if (createEntity === 'club') {
      navigation.navigate('CreateClubForm1');
    }
  };

  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item?.sport_name);
        setVisibleSportsModal(false);
        setSports(item?.sport_name);
        setTimeout(() => {
          navigation.navigate('ManageChallengeScreen', { sportName: sports });
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {sportsSelection === item?.sport_name ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderTopHeader}
      <ActivityLoader visible={loading} />
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
                  // backgroundColor: 'red',
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
                  ? { uri: authContext?.entity?.obj?.background_thumbnail }
                  : images.ImageBackground
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
                <Image
                  source={
                    authContext?.entity?.obj?.thumbnail || ''
                      ? { uri: authContext.entity.obj.thumbnail }
                      : placeHolder
                  }
                  style={styles.profileImg}
                />
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
                          ? [styles.nameText, { alignSelf: 'flex-start' }]
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
                      {authContext?.entity?.auth?.user?.full_name || ''}
                    </MarqueeText>

                    <Image
                      source={images.arrowGraterthan}
                      style={{
                        height: 14,
                        width: 8,
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
                        ? [styles.locationText, { alignSelf: 'flex-start' }]
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
        {(authContext.entity.role === 'team'
          || authContext.entity.role === 'club') && (
            <View style={styles.profileView}>
              <ImageBackground
              source={
                authContext?.entity?.obj?.background_thumbnail
                  ? { uri: authContext?.entity?.obj?.background_thumbnail }
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
                  marginLeft: 25,
                  marginRight: 25,
                  alignContent: 'center',
                }}>
                  <Image
                  source={
                    authContext?.entity?.obj?.thumbnail
                      ? { uri: authContext?.entity?.obj?.thumbnail }
                      : placeHolder
                  }
                  style={styles.profileImg}
                />
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
                          ? [styles.nameText, { alignSelf: 'flex-start' }]
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
                        marginLeft: 10,
                        resizeMode: 'cover',
                      }}
                    />
                      <Image
                      source={images.arrowGraterthan}
                      style={{
                        height: 14,
                        width: 8,
                        marginLeft: 10,
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
                        ? [styles.locationText, { alignSelf: 'flex-start' }]
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
            (authContext.entity.role === 'team' && teamMenu)
            || (authContext.entity.role === 'club' && clubMenu)
            || (authContext.entity.role === 'user' && userMenu)
          }
          headerKey={'key'}
          memberKey="member"
          renderRow={renderMenuItems}
          ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
          renderSectionHeaderX={(section) => (
            <>
              <TouchableWithoutFeedback
                style={styles.listContainer}
                onPress={() => {
                  handleSections(section);
                }}>
                {section === 'Reservations' && (
                  <Image source={images.mySchedule} style={styles.menuItem} />
                )}
                {section === 'Sports' && (
                  <Image source={images.mySports} style={styles.menuItem} />
                )}
                {section === 'Refereeing' && (
                  <Image source={images.myRefereeing} style={styles.menuItem} />
                )}
                {section === 'Scorekeeping' && (
                  <Image source={images.myRefereeing} style={styles.menuItem} />
                )}
                {section === 'Teams' && (
                  <Image source={images.myTeams} style={styles.menuItem} />
                )}
                {section === 'Clubs' && (
                  <Image source={images.myClubs} style={styles.menuItem} />
                )}
                {section === 'Leagues' && (
                  <Image source={images.myLeagues} style={styles.menuItem} />
                )}
                {section === 'Manage Challenge' && (
                  <Image
                    source={images.manageChallengeIcon}
                    style={styles.menuItem}
                  />
                )}
                {section === 'Payment & Payout' && (
                  <Image
                    source={images.paymentPayout}
                    style={styles.menuItem}
                  />
                )}
                {/* {section === 'Currency' && (
                  <Image
                    source={images.paymentPayout}
                    style={styles.menuItem}
                  />
                )} */}
                {section === 'Setting & Privacy' && (
                  <Image
                    source={images.SettingPrivacy}
                    style={styles.menuItem}
                  />
                )}
                {section === 'Members' && (
                  <Image source={images.Members} style={styles.menuItem} />
                )}
                <Text style={styles.listItems}>{section}</Text>
                <Image source={images.nextArrow} style={styles.nextArrow} />
              </TouchableWithoutFeedback>
              <View style={styles.separatorLine} />
            </>
          )}
        />

        {groupList.length > 0 && (
          <>
            <View style={styles.separatorView}></View>
            <View style={{ flexDirection: 'row' }}>
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
        <TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={handleLogOut}>
          <Image source={images.logoutIcon} style={styles.switchAccountIcon} />
          <Text style={styles.listItems}>Log out</Text>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </TouchableWithoutFeedback>

        {/* Sport created modal */}
        <Modal
          isVisible={isSportCreateModalVisible}
          backdropColor="black"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.blackOpacityColor,
            flex: 1,
          }}
          hasBackdrop
          onBackdropPress={() => setIsSportCreateModalVisible(false)}
          backdropOpacity={0}>
          <View style={styles.modalContainerViewStyle}>
            <Image style={styles.background} source={images.orangeLayer} />
            <Image style={styles.background} source={images.entityCreatedBG} />
            <TouchableOpacity
              onPress={() => setIsSportCreateModalVisible(false)}
              style={{ alignSelf: 'flex-end' }}>
              <Image
                source={images.cancelWhite}
                style={{
                  marginTop: 25,
                  marginRight: 25,
                  height: 15,
                  width: 15,
                  resizeMode: 'contain',
                  tintColor: colors.whiteColor,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 77,
                  width: 77,
                  backgroundColor: colors.whiteColor,
                  borderRadius: 154,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.profilePlaceHolder}
                  style={styles.groupsImg}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}></View>
              <Text style={styles.foundText}>
                {`${route?.params?.createdSportName}\nadded as your sports`}
              </Text>
            </View>
            <Text style={styles.manageChallengeDetailTitle}>
              {strings.manageChallengeDetailText}
            </Text>
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                Alert.alert('Manage challenge');
              }}>
              <Text style={styles.goToProfileTitle}>
                {strings.manageChallengeText}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Sport created modal */}

        {/* Rules notes modal */}
        <Modal
          isVisible={isRulesModalVisible} // isRulesModalVisible
          backdropColor="black"
          onBackdropPress={() => setIsRulesModalVisible(false)}
          onRequestClose={() => setIsRulesModalVisible(false)}
          backdropOpacity={0}
          style={{
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 1.7,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
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
            <View style={{ flex: 1 }}>
              <ScrollView>
                <Text style={[styles.rulesText, { margin: 15 }]}>
                  {'When your team creates a club:'}
                </Text>
                <Text style={[styles.rulesText, { marginLeft: 15 }]}>
                  {'\n• your team will belong to the club initially.'}
                </Text>
                <Text style={[styles.rulesText, { marginLeft: 15 }]}>
                  {'\n• your team can leave the club anytime later.'}
                </Text>
                <Text style={[styles.rulesText, { marginLeft: 15 }]}>
                  {
                    '\n• the admins of your team will be the admins of the club initially.'
                  }
                </Text>
              </ScrollView>
            </View>
            <TCGradientButton
              isDisabled={false}
              title={strings.nextTitle}
              style={{ marginBottom: 30 }}
              onPress={onNextPressed}
            />
          </View>
        </Modal>

        {/* Rules notes modal */}

        <Modal
          isVisible={visibleSportsModal}
          backdropColor="black"
          onBackdropPress={() => setVisibleSportsModal(false)}
          onRequestClose={() => setVisibleSportsModal(false)}
          backdropOpacity={0}
          style={{
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
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
              shadowOffset: { width: 0, height: 1 },
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
              data={authContext?.entity?.obj?.registered_sports}
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
    fontFamily: fonts.RBold,
    fontSize: 11,
    height: 17,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 17,
  },
  badgeView: {
    backgroundColor: 'red',
    borderRadius: 10,
    height: 20,

    position: 'absolute',
    width: 20,
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
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 1,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  entityProfileImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 1,
    height: 40,
    margin: 15,
    resizeMode: 'cover',
    width: 40,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
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
    height: 40,
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 20,
    // width: wp('86%'),
  },
  halfSeparatorLine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    marginRight: 20,
    width: wp('82%'),
  },
  imageContainer: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
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
    height: 25,
    marginLeft: 20,
    resizeMode: 'contain',
    width: 25,
  },
  nameText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 20,
    marginRight: 10,
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',

    tintColor: colors.grayColor,

    width: 15,
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

    borderColor: colors.offwhite,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    margin: 15,
    width: 50,
  },
  playerImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 3,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  playerProfileImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 20,

    borderWidth: 3,
    height: 40,
    margin: 15,
    resizeMode: 'cover',
    width: 40,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,

    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
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
    backgroundColor: colors.grayBackgroundColor,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  separatorView: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 10,
    width: wp('100%'),
  },
  smallProfileImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 15,

    borderWidth: 1,
    height: 25,
    margin: 15,
    resizeMode: 'cover',
    width: 25,
  },
  subMenuItem: {
    alignSelf: 'center',
    height: 25,
    marginLeft: 55,
    resizeMode: 'contain',
    width: 25,
  },
  switchAccount: {
    flex: 1,
    padding: 15,
    paddingLeft: 10,
    fontSize: wp('4%'),
    // fontFamily: fonts.RRegular,
    color: colors.grayColor,
  },
  switchAccountIcon: {
    alignSelf: 'center',
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain',
    width: 30,
  },
  teamSportView: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'cover',
    width: 20,
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
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
  },

  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  foundText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
    marginTop: 20,
  },
  groupsImg: {
    height: 75,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
  },

  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,
    marginBottom: wp('15%'),
    width: '92%',
  },
  manageChallengeDetailTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  modalContainerViewStyle: {
    height: '94%',
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  rulesText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  backImageStyle: {
    height: 30,
    width: 30,
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
});
