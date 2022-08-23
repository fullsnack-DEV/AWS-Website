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
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import ClubCreatedScreen from '../screens/account/createGroup/createClub/ClubCreatedScreen';
import TeamCreatedScreen from '../screens/account/createGroup/createTeam/TeamCreatedScreen';
import CreateClubForm3 from '../screens/account/createGroup/createClub/CreateClubForm3';
import CreateClubForm2 from '../screens/account/createGroup/createClub/CreateClubForm2';
import CreateClubForm1 from '../screens/account/createGroup/createClub/CreateClubForm1';
import CreateTeamForm4 from '../screens/account/createGroup/createTeam/CreateTeamForm4';
import CreateTeamForm3 from '../screens/account/createGroup/createTeam/CreateTeamForm3';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/CreateTeamForm2';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/CreateTeamForm1';
import RegisterPlayerSuccess from '../screens/account/registerPlayer/RegisterPlayerSuccess';
import RegisterRefereeSuccess from '../screens/account/registerReferee/RegisterRefereeSuccess';
import RegisterRefereeForm2 from '../screens/account/registerReferee/RegisterRefereeForm2';
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/RegisterPlayerForm2';
import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterScorekeeper from '../screens/account/registerScorekeeper/RegisterScorekeeper';
import RegisterScorekeeperForm2 from '../screens/account/registerScorekeeper/RegisterScorekeeperForm2';
import RegisterScorekeeperSuccess from '../screens/account/registerScorekeeper/RegisterScorekeeperSuccess';

import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

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
        headerShown: false,
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
    <Stack.Screen
      name="WritePostScreen"
      component={WritePostScreen}
      options={{
        title: 'Write Post',
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
      name="RegisterPlayer"
      component={RegisterPlayer}
      options={{
        title: 'Add Sport',
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
      name="RegisterPlayerForm2"
      component={RegisterPlayerForm2}
      options={{
        title: 'Add Sport',
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
      name="RegisterReferee"
      component={RegisterReferee}
      options={{
        title: 'Register as Referee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          alignSelf: 'center',
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
      name="RegisterRefereeForm2"
      component={RegisterRefereeForm2}
      options={{
        title: 'Register as Referee',
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
      name="RegisterRefereeSuccess"
      component={RegisterRefereeSuccess}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="RegisterScorekeeperSuccess"
      component={RegisterScorekeeperSuccess}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="RegisterPlayerSuccess"
      component={RegisterPlayerSuccess}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="RegisterScorekeeper"
      component={RegisterScorekeeper}
      options={{
        title: 'Register as Scorekeeper',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          alignSelf: 'center',
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
      name="RegisterScorekeeperForm2"
      component={RegisterScorekeeperForm2}
      options={{
        title: 'Register as Scorekeeper',
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
      name="CreateTeamForm1"
      component={CreateTeamForm1}
      options={{
        title: 'Create Team',
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
      name="CreateTeamForm2"
      component={CreateTeamForm2}
      options={{
        title: 'Create Team',
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
      name="CreateTeamForm3"
      component={CreateTeamForm3}
      options={{
        title: 'Create Team',
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
      name="CreateTeamForm4"
      component={CreateTeamForm4}
      options={{
        title: 'Create Team',
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
      name="CreateClubForm1"
      component={CreateClubForm1}
      options={{
        title: 'Create Club',
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
      name="CreateClubForm2"
      component={CreateClubForm2}
      options={{
        title: 'Create Club',
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
      name="CreateClubForm3"
      component={CreateClubForm3}
      options={{
        title: 'Create Club',
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
      name="TeamCreatedScreen"
      component={TeamCreatedScreen}
      options={{
        // headerTransparent: true,
        // title: ' ',
        // headerTintColor: colors.whiteColor,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ClubCreatedScreen"
      component={ClubCreatedScreen}
      options={{
        // headerTransparent: true,
        // title: ' ',
        // headerTintColor: colors.whiteColor,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="SearchLocationScreen"
      component={SearchLocationScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
  </Stack.Navigator>
);

export default LocalHomeNavigator;
