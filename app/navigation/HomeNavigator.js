import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import EditPersonalProfileScreen from '../screens/home/EditPersonalProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import colors from '../Constants/Colors'
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import strings from '../Constants/String';
import UserAboutScreen from '../screens/home/UserAboutScreen';
import UserBasicInfoScreen from '../screens/home/UserBasicInfoScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      }}>

    <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
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
        }}
      />

    <Stack.Screen
        name="EditPersonalProfileScreen"
        component={EditPersonalProfileScreen}
        options={{
          title: 'Edit Profile',
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
      name="WritePostScreen"
      component={ WritePostScreen }
      options={ {
        title: 'Write Post',
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
        name="WriteCommentScreen"
        component={ WriteCommentScreen }
        options={ {
          title: 'Write Comment',
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
        name="UserAboutScreen"
        component={UserAboutScreen}
        options={{
          title: strings.editabouttitle,
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
        name="UserBasicInfoScreen"
        component={UserBasicInfoScreen}
        options={{
          title: strings.editbasicinfotitle,
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
        name="SearchLocationScreen"
        component={SearchLocationScreen}
        options={{
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        }}
      />

  </Stack.Navigator>
);

export default HomeNavigator;
