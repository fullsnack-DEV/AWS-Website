import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import colors from '../Constants/Colors'
import LocalHomeScreen from '../screens/localhome/LocalHomeScreen';

const Stack = createStackNavigator();

const LocalHomeNavigator = () => (
  <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        gestureEnabled: false,
        headerBackTitleVisible: false,
      }}>
    <Stack.Screen
        name="LocalHomeScreen"
        component={LocalHomeScreen}
        options={{
          title: 'LocalHomeScreen',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        }}
      />

    {/* <Stack.Screen
      name="UserTagSelectionListScreen"
      component={UserTagSelectionListScreen}
      options={{
        headerShown: false,
      }}
    /> */}

  </Stack.Navigator>
);

export default LocalHomeNavigator;
