import React from 'react';
import {
  Button,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

import AccountScreen from '../screens/account';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import GameRecording from '../screens/account/schedule/GameRecording';
import GameDetailRecord from '../screens/account/schedule/GameDetailRecord';
import GameRecordList from '../screens/account/schedule/GameRecordList';
import RegisterPlayer from '../screens/account/registerPlayer';
import RegisterReferee from '../screens/account/registerReferee';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/createTeamForm1';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/createTeamForm2';
import CreateTeamForm3 from '../screens/account/createGroup/createTeam/createTeamForm3';
import CreateTeamForm4 from '../screens/account/createGroup/createTeam/createTeamForm4';

import CreateClubForm1 from '../screens/account/createGroup/createClub/createClubForm1';
import CreateClubForm2 from '../screens/account/createGroup/createClub/createClubForm2';

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: 'Account',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="GameDetail"
        component={GameDetail}
        options={{
          title: 'Game',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="GameRecording"
        component={GameRecording}
        options={{
          title: 'Match Record',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="GameDetailRecord"
        component={GameDetailRecord}
        options={{
          title: 'Match Record',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />

      <Stack.Screen
        name="GameRecordList"
        component={GameRecordList}
        options={{
          title: 'Match Record',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="RegisterPlayer"
        component={RegisterPlayer}
        options={{
          title: 'Register as a personal player',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="RegisterReferee"
        component={RegisterReferee}
        options={{
          title: 'Register as a referee',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateTeamForm1"
        component={CreateTeamForm1}
        options={{
          title: 'Create a Team',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateTeamForm2"
        component={CreateTeamForm2}
        options={{
          title: 'Create a Team',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateTeamForm3"
        component={CreateTeamForm3}
        options={{
          title: 'Create a Team',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateTeamForm4"
        component={CreateTeamForm4}
        options={{
          title: 'Create a Team',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateClubForm1"
        component={CreateClubForm1}
        options={{
          title: 'Create a Club',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="CreateClubForm2"
        component={CreateClubForm2}
        options={{
          title: 'Create a Club',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
