import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';
import EventScreen from '../screens/account/schedule/EventScreen';
import CreateEventScreen from '../screens/account/schedule/CreateEventScreen';
import DefaultColorScreen from '../screens/account/schedule/DefaultColorScreen';
import GroupEventScreen from '../screens/account/schedule/GroupEventScreen';
import ViewEventSettingsScreen from '../screens/account/schedule/ViewEventSettingsScreen';
import ViewPrivacyScreen from '../screens/account/schedule/ViewPrivacyScreen';
import EditEventScreen from '../screens/account/schedule/EditEventScreen';
import fonts from '../Constants/Fonts';
import InviteToEventScreen from '../screens/account/schedule/InviteToEventScreen';
import GoingListScreen from '../screens/account/schedule/GoingListScreen';
import LikedEventScreen from '../screens/account/schedule/LikedEventScreen';

import CreateEventScreen2 from '../screens/account/schedule/CreateEventScreen2';
import EditEventScreen2 from '../screens/account/schedule/EditEventScreen2';
import EventCheckoutScreen from '../screens/account/schedule/EventCheckoutScreen';
import CompleteBookingFile from '../screens/account/schedule/CompleteBookingFile';

const Stack = createStackNavigator();

const ScheduleNavigator = () => (
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
      name="EventScreen"
      component={EventScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="BookEventScreen"
      component={CompleteBookingFile}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="EventCheckoutScreen"
      component={EventCheckoutScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="GoingListScreen"
      component={GoingListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="InviteToEventScreen"
      component={InviteToEventScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EditEventScreen"
      component={EditEventScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="EditEventScreen2"
      component={EditEventScreen2}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="CreateEventScreen"
      component={CreateEventScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CreateEventScreen2"
      component={CreateEventScreen2}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="DefaultColorScreen"
      component={DefaultColorScreen}
      options={{
        headerShown: false,
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
      name="ViewEventSettingsScreen"
      component={ViewEventSettingsScreen}
      options={{
        title: strings.eventsViewSettings,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ViewPrivacyScreen"
      component={ViewPrivacyScreen}
      options={{
        title: strings.privacySettings,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="LikedEventScreen"
      component={LikedEventScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default ScheduleNavigator;
