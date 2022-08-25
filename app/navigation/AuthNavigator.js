import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '../screens/authScreens/WelcomeScreen';
import ChooseSportsScreen from '../screens/authScreens/ChooseSportsScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/authScreens/ForgotPasswordScreen';
import ChooseLocationScreen from '../screens/authScreens/ChooseLocationScreen';
import SignupScreen from '../screens/authScreens/SignupScreen';
import FollowTeams from '../screens/authScreens/FollowTeams';
import HomeScreen from '../screens/home/HomeScreen';
import TotalTeamsScreen from '../screens/authScreens/TotalTeamsScreen';
import EmailVerificationScreen from '../screens/authScreens/EmailVerificationScreen';
import ForgotPasswordLinkSentScreen from '../screens/authScreens/ForgotPasswordLinkSentScreen';
import AddBirthdayScreen from '../screens/authScreens/AddBirthdayScreen';
import ChooseGenderScreen from '../screens/authScreens/ChooseGenderScreen';
import AddNameScreen from '../screens/authScreens/AddNameScreen';

import BottomTab from '../components/BottomTab';
import colors from '../Constants/Colors';
import SignupFromLoginScreen from '../screens/authScreens/SignupFromLoginScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerTintColor: colors.whiteColor,
      headerTransparent: true,
      headerTitle: false,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="ForgotPasswordLinkSentScreen"
      component={ForgotPasswordLinkSentScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="SignupScreen"
      component={SignupScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="SignUpFromLoginScreen"
      component={SignupFromLoginScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="ChooseLocationScreen"
      component={ChooseLocationScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="ChooseSportsScreen"
      component={ChooseSportsScreen}
      options={{title: ''}}
    />
    <Stack.Screen name="FollowTeams" component={FollowTeams} options={{}} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{}} />
    <Stack.Screen
      name="EmailVerificationScreen"
      component={EmailVerificationScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="BottomTab"
      component={BottomTab}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="TotalTeamsScreen"
      component={TotalTeamsScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="AddNameScreen"
      component={AddNameScreen}
      options={{title: ''}}
    />
    <Stack.Screen
      name="AddBirthdayScreen"
      component={AddBirthdayScreen}
      // options={{headerShown: true}}
      options={{title: ''}}
    />
    <Stack.Screen
      name="ChooseGenderScreen"
      component={ChooseGenderScreen}
      options={{title: ''}}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
