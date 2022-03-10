import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import colors from '../Constants/Colors';
import LocalHomeScreen from '../screens/localhome/LocalHomeScreen';
import RecentMatchScreen from '../screens/localhome/RecentMatchScreen';
import UpcomingMatchScreen from '../screens/localhome/UpcomingMatchScreen';
import LookingForChallengeScreen from '../screens/localhome/LookingForChallengeScreen';
import LookingTeamScreen from '../screens/localhome/LookingTeamScreen';
import RefereesListScreen from '../screens/localhome/RefereesListScreen';
import ScorekeeperListScreen from '../screens/localhome/ScorekeeperListScreen';
import SearchCityScreen from '../screens/localhome/SearchCityScreen';
import ShortsPlayScreen from '../screens/localhome/shorts/ShortsPlayScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';
import ScorekeeperAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperAgreementScreen';
import RefereeAgreementScreen from '../screens/challenge/createChallenge/RefereeAgreementScreen';
import ScorekeeperInviteAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperInviteAgreementScreen';
import RefereeInviteAgreementScreen from '../screens/challenge/createChallenge/RefereeInviteAgreementScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import TennisHome from '../screens/game/tennis/TennisHome';
import SportSettingScreen from '../screens/localhome/SportSettingScreen';
import AddOrDeleteSport from '../screens/localhome/AddOrDeleteSport';
import RecruitingPlayerScreen from '../screens/localhome/RecruitingPlayerScreen';
import EntitySearchScreen from '../screens/EntitySearchScreen';

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
      options={{
        title: '',
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
        title: 'Availble For Challenge',
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
      name="RefereeAgreementScreen"
      component={RefereeAgreementScreen}
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
      name="ScorekeeperAgreementScreen"
      component={ScorekeeperAgreementScreen}
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
      name="RefereeInviteAgreementScreen"
      component={RefereeInviteAgreementScreen}
      options={{
        title: 'Invite to Challenge',
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
      name="ScorekeeperInviteAgreementScreen"
      component={ScorekeeperInviteAgreementScreen}
      options={{
        title: 'Invite to Challenge',
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
      name="RecruitingPlayerScreen"
      component={RecruitingPlayerScreen}
      options={{
        title: 'Recruiting players',
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
    <Stack.Screen
      name={'FeedViewScreen'}
      component={FeedViewScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'Home',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="SportSettingScreen"
      component={SportSettingScreen}
      options={{
        title: 'Sports',
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
      name="AddOrDeleteSport"
      component={AddOrDeleteSport}
      options={{
        title: 'Sports',
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
      name="SoccerHome"
      component={SoccerHome}
      options={{
        tabBarVisible: false,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="TennisHome"
      component={TennisHome}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EntitySearchScreen"
      component={EntitySearchScreen}
      options={{
        title: 'Search',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        // headerShown: false,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
  </Stack.Navigator>
);

export default LocalHomeNavigator;
