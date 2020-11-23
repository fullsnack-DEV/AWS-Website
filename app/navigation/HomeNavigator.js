import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import EditPersonalProfileScreen from '../screens/home/user/EditPersonalProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import colors from '../Constants/Colors'
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import strings from '../Constants/String';
import UserAboutScreen from '../screens/home/user/UserAboutScreen';
import UserBasicInfoScreen from '../screens/home/user/UserBasicInfoScreen';
import GroupBioScreen from '../screens/home/GroupBioScreen'
import EditGroupContactScreen from '../screens/home/EditGroupContactScreen';

// Account's Screens
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import SoccerRecording from '../screens/game/soccer/SoccerRecording';
import GameDetailRecord from '../screens/account/schedule/GameDetailRecord';

import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/RegisterPlayerForm2';
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
import RegisterRefereeForm2 from '../screens/account/registerReferee/RegisterRefereeForm2';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/CreateTeamForm1';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/CreateTeamForm2';
import CreateTeamForm3 from '../screens/account/createGroup/createTeam/CreateTeamForm3';
import CreateTeamForm4 from '../screens/account/createGroup/createTeam/CreateTeamForm4';
import SearchPlayerScreen from '../screens/account/createGroup/createTeam/SearchPlayerScreen';
import TeamCreatedScreen from '../screens/account/createGroup/createTeam/TeamCreatedScreen';

import CreateClubForm1 from '../screens/account/createGroup/createClub/CreateClubForm1';
import CreateClubForm2 from '../screens/account/createGroup/createClub/CreateClubForm2';
import CreateClubForm3 from '../screens/account/createGroup/createClub/CreateClubForm3';
import ClubCreatedScreen from '../screens/account/createGroup/createClub/ClubCreatedScreen';

// import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import JoinedClubsScreen from '../screens/account/JoinedClubsScreen';

import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen'
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen'

import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import UserNotFoundScreen from '../screens/account/groupConnections/UserNotFoundScreen';
import MemberProfileCreatedScreen from '../screens/account/groupConnections/MemberProfileCreatedScreen';
import UserFoundScreen from '../screens/account/groupConnections/UserFoundScreen';
import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import CreateMemberProfileTeamForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm2';
import CreateMemberProfileClubForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm2';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';
import ConnectionReqSentScreen from '../screens/account/groupConnections/ConnectionReqSentScreen';
import ClubSettingScreen from '../screens/account/groupConnections/ClubSettingScreen';
import ConnectMemberAccountScreen from '../screens/account/groupConnections/ConnectMemberAccountScreen';
import EditMemberInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberInfoScreen';
import EditMemberBasicInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberBasicInfoScreen';
import EditMemberTeamInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberTeamInfoScreen';
import EditMemberClubInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberClubInfoScreen';
import EditClubNotesScreen from '../screens/account/groupConnections/editMemberProfile/EditClubNotesScreen';

import EventScreen from '../screens/account/schedule/EventScreen';
import CreateEventScreen from '../screens/account/schedule/CreateEventScreen';
import DefaultColorScreen from '../screens/account/schedule/DefaultColorScreen';
import GroupEventScreen from '../screens/account/schedule/GroupEventScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';

// Create challenge
import CreateChallengeForm1 from '../screens/challenge/createChallenge/CreateChallengeForm1';
import CreateChallengeForm2 from '../screens/challenge/createChallenge/CreateChallengeForm2';
import CreateChallengeForm3 from '../screens/challenge/createChallenge/CreateChallengeForm3';
import CreateChallengeForm4 from '../screens/challenge/createChallenge/CreateChallengeForm4';
import CreateChallengeForm5 from '../screens/challenge/createChallenge/CreateChallengeForm5';
import ChooseDateTimeScreen from '../screens/challenge/createChallenge/ChooseDateTimeScreen';

import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';

