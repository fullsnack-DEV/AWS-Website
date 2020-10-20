import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import constants from '../config/constants';

import ReservationScreen from '../screens/reservation';
import ReservationDetailScreen from '../screens/reservation/reservationDetail'

const {
  colors,
} = constants;

const Stack = createStackNavigator();

const ReservationNavigator = () => (
    <Stack.Navigator
      screenOptions={ {
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      } }>
        <Stack.Screen
        name="ReservationScreen"
        component={ ReservationScreen }
        options={ {
          title: 'Reservations',
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
        name="ReservationDetailScreen"
        component={ ReservationDetailScreen }
        options={ {
          title: 'Reservation Detail',
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
    </Stack.Navigator>
);

export default ReservationNavigator;
