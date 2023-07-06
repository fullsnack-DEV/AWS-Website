import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

// import colors from '../Constants/Colors';
// import {strings} from '../../Localization/translation';

import MessageMainScreen from '../screens/message/MessageMainScreen';
import MessageInviteScreen from '../screens/message/MessageInviteScreen';
import MessageNewGroupScreen from '../screens/message/MessageNewGroupScreen';
// import HomeScreen from '../screens/home/HomeScreen';
import MessageEditGroupScreen from '../screens/message/MessageEditGroupScreen';
import MessageSearchScreen from '../screens/message/MessageSearchScreen';
import MessageEditInviteeScreen from '../screens/message/MessageEditInviteeScreen';
// import SearchScreen from '../screens/search/SearchScreen';
// // import MessageChat from '../components/message/MessageChat';
import MessageChatScreen from '../screens/message/MessageChatScreen';

// import fonts from '../Constants/Fonts';

// import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
// import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';
// import ReviewDetailsScreen from '../screens/home/SportActivity/ReviewDetailsScreen';

const Stack = createStackNavigator();

const MessageNavigator = () => (
  <Stack.Navigator initialRouteName="MessageMainScreen">
    <Stack.Screen
      name="MessageMainScreen"
      component={MessageMainScreen}
      options={{headerShown: false}}
    />
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
      name="MessageEditInviteeScreen"
      component={MessageEditInviteeScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="MessageNewGroupScreen"
      component={MessageNewGroupScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessageEditGroupScreen"
      component={MessageEditGroupScreen}
      options={{headerShown: false}}
    />
    {/* <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: strings.home,
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
      name="SportActivityHome"
      component={SportActivityHome}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EditWrapperScreen"
      component={EditWrapperScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReviewDetailsScreen"
      component={ReviewDetailsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        title: strings.searchText,
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
    /> */}
  </Stack.Navigator>
);

export default MessageNavigator;