import ViewPrivacyScreen from '../screens/account/schedule/ViewPrivacyScreen';
import EditEventScreen from '../screens/account/schedule/EditEventScreen';
import EditChallengeAvailability from '../screens/account/schedule/EditChallengeAvailability';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import SoccerApproveDisapproveConfirmation
  from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      }}>

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
        name="EditPersonalProfileScreen"
        component={EditPersonalProfileScreen}
        options={{
          title: 'Edit Profile',
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
      name="WritePostScreen"
      component={ WritePostScreen }
      options={ {
        title: 'Write Post',
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
      } }
    />

    <Stack.Screen
        name="WriteCommentScreen"
        component={ WriteCommentScreen }
        options={ {
          title: 'Write Comment',
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
        name="UserAboutScreen"
        component={UserAboutScreen}
        options={{
          title: strings.editabouttitle,
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
        name="UserBasicInfoScreen"
        component={UserBasicInfoScreen}
        options={{
          title: strings.editbasicinfotitle,
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
        name="SearchLocationScreen"
        component={SearchLocationScreen}
        options={{
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        }}
      />
    <Stack.Screen
        name="GroupMembersScreen"
        component={ GroupMembersScreen }
        options={ {
          title: 'Connection',
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

    {/* Accounts screens */}

    <Stack.Screen
      name="ScheduleScreen"
      component={ScheduleScreen}
      options={{
        title: 'Schedule',
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
      name="GameDetail"
      component={GameDetail}
      options={{
        title: 'Game',
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
      name="EventScreen"
      component={EventScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditEventScreen"
      component={EditEventScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CreateEventScreen"
      component={CreateEventScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditChallengeAvailability"
      component={EditChallengeAvailability}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="DefaultColorScreen"
      component={DefaultColorScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="GroupEventScreen"
      component={GroupEventScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ViewPrivacyScreen"
      component={ViewPrivacyScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
          name="SoccerHome"
          component={SoccerHome}
          options={{
            headerShown: false,
          }}
      />
    <Stack.Screen
      name="SoccerRecording"
      component={SoccerRecording}
      options={{
        title: 'Match Record',
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
          name="SoccerRecordList"
          component={ SoccerRecordList }
          options={ {
            title: 'Match Record',
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
          name="SoccerApproveDisapproveConfirmation"
          component={ SoccerApproveDisapproveConfirmation }
          options={ {
            title: 'Match Record',
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
      name="GameDetailRecord"
      component={GameDetailRecord}
      options={{
        title: 'Match Record',
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
        component={ RegisterPlayer }
        options={ {
          title: 'Register as a personal player',
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
        name="RegisterPlayerForm2"
        component={ RegisterPlayerForm2 }
        options={ {
          title: 'Register as a personal player',
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
        name="RegisterReferee"
        component={ RegisterReferee }
        options={ {
          title: 'Register as a referee',
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
        name="RegisterRefereeForm2"
        component={ RegisterRefereeForm2 }
        options={ {
          title: 'Register as a referee',
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
        name="CreateTeamForm1"
        component={ CreateTeamForm1 }
        options={ {
          title: 'Create a Team',
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
        name="CreateTeamForm2"
        component={ CreateTeamForm2 }
        options={ {
          title: 'Create a Team',
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
        name="CreateTeamForm3"
        component={ CreateTeamForm3 }
        options={ {
          title: 'Create a Team',
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
        name="CreateTeamForm4"
        component={ CreateTeamForm4 }
        options={ {
          title: 'Create a Team',
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
        name="CreateClubForm1"
        component={ CreateClubForm1 }
        options={ {
          title: 'Create a Club',
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
        name="CreateClubForm2"
        component={ CreateClubForm2 }
        options={ {
          title: 'Create a Club',
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
        name="CreateClubForm3"
        component={ CreateClubForm3 }
        options={ {
          title: 'Create a Club',
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
        name="TeamCreatedScreen"
        component={ TeamCreatedScreen }
        options={ {
          // headerTransparent: true,
          // title: ' ',
          // headerTintColor: colors.whiteColor,
          headerShown: false,
        } }
      />
    <Stack.Screen
        name="ClubCreatedScreen"
        component={ ClubCreatedScreen }
        options={ {
          // headerTransparent: true,
          // title: ' ',
          // headerTintColor: colors.whiteColor,
          headerShown: false,
        } }
      />
    {/* <Stack.Screen
        name="SearchLocationScreen"
        component={ SearchLocationScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      /> */}
    <Stack.Screen
        name="SearchPlayerScreen"
        component={ SearchPlayerScreen }
        options={ {
          title: 'Choose a Player',
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
        name="JoinedTeamsScreen"
        component={ JoinedTeamsScreen }
        options={ {
          title: 'Teams',
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
        name="JoinedClubsScreen"
        component={ JoinedClubsScreen }
        options={ {
          title: 'Clubs',
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
        name="GroupSettingPrivacyScreen"
        component={ GroupSettingPrivacyScreen }
        options={ {
          title: 'Setting & Privacy',
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
        name="UserSettingPrivacyScreen"
        component={ UserSettingPrivacyScreen }
        options={ {
          title: 'Setting & Privacy',
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
        name="ChangePasswordScreen"
        component={ ChangePasswordScreen }
        options={ {
          title: 'Change Password',
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
        name="PersonalInformationScreen"
        component={ PersonalInformationScreen }
        options={ {
          title: 'Personal Information',
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
        name="MembersProfileScreen"
        component={ MembersProfileScreen }
        options={ {
          title: 'Member Profile',
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
        name="InviteMembersByEmailScreen"
        component={ InviteMembersByEmailScreen }
        options={ {
          title: 'Invite by Email',
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
        name="InviteMembersBySearchScreen"
        component={ InviteMembersBySearchScreen }
        options={ {
          title: 'Invite by Search',
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
        name="InvitationSentScreen"
        component={ InvitationSentScreen }
        options={ { headerShown: false } }
      />
    <Stack.Screen
        name="UserNotFoundScreen"
        component={ UserNotFoundScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="MemberProfileCreatedScreen"
        component={ MemberProfileCreatedScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="UserFoundScreen"
        component={ UserFoundScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="MembersViewPrivacyScreen"
        component={ MembersViewPrivacyScreen }
        options={ {
          title: 'View Privacy',
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
        name="CreateMemberProfileForm1"
        component={ CreateMemberProfileForm1 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileTeamForm2"
        component={ CreateMemberProfileTeamForm2 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileClubForm2"
        component={ CreateMemberProfileClubForm2 }
        options={ {
          title: 'Create Member Profile',
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
        name="CreateMemberProfileClubForm3"
        component={ CreateMemberProfileClubForm3 }
        options={ {
          title: 'Create Member Profile',
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
        name="ConnectionReqSentScreen"
        component={ ConnectionReqSentScreen }
        options={ {
          headerTransparent: true,
          title: ' ',
          headerTintColor: colors.whiteColor,
        } }
      />
    <Stack.Screen
        name="ClubSettingScreen"
        component={ ClubSettingScreen }
        options={ {
          title: 'Settings',
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
        name="ConnectMemberAccountScreen"
        component={ ConnectMemberAccountScreen }
        options={ {
          title: 'Connect Member Account',
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
        name="EditMemberInfoScreen"
        component={ EditMemberInfoScreen }
        options={ {
          title: 'Name',
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
        name="EditMemberBasicInfoScreen"
        component={ EditMemberBasicInfoScreen }
        options={ {
          title: 'Basic Info',
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
        name="EditMemberTeamInfoScreen"
        component={ EditMemberTeamInfoScreen }
        options={ {
          title: '',
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
        name="EditMemberClubInfoScreen"
        component={ EditMemberClubInfoScreen }
        options={ {
          title: '',
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
        name="EditClubNotesScreen"
        component={ EditClubNotesScreen }
        options={ {
          title: '',
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
        name="CreateChallengeForm1"
        component={ CreateChallengeForm1 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateChallengeForm2"
        component={ CreateChallengeForm2 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateChallengeForm3"
        component={ CreateChallengeForm3 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateChallengeForm4"
        component={ CreateChallengeForm4 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="CreateChallengeForm5"
        component={ CreateChallengeForm5 }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="ChooseDateTimeScreen"
        component={ ChooseDateTimeScreen }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="ChooseAddressScreen"
        component={ ChooseAddressScreen }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="ChallengeSentScreen"
        component={ ChallengeSentScreen }
        options={ {
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
        } }
      />

    <Stack.Screen
        name="GroupBioScreen"
        component={GroupBioScreen}
        options={{
          title: strings.editbio,
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
        name="EditGroupContactScreen"
        component={EditGroupContactScreen}
        options={{
          title: strings.editcontact,
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

export default HomeNavigator;
