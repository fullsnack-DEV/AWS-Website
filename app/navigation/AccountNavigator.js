import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/account/index';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import GameRecording from '../screens/account/schedule/GameRecording';
import GameDetailRecord from '../screens/account/schedule/GameDetailRecord';
import GameRecordList from '../screens/account/schedule/GameRecordList';
import RegisterPlayer from '../screens/account/registerPlayer';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/registerPlayerForm2';
import RegisterReferee from '../screens/account/registerReferee';
import RegisterRefereeForm2 from '../screens/account/registerReferee/registerRefereeForm2';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/createTeamForm1';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/createTeamForm2';
import CreateTeamForm3 from '../screens/account/createGroup/createTeam/createTeamForm3';
import CreateTeamForm4 from '../screens/account/createGroup/createTeam/createTeamForm4';
import SearchPlayerScreen from '../screens/account/createGroup/createTeam/searchPlayer';
import TeamCreatedScreen from '../screens/account/createGroup/createTeam/teamCreated';

import CreateClubForm1 from '../screens/account/createGroup/createClub/createClubForm1';
import CreateClubForm2 from '../screens/account/createGroup/createClub/createClubForm2';
import CreateClubForm3 from '../screens/account/createGroup/createClub/createClubForm3';
import ClubCreatedScreen from '../screens/account/createGroup/createClub/clubCreated';

import SearchLocationScreen from '../screens/account/commonScreen/searchLocation';

import JoinedTeamsScreen from '../screens/account/teams';
import JoinedClubsScreen from '../screens/account/clubs';

import GroupSettingPrivacyScreen from '../screens/account/groupSettingPrivacy';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/changePassword'
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/personalInformation'
import GroupMembers from '../screens/account/groupConnections/GroupMembers';
import colors from '../Constants/Colors'

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator
      screenOptions={ {
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      } }>
    <Stack.Screen
        name="AccountScreen"
        component={ AccountScreen }
        options={ {
          // title: 'Account',
          // headerTintColor: colors.blackColor,
          // headerTitleStyle: {
          //   fontWeight: '500',
          // },
          // headerStyle: {
          //   backgroundColor: colors.whiteColor,
          //   borderBottomColor: colors.grayColor,
          //   borderBottomWidth: 0.3,
          // },
          headerShown: false,
        } }
      />
    <Stack.Screen
        name="ScheduleScreen"
        component={ ScheduleScreen }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="GameDetail"
        component={ GameDetail }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="GameRecording"
        component={ GameRecording }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="GameDetailRecord"
        component={ GameDetailRecord }
        options={ {
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
        } }
      />

    <Stack.Screen
        name="GameRecordList"
        component={ GameRecordList }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="RegisterPlayer"
        component={ RegisterPlayer }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="RegisterPlayerForm2"
        component={ RegisterPlayerForm2 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="RegisterReferee"
        component={ RegisterReferee }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="RegisterRefereeForm2"
        component={ RegisterRefereeForm2 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateTeamForm1"
        component={ CreateTeamForm1 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateTeamForm2"
        component={ CreateTeamForm2 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateTeamForm3"
        component={ CreateTeamForm3 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateTeamForm4"
        component={ CreateTeamForm4 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateClubForm1"
        component={ CreateClubForm1 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateClubForm2"
        component={ CreateClubForm2 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateClubForm3"
        component={ CreateClubForm3 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="TeamCreatedScreen"
        component={ TeamCreatedScreen }
        options={ {
          // headerTransparent: true,
          // title: ' ',
          // headerTintColor: colors.whiteColor,
          headerShown: false,
        } }
      />
    <Stack.Screen
        name="ClubCreatedScreen"
        component={ ClubCreatedScreen }
        options={ {
          // headerTransparent: true,
          // title: ' ',
          // headerTintColor: colors.whiteColor,
          headerShown: false,
        } }
      />
    <Stack.Screen
        name="SearchLocationScreen"
        component={ SearchLocationScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="SearchPlayerScreen"
        component={ SearchPlayerScreen }
        options={ {
          title: 'Choose a Player',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="JoinedTeamsScreen"
        component={ JoinedTeamsScreen }
        options={ {
          title: 'Teams',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="JoinedClubsScreen"
        component={ JoinedClubsScreen }
        options={ {
          title: 'Clubs',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="GroupSettingPrivacyScreen"
        component={ GroupSettingPrivacyScreen }
        options={ {
          title: 'Setting & Privacy',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="UserSettingPrivacyScreen"
        component={ UserSettingPrivacyScreen }
        options={ {
          title: 'Setting & Privacy',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="ChangePasswordScreen"
        component={ ChangePasswordScreen }
        options={ {
          title: 'Change Password',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="PersonalInformationScreen"
        component={ PersonalInformationScreen }
        options={ {
          title: 'Personal Information',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
        name="GroupMembers"
        component={ GroupMembers }
        options={ {
          title: 'Connection',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
  </Stack.Navigator>
);

export default AccountNavigator;
