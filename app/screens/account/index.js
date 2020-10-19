import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Platform,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';

// import ActionSheet from 'react-native-actionsheet';
import ExpanableList from 'react-native-expandable-section-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from './style';

import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';

import {
  getParentClubDetail,
  getUnreadCount,
  getJoinedTeams,
  getTeamsByClub,
} from '../../api/Accountapi';

import * as Utility from '../../utility/index';

import PATH from '../../Constants/ImagePath';
import { token_details } from '../../utils/constant';

export default function AccountScreen({ navigation }) {
  const [switchBy, setSwitchBy] = useState('user');
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState(null);

  const [playerAdd, setPlayerAdd] = useState(false);
  const [entities, setEntities] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const authContext = useContext(AuthContext);
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
    { key: 'Setting & Privacy' },
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
    { key: 'Setting & Privacy' },
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
    setloading(true);
    getToken();
    getTeamsList();
    getClubList();
    setloading(false);
  }, []);

  const getParentClub = async (item) => {
    setloading(true);
    getParentClubDetail(item.group_id).then((response) => {
      if (response.status === true) {
        if (response.payload.club !== undefined) {
          setParentGroup(response.payload.club);
        } else {
          setParentGroup(null);
        }
      } else {
        alert(response.messages);
      }
    });
    setloading(false);
  };
  const getToken = async () => {
    try {
      setloading(true);
      const switchByGroup = await Utility.getStorage('switchBy');
      setSwitchBy(switchByGroup);
      getUnreadCount().then((response) => {
        if (response.status === true) {
          const { teams } = response.payload;
          const { clubs } = response.payload;
          setEntities([...clubs, ...teams]);
          setSwitchBy('user');
          setGroupList([...clubs, ...teams]);
        } else {
          alert(response.messages);
        }
      });
    } catch (e) {
      Alert.alert('Towns Cup', e.messages)
    }
    setloading(false);
  };
  const getTeamsList = async () => {
    setloading(true);
    const switchByEntity = await Utility.getStorage('switchBy');
    if (switchByEntity === 'club') {
      const clubObject = await Utility.getStorage('club');
      getTeamsByClub(clubObject.group_id).then((response) => {
        if (response.status === true) {
          setTeamList(response.payload);
        } else {
          Alert.alert(response.messages);
        }
      });
    } else {
      getJoinedTeams().then((response) => {
        if (response.status === true) {
          setTeamList(response.payload.teams);
        } else {
          Alert.alert(response.messages);
        }
      });
    }
    setloading(false);
  };

  const getClubList = async () => {
    setloading(true);
    getJoinedTeams().then((response) => {
      if (response.status === true) {
        console.log('RESPONSE OF CLUB LIST::', response.payload);
        setClubList(response.payload.clubs);
      } else {
        alert(response.messages);
      }
    });
    setloading(false);
  };
  const switchProfile = async ({ item }) => {
    setloading(true);
    if (item.entity_type === 'club') {
      if (!entities.includes(authContext.user, 0)) {
        const i = entities.indexOf(authContext.user);
        if (i === -1) {
          entities.unshift(authContext.user);
          // setPlayerAdd(true);
          setGroupList(entities);
          // setGroupList(entities);
        }
      }
      const index = entities.indexOf(item);
      if (!playerAdd) {
        entities.splice(index, 1);
        setGroupList(entities);
      } else if (group.entity_type === 'player') {
        entities.splice(index, 1);
        setGroupList(entities);
      } else {
        entities.splice(index, 1, group);
        setGroupList(entities);
      }

      await Utility.setStorage('club', item);
      await Utility.setStorage('switchBy', 'club');
      await Utility.removeAuthKey('team');
      setEntities(entities.filter((value) => JSON.stringify(value) !== '{}'));
      setSwitchBy('club');
      getTeamsList();
      setGroup(item);
      setParentGroup(null);
      setGroupList(entities);
      authContext.setSwitchBy('club');
    }
    if (item.entity_type === 'team') {
      if (!entities.includes(authContext.user, 0)) {
        const i = entities.indexOf(authContext.user);
        if (i === -1) {
          entities.unshift(authContext.user);
          setPlayerAdd(true);
          setGroupList(entities);
        }
      }

      const index = entities.indexOf(item);
      if (!playerAdd) {
        entities.splice(index, 1);
        setGroupList(entities);
      } else if (group.entity_type === 'player') {
        entities.splice(index, 1);
        setGroupList(entities);
      } else {
        entities.splice(index, 1, group);
        setGroupList(entities);
      }

      await Utility.setStorage('team', item);
      await Utility.setStorage('switchBy', 'team');
      await Utility.removeAuthKey('club');

      getParentClub(item);

      setEntities(entities.filter((value) => JSON.stringify(value) !== '{}'));
      setSwitchBy('team');
      setGroup(item);
      setGroupList(entities);
      authContext.setSwitchBy('team');
    }
    if (item.entity_type === 'player') {
      await Utility.setStorage('switchBy', 'user');
      await Utility.removeAuthKey('club');
      await Utility.removeAuthKey('team');
      entities.splice(0, 1);
      entities.push(group);
      setSwitchBy('user');
      setGroup(item);
      setParentGroup(null);
      setGroupList(entities);
      authContext.setSwitchBy('user');
    }
    setloading(false);
  };
  const handleLogOut = async () => {
    await Utility.removeAuthKey('token');

    const tokeen = await Utility.getStorage('token');
    console.log('tokeeennn', tokeen);
    if (tokeen === null) {
      navigation.navigate('WelcomeScreen');
    }
    authContext.setUser(null);
    await Utility.removeAuthKey('user');
    await Utility.removeAuthKey('team');
    await Utility.removeAuthKey('club');
    await Utility.removeAuthKey('switchBy');
    await Utility.removeAuthKey(token_details);
    QB.auth
      .logout()
      .then(() => {
        Alert.alert('signed out successfully');
      })
      .catch((e) => {
        Alert.alert('Towns Cup', e.messages);
      });
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
      const switchEntity = await Utility.getStorage('switchBy');
      if (switchEntity === 'user') {
        navigation.navigate('UserSettingPrivacyScreen');
      } else {
        navigation.navigate('GroupSettingPrivacyScreen', {
          switchBy: switchEntity,
        });
      }
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
  return (
      <SafeAreaView style={styles.mainContainer}>
          <ScrollView style={styles.mainContainer}>
              <ActivityLoader visible={loading} />

              {parentGroup !== null && (
              <>
                  <TouchableWithoutFeedback
              style={{
                flexDirection: 'row',
                padding: 15,
                marginTop: Platform.OS === 'ios' ? 50 : 0,
              }}>
                      <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                          <Image source={PATH.clubLable} style={styles.clubLableView} />
                          {!parentGroup.thumbnail && (
                          <Image source={PATH.club_ph} style={styles.clubLable} />
                          )}

                          {parentGroup.thumbnail && (
                          <Image
                    source={{ uri: parentGroup.thumbnail }}
                    style={styles.clubLable}
                  />
                          )}
                          <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                              <Text style={styles.clubNameText}>
                                  {parentGroup.group_name}
                              </Text>

                              <View style={styles.identityViewTop}>
                                  <ImageBackground
                      source={PATH.clubSqure}
                      style={styles.badgeCounter}
                    />
                                  <Text style={styles.badgeCounter}>C</Text>
                              </View>
                          </View>
                      </View>
                  </TouchableWithoutFeedback>
              </>
              )}

              {switchBy === 'user' && (
              <View style={styles.profileView}>
                  {authContext.user.full_image === '' && (
                  <Image
                source={PATH.profilePlaceHolder}
                style={styles.entityImg}
              />
                  )}
                  {authContext.user.full_image !== '' && (
                  <Image
                source={{ uri: authContext.user.thumbnail }}
                style={styles.profileImg}
              />
                  )}

                  <Text style={styles.nameText}>{authContext.user.full_name}</Text>
                  <Text style={styles.locationText}>
                      {authContext.user.city}, {authContext.user.state_abbr}
                  </Text>
              </View>
              )}
              {switchBy === 'team' && (
              <View style={styles.profileView}>
                  {!group.thumbnail && (
                  <Image source={PATH.team_ph} style={styles.profileImgGroup} />
                  )}

                  {group.thumbnail && (
                  <Image
                source={{ uri: group.thumbnail }}
                style={styles.profileImgGroup}
              />
                  )}
                  <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingLeft: 30,
              }}>
                      <Text style={styles.nameText}>{group.group_name}</Text>
                      <View style={styles.identityView}>
                          <ImageBackground
                  source={PATH.teamSqure}
                  style={styles.badgeCounter}
                />
                          <Text style={styles.badgeCounter}>T</Text>
                      </View>
                  </View>

                  <Text style={styles.locationText}>
                      {group.city}, {group.state_abbr}
                  </Text>
              </View>
              )}
              {switchBy === 'club' && (
              <View style={styles.profileView}>
                  {!group.thumbnail && (
                  <Image source={PATH.club_ph} style={styles.profileImgGroup} />
                  )}

                  {group.thumbnail && (
                  <Image
                source={{ uri: group.thumbnail }}
                style={styles.profileImgGroup}
              />
                  )}
                  <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingLeft: 30,
              }}>
                      <Text style={styles.nameText}>{group.group_name}</Text>

                      <View style={styles.identityView}>
                          <ImageBackground
                  source={PATH.clubSqure}
                  style={styles.badgeCounter}
                />
                          <Text style={styles.badgeCounter}>C</Text>
                      </View>
                  </View>

                  <Text style={styles.locationText}>
                      {group.city}, {group.state_abbr}
                  </Text>
              </View>
              )}
              <View style={styles.separatorLine}></View>

              <ExpanableList
          dataSource={
            (switchBy === 'team' && teamMenu)
            || (switchBy === 'club' && clubMenu)
            || (switchBy === 'user' && userMenu)
          }
          headerKey={'key'}
          memberKey="member"
          renderRow={(rowItem, rowId, sectionId) => (
              <>
                  {switchBy === 'user' && sectionId === 3 && teamList.length > 0 && (
                  <FlatList
                  data={teamList}
                  keyExtractor={(item) => item.group_id}
                  renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', rowItem.rowId.sectionId);
                      }}>
                          <View style={styles.entityTextContainer}>
                              {item.full_image ? (
                                  <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.smallProfileImg}
                          />
                              ) : (
                                  <Image
                            source={PATH.teamPlaceholder}
                            style={styles.smallProfileImg}
                          />
                              )}
                              <Text style={styles.entityName}>{item.group_name}</Text>
                              <Text style={styles.teamSportView}> {item.sport}</Text>

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
                  {switchBy === 'user' && sectionId === 4 && clubList.length > 0 && (
                  <FlatList
                  data={clubList}
                  keyExtractor={(item) => item.group_id}
                  renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', rowItem.rowId.sectionId);
                      }}>
                          <View style={styles.entityTextContainer}>
                              {item.full_image ? (
                                  <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.smallProfileImg}
                          />
                              ) : (
                                  <Image
                            source={PATH.clubPlaceholder}
                            style={styles.smallProfileImg}
                          />
                              )}
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

                  {switchBy === 'club' && sectionId === 2 && teamList.length > 0 && (
                  <FlatList
                  data={teamList}
                  keyExtractor={(item) => item.group_id}
                  renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                      style={styles.listContainer}
                      onPress={() => {
                        console.log('Pressed Team..', rowItem.rowId.sectionId);
                      }}>
                          <View style={styles.entityTextContainer}>
                              {item.full_image ? (
                                  <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.smallProfileImg}
                          />
                              ) : (
                                  <Image
                            source={PATH.teamPlaceholder}
                            style={styles.smallProfileImg}
                          />
                              )}
                              <Text style={styles.entityName}>{item.group_name}</Text>
                              <Text style={styles.teamSportView}> {item.sport}</Text>

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

                  <View style={styles.halfSeparatorLine} />

                  <TouchableWithoutFeedback
                style={styles.listContainer}
                onPress={() => {
                  handleOpetions(rowItem.opetions);
                }}>
                      {rowItem.opetions === 'Add a sport' && (
                      <Image source={PATH.addSport} style={styles.subMenuItem} />
                      )}
                      {rowItem.opetions === 'Register as a referee' && (
                      <Image
                    source={PATH.registerReferee}
                    style={styles.subMenuItem}
                  />
                      )}
                      {rowItem.opetions === 'Create a Team' && (
                      <Image source={PATH.createTeam} style={styles.subMenuItem} />
                      )}
                      {rowItem.opetions === 'Create a Club' && (
                      <Image source={PATH.createClub} style={styles.subMenuItem} />
                      )}
                      {rowItem.opetions === 'Create a League' && (
                      <Image
                    source={PATH.createLeague}
                    style={styles.subMenuItem}
                  />
                      )}
                      {rowItem.opetions === 'Payment Method' && (
                      <Image
                    source={PATH.Payment_method}
                    style={styles.subMenuItem}
                  />
                      )}
                      {rowItem.opetions === 'Payout Method' && (
                      <Image
                    source={PATH.Payout_method}
                    style={styles.subMenuItem}
                  />
                      )}
                      {rowItem.opetions === 'Invoicing' && (
                      <Image source={PATH.Invoicing} style={styles.subMenuItem} />
                      )}
                      {rowItem.opetions === 'Transactions' && (
                      <Image source={PATH.Transations} style={styles.subMenuItem} />
                      )}

                      <Text style={styles.listItems}>{rowItem.opetions}</Text>
                      <Image source={PATH.nextArrow} style={styles.nextArrow} />
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
                      <Image source={PATH.mySchedule} style={styles.menuItem} />
                      )}
                      {section === 'My Sports' && (
                      <Image source={PATH.mySports} style={styles.menuItem} />
                      )}
                      {section === 'My Refereeing' && (
                      <Image source={PATH.myRefereeing} style={styles.menuItem} />
                      )}
                      {section === 'My Teams' && (
                      <Image source={PATH.myTeams} style={styles.menuItem} />
                      )}
                      {section === 'My Clubs' && (
                      <Image source={PATH.myClubs} style={styles.menuItem} />
                      )}
                      {section === 'My Leagues' && (
                      <Image source={PATH.myLeagues} style={styles.menuItem} />
                      )}
                      {section === 'Payment & Payout' && (
                      <Image source={PATH.paymentPayout} style={styles.menuItem} />
                      )}
                      {section === 'Setting & Privacy' && (
                      <Image source={PATH.SettingPrivacy} style={styles.menuItem} />
                      )}
                      {section === 'Members' && (
                      <Image source={PATH.Members} style={styles.menuItem} />
                      )}

                      <Text style={styles.listItems}>{section}</Text>
                      <Image source={PATH.nextArrow} style={styles.nextArrow} />
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
                source={PATH.switchAccount}
                style={styles.switchAccountIcon}
              />
                      <Text style={styles.switchAccount}>Switch Account</Text>
                  </View>
              </>
              )}

              <FlatList
          data={groupList}
          renderItem={({ item }) => (
              <TouchableWithoutFeedback
              style={styles.listContainer}
              onPress={() => {
                switchProfile({ item });
              }}>
                  <View>
                      {item.entity_type === 'player'
                  && (item.thumbnail ? (
                      <View style={styles.imageContainer}>
                          <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.playerImg}
                      />
                      </View>
                  ) : (
                      <Image
                      source={PATH.profilePlaceHolder}
                      style={styles.entityImg}
                    />
                  ))}
                      {item.entity_type === 'club'
                  && (item.thumbnail ? (
                      <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.entityImg}
                    />
                  ) : (
                      <View style={styles.placeholderView}>
                          <Image
                        source={PATH.clubPlaceholder}
                        style={styles.entityImg}
                      />
                          <Text style={styles.oneCharacterText}>
                              {item.group_name.charAt(0).toUpperCase()}
                          </Text>
                      </View>
                  ))}
                      {item.entity_type === 'team'
                  && (item.thumbnail ? (
                      <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.entityImg}
                    />
                  ) : (
                      <View style={styles.placeholderView}>
                          <Image
                        source={PATH.teamPlaceholder}
                        style={styles.entityImg}
                      />
                          <Text style={styles.oneCharacterText}>
                              {item.group_name.charAt(0).toUpperCase()}
                          </Text>
                      </View>
                  ))}

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
          )}
          // ItemSeparatorComponent={() => (
          //   <View style={styles.separatorLine}></View>
          // )}
          scrollEnabled={false}
        />
              <View style={styles.separatorView}></View>
              <TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={handleLogOut}>
                  <Image source={PATH.logoutIcon} style={styles.switchAccountIcon} />
                  <Text style={styles.listItems}>Log out</Text>
                  <Image source={PATH.nextArrow} style={styles.nextArrow} />
              </TouchableWithoutFeedback>
          </ScrollView>
      </SafeAreaView>
  );
}
