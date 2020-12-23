import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import colors from '../Constants/Colors';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';

const Stack = createStackNavigator();

function NotificationNavigator() {
  return (
    <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
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
      <Stack.Screen
         name="TrashScreen"
         component={TrashScreen}
         options={{
           title: 'Trash',
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
         name="AcceptDeclineChallengeScreen"
         component={AcceptDeclineChallengeScreen}
         options={{
           title: 'Challenge',
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
         name="ChallengeAcceptedDeclinedScreen"
         component={ChallengeAcceptedDeclinedScreen}
         options={{
           headerShown: false,
         }}
        />
      <Stack.Screen
            name="RefereeReservationScreen"
            component={RefereeReservationScreen}
            options={{
              title: 'Referee Reservation',
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
            name="AlterRefereeScreen"
            component={AlterRefereeScreen}
            options={{
              title: 'Change Referee Reservation',
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
