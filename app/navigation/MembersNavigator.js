import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';

import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import UserNotFoundScreen from '../screens/account/groupConnections/UserNotFoundScreen';
import MemberProfileCreatedScreen from '../screens/account/groupConnections/MemberProfileCreatedScreen';
import UserFoundScreen from '../screens/account/groupConnections/UserFoundScreen';
import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import CreateMemberProfileTeamForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm3';
import CreateMemberProfileForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm2';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';

import GroupEventScreen from '../screens/account/schedule/GroupEventScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';

import GroupMembersSettingScreen from '../screens/account/GroupSetting/GroupMembersSettingScreen';
import GroupsScreen from '../screens/account/GroupSetting/GroupsScreen';

import GroupInviteYouScreen from '../screens/account/GroupSetting/GroupInviteYouScreen';
import GroupInviteSettingPrivacyScreen from '../screens/account/GroupSetting/GroupInviteSettingPrivacyScreen';
import UserEventSettingPrivacyScreen from '../screens/account/GroupSetting/UserEventSettingPrivacyScreen';

// Scorekeeper Review Screen

const Stack = createStackNavigator();

const MembersNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      // headerTintColor: colors.blackColor,
      // headerTransparent: true,
      // headerTitle: true,
      gestureEnabled: false,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="GroupMembersScreen"
      component={GroupMembersScreen}
      options={{
        title: strings.membersTitle,
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
      name="UserEventSettingPrivacyScreen"
      component={UserEventSettingPrivacyScreen}
      options={{
        title: '',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="GroupEventScreen"
      component={GroupEventScreen}
      options={{
        title: 'Group Events',
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
      name="MembersProfileScreen"
      component={MembersProfileScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="InviteMembersByEmailScreen"
      component={InviteMembersByEmailScreen}
      options={{
        title: strings.inviteByEmail,
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
      name="InviteMembersBySearchScreen"
      component={InviteMembersBySearchScreen}
      options={{
        title: strings.inviteBySearchText,
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
      name="InvitationSentScreen"
      component={InvitationSentScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserNotFoundScreen"
      component={UserNotFoundScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="MemberProfileCreatedScreen"
      component={MemberProfileCreatedScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="UserFoundScreen"
      component={UserFoundScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="MembersViewPrivacyScreen"
      component={MembersViewPrivacyScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="GroupMembersSettingScreen"
      component={GroupMembersSettingScreen}
      options={{
        title: strings.membersTitle,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="GroupInviteYouScreen"
      component={GroupInviteYouScreen}
      options={{
        title: 'Who Can Join Team',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="GroupInviteSettingPrivacyScreen"
      component={GroupInviteSettingPrivacyScreen}
      options={{
        title: 'Who Can Join Team',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="GroupsScreen"
      component={GroupsScreen}
      options={{
        title: 'Clubs',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="CreateMemberProfileForm1"
      component={CreateMemberProfileForm1}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileTeamForm3"
      component={CreateMemberProfileTeamForm3}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileForm2"
      component={CreateMemberProfileForm2}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileClubForm3"
      component={CreateMemberProfileClubForm3}
      options={{
        title: strings.createMemberProfileText,
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

export default MembersNavigator;
