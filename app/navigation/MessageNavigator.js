import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import colors from '../Constants/Colors'

import MessageMainScreen from '../screens/message/MessageMainScreen';
import MessageInviteScreen from '../screens/message/MessageInviteScreen';
import MessageNewGroupScreen from '../screens/message/MessageNewGroupScreen';
import MessageDrawerNavigator from './MessageDrawerNavigator';

const Stack = createStackNavigator();

const MessageNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
    }}>

    <Stack.Screen
      name="MessageMainScreen"
      component={MessageMainScreen}
      options={{
        title: 'Neymar JR',
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
      }}
    />
    <Stack.Screen
      name="MessageChat"
      component={MessageDrawerNavigator}
      options={{

        title: 'Message Chat',
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
      }}
    />

    <Stack.Screen
      name="MessageInviteScreen"
      component={ MessageInviteScreen }
      options={{
        title: 'Message Chat',
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
      }}
    />

    <Stack.Screen
      name="MessageNewGroupScreen"
      component={ MessageNewGroupScreen }
      options={{
        title: 'Message Chat',
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
      }}
    />
  </Stack.Navigator>
);

export default MessageNavigator;
