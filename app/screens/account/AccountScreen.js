/* eslint-disable array-callback-return */
import React, {
    useEffect, useState, useContext, useLayoutEffect, useRef, useCallback,
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
// import ActionSheet from 'react-native-actionsheet';
// import { useIsDrawerOpen } from '@react-navigation/drawer';
import MarqueeText from 'react-native-marquee';
import firebase from '@react-native-firebase/app';
import ExpanableList from 'react-native-expandable-section-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
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

export default function AccountScreen({ navigation }) {
 const scrollRef = useRef()
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [team, setTeam] = useState([]);
  const [club, setClub] = useState([]);
  // for set/get teams
  const [teamList, setTeamList] = useState([]);
  // for set/get clubs
  const [clubList, setClubList] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(true);

  // Account menu opetions
  const userMenu = [
    { key: 'My Schedule' },
    { key: 'My Sports', member: [{ opetions: 'Add a sport' }] },
    { key: 'My Refereeing', member: [{ opetions: 'Register as a referee' }] },
    { key: 'My Scorekeeping', member: [{ opetions: 'Register as a scorekeeper' }] },
    { key: 'My Teams', member: [{ opetions: 'Create a Team' }] },
    { key: 'My Clubs', member: [{ opetions: 'Create a Club' }] },
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
    { key: 'Currency' },
    { key: 'Setting & Privacy' },
  ];
  const teamMenu = [
    { key: 'My Schedule' },
    { key: 'Members' },
    // {key: 'My Leagues'},
    { key: 'My Clubs', member: [{ opetions: 'Create a Club' }] },
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
    { key: 'My Schedule' },
    { key: 'Members' },
    { key: 'My Teams', member: [{ opetions: 'Create a Team' }] },
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Account',
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NotificationsListScreen');
          }}
          hitSlop={{
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
          }}>
          <ImageBackground
            source={notificationCounter > 0 ? images.notificationBell : images.tab_notification}
            style={styles.headerRightImg}
          >
            {notificationCounter > 0 && <View
            style={notificationCounter > 9 ? styles.eclipseBadge : styles.roundBadge}>
              <Text
              style={styles.notificationCounterStyle}>
                {notificationCounter > 9 ? '9+' : notificationCounter}
              </Text>
            </View>}
          </ImageBackground>
        </TouchableOpacity>
      ),
    });
  }, [navigation, notificationCounter]);

  useEffect(() => {
    const getData = async () => {
      const entity = authContext.entity;
      console.log(
        'LoggedIn entity ::=>',
        authContext?.entity?.auth?.user?.full_name?.length,
      );
      const promises = [getOwnGroupList(entity), getTeamsList(entity)];

      if (entity.role !== 'club') {
        promises.push(getClubList(entity));
      }

      Promise.all(promises).then(() => {
        setloading(false);
      });
    };
    getData();
  }, [authContext.entity, isFocused, navigation]);

  const getParentClub = (item) => {
    setloading(true);
    console.log('Parent group ID::', item.group_id);
    getGroupDetails(item.group_id, authContext)
      .then((response) => {
        console.log('Parent group detail1::', response.payload);
        console.log('Parent group detail2::', response.payload.club);
        if (!response?.payload?.club) {
          setParentGroup(response?.payload?.club);
        } else {
          setParentGroup();
        }
        setloading(false);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getOwnGroupList = async (currentEntity) => {
    getUnreadCount(authContext)
      .then((response) => {
        const { teams } = response.payload;
        const { clubs } = response.payload;
        setTeam(teams);
        setClub(clubs);
        let count = 0;
        ([...clubs, ...teams] || []).map((e) => {
          count += e.unread
        })
        setNotificationCounter(count)
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
  };

  const getTeamsList = async (currentEntity) => {
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
  };

  const getClubList = async () => {
    getJoinedGroups(authContext.entity.uid, authContext)
      .then((response) => {
        setClubList(response.payload.clubs);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onSwitchProfile = async ({ item }) => {
    setloading(true);
    switchProfile(item)
      .then((currentEntity) => {
        // setloading(true);
        switchQBAccount(item, currentEntity);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const switchProfile = async (item) => {
    let currentEntity = authContext.entity;

    if (item.entity_type === 'player') {
      if (currentEntity.obj.entity_type === 'team') {
        team.push(currentEntity.obj);
      } else if (currentEntity.obj.entity_type === 'club') {
        club.push(currentEntity.obj);
      }
      setGroupList([...club, ...team]);
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: 'user',
        obj: item,
      };
      setParentGroup();
    } else {
      if (item.entity_type === 'team') {
        const i = team.indexOf(item);
        if (currentEntity.obj.entity_type === 'player') {
          team.splice(i, 1);
          console.log('Team List::', team);
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
      setGroupList([authContext.entity.auth.user, ...club, ...team]);
    }
    authContext.setEntity({ ...currentEntity });
    Utility.setStorage('authContextEntity', { ...currentEntity });
    return currentEntity;
  };

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    authContext.setEntity({ ...currentEntity });
    Utility.setStorage('authContextEntity', { ...currentEntity });
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
            authContext.setEntity({ ...currentEntity });
            Utility.setStorage('authContextEntity', { ...currentEntity });
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log('Towns Cup', qbRes?.error);
                }
              })
              .catch(() => {
                setloading(false);
              });
          })
          .catch(() => {
            setloading(false);
          });
      })
      .catch(() => {
        setloading(false);
      });
  };

  const onLogout = useCallback(async () => {
      await Utility.clearStorage();
      QBLogout();
      firebase.auth().signOut();
      await authContext.setUser(null);
      await authContext.setEntity(null);
  }, [authContext]);

  const handleLogOut = useCallback(async () => {
    Alert.alert(
      'Towns Cup',
      'Are you sure want to logout?',
      [
        {
          text: 'OK',
          onPress: onLogout,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }, []);

  const handleSections = async (section) => {
    if (section === 'My Schedule') {
      navigation.navigate('ScheduleScreen');
    } else if (section === 'Register as a Referee') {
      navigation.navigate('RegisterReferee');
    } else if (section === 'Register as a personal player') {
      navigation.navigate('RegisterPlayer');
    } else if (section === 'Register as a scorekeeper') {
      navigation.navigate('RegisterScorekeeper');
    } else if (section === 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    } else if (section === 'Currency') {
      navigation.navigate('CurrencySettingScreen');
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
    }
  };

  const handleOptions = async (options) => {
    // navigation.closeDrawer();
    if (options === 'Register as a referee') {
      navigation.navigate('RegisterReferee');
    } else if (options === 'Register as a scorekeeper') {
      navigation.navigate('RegisterScorekeeper');
    } else if (options === 'Add a sport') {
      navigation.navigate('RegisterPlayer');
    } else if (options === 'Create a Team') {
      const entity = authContext.entity;
      if (entity.role === 'user') {
        navigation.navigate('CreateTeamForm1');
      } else {
        navigation.navigate('CreateTeamForm1', { clubObject: group });
      }
    } else if (options === 'Create a Club') {
      navigation.navigate('CreateClubForm1');
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
  };

  const renderSwitchProfile = ({ item, index }) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        scrollRef.current.scrollTo({ x: 0, y: 0 });
        onSwitchProfile({ item, index });
        // navigation.closeDrawer();
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
              style={styles.playerImg}
            />
          </View>
        )}
        {item.entity_type === 'club' && (
          <View style={styles.placeholderView}>
            <Image
              source={
                item.thumbnail ? { uri: item.thumbnail } : images.clubPlaceholder
              }
              style={styles.entityImg}
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
                item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder
              }
              style={styles.entityImg}
            />
            {item.thumbnail ? null : (
              <Text style={styles.oneCharacterText}>
                {item.group_name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        )}

        {item.unread > 0 && (
          <View style={styles.badgeView}>
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
  );

  let placeHolder = images.teamSqure;
  if (authContext.entity.role === 'club') {
    placeHolder = images.club_ph;
  } else if (authContext.entity.role === 'team') {
    placeHolder = images.team_ph;
  } else {
    placeHolder = images.profilePlaceHolder;
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
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
                  name={parentGroup.group_name}
                  groupType={'club'}
                  image={parentGroup.thumbnail && parentGroup.thumbnail}
                />
              </View>
            </View>
          ) : (
            <View></View>
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
                <View style={{ marginLeft: 15, width: Dimensions.get('window').width / 1.6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <MarqueeText
                      style={authContext?.entity?.obj?.background_thumbnail ? [styles.nameText, { alignSelf: 'flex-start' }] : [styles.nameText, { alignSelf: 'flex-start', color: colors.lightBlackColor }]}
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
                        height: 12,
                        width: 12,
                        resizeMode: 'cover',
                        tintColor: authContext?.entity?.obj?.background_thumbnail ? colors.whiteColor : colors.lightBlackColor,
                      }}
                    />
                  </View>
                  <Text
                    style={authContext?.entity?.obj?.background_thumbnail ? [styles.locationText, { alignSelf: 'flex-start' }] : [styles.locationText, { alignSelf: 'flex-start', color: colors.lightBlackColor }]}>
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
                      style={authContext?.entity?.obj?.background_thumbnail ? [styles.nameText, { alignSelf: 'flex-start' }] : [styles.nameText, { alignSelf: 'flex-start', color: colors.lightBlackColor }]}
                      duration={3000}
                      marqueeOnStart
                      loop={true}
                      // marqueeDelay={0}
                      // marqueeResetDelay={1000}
                    >
                        {authContext.entity.obj.group_name || ''}
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
                        height: 12,
                        width: 12,
                        marginLeft: 10,
                        resizeMode: 'cover',
                        tintColor: authContext?.entity?.obj?.background_thumbnail ? colors.whiteColor : colors.lightBlackColor,
                      }}
                    />
                    </View>
                    <Text
                    style={authContext?.entity?.obj?.background_thumbnail ? [styles.locationText, { alignSelf: 'flex-start' }] : [styles.locationText, { alignSelf: 'flex-start', color: colors.lightBlackColor }]}>
                      {authContext.entity.obj.city},{' '}
                      {authContext.entity.obj.state_abbr}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            </View>
        )}

        <View style={styles.separatorLine}></View>

        <ExpanableList
          dataSource={
            (authContext.entity.role === 'team' && teamMenu)
            || (authContext.entity.role === 'club' && clubMenu)
            || (authContext.entity.role === 'user' && userMenu)
          }
          headerKey={'key'}
          memberKey="member"
          renderRow={(rowItem, rowId, sectionId) => (
            <>
              {authContext.entity.role === 'user' && sectionId === 1 && (
                <FlatList
                  data={authContext?.user?.registered_sports}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={styles.listContainer}
                      onPress={() => {
                        // navigation.closeDrawer();
                        // alert('Game Pressed');
                      }}>
                      <View style={styles.entityTextContainer}>
                        <Image
                          source={images.mySports}
                          style={styles.smallProfileImg}
                        />
                        <Text style={styles.entityName}>{item.sport_name}</Text>
                      </View>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              )}
              {authContext.entity.role === 'user' && sectionId === 2 && (
                <FlatList
                  data={authContext?.entity?.auth?.user?.referee_data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={styles.listContainer}
                      onPress={() => {
                        // navigation.closeDrawer();
                        // alert('Referee Pressed');
                      }}>
                      <View style={styles.entityTextContainer}>
                        <Image
                          source={images.myRefereeing}
                          style={styles.smallProfileImg}
                        />
                        <Text style={styles.entityName}>
                          {_.startCase(item?.sport_name)}
                        </Text>
                      </View>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              )}
              {authContext.entity.role === 'user' && sectionId === 3 && (
                <FlatList
                  data={authContext?.entity?.auth?.user?.scorekeeper_data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={styles.listContainer}
                      onPress={() => {
                        // navigation.closeDrawer();
                        // alert('Referee Pressed');
                      }}>
                      <View style={styles.entityTextContainer}>
                        <Image
                          source={images.myRefereeing}
                          style={styles.smallProfileImg}
                        />
                        <Text style={styles.entityName}>
                          {_.startCase(item?.sport_name)}
                        </Text>
                      </View>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              )}
              {authContext.entity.role === 'user'
                && (sectionId === 4 || sectionId === 5) && (
                  <FlatList
                    data={sectionId === 4 ? teamList : clubList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                        style={styles.listContainer}
                        onPress={() => {
                          navigation.navigate('HomeScreen', {
                                uid: group.group_id,
                                backButtonVisible: true,
                                menuBtnVisible: false,
                                role: group.entity_type,
                          });
                        }}>
                        <View style={styles.entityTextContainer}>
                          {item.entity_type === 'team' && (
                            <Image
                              source={
                                item.thumbnail
                                  ? { uri: item.thumbnail }
                                  : images.teamPlaceholder
                              }
                              style={styles.smallProfileImg}
                            />
                          )}
                          {item.entity_type === 'club' && (
                            <Image
                              source={
                                item.thumbnail
                                  ? { uri: item.thumbnail }
                                  : images.clubPlaceholder
                              }
                              style={styles.smallProfileImg}
                            />
                          )}
                          <Text style={styles.entityName}>
                            {item.group_name}
                          </Text>
                          <Text style={styles.teamSportView}>
                            {' '}
                            {item.sport}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                    scrollEnabled={false}
                  />
                )}
              {authContext.entity.role === 'club' && sectionId === 2 && (
                <FlatList
                  data={teamList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', rowItem.rowId.sectionId);
                      }}>
                      <View style={styles.entityTextContainer}>
                        <Image
                          source={
                            item.thumbnail
                              ? { uri: item.thumbnail }
                              : images.teamPlaceholder
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
                  )}
                  // ItemSeparatorComponent={() => (
                  //   <View style={styles.separatorLine}></View>
                  // )}
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
                  <Image
                    source={images.registerReferee}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Register as a scorekeeper' && (
                  <Image
                    source={images.registerReferee}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Create a Team' && (
                  <Image
                    source={images.createTeam}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Create a Club' && (
                  <Image
                    source={images.createClub}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Create a League' && (
                  <Image
                    source={images.createLeague}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Payment Method' && (
                  <Image
                    source={images.Payment_method}
                    style={styles.subMenuItem}
                  />
                )}

                {rowItem.opetions === 'Payout Method' && (
                  <Image
                    source={images.Payout_method}
                    style={styles.subMenuItem}
                  />
                )}
                {rowItem.opetions === 'Invoicing' && (
                  <Image source={images.Invoicing} style={styles.subMenuItem} />
                )}
                {rowItem.opetions === 'Transactions' && (
                  <Image
                    source={images.Transations}
                    style={styles.subMenuItem}
                  />
                )}

                <Text style={styles.listItems}>{rowItem.opetions}</Text>
                <Image source={images.nextArrow} style={styles.nextArrow} />
              </TouchableWithoutFeedback>
              <View style={styles.halfSeparatorLine} />
            </>
          )}
          renderSectionHeaderX={(section) => (
            <>
              <TouchableWithoutFeedback
                style={styles.listContainer}
                onPress={() => {
                  handleSections(section);
                }}>
                {section === 'My Schedule' && (
                  <Image source={images.mySchedule} style={styles.menuItem} />
                )}
                {section === 'My Sports' && (
                  <Image source={images.mySports} style={styles.menuItem} />
                )}
                {section === 'My Refereeing' && (
                  <Image source={images.myRefereeing} style={styles.menuItem} />
                )}
                {section === 'My Scorekeeping' && (
                  <Image source={images.myRefereeing} style={styles.menuItem} />
                )}
                {section === 'My Teams' && (
                  <Image source={images.myTeams} style={styles.menuItem} />
                )}
                {section === 'My Clubs' && (
                  <Image source={images.myClubs} style={styles.menuItem} />
                )}
                {section === 'My Leagues' && (
                  <Image source={images.myLeagues} style={styles.menuItem} />
                )}
                {section === 'Payment & Payout' && (
                  <Image
                    source={images.paymentPayout}
                    style={styles.menuItem}
                  />
                )}
                {section === 'Currency' && (
                  <Image
                    source={images.paymentPayout}
                    style={styles.menuItem}
                  />
                )}
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSwitchProfile}
          // ItemSeparatorComponent={() => (
          //   <View style={styles.separatorLine}></View>
          // )}
          scrollEnabled={false}
        />
        <View style={styles.separatorView}/>
        <TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={handleLogOut}>
          <Image source={images.logoutIcon} style={styles.switchAccountIcon} />
          <Text style={styles.listItems}>Log out</Text>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </TouchableWithoutFeedback>
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
    right: 10,
    top: 10,
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
    // backgroundColor:'red',
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
    height: 30,
    marginRight: 20,
    resizeMode: 'cover',
    width: 30,
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
});
