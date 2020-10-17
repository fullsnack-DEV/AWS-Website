import React from 'react';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

import ReservationScreen from '../screens/reservation';


const Stack = createStackNavigator();

const ReservationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="ReservationScreen"
        component={ReservationScreen}
        options={{
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
        }}
      />
    </Stack.Navigator>
  );
};

export default ReservationNavigator;
