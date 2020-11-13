import React, {
  useEffect, useState, useContext, useLayoutEffect,
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
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// import ActionSheet from 'react-native-actionsheet';
import firebase from '@react-native-firebase/app';
import ExpanableList from 'react-native-expandable-section-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';

import { getGroupDetails, getJoinedGroups, getTeamsOfClub } from '../../api/Groups';

import { getUnreadCount } from '../../api/Notificaitons';

import * as Utility from '../../utils/index';

import images from '../../Constants/ImagePath';
import TCNavigationHeader from '../../components/TCNavigationHeader';
import {
  QB_ACCOUNT_TYPE, QBconnectAndSubscribe, QBlogin, QBLogout,
} from '../../utils/QuickBlox';

export default function AccountScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [role, setRole] = useState('user');
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [team, setTeam] = useState([]);
  const [club, setClub] = useState([]);

  const [authUser, setAuthUser] = useState({});
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
      // headerRight: () => (
      //   <TouchableWithoutFeedback onPress={() => connectChat()}>
      //     <Image
      //       source={PATH.messageBox_account}
      //       style={styles.headerRightImg}
      //     />
      //   </TouchableWithoutFeedback>
      // ),
    });
  }, [navigation]);
  useEffect(() => {
    console.log('EFFECT CALLED:: ACCOUNT');
    const getData = async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setAuthUser(entity);
      if (entity.role === 'user') {
        setRole('user');
      } else if (entity.role === 'team') {
        setRole('team');
      } else if (entity.role === 'club') {
        setRole('club');
      }
      Promise.all([
        getOwnGroupList(),
        getTeamsList(),
        getClubList(),
      ]).then(() => {
        setloading(false);
      });
    }
    getData()
  }, []);

  const getParentClub = (item) => {
    getGroupDetails(item.group_id).then((response) => {
      if (response.payload.club !== undefined) {
        setParentGroup(response.payload.club);
      } else {
        setParentGroup(null);
      }
    })
      .catch((error) => {
        Alert.alert(error)
      })
  };
  const getOwnGroupList = async () => {
    getUnreadCount().then((response) => {
      const { teams } = response.payload;
      const { clubs } = response.payload;
      console.log('ENTITY DATA:::::::', response.payload);
      // setEntities([...clubs, ...teams]);
      setTeam(teams);
      setClub(clubs);
      // if (authUser.role === 'user') {
      setGroupList([...clubs, ...teams]);
      // } else if (authUser.role === 'team') {
      //   const updatedTeam = team.filter((item) => item.group_id !== authUser.uid);
      //   setGroupList([authUser.auth.user, ...club, ...updatedTeam]);
      // } else if (authUser.role === 'club') {
      //   const updatedClub = club.filter((item) => item.group_id !== authUser.uid);
      //   setGroupList([authUser.auth.user, ...updatedClub, ...team]);
      // }
    })
      .catch((error) => {
        Alert.alert(error)
      })
  };
  const getTeamsList = async () => {
    const loggedInEntity = await Utility.getStorage('loggedInEntity');
    if (loggedInEntity.role === 'club') {
      getTeamsOfClub(loggedInEntity.uid).then((response) => {
        setTeamList(response.payload);
      }).catch((error) => {
        Alert.alert(error)
      })
    } else {
      getJoinedGroups().then((response) => {
        console.log('JOINED response::', response)

        setTeamList(response.payload.teams);
      }).catch((error) => {
        Alert.alert(error)
      })
    }
  };

  const getClubList = async () => {
    getJoinedGroups().then((response) => {
      setClubList(response.payload.clubs);
    }).catch((error) => {
      Alert.alert(error)
    })
  };
  const switchProfile = async ({ item }) => {
    console.log('Item :-', item);
    setloading(true);

    let currentEntity = await Utility.getStorage('loggedInEntity');
    if (item.entity_type === 'player') {
      if (currentEntity.obj.entity_type === 'team') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        team.push(currentEntity.obj)
        setGroupList([...club, ...team]);
      } else if (currentEntity.obj.entity_type === 'club') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        club.push(currentEntity.obj)
        setGroupList([...club, ...team]);
      }
      currentEntity = {
        ...currentEntity, uid: item.group_id, role: 'user', obj: item,
      }
      setParentGroup(null);
      await Utility.setStorage('loggedInEntity', currentEntity);
      setAuthUser(currentEntity)
      setRole('user')
    } else if (item.entity_type === 'team') {
      if (currentEntity.obj.entity_type === 'player') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = team.indexOf(item);
        team.splice(i, 1);
        setGroupList([authUser.auth.user, ...club, ...team]);
      } else if (currentEntity.obj.entity_type === 'team') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = team.indexOf(item);
        team.splice(i, 1, currentEntity.obj);
        setGroupList([authUser.auth.user, ...club, ...team]);
      } else if (currentEntity.obj.entity_type === 'club') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = team.indexOf(item);
        team.splice(i, 1);
        club.push(currentEntity.obj)
        setGroupList([authUser.auth.user, ...club, ...team]);
      }
      currentEntity = {
        ...currentEntity, uid: item.group_id, role: 'team', obj: item,
      }
      getParentClub(item);
      await Utility.setStorage('loggedInEntity', currentEntity);
      setAuthUser(currentEntity)
      setRole('team')
    } else if (item.entity_type === 'club') {
      if (currentEntity.obj.entity_type === 'player') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = club.indexOf(item);
        club.splice(i, 1);
        setGroupList([authUser.auth.user, ...club, ...team]);
      } else if (currentEntity.obj.entity_type === 'team') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = club.indexOf(item);
        club.splice(i, 1);
        team.push(currentEntity.obj)
        setGroupList([authUser.auth.user, ...club, ...team]);
      } else if (currentEntity.obj.entity_type === 'club') {
        console.log('Switched:: switch', currentEntity.obj.entity_type, item.entity_type);
        const i = club.indexOf(item);
        club.splice(i, 1, currentEntity.obj);
        setGroupList([authUser.auth.user, ...club, ...team]);
      }

      currentEntity = {
        ...currentEntity, uid: item.group_id, role: 'club', obj: item,
      }
      setParentGroup(null);
      setGroup(item);
      await Utility.setStorage('loggedInEntity', currentEntity);
      setAuthUser(currentEntity)
      setRole('club')
    }
    await switchQBAccount(item);
  };

  const switchQBAccount = async (accountData) => {
    setloading(true);
    let entity = await Utility.getStorage('loggedInEntity')
    entity = { ...entity, QB: { connected: false } }
    await Utility.setStorage('loggedInEntity', entity);
    const entityType = await accountData?.entity_type ?? '';
    const uid = entityType === 'player' ? 'user_id' : 'group_id'
    QBLogout().then(async () => {
      const {
        USER, CLUB, LEAGUE, TEAM,
      } = QB_ACCOUNT_TYPE;
      let accountType = USER;
      if (entityType === 'club') accountType = CLUB;
      else if (entityType === 'team') accountType = TEAM;
      else if (entityType === 'league') accountType = LEAGUE;

      await QBlogin(
        accountData[uid],
        {
          ...accountData,
          full_name: accountData.group_name,
        },
        accountType,
      ).then(async (res) => {
        entity.QB = { ...res.user, connected: true, token: res?.session?.token }
        await Utility.setStorage('loggedInEntity', entity);
        await QBconnectAndSubscribe()
      }).catch((e) => console.log(e))
    }).catch((e) => {
      console.log(e);
    }).finally(() => setloading(false));
  }

  const handleLogOut = async () => {
    Alert.alert(
      'Towns Cup',
      'Are you sure want to logout?',
      [{
        text: 'OK',
        onPress: async () => {
          QBLogout();
          await firebase.auth().signOut();
          await Utility.clearStorage();
          authContext.setUser(null);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },

      ],
      { cancelable: false },
    );
  };
  const handleSections = async (section) => {
    if (section === 'My Schedule') {
      navigation.navigate('ScheduleScreen');
    } else if (section === 'Register as a Referee') {
      navigation.navigate('RegisterReferee');
    } else if (section === 'Register as a personal player') {
      navigation.navigate('RegisterPlayer');
    } else if (section === 'Create a Team') {
      navigation.navigate('CreateTeamForm1', { clubObject: group });
    } else if (section === 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    } else if (section === 'Setting & Privacy') {
      const entity = await Utility.getStorage('loggedInEntity');
      if (entity.role === 'user') {
        console.log('GO to UserSettingPrivacyScreen')
        navigation.navigate('UserSettingPrivacyScreen');
      } else {
        navigation.navigate('GroupSettingPrivacyScreen', {
          role: entity.role,
        });
      }
    } else if (section === 'Members') {
      const entity = await Utility.getStorage('loggedInEntity');
      navigation.navigate('GroupMembersScreen', { groupID: entity.uid });
    }
  };

  const handleOpetions = async (opetions) => {
    if (opetions === 'Register as a referee') {
      navigation.navigate('RegisterReferee');
    } else if (opetions === 'Add a sport') {
      navigation.navigate('RegisterPlayer');
    } else if (opetions === 'Create a Team') {
      navigation.navigate('CreateTeamForm1', { clubObject: group });
    } else if (opetions === 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    }
  };
  const renderSwitchProfile = ({ item, index }) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        switchProfile({ item, index });
      }}>
      <View>
        {item.entity_type === 'player'
          && <View style={styles.imageContainer}>
            <Image
                source={item.thumbnail ? { uri: item.thumbnail } : images.profilePlaceHolder}
                style={styles.playerImg}
              />
          </View>
          }
        {item.entity_type === 'club'
          && <View style={styles.placeholderView}>
            <Image
                source={ item.thumbnail ? { uri: item.thumbnail } : images.clubPlaceholder}
                style={styles.entityImg}
              />
            {item.thumbnail ? null : <Text style={styles.oneCharacterText}>
              {item.group_name.charAt(0).toUpperCase()}
            </Text>}
          </View>
          }
        {item.entity_type === 'team'
          && <View style={styles.placeholderView}>
            <Image
              source={ item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder}
              style={styles.entityImg}
            />
            {item.thumbnail ? null : <Text style={styles.oneCharacterText}>
              {item.group_name.charAt(0).toUpperCase()}
            </Text>}
          </View>}

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
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ScrollView style={styles.mainContainer}>

        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center',
        }}>
          {parentGroup ? (<View
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
                 image={parentGroup.thumbnail && parentGroup.thumbnail }/>
            </View>
          </View>) : <View></View>}
          <View>
            <TouchableOpacity onPress={() => navigation.closeDrawer()} >
              <Image source={images.menuClose} style={styles.closeMenu}/>
            </TouchableOpacity>
          </View>
        </View>

        {authUser.role === 'user' && (
          <View style={styles.profileView}>
            <Image
                source={authUser.auth.user.thumbnail ? { uri: authUser.auth.user.thumbnail } : images.profilePlaceHolder}
                style={[styles.profileImg, { marginTop: 20 }]}
              />
            <Text style={styles.nameText}>{authUser.auth.user.full_name}</Text>
            <Text style={styles.locationText}>
              {authUser.auth.user.city}, {authUser.auth.user.state_abbr}
            </Text>
          </View>
        )}
        {authUser.role === 'team' && (
          <View style={styles.profileView}>
            <Image
                source={authUser.obj.thumbnail ? { uri: authUser.obj.thumbnail } : images.team_ph}
                style={styles.profileImgGroup}
              />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingLeft: 30,
              }}>
              <Text style={styles.nameText}>{authUser.obj.group_name}</Text>
              <View style={styles.identityView}>
                <ImageBackground
                  source={images.teamSqure}
                  style={styles.badgeCounter}
                />
                <Text style={styles.badgeCounter}>T</Text>
              </View>
            </View>

            <Text style={styles.locationText}>
              {authUser.obj.city}, {authUser.obj.state_abbr}
            </Text>
          </View>
        )}
        {authUser.role === 'club' && (
          <View style={styles.profileView}>
            <Image
                source={authUser.obj.thumbnail ? { uri: authUser.obj.thumbnail } : images.club_ph}
                style={styles.profileImgGroup}
              />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingLeft: 30,
              }}>
              <Text style={styles.nameText}>{authUser.obj.group_name}</Text>

              <View style={styles.identityView}>
                <ImageBackground
                  source={images.clubSqure}
                  style={styles.badgeCounter}
                />
                <Text style={styles.badgeCounter}>C</Text>
              </View>
            </View>

            <Text style={styles.locationText}>
              {authUser.obj.city}, {authUser.obj.state_abbr}
            </Text>
          </View>
        )}
        <View style={styles.separatorLine}></View>

        <ExpanableList
          dataSource={
            (role === 'team' && teamMenu)
            || (role === 'club' && clubMenu)
            || (role === 'user' && userMenu)
          }
          headerKey={'key'}
          memberKey="member"
          renderRow={(rowItem, rowId, sectionId) => (
            <>
              {role === 'user' && sectionId === 3 && (
                <FlatList
                  data={teamList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', item);
                      }}>
                      <View style={styles.entityTextContainer}>
                        <Image
                            source={item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder}
                            style={styles.smallProfileImg}
                          />
                        <Text style={styles.entityName}>{item.group_name}</Text>
                        <Text style={styles.teamSportView}> {item.sport}</Text>

                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  // ItemSeparatorComponent={() => (
                  //   <View style={styles.separatorLine}></View>
                  // )}
                  scrollEnabled={false}
                />
              )}
              {role === 'user' && sectionId === 4 && (
                <FlatList
                  data={clubList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', rowItem.rowId.sectionId);
                      }}>
                      <View style={styles.entityTextContainer}>

                        <Image
                            source={item.thumbnail ? { uri: item.thumbnail } : images.clubPlaceholder }
                            style={styles.smallProfileImg}
                          />

                        <Text style={styles.entityName}>{item.group_name}</Text>
                        <Text style={styles.clubSportView}> {item.sport}</Text>

                        {/* <Text style={styles.entityLocationText}>
                {item.city}, {item.state_abbr}, {item.country}
              </Text> */}
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  // ItemSeparatorComponent={() => (
                  //   <View style={styles.separatorLine}></View>
                  // )}
                  scrollEnabled={false}
                />
              )}

              {role === 'club' && sectionId === 2 && (
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
                            source={item.thumbnail ? { uri: item.thumbnail } : images.teamPlaceholder}
                            style={styles.smallProfileImg}
                          />

                        <Text style={styles.entityName}>{item.group_name}</Text>
                        <Text style={styles.teamSportView}> {item.sport}</Text>

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
                  handleOpetions(rowItem.opetions);
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
                {rowItem.opetions === 'Create a Team' && (
                  <Image source={images.createTeam} style={styles.subMenuItem} />
                )}
                {rowItem.opetions === 'Create a Club' && (
                  <Image source={images.createClub} style={styles.subMenuItem} />
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
                  <Image source={images.Transations} style={styles.subMenuItem} />
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
                  <Image source={images.paymentPayout} style={styles.menuItem} />
                )}
                {section === 'Setting & Privacy' && (
                  <Image source={images.SettingPrivacy} style={styles.menuItem} />
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
          renderItem={renderSwitchProfile }
          // ItemSeparatorComponent={() => (
          //   <View style={styles.separatorLine}></View>
          // )}
          scrollEnabled={false}
        />
        <View style={styles.separatorView}></View>
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

  identityView: {
    // backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
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
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
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
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 20,
    marginTop: 5,
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
  closeMenu: {
    height: 14,
    width: 14,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 20,
  },
  profileImgGroup: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileView: { height: 150 },
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

});
