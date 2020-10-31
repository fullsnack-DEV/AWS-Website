import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/account/AccountScreen';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import GameRecording from '../screens/account/schedule/GameRecording';
import GameDetailRecord from '../screens/account/schedule/GameDetailRecord';
import GameRecordList from '../screens/account/schedule/GameRecordList';
import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/RegisterPlayerForm2';
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
import RegisterRefereeForm2 from '../screens/account/registerReferee/RegisterRefereeForm2';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/CreateTeamForm1';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/CreateTeamForm2';
import CreateTeamForm3 from '../screens/account/createGroup/createTeam/CreateTeamForm3';
import CreateTeamForm4 from '../screens/account/createGroup/createTeam/CreateTeamForm4';
import SearchPlayerScreen from '../screens/account/createGroup/createTeam/SearchPlayerScreen';
import TeamCreatedScreen from '../screens/account/createGroup/createTeam/TeamCreatedScreen';

import CreateClubForm1 from '../screens/account/createGroup/createClub/CreateClubForm1';
import CreateClubForm2 from '../screens/account/createGroup/createClub/CreateClubForm2';
import CreateClubForm3 from '../screens/account/createGroup/createClub/CreateClubForm3';
import ClubCreatedScreen from '../screens/account/createGroup/createClub/ClubCreatedScreen';

import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import JoinedClubsScreen from '../screens/account/JoinedClubsScreen';

import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen'
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen'
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import UserNotFoundScreen from '../screens/account/groupConnections/UserNotFoundScreen';
import MemberProfileCreatedScreen from '../screens/account/groupConnections/MemberProfileCreatedScreen';
import UserFoundScreen from '../screens/account/groupConnections/UserFoundScreen';
import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import CreateMemberProfileTeamForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm2';
import CreateMemberProfileClubForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm2';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';

import colors from '../Constants/Colors'
import EventScreen from '../screens/account/schedule/EventScreen';

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
        name="EventScreen"
        component={ EventScreen }
        options={ {
          title: 'Game',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerShown: false,
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
        name="GroupMembersScreen"
        component={ GroupMembersScreen }
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
    <Stack.Screen
        name="MembersProfileScreen"
        component={ MembersProfileScreen }
        options={ {
          title: 'Member Profile',
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
        name="InviteMembersByEmailScreen"
        component={ InviteMembersByEmailScreen }
        options={ {
          title: 'Invite by Email',
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
        name="InviteMembersBySearchScreen"
        component={ InviteMembersBySearchScreen }
        options={ {
          title: 'Invite by Search',
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
        name="InvitationSentScreen"
        component={ InvitationSentScreen }
        options={ { headerShown: false } }
      />
    <Stack.Screen
        name="UserNotFoundScreen"
        component={ UserNotFoundScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="MemberProfileCreatedScreen"
        component={ MemberProfileCreatedScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="UserFoundScreen"
        component={ UserFoundScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="MembersViewPrivacyScreen"
        component={ MembersViewPrivacyScreen }
        options={ {
          title: 'View Privacy',
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
        name="CreateMemberProfileForm1"
        component={ CreateMemberProfileForm1 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileTeamForm2"
        component={ CreateMemberProfileTeamForm2 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileClubForm2"
        component={ CreateMemberProfileClubForm2 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileClubForm3"
        component={ CreateMemberProfileClubForm3 }
        options={ {
          title: 'Create Member Profile',
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
