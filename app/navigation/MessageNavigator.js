import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import colors from '../Constants/Colors'

import MessageMainScreen from '../screens/message/MessageMainScreen';
import MessageInviteScreen from '../screens/message/MessageInviteScreen';
import MessageNewGroupScreen from '../screens/message/MessageNewGroupScreen';
import MessageDrawerNavigator from './MessageDrawerNavigator';
import HomeScreen from '../screens/home/HomeScreen';
import MessageEditGroupScreen from '../screens/message/MessageEditGroupScreen';
import MessageSearchScreen from '../screens/message/MessageSearchScreen';
import MessageEditInviteeScreen from '../screens/message/MessageEditInviteeScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';

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
      name="MessageSearchScreen"
      component={MessageSearchScreen}
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
    <Stack.Screen name={'FeedViewScreen'} component={FeedViewScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="MessageEditInviteeScreen"
      component={ MessageEditInviteeScreen }
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
    <Stack.Screen
          name="MessageEditGroupScreen"
          component={ MessageEditGroupScreen }
          options={{
              title: 'Message',
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
          name="HomeScreen"
          component={ HomeScreen }
          options={ {
            title: 'Home',
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
  </Stack.Navigator>
);

export default MessageNavigator;
