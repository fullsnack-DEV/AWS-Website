import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/authScreens/Welcome';
import ChooseSportsScreen from '../screens/authScreens/ChooseSports';
import LoginScreen from '../screens/authScreens/Login';
import ForgotPasswordScreen from '../screens/authScreens/ForgotPassword';
import ChooseLocationScreen from '../screens/authScreens/ChooseLocation';
import SignupScreen from '../screens/authScreens/SignUp';
import FollowTeams from '../screens/authScreens/FollowTeam';
import HomeScreen from '../screens/home/HomeScreen';
import TotalTeamsScreen from '../screens/authScreens/TotalTeam';
import EmailVerification from '../screens/authScreens/EmailVerifiation';
import ForgotPasswordLinkSentScreen from '../screens/authScreens/forgotPasswordLinkSent';
import AddBirthdayScreen from '../screens/authScreens/addYourBirthday';
import ChooseGenderScreen from '../screens/authScreens/chooseGender';

import BottomTab from '../components/BottomTab';
import constants from '../config/constants';

const {
  colors,
} = constants;

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator
      screenOptions={ {
        headerTintColor: colors.whiteColor,
        headerTransparent: true,
        headerTitle: false,
        headerBackTitleVisible: false,
      } }>
        <Stack.Screen
        name="WelcomeScreen"
        component={ WelcomeScreen }
        options={ { headerShown: false } }
      />
        <Stack.Screen
        name="ForgotPasswordScreen"
        component={ ForgotPasswordScreen }
        options={ {} }
      />
        <Stack.Screen
        name="ForgotPasswordLinkSentScreen"
        component={ ForgotPasswordLinkSentScreen }
        options={ {} }
      />
        <Stack.Screen name="SignupScreen" component={ SignupScreen } options={ {} } />
        <Stack.Screen name="LoginScreen" component={ LoginScreen } options={ {} } />
        <Stack.Screen
        name="ChooseLocationScreen"
        component={ ChooseLocationScreen }
        options={ {} }
      />
        <Stack.Screen
        name="ChooseSportsScreen"
        component={ ChooseSportsScreen }
        options={ {} }
      />
        <Stack.Screen name="FollowTeams" component={ FollowTeams } options={ {} } />
        <Stack.Screen name="HomeScreen" component={ HomeScreen } options={ {} } />
        <Stack.Screen
        name="EmailVerification"
        component={ EmailVerification }
        options={ {} }
      />
        <Stack.Screen
        name="BottomTab"
        component={ BottomTab }
        options={ { headerShown: false } }
      />
        <Stack.Screen
        name="TotalTeamsScreen"
        component={ TotalTeamsScreen }
        options={ {} }
      />
        <Stack.Screen
        name="AddBirthdayScreen"
        component={ AddBirthdayScreen }
        options={ {} }
      />
        <Stack.Screen
        name="ChooseGenderScreen"
        component={ ChooseGenderScreen }
        options={ {} }
      />
    </Stack.Navigator>
);

export default AuthNavigator;
