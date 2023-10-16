import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';
import fonts from '../Constants/Fonts';

import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import CreateMemberProfileTeamForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm3';
import CreateMemberProfileForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm2';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';
import ConnectMemberAccountScreen from '../screens/account/groupConnections/ConnectMemberAccountScreen';
import EditMemberInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberInfoScreen';
import EditMemberBasicInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberBasicInfoScreen';
import EditMemberTeamInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberTeamInfoScreen';
import RequestBasicInfoScreen from '../screens/account/groupConnections/RequestBasicInfoScreen';
import EditMemberAuthInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberAuthInfoScreen';
import ConnectionReqSentScreen from '../screens/account/groupConnections/ConnectionReqSentScreen';

const Stack = createStackNavigator();

const MembersNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerBackTitleVisible: false,
      headerTitleStyle: {
        textAlign: 'center',
        fontFamily: fonts.Roboto,
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 17,
        paddingTop: 5,
        color: colors.lightBlackColor,
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerStyle: {
        backgroundColor: colors.whiteColor,
        borderBottomColor: colors.grayColor,
        borderBottomWidth: 0.3,
      },
    }}>
    <Stack.Screen
      name="MembersProfileScreen"
      component={MembersProfileScreen}
      options={{
        title: strings.memberProfile,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',

        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
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
          fontSize: 16,
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
        title: strings.inviteMemberText,

        headerTitleAlign: 'center',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
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
      name="InvitationSentScreen"
      component={InvitationSentScreen}
      options={{headerShown: false}}
    />
    {/* <Stack.Screen
      name="MemberProfileCreatedScreen"
      component={MemberProfileCreatedScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    /> */}

    <Stack.Screen
      name="CreateMemberProfileForm1"
      component={CreateMemberProfileForm1}
      options={{
        title: strings.createMemberProfileText,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',
        headerShown: false,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
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
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
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
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="ConnectionReqSentScreen"
      component={ConnectionReqSentScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="CreateMemberProfileClubForm3"
      component={CreateMemberProfileClubForm3}
      options={{
        title: strings.createMemberProfileText,
        headerTitleAlign: 'center',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
        },
      }}
    />

    <Stack.Screen
      name="ConnectMemberAccountScreen"
      component={ConnectMemberAccountScreen}
      options={{
        title: 'Connect Member Account',
        headerTintColor: colors.blackColor,
      }}
    />
    <Stack.Screen
      name="EditMemberInfoScreen"
      component={EditMemberInfoScreen}
      options={{
        title: strings.editprofiletitle,
        headerTintColor: colors.blackColor,
      }}
    />
    <Stack.Screen
      name="EditMemberBasicInfoScreen"
      component={EditMemberBasicInfoScreen}
      options={{
        title: strings.editbasicinfotitle,
        headerTintColor: colors.blackColor,

        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
        },
      }}
    />
    <Stack.Screen
      name="RequestBasicInfoScreen"
      component={RequestBasicInfoScreen}
      options={{
        title: strings.requestBasicInfoTitle,
        headerTintColor: colors.blackColor,
      }}
    />
    <Stack.Screen
      name="EditMemberTeamInfoScreen"
      component={EditMemberTeamInfoScreen}
      options={{
        title: '',
        headerTintColor: colors.blackColor,
      }}
    />
    <Stack.Screen
      name="EditMemberAuthInfoScreen"
      component={EditMemberAuthInfoScreen}
      options={{
        title: '',
        headerTintColor: colors.blackColor,
      }}
    />
  </Stack.Navigator>
);

export default MembersNavigator;
