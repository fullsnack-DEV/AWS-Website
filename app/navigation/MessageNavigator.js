import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';

import MessageMainScreen from '../screens/message/MessageMainScreen';
import MessageInviteScreen from '../screens/message/MessageInviteScreen';
import MessageNewGroupScreen from '../screens/message/MessageNewGroupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MessageEditGroupScreen from '../screens/message/MessageEditGroupScreen';
import MessageSearchScreen from '../screens/message/MessageSearchScreen';
import MessageEditInviteeScreen from '../screens/message/MessageEditInviteeScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';
import SearchScreen from '../screens/search/SearchScreen';
import MessageChat from '../components/message/MessageChat';

import fonts from '../Constants/Fonts';

import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';


const Stack = createStackNavigator();

const MessageNavigator = () => (
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
      name="MessageMainScreen"
      component={MessageMainScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MessageSearchScreen"
      component={MessageSearchScreen}
      options={{
        title: 'Neymar JR',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MessageChat"
      component={MessageChat}
      options={{
        title: strings.messageChat,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="MessageInviteScreen"
      component={MessageInviteScreen}
      options={{
        title: strings.messageChat,

        headerShown: false,
      }}
    />
    <Stack.Screen
      name={'FeedViewScreen'}
      component={FeedViewScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessageEditInviteeScreen"
      component={MessageEditInviteeScreen}
      options={{
        title: strings.messageChat,

        headerShown: false,
      }}
    />

    <Stack.Screen
      name="MessageNewGroupScreen"
      component={MessageNewGroupScreen}
      options={{
        title: strings.messageChat,

        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MessageEditGroupScreen"
      component={MessageEditGroupScreen}
      options={{
        title: strings.message,

        headerShown: false,
      }}
    />
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: strings.home,

        headerShown: false,
      }}
    />
    <Stack.Screen
      name="SportActivityHome"
      component={SportActivityHome}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EditWrapperScreen"
      component={EditWrapperScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        title: strings.searchText,
      }}
    />
  </Stack.Navigator>
);

export default MessageNavigator;
