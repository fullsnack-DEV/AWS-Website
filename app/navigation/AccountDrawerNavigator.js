import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import AccountScreen from '../screens/account/AccountScreen';
import HomeNavigator from './HomeNavigator';

// import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
// import GameDetail from '../screens/account/schedule/GameDetail';
// import GameRecording from '../screens/account/schedule/GameRecording';
// import GameDetailRecord from '../screens/account/schedule/GameDetailRecord';
// import GameRecordList from '../screens/account/schedule/GameRecordList';
// import RegisterPlayer from '../screens/account/registerPlayer';
// import RegisterPlayerForm2 from '../screens/account/registerPlayer/registerPlayerForm2';
// import RegisterReferee from '../screens/account/registerReferee';
// import RegisterRefereeForm2 from '../screens/account/registerReferee/registerRefereeForm2';
// import CreateTeamForm1 from '../screens/account/createGroup/createTeam/createTeamForm1';
// import CreateTeamForm2 from '../screens/account/createGroup/createTeam/createTeamForm2';
// import CreateTeamForm3 from '../screens/account/createGroup/createTeam/createTeamForm3';
// import CreateTeamForm4 from '../screens/account/createGroup/createTeam/createTeamForm4';
// import SearchPlayerScreen from '../screens/account/createGroup/createTeam/searchPlayer';
// import TeamCreatedScreen from '../screens/account/createGroup/createTeam/teamCreated';

// import CreateClubForm1 from '../screens/account/createGroup/createClub/createClubForm1';
// import CreateClubForm2 from '../screens/account/createGroup/createClub/createClubForm2';
// import CreateClubForm3 from '../screens/account/createGroup/createClub/createClubForm3';
// import ClubCreatedScreen from '../screens/account/createGroup/createClub/clubCreated';

// import SearchLocationScreen from '../screens/account/commonScreen/searchLocation';

// import JoinedTeamsScreen from '../screens/account/teams';
// import JoinedClubsScreen from '../screens/account/clubs';

// import GroupSettingPrivacyScreen from '../screens/account/groupSettingPrivacy';
// import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy';
// import ChangePasswordScreen from '../screens/account/userSettingPrivacy/changePassword'
// import PersonalInformationScreen from '../screens/account/userSettingPrivacy/personalInformation'

const Drawer = createDrawerNavigator();

const AccountDrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <AccountScreen {...props} />}
   drawerPosition={'right'}
   openByDefault={false}
   drawerStyle={{ width: '76%' }}>
    <Drawer.Screen name="Home" component={ HomeNavigator } />

  </Drawer.Navigator>
)

export default AccountDrawerNavigator;
