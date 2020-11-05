import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';

const Stack = createStackNavigator();
const NotificationNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      // headerTintColor: colors.blackColor,
      // headerTransparent: true,
      // headerTitle: true,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{
        // title: 'Account',
        // headerTintColor: colors.blackColor,
        // headerTitleStyle: {
        //   fontWeight: '500',
        // },
        // headerStyle: {
        //   backgroundColor: colors.whiteColor,
        //   borderBottomColor: colors.grayColor,
        //   borderBottomWidth: 0.3,
        // },
        headerShown: false,
      }}
    />

  </Stack.Navigator>
);

export default NotificationNavigator;
