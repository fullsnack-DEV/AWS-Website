import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {StyleSheet, View, Text, Image, FlatList,ScrollView} from 'react-native';

import QB from 'quickblox-react-native-sdk';

import ActionSheet from 'react-native-actionsheet';
import ExpanableList from 'react-native-expandable-section-flatlist';
import styles from './style';

import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import AuthContext from '../../auth/context';

import {getParentClubDetail, getUnreadCount,getJoinedTeams, getTeamsByClub} from '../../api/Accountapi';

import * as Utility from '../../utility/index';
import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';

export default function AccountScreen({navigation, route}) {
  const [switchBy, setSwitchBy] = useState('user');
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState(null);

  const [playerAdd, setPlayerAdd] = useState(false);
  const [entities, setEntities] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const authContext = useContext(AuthContext);
  // for set/get teams
  const [teamList, setTeamList] = useState([]);

  //Account menu opetions
  const userMenu = [
    {key: 'My Schedule', },
    {key: 'My Sports',member:[{opetions: 'Add a sport'}]},
    {key: 'My Refereeing',member:[{opetions: 'Register as a referee'}]},
    {key: 'My Teams', member:[{opetions: 'Create a Team'}]},
    {key: 'My Clubs', member:[{opetions: 'Create a Club'}]},
    {key: 'My Leagues', member:[{opetions: 'Create a League'}]},
    //{key: 'Register as a Referee'},
    //{key: 'Register as a personal player'},
    //{key: 'Create Group'},
    // {key: 'Reservations'},
    {key: 'Payment & Payout'},
    {key: 'Setting & Privacy'},
  ];
  const teamMenu = [
    {key: 'Members'},
    {key: 'My Leagues'},
    {key: 'Schedule'},
    {key: 'Create a Club'},
    {key: 'Reservations'},
    {key: 'Payment & Payout'},
    {key: 'Setting & Privacy'},
  ];
  const clubMenu = [
    {key: 'Members'},
    {key: 'My Teams'},
    {key: 'My Leagues'},
    {key: 'Schedule'},
    {key: 'Create a Team'},
    {key: 'Invite Teams'},
    {key: 'Payment & Payout'},
    {key: 'Setting & Privacy'},
  ];

  // Payment menu opetions
  const userPaymentOpetions = [
    'Payment Method',
    'Payout Method',
    'Received Invoices',
    'Transactions',
    'Cancel',
  ];
  const teamPaymentOpetions = [
    'Payment Method',
    'Payout Method',
    'Invoicing',
    'Transactions',
    'Cancel',
  ];
  const clubPaymentOpetions = [
    'Payment Method',
    'Payout Method',
    'Transactions',
    'Cancel',
  ];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => connectChat()}>
          <Image
            source={PATH.messageBox_account}
            style={styles.headerRightImg}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    getToken();
    getTeamsList();
  }, []);

  const connectChat = () => {
    QB.chat
      .createDialog({
        type: QB.chat.DIALOG_TYPE.CHAT,
        occupantsIds: ['jE8OTmUmJ0WyoT2zGL1Oee5PfWJ3'],
      })
      .then(function (dialog) {
        // handle as neccessary, i.e.
        // subscribe to chat events, typing events, etc.
      })
      .catch(function (e) {
        // handle error
        alert(e);
      });
  };
  const getParentClub = async (item) => {
    getParentClubDetail(item.group_id).then((response) => {
      if (response.status == true) {
        if (response.payload.club != undefined) {
          setParentGroup(response.payload.club);
        } else {
          setParentGroup(null);
        }
        console.log('GROUP API RESPONSE::', JSON.stringify(response.payload));
      } else {
        alert(response.messages);
      }
    });
  };
  const getToken = async () => {
    try {
      console.log('AUTHCONTEXT::', authContext.user);
      const switchByGroup = await Utility.getFromLocalStorge('switchBy');
      setSwitchBy(switchByGroup);
      getUnreadCount().then((response) => {
        if (response.status == true) {
          let teams = response.payload.teams;
          let clubs = response.payload.clubs;
          setEntities([...clubs, ...teams]);
          setSwitchBy('user');
          setGroupList([...clubs, ...teams]);
        } else {
          alert(response.messages);
        }
      });
    } catch (e) {}
  };
  const getTeamsList = async () => {
    let switchBy = await Utility.getStorage('switchBy');
    if (switchBy == 'club') {
      let clubObject = await Utility.getStorage('club');
      getTeamsByClub(clubObject.group_id).then((response) => {
        if (response.status == true) {
          console.log('RESPONSE OF TEAM LIST BY CLUB::', response.payload);
          setTeamList(response.payload);
        } else {
          alert(response.messages);
        }
      });
    } else {
      getJoinedTeams().then((response) => {
        if (response.status == true) {
          console.log('RESPONSE OF TEAM LIST::', response.payload);
          setTeamList(response.payload.teams);
        } else {
          alert(response.messages);
        }
      });
    }
  };
  const switchProfile = async ({item}) => {
    if (item.entity_type == 'club') {
      if (!entities.includes(authContext.user, 0)) {
        let i = entities.indexOf(authContext.user);
        if (i == -1) {
          entities.unshift(authContext.user);
          //setPlayerAdd(true);
          setGroupList(entities);
          //setGroupList(entities);
        }
      }
      let index = entities.indexOf(item);
      if (!playerAdd) {
        entities.splice(index, 1);
        setGroupList(entities);
      } else if (group.entity_type == 'player') {
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
      setGroup(item);
      setGroupList(entities);
      authContext.setSwitchBy('club');
    }
    if (item.entity_type == 'team') {
      if (!entities.includes(authContext.user, 0)) {
        let i = entities.indexOf(authContext.user);
        if (i == -1) {
          entities.unshift(authContext.user);
          setPlayerAdd(true);
          setGroupList(entities);
        }
      }

      let index = entities.indexOf(item);
      if (!playerAdd) {
        entities.splice(index, 1);
        setGroupList(entities);
      } else if (group.entity_type == 'player') {
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
    if (item.entity_type == 'player') {
      await Utility.setStorage('switchBy', 'user');
      await Utility.removeAuthKey('club');
      await Utility.removeAuthKey('team');
      entities.splice(0, 1);
      entities.push(group);
      setSwitchBy('user');
      setGroup(item);
      setGroupList(entities);
      authContext.setSwitchBy('user');
    }
  };
  const handleLogOut = async () => {
    await Utility.removeAuthKey('token');

    let tokeen = await Utility.getFromLocalStorge('token');
    console.log('tokeeennn', tokeen);
    if (tokeen == null) {
      navigation.navigate('WelcomeScreen');
    }
    authContext.setUser(null);
    await Utility.removeAuthKey('user');
    await Utility.removeAuthKey('team');
    await Utility.removeAuthKey('club');
    await Utility.removeAuthKey('switchBy');
    QB.auth
      .logout()
      .then(function () {
        alert('signed out successfully');
      })
      .catch(function (e) {
        // handle error
      });
  };
  const handleSections = async(section) => {
    if (section == 'My Schedule') {
      navigation.navigate('ScheduleScreen');
    }else if (section == 'My Clubs') {
      navigation.navigate('JoinedClubsScreen');
    } else if (section == 'My Leagues') {
    } else if (section == 'Register as a Referee') {
      navigation.navigate('RegisterReferee');
    } else if (section == 'Register as a personal player') {
      navigation.navigate('RegisterPlayer');
    } else if (section == 'Create Group') {
      groupOpetionActionSheet.show();
    } else if (section == 'Create a Team') {
      navigation.navigate('CreateTeamForm1', {clubObject: group});
    } else if (section == 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    } else if (section == 'Reservations') {
    } else if (section == 'Setting & Privacy') {
      const switchEntity = await Utility.getStorage('switchBy');
      navigation.navigate('GroupSettingPrivacyScreen',{switchBy: switchEntity});
    } else if (section == 'Payment & Payout') {
      paymentOpetionActionSheet.show();
    } 
  };

  const handleOpetions = async(opetions) => {
     if (opetions == 'My Teams') {
      navigation.navigate('JoinedTeamsScreen');
    } else if (opetions == 'My Clubs') {
      navigation.navigate('JoinedClubsScreen');
    } else if (opetions == 'My Leagues') {
    } else if (opetions == 'Register as a referee') {
      navigation.navigate('RegisterReferee');
    } else if (opetions == 'Add a sport') {
      navigation.navigate('RegisterPlayer');
    } else if (opetions == 'Create Group') {
      groupOpetionActionSheet.show();
    } else if (opetions == 'Create a Team') {
      navigation.navigate('CreateTeamForm1', {clubObject: group});
    } else if (opetions == 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    } else if (opetions == 'Reservations') {
    }  else if (opetions == 'Payment & Payout') {
      paymentOpetionActionSheet.show();
    } 
  };
  return (
    <ScrollView style={styles.mainContainer}>
      {switchBy == 'user' && (
        <View style={styles.profileView}>
          {!authContext.user.thumbnail && (
            <Image source={PATH.profilePlaceHolder} style={styles.entityImg} />
          )}
          {authContext.user.thumbnail && (
            <Image
              source={{uri: authContext.user.thumbnail}}
              style={styles.profileImg}
            />
          )}

          <Text style={styles.nameText}>{authContext.user.full_name}</Text>
          <Text style={styles.locationText}>
            {authContext.user.city}, {authContext.user.state_abbr}
          </Text>
        </View>
      )}
      {switchBy == 'team' && (
        <View style={styles.profileView}>
          {!group.thumbnail && (
            <Image source={PATH.team_ph} style={styles.profileImgGroup} />
          )}

          {group.thumbnail && (
            <Image
              source={{uri: group.thumbnail}}
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
              <Text style={styles.badgeCounter}>T</Text>
            </View>
          </View>

          <Text style={styles.locationText}>
            {group.city}, {group.state_abbr}
          </Text>
        </View>
      )}
      {switchBy == 'club' && (
        <View style={styles.profileView}>
          {!group.thumbnail && (
            <Image source={PATH.club_ph} style={styles.profileImgGroup} />
          )}

          {group.thumbnail && (
            <Image
              source={{uri: group.thumbnail}}
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
            <View style={styles.identityViewClub}>
              <Text style={styles.badgeCounter}>C</Text>
            </View>
          </View>

          <Text style={styles.locationText}>
            {group.city}, {group.state_abbr}
          </Text>
        </View>
      )}
      <View style={styles.separatorLine}></View>
      {parentGroup != null && (
        <>
          <TouchableWithoutFeedback style={{flexDirection: 'row', padding: 15}}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 15,
              }}>
              {!parentGroup.thumbnail && (
                <Image source={PATH.club_ph} style={styles.clubView} />
              )}

              {parentGroup.thumbnail && (
                <Image
                  source={{uri: parentGroup.thumbnail}}
                  style={styles.clubView}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  height: 20,
                }}>
                <Text style={styles.clubNameText}>
                  {parentGroup.group_name}
                </Text>
                <View style={styles.clubBadge}>
                  <Text style={styles.badgeCounter}>C</Text>
                </View>
              </View>
            </View>
            <Image source={PATH.nextArrow} style={styles.nextArrowClub} />
          </TouchableWithoutFeedback>
          <View style={styles.separatorLine}></View>
        </>
      )}

      {/* <FlatList
        data={
          (switchBy == 'team' && teamMenu) ||
          (switchBy == 'club' && clubMenu) ||
          (switchBy == 'user' && userMenu)
        }
        renderItem={({item, index}) => (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => {
              handleOpetions({item});
            }}>
              {item.key == 'My Schedule' && <Image source={PATH.mySchedule} style={styles.menuItem} />}
              {item.key == 'My Sports' && <Image source={PATH.mySports} style={styles.menuItem} />}
              {item.key == 'My Refereeing' && <Image source={PATH.myRefereeing} style={styles.menuItem} />}
              {item.key == 'My Teams' && <Image source={PATH.myTeams} style={styles.menuItem} />}
              {item.key == 'My Clubs' && <Image source={PATH.myClubs} style={styles.menuItem} />}
              {item.key == 'My Leagues' && <Image source={PATH.myLeagues} style={styles.menuItem} />}
              {item.key == 'Payment & Payout' && <Image source={PATH.paymentPayout} style={styles.menuItem} />}
              {item.key == 'Setting & Privacy' && <Image source={PATH.SettingPrivacy} style={styles.menuItem} />}

            <Text style={styles.listItems}>{item.key}</Text>
            <Image source={PATH.nextArrow} style={styles.nextArrow} />
          </TouchableWithoutFeedback>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
        scrollEnabled={false}
      /> */}
      <ExpanableList
        dataSource={
          userMenu
        }
        
        headerKey={"key"}
        memberKey="member"
        renderRow={(rowItem, rowId, sectionId)=>(<>
        {teamList.length >0 && <FlatList
        data={teamList}
        keyExtractor={(item, index) => item.group_id}
        renderItem={({item, index}) => (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => {
              console.log('Pressed Team..');
            }}>
           

            <View style={styles.entityTextContainer}>
            {item.full_image ? (
                <Image
                  source={{uri: item.full_image}}
                  style={styles.smallProfileImg}
                />
              ) : (
                <Image source={PATH.teamPlaceholder} style={styles.smallProfileImg} />
              )}
              <Text style={styles.entityName}>{item.group_name}</Text>

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
      />}
        
      
        <TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={()=>{
            console.log('Pressed::', rowItem.opetions);
          }}>
            {rowItem.opetions == 'Add a sport' && <Image source={PATH.addSport} style={styles.subMenuItem} />}
            {rowItem.opetions == 'Register as a referee' && <Image source={PATH.registerReferee} style={styles.subMenuItem} />}
            {rowItem.opetions == 'Create a Team' && <Image source={PATH.createTeam} style={styles.subMenuItem} />}
            {rowItem.opetions == 'Create a Club' && <Image source={PATH.createClub} style={styles.subMenuItem} />}
            {rowItem.opetions == 'Create a League' && <Image source={PATH.createLeague} style={styles.subMenuItem} />}
          <Text style={styles.listItems}>{rowItem.opetions}</Text>
          <Image source={PATH.nextArrow} style={styles.nextArrow} />
        </TouchableWithoutFeedback>
        <View style={styles.halfSeparatorLine}/></>)}

        renderSectionHeaderX={(section, sectionId)=>(<><TouchableWithoutFeedback
          style={styles.listContainer}
          onPress={()=>{
            handleSections(section);
          }}>
            {section == 'My Schedule' && <Image source={PATH.mySchedule} style={styles.menuItem} />}
            {section == 'My Sports' && <Image source={PATH.mySports} style={styles.menuItem} />}
            {section == 'My Refereeing' && <Image source={PATH.myRefereeing} style={styles.menuItem} />}
            {section == 'My Teams' && <Image source={PATH.myTeams} style={styles.menuItem} />}
            {section == 'My Clubs' && <Image source={PATH.myClubs} style={styles.menuItem} />}
            {section == 'My Leagues' && <Image source={PATH.myLeagues} style={styles.menuItem} />}
            {section == 'Payment & Payout' && <Image source={PATH.paymentPayout} style={styles.menuItem} />}
            {section == 'Setting & Privacy' && <Image source={PATH.SettingPrivacy} style={styles.menuItem} />}

          <Text style={styles.listItems}>{section}</Text>
          <Image source={PATH.nextArrow} style={styles.nextArrow} />
        </TouchableWithoutFeedback>
        <View style={styles.separatorLine}/>
        </>)}
        

      />

      {groupList.length > 0 && (
        <>
          <View style={styles.separatorView}></View>
          <View style={{flexDirection:'row'}}>
          
          <Image source={PATH.switchAccount} style={styles.switchAccountIcon} />
          <Text style={styles.switchAccount}>Switch Account</Text>
          </View>
        </>
      )}

      <FlatList
        data={groupList}
        renderItem={({item, index}) => (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => {
              switchProfile({item});
            }}>
            <View>
              {item.entity_type == 'player' &&
                (item.thumbnail ? (
                  <View style={styles.imageContainer}>
                  <Image
                    source={{uri: item.thumbnail}}
                    style={styles.playerImg}
                  />
                  </View>
                ) : (
                  <Image
                    source={PATH.profilePlaceHolder}
                    style={styles.entityImg}
                  />
                ))}
              {item.entity_type == 'club' &&
                (item.thumbnail ? (
                  <Image
                    source={{uri: item.thumbnail}}
                    style={styles.entityImg}
                  />
                ) : (
                  <Image source={PATH.clubPlaceholder} style={styles.entityImg} />
                ))}
              {item.entity_type == 'team' &&
                (item.thumbnail ? (
                  <Image
                    source={{uri: item.thumbnail}}
                    style={styles.entityImg}
                  />
                ) : (
                  <Image source={PATH.teamPlaceholder} style={styles.entityImg} />
                ))}

              {item.unread > 0 && (
                <View style={styles.badgeView}>
                  <Text style={styles.badgeCounter}>{item.unread}</Text>
                </View>
              )}
            </View>

            <View style={styles.textContainer}>
              {item.entity_type == 'player' && (
                <Text style={styles.entityNameText}>{item.full_name}</Text>
              )}
              {item.entity_type == 'team' && (
                <Text style={styles.entityNameText}>{item.group_name}</Text>
              )}
              {item.entity_type == 'club' && (
                <Text style={styles.entityNameText}>{item.group_name}</Text>
              )}
              <Text style={styles.entityLocationText}>
                {item.city},{item.state_abbr}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
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

      <ActionSheet
        ref={(paymentOpetion) => (paymentOpetionActionSheet = paymentOpetion)}
        //title={'Which one do you like ?'}
        options={
          (switchBy == 'team' && teamPaymentOpetions) ||
          (switchBy == 'club' && clubPaymentOpetions) ||
          (switchBy == 'user' && userPaymentOpetions)
        }
        cancelButtonIndex={
          (switchBy == 'team' && teamPaymentOpetions.length - 1) ||
          (switchBy == 'club' && clubPaymentOpetions.length - 1) ||
          (switchBy == 'user' && userPaymentOpetions.length - 1)
        }
        //destructiveButtonIndex={1}
        onPress={(index) => {
          /* do something */
        }}
      />
      <ActionSheet
        ref={(groupOpetion) => (groupOpetionActionSheet = groupOpetion)}
        //title={'Which one do you like ?'}
        options={[
          'Create a Team',
          'Create a Club',
          'Create a League',
          'Setting & Privacy',
          'Cancel',
        ]}
        cancelButtonIndex={4}
        //destructiveButtonIndex={1}
        onPress={(index) => {
          if (index == 0) {
            navigation.navigate('CreateTeamForm1');
          } else if (index == 1) {
            navigation.navigate('CreateClubForm1');
          }
        }}
      />
    </ScrollView>
  );
}
