import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import colors from '../Constants/Colors';
import HomeScreen from '../screens/home/HomeScreen';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';

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
      <Stack.Screen
            name="EditRefereeReservation"
            component={EditRefereeReservation}
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
      <Stack.Screen
        name="CurruentRefereeReservationScreen"
        component={ CurruentRefereeReservationScreen }
        options={ {
          title: 'Curruent Referee Reservation',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
      <Stack.Screen
        name="EditRefereeFeeScreen"
        component={ EditRefereeFeeScreen }
        options={ {
          title: 'Referee Fee',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
      <Stack.Screen
        name="AlterRequestSent"
        component={ AlterRequestSent }
        options={ {
          headerShown: false,
        } }
      />
      <Stack.Screen name="HomeScreen" component={ HomeScreen } options={ {} } />
    </Stack.Navigator>
  );
}

export default NotificationNavigator;
