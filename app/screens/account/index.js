import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import QB from 'quickblox-react-native-sdk';

import ActionSheet from 'react-native-actionsheet';
import styles from './style';

import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import AuthContext from '../../auth/context';

import {get} from '../../api/services';
import {GET_UNREAD_COUNT_URL, GET_PARENT_CLUB} from '../../api/Url';
import * as Utility from '../../utility/index';
import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function AccountScreen({navigation, route}) {
  const [token, setToken] = useState('');
  const [switchBy, setSwitchBy] = useState('user');
  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState(null);

  const [playerAdd, setPlayerAdd] = useState(false);
  const [entities, setEntities] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const authContext = useContext(AuthContext);

  //Account menu opetions
  const userMenu = [
    {key: 'Schedule'},
    {key: 'Referee'},
    {key: 'Teams'},
    {key: 'Clubs'},
    {key: 'Leagues'},
    {key: 'Register as a Referee'},
    {key: 'Register as a personal player'},
    {key: 'Create Group'},
    {key: 'Reservations'},
    {key: 'Payment & Payout'},
  ];
  const teamMenu = [
    {key: 'Members'},
    {key: 'Leagues'},
    {key: 'Schedule'},
    {key: 'Create a Club'},
    {key: 'Setting & Privacy'},
    {key: 'Reservations'},
    {key: 'Payment & Payout'},
  ];
  const clubMenu = [
    {key: 'Members'},
    {key: 'Teams'},
    {key: 'Leagues'},
    {key: 'Schedule'},
    {key: 'Create a Team'},
    {key: 'Invite Teams'},
    {key: 'Setting & Privacy'},
    {key: 'Payment & Payout'},
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
  const getParentClubDetail = async (item) => {
    try {
      const value = await Utility.getFromLocalStorge('token');
      if (value !== null) {
        console.log('TOKEN RETRIVED...:::', value);
        let endPoint = GET_PARENT_CLUB + item.group_id;
        get(endPoint, JSON.parse(value)).then((response) => {
          if (response.status == true) {
            if (response.payload.club != undefined) {
              setParentGroup(response.payload.club);
            } else {
              setParentGroup(null);
            }

            console.log(
              'GROUP API RESPONSE::',
              JSON.stringify(response.payload),
            );
          } else {
            alert(response.messages);
          }
        });
      } else {
        console.log('TOKEN::::::::::::EMPTY');
      }
    } catch (e) {
      alert(e);
    }
  };
  const getToken = async () => {
    try {
      const value = await Utility.getFromLocalStorge('token');
      const switchByGroup = await Utility.getFromLocalStorge('switchBy');
      setSwitchBy(switchByGroup);

      if (value !== null) {
        console.log('TOKEN RETRIVED...:::', value);
        setToken(value);
        get(GET_UNREAD_COUNT_URL, JSON.parse(value)).then((response) => {
          if (response.status == true) {
            let teams = response.payload.teams;
            let clubs = response.payload.clubs;
            setEntities([...clubs, ...teams]);
            //arr.shift();
            setSwitchBy('user');
            setGroupList([...clubs, ...teams]);
          } else {
            alert(response.messages);
          }
        });
      } else {
        console.log('TOKEN::::::::::::EMPTY');
      }
    } catch (e) {
      // error reading value
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

      getParentClubDetail(item);

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
    QB.auth
      .logout()
      .then(function () {
        alert('signed out successfully');
      })
      .catch(function (e) {
        // handle error
      });
  };
  const handleOpetions = ({item}) => {
    if (item.key == 'Schedule') {
      navigation.navigate('ScheduleScreen');
    } else if (item.key == 'Referee') {
    } else if (item.key == 'Teams') {
    } else if (item.key == 'Clubs') {
    } else if (item.key == 'Leagues') {
    } else if (item.key == 'Register as a Referee') {
      navigation.navigate('RegisterReferee');
    } else if (item.key == 'Register as a personal player') {
      navigation.navigate('RegisterPlayer');
    } else if (item.key == 'Create Group') {
      groupOpetionActionSheet.show();
    } else if (item.key == 'Create a Team') {
      navigation.navigate('CreateTeamForm1', {clubObject: group});
    } else if (item.key == 'Create a Club') {
      navigation.navigate('CreateClubForm1');
    } else if (item.key == 'Reservations') {
    } else if (item.key == 'Payment & Payout') {
      paymentOpetionActionSheet.show();
    }
  };
  return (
    <ScrollView style={styles.mainContainer}>
      {switchBy == 'user' && (
        <View style={styles.profileView}>
          {!authContext.user.full_image && (
            <Image source={PATH.profilePlaceHolder} style={styles.entityImg} />
          )}
          {authContext.user.full_image && (
            <Image
              source={{uri: authContext.user.full_image}}
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
          {!group.full_image && (
            <Image source={PATH.team_ph} style={styles.profileImgGroup} />
          )}

          {group.full_image && (
            <Image
              source={{uri: group.full_image}}
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
          {!group.full_image && (
            <Image source={PATH.club_ph} style={styles.profileImgGroup} />
          )}

          {group.full_image && (
            <Image
              source={{uri: group.full_image}}
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
              {!parentGroup.full_image && (
                <Image source={PATH.club_ph} style={styles.clubView} />
              )}

              {parentGroup.full_image && (
                <Image
                  source={{uri: parentGroup.full_image}}
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

      <FlatList
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
            <Text style={styles.listItems}>{item.key}</Text>
            <Image source={PATH.nextArrow} style={styles.nextArrow} />
          </TouchableWithoutFeedback>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
        scrollEnabled={false}
      />

      <View style={styles.separatorView}></View>
      <Text style={styles.switchAccount}>Switch Account</Text>
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
                (item.full_image ? (
                  <Image
                    source={{uri: item.full_image}}
                    style={styles.playerImg}
                  />
                ) : (
                  <Image
                    source={PATH.profilePlaceHolder}
                    style={styles.entityImg}
                  />
                ))}
              {item.entity_type == 'club' &&
                (item.full_image ? (
                  <Image
                    source={{uri: item.full_image}}
                    style={styles.entityImg}
                  />
                ) : (
                  <Image source={PATH.club_ph} style={styles.entityImg} />
                ))}
              {item.entity_type == 'team' &&
                (item.full_image ? (
                  <Image
                    source={{uri: item.full_image}}
                    style={styles.entityImg}
                  />
                ) : (
                  <Image source={PATH.team_ph} style={styles.entityImg} />
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
        <Text style={styles.listItems}>Logout</Text>
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
