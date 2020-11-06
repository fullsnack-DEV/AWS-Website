import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';

import colors from '../Constants/Colors';

const Stack = createStackNavigator();

function NotificationNavigator() {
  return (
    <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: true,
        }}>
      <Stack.Screen
         name="NotificationsListScreen"
         component={NotificationsListScreen}
         options={{
           title: 'Notification',
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
    </Stack.Navigator>
  );
}

export default NotificationNavigator;
