import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import EditPersonalProfileScreen from '../screens/home/EditPersonalProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import colors from '../Constants/Colors'

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
