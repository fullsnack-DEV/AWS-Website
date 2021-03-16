import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import HomeNavigator from './HomeNavigator';

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      // headerTintColor: colors.blackColor,
      // headerTransparent: true,
      // headerTitle: true,
      headerBackTitleVisible: false,
    }}>
    {/* <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{ headerShown: false }}
    /> */}
    <Stack.Screen name="Account" component={ HomeNavigator } options={{ headerShown: false }} />

  </Stack.Navigator>
);

export default AccountNavigator;
