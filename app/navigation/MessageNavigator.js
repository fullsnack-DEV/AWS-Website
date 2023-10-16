import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

// import MessageMainScreen from '../screens/message/MessageMainScreen';
import MessageInviteScreen from '../screens/message/MessageInviteScreen';
import MessageNewGroupScreen from '../screens/message/MessageNewGroupScreen';
import MessageSearchScreen from '../screens/message/search/MessageSearchScreen';
import MessageChatScreen from '../screens/message/MessageChatScreen';
import MessageMediaFullScreen from '../screens/message/MessageMediaFullScreen';
import LongTextMessageScreen from '../screens/message/LongTextMessageScreen';

const Stack = createStackNavigator();

const MessageNavigator = () => (
  <Stack.Navigator initialRouteName="MessageChatScreen">
    {/* <Stack.Screen
      name="MessageMainScreen"
      component={MessageMainScreen}
      options={{headerShown: false}}
    /> */}
    <Stack.Screen
      name="MessageSearchScreen"
      component={MessageSearchScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessageChatScreen"
      component={MessageChatScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="MessageInviteScreen"
      component={MessageInviteScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessageNewGroupScreen"
      component={MessageNewGroupScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessageMediaFullScreen"
      component={MessageMediaFullScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="LongTextMessageScreen"
      component={LongTextMessageScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default MessageNavigator;
