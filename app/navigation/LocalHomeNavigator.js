import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import colors from '../Constants/Colors'
import LocalHomeScreen from '../screens/localhome/LocalHomeScreen';
import RecentMatchScreen from '../screens/localhome/RecentMatchScreen';
import UpcomingMatchScreen from '../screens/localhome/UpcomingMatchScreen';
import LookingForChallengeScreen from '../screens/localhome/LookingForChallengeScreen';
import HiringPlayerScreen from '../screens/localhome/HiringPlayerScreen';
import LookingTeamScreen from '../screens/localhome/LookingTeamScreen';
import RefereesListScreen from '../screens/localhome/RefereesListScreen';
import ScorekeeperListScreen from '../screens/localhome/ScorekeeperListScreen';
import SearchCityScreen from '../screens/localhome/SearchCityScreen';
import ShortsPlayScreen from '../screens/localhome/shorts/ShortsPlayScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';

const Stack = createStackNavigator();

const LocalHomeNavigator = () => (
  <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        gestureEnabled: false,
        headerBackTitleVisible: false,
        // <Image source={images.backArrow} style={{height:12,width:12,resizeMode:'contain'}} />,

      }}>
    <Stack.Screen
        name="LocalHomeScreen"
        component={LocalHomeScreen}
        options={{ headerShown: false }}
      />
    <Stack.Screen
        name="RecentMatchScreen"
        component={RecentMatchScreen}
        options={{
          title: 'Recent Matches',
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
        name="UpcomingMatchScreen"
        component={UpcomingMatchScreen}
        options={{
          title: 'Upcoming Matches',
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
        name="LookingForChallengeScreen"
        component={LookingForChallengeScreen}
        options={{
          title: 'Looking for a challenge',
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
        name="HiringPlayerScreen"
        component={HiringPlayerScreen}
        options={{
          title: 'Hiring players',
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
        name="LookingTeamScreen"
        component={LookingTeamScreen}
        options={{
          title: 'Looking for a Team',
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
        name="RefereesListScreen"
        component={RefereesListScreen}
        options={{
          title: 'Referees',
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
        name="ScorekeeperListScreen"
        component={ScorekeeperListScreen}
        options={{
          title: 'Scorekeepers',
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
    <Stack.Screen name={'FeedViewScreen'} component={FeedViewScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default LocalHomeNavigator;
