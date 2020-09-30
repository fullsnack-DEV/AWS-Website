import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import QB from 'quickblox-react-native-sdk';

import storage from '../../auth/storage';
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-actionsheet';
import styles from './style';

import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import AuthContext from '../../auth/context';
import Separator from '../../components/Separator';
import {get} from '../../api/services';
import {GET_UNREAD_COUNT_URL} from '../../api/Url';

import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function AccountScreen({navigation, route}) {
  const [token, setToken] = useState('');
  const authContext = useContext(AuthContext);
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
    get(GET_UNREAD_COUNT_URL, token);
  });

  const connectChat = () => {
    QB.chat
      .createDialog({
        type: QB.chat.DIALOG_TYPE.CHAT,
        occupantsIds: ['jE8OTmUmJ0WyoT2zGL1Oee5PfWJ3'],
      })
      .then(function (dialog) {
        alert('connect successfully');
        // handle as neccessary, i.e.
        // subscribe to chat events, typing events, etc.
      })
      .catch(function (e) {
        // handle error
        alert(e);
      });
  };
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        console.log('TOKEN RETRIVED... ');
        setToken(value);
      } else {
        console.log('TOKEN::::::::::::EMPTY');
      }
    } catch (e) {
      // error reading value
    }
  };
  const handleLogOut = () => {
    authContext.setUser(null);
    AsyncStorage.removeItem('user');
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
    } else if (item.key == 'Reservations') {
    } else if (item.key == 'Payment & Payout') {
      paymentOpetionActionSheet.show();
    }
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.profileView}>
        <Image source={PATH.profilePlaceHolder} style={styles.profileImg} />
        <Text style={styles.nameText}>Kishan Makani</Text>
        <Text style={styles.locationText}>Vancouver, BC</Text>
      </View>
      <View style={styles.separatorLine}></View>
      <FlatList
        data={[
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
        ]}
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
        data={[
          {key: 'Schedule'},
          {key: 'Referee'},
          {key: 'Teams'},
          {key: 'Clubs'},
          {key: 'Leagues'},
        ]}
        renderItem={({item}) => (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => alert('clicked row..!!')}>
            <Image source={PATH} style={styles.entityImg} />
            <View style={styles.textContainer}>
              <Text style={styles.entityNameText}>Kishan Makani</Text>
              <Text style={styles.entityLocationText}>Vancouver, BC</Text>
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
        options={[
          'Payment Method',
          'Payout Method',
          'Received Invoices',
          'Transactions',
          'Cancel',
        ]}
        cancelButtonIndex={4}
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
