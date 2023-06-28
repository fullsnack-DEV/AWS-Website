// @flow
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import MediaScreen from '../screens/home/SportActivity/contentScreens/MediaScreen';
import CertificateDisplayScreen from '../screens/home/SportActivity/contentScreens/CertificateDisplayScreen';

const Stack = createStackNavigator();
const LoneStackNavigator = () => (
  <Stack.Navigator initialRouteName="MediaScreen">
    <Stack.Screen
      name="MediaScreen"
      component={MediaScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CertificateDisplayScreen"
      component={CertificateDisplayScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default LoneStackNavigator;
