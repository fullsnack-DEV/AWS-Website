import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import colors from '../Constants/Colors';
import RecentMatchScreen from '../screens/localhome/RecentMatchScreen';
import UpcomingMatchScreen from '../screens/localhome/UpcomingMatchScreen';
import LookingForChallengeScreen from '../screens/localhome/LookingForChallengeScreen';
import LookingTeamScreen from '../screens/localhome/LookingTeamScreen';
import RefereesListScreen from '../screens/localhome/RefereesListScreen';
import ScorekeeperListScreen from '../screens/localhome/ScorekeeperListScreen';
import SearchCityScreen from '../screens/localhome/SearchCityScreen';
import ShortsPlayScreen from '../screens/localhome/shorts/ShortsPlayScreen';
import RecruitingPlayerScreen from '../screens/localhome/RecruitingPlayerScreen';
import {strings} from '../../Localization/translation';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';
import fonts from '../Constants/Fonts';
import JoinTeamScreen from '../screens/localhome/JoinTeamScreen';
import JoinClubScreen from '../screens/localhome/JoinClubScreen';
import LocalHomEventScreen from '../screens/localhome/LocalHomEventScreen';
import VenueScreen from '../screens/localhome/VenueScreen';

const Stack = createStackNavigator();

const LocalHomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerBackTitleVisible: false,
      headerTitleStyle: {
        textAlign: 'center',
        fontFamily: fonts.RBold,

        fontSize: 16,
        lineHeight: 17,
        paddingTop: 5,
        color: colors.lightBlackColor,
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerStyle: {
        backgroundColor: colors.whiteColor,
        borderBottomColor: colors.grayColor,
        borderBottomWidth: 0.3,
      },
    }}>
    <Stack.Screen
      name="RecentMatchScreen"
      component={RecentMatchScreen}
      options={{
        title: strings.completedMatches,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="JoinTeamScreen"
      component={JoinTeamScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="JoinClubScreen"
      component={JoinClubScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="UpcomingMatchScreen"
      component={UpcomingMatchScreen}
      options={{
        title: strings.upcomingMatchesTitle,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="LookingForChallengeScreen"
      component={LookingForChallengeScreen}
      options={{
        title: 'Availble For Challenge',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="RecruitingPlayerScreen"
      component={RecruitingPlayerScreen}
      options={{
        title: strings.groupsRecruitingMembers,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="LookingTeamScreen"
      component={LookingTeamScreen}
      options={{
        title: strings.individualsLookingforGroups,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="VenueScreen"
      component={VenueScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="RefereesListScreen"
      component={RefereesListScreen}
      options={{
        title: strings.refereesAvailable,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="ScorekeeperListScreen"
      component={ScorekeeperListScreen}
      options={{
        title: strings.scoreKeeperAvailable,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="SearchCityScreen"
      component={SearchCityScreen}
      options={{
        title: 'Search Location',
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

    <Stack.Screen
      name="ShortsPlayScreen"
      component={ShortsPlayScreen}
      options={{
        title: '',
        headerTintColor: colors.whiteColor,
        headerTitleStyle: {
          fontWeight: '500',
        },

        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.yellowColor,
          borderBottomColor: colors.blackColor,
          borderBottomWidth: 0,
        },
      }}
    />

    <Stack.Screen
      name="ChooseAddressScreen"
      component={ChooseAddressScreen}
      options={{
        title: 'Venue',
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
      name="LocalHomEventScreen"
      component={LocalHomEventScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default LocalHomeNavigator;
