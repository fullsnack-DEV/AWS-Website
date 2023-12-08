import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import GroupListScreen from '../screens/home/GroupListScreen';
import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';
import UserAboutScreen from '../screens/home/user/UserAboutScreen';
import UserBasicInfoScreen from '../screens/home/user/UserBasicInfoScreen';
import GroupLongTextScreen from '../screens/home/GroupLongTextScreen';
import GameFeeEditScreen from '../screens/home/GameFeeEditScreen';
import EditGroupContactScreen from '../screens/home/EditGroupContactScreen';
import EditGroupBasicInfoScreen from '../screens/home/EditGroupBasicInfoScreen';

// Account's Screens
import GameDetail from '../screens/account/schedule/GameDetail';
import SoccerRecording from '../screens/game/soccer/SoccerRecording';
import TennisRecording from '../screens/game/tennis/TennisRecording';
import GameDetailRecord from '../screens/game/soccer/GameDetailRecord';
import SearchPlayerScreen from '../screens/account/createGroup/createTeam/SearchPlayerScreen';

import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import ClubSettingScreen from '../screens/account/groupConnections/ClubSettingScreen';
import EditClubNotesScreen from '../screens/account/groupConnections/editMemberProfile/EditClubNotesScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import TennisHome from '../screens/game/tennis/TennisHome';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import SoccerApproveDisapproveConfirmation from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';
import EditChallengeAvailability from '../screens/account/schedule/EditChallengeAvailability';
import LeaveReview from '../screens/game/leaveReview/LeaveReview';
import TennisRecordList from '../screens/game/tennis/TennisRecordList';
import BookReferee from '../screens/game/bookReferee/refereeList/BookReferee';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import UserConnections from '../screens/account/connections/UserConnections';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';

import CurrencySettingScreen from '../screens/account/CurrencySettingScreen';
import TennisDeletedRecordScreen from '../screens/game/tennis/TennisDeletedRecordScreen';
import ReviewPlayerList from '../components/game/soccer/home/review/reviewForPlayer/ReviewPlayerList';
import PlayerReviewScreen from '../components/game/soccer/home/review/reviewForPlayer/PlayerReviewScreen';
import ReviewRefereeList from '../components/game/soccer/home/review/reviewForReferee/ReviewRefereeList';
import RefereeReviewScreen from '../components/game/soccer/home/review/reviewForReferee/RefereeReviewScreen';
import WriteReviewScreen from '../components/game/soccer/home/review/WriteReviewScreen';

import ReviewScorekeeperList from '../components/game/soccer/home/review/reviewForScorekeeper/ReviewScorekeeperList';
import ScorekeeperReviewScreen from '../components/game/soccer/home/review/reviewForScorekeeper/ScorekeeperReviewScreen';
import fonts from '../Constants/Fonts';
import ScorekeeperAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperAgreementScreen';
import RefereeAgreementScreen from '../screens/challenge/createChallenge/RefereeAgreementScreen';
import RefereeInviteAgreementScreen from '../screens/challenge/createChallenge/RefereeInviteAgreementScreen';
import ScorekeeperInviteAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperInviteAgreementScreen';
import SportActivityScreen from '../screens/home/SportActivityScreen';
import SportActivityTagScreen from '../screens/home/SportActivityTagScreen';

import EntityInfoScreen from '../screens/home/EntityInfoScreen';
import EntityScoreboardScreen from '../screens/home/EntityScoreboardScreen';
import EntityGallaryScreen from '../screens/home/EntityGallaryScreen';
import EntityReviewScreen from '../screens/home/EntityReviewScreen';
import EntityStatScreen from '../screens/home/EntityStatScreen';
import ActivitySettingScreen from '../screens/account/userSettingPrivacy/sportsActivity/ActivitySettingScreen';
import SportHideUnhideScreen from '../screens/home/SportHideUnhideScreen';
import SportActivitiesScreen from '../components/Home/SportActivitiesScreen';
import ChangeSportsOrderScreen from '../screens/account/schedule/ChangeSportsOrderScreen';
import ChangeOtherListScreen from '../screens/account/schedule/ChangeOtherListScreen';
import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';
import ReviewDetailsScreen from '../screens/home/SportActivity/ReviewDetailsScreen';
import MembershipFeeScreen from '../screens/home/MembershipFeeScreen';
import GroupFollowersScreen from '../screens/account/groupConnections/GroupFollowersScreen';
import EventsListScreen from '../screens/account/schedule/EventsListScreen';
import PrivacySettingsScreen from '../screens/home/SportActivity/PrivacySettingsScreen';
import ReplyScreen from '../screens/home/SportActivity/contentScreens/ReplyScreen';
import UserGalleryScreen from '../screens/home/user/UserGalleryScreen';
import UserScoreboardScreen from '../screens/home/user/UserScoreboardScreen';
import InviteChallengeScreen from '../screens/challenge/createChallenge/InviteChallengeScreen';
import ChooseVenueScreen from '../screens/challenge/manageChallenge/ChooseVenueScreen';
import ChallengePreviewScreen from '../screens/challenge/createChallenge/ChallengePreviewScreen';
import ChallengePaymentScreen from '../screens/challenge/createChallenge/ChallengePaymentScreen';
import ChooseTimeSlotScreen from '../screens/challenge/createChallenge/ChooseTimeSlotScreen';
import ChallengeScreen from '../screens/challenge/createChallenge/ChallengeScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import HomeScheduleScreen from '../screens/home/HomeScheduleScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      // headerTintColor: colors.blackColor,
      // headerTransparent: true,
      // headerTitle: true,
      gestureEnabled: false,
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
      name="SportActivityHome"
      component={SportActivityHome}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EditWrapperScreen"
      component={EditWrapperScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="PrivacySettingsScreen"
      component={PrivacySettingsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ReviewDetailsScreen"
      component={ReviewDetailsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ReplyScreen"
      component={ReplyScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="GroupListScreen"
      component={GroupListScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="InviteChallengeScreen"
      component={InviteChallengeScreen}
      options={{
        title: strings.inviteToChallenge,
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
      name="ChallengeScreen"
      component={ChallengeScreen}
      options={{
        title: strings.challenge,
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
      name="ChooseVenueScreen"
      component={ChooseVenueScreen}
      options={{
        title: strings.venueText,
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
      name="ChallengePreviewScreen"
      component={ChallengePreviewScreen}
      options={{
        title: strings.challenge,
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
      name="ChallengePaymentScreen"
      component={ChallengePaymentScreen}
      options={{
        title: strings.challenge,
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
      name="ChooseTimeSlotScreen"
      component={ChooseTimeSlotScreen}
      options={{
        title: strings.chooseDateTimeText,
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
      name="UserScoreboardScreen"
      component={UserScoreboardScreen}
      options={{
        title: strings.scoreboard,
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
      }}
    />

    <Stack.Screen
      component={GroupFollowersScreen}
      name="GroupFollowersScreen"
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserGalleryScreen"
      component={UserGalleryScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="EventsListScreen"
      component={EventsListScreen}
      options={{
        title: strings.events,
        headerShown: false,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="EntityInfoScreen"
      component={EntityInfoScreen}
      options={{
        title: 'Info',
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
      name="EntityReviewScreen"
      component={EntityReviewScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EntityStatScreen"
      component={EntityStatScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="EntityScoreboardScreen"
      component={EntityScoreboardScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EntityGallaryScreen"
      component={EntityGallaryScreen}
      options={{headerShown: false}}
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
      name="EditChallengeAvailability"
      component={EditChallengeAvailability}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="HomeScheduleScreen"
      component={HomeScheduleScreen}
      options={{
        headerShown: false,
      }}
    />

    {/* Soccer */}
    <Stack.Screen
      name="SoccerHome"
      component={SoccerHome}
      options={{
        tabBarVisible: false,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="LeaveReview"
      component={LeaveReview}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="SoccerRecording"
      component={SoccerRecording}
      options={{
        title: 'Match Records',
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
      name="TennisRecording"
      component={TennisRecording}
      options={{
        title: 'Match Records',
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
      component={SoccerRecordList}
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
      name="SoccerApproveDisapproveConfirmation"
      component={SoccerApproveDisapproveConfirmation}
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

    {/* Tennis */}
    <Stack.Screen
      name="TennisHome"
      component={TennisHome}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="TennisRecordList"
      component={TennisRecordList}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="TennisDeletedRecordScreen"
      component={TennisDeletedRecordScreen}
      options={{
        headerShown: false,
      }}
    />
    {/*  Book A Referee */}
    <Stack.Screen
      name="BookReferee"
      component={BookReferee}
      options={{
        title: 'Book a referee',
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
      name="RefereeBookingDateAndTime"
      component={RefereeBookingDateAndTime}
      options={{
        title: 'Book a referee',
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

    {/*  Book A Scorekeeper */}

    {/*  Connections */}
    <Stack.Screen
      name="UserConnections"
      component={UserConnections}
      options={{
        title: strings.connections,
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
      name="SearchPlayerScreen"
      component={SearchPlayerScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="MembersViewPrivacyScreen"
      component={MembersViewPrivacyScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="ClubSettingScreen"
      component={ClubSettingScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="EditClubNotesScreen"
      component={EditClubNotesScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="GroupLongTextScreen"
      component={GroupLongTextScreen}
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

    <Stack.Screen
      name="EditGroupBasicInfoScreen"
      component={EditGroupBasicInfoScreen}
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
      }}
    />

    <Stack.Screen
      name="MembershipFeeScreen"
      component={MembershipFeeScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="GameFeeEditScreen"
      component={GameFeeEditScreen}
      options={{
        title: strings.gamefeetitle,
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
      name="EditRefereeFeeScreen"
      component={EditRefereeFeeScreen}
      options={{
        title: strings.refereeFee,
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
      name="CurrencySettingScreen"
      component={CurrencySettingScreen}
      options={{
        title: 'Currency Setting',
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
      name="ReviewPlayerList"
      component={ReviewPlayerList}
      options={{
        title: 'Player',
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
      name="PlayerReviewScreen"
      component={PlayerReviewScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReviewRefereeList"
      component={ReviewRefereeList}
      options={{
        title: 'Referee',
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
      name="RefereeReviewScreen"
      component={RefereeReviewScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="WriteReviewScreen"
      component={WriteReviewScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="ScorekeeperReviewScreen"
      component={ScorekeeperReviewScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReviewScorekeeperList"
      component={ReviewScorekeeperList}
      options={{
        title: 'Referee',
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
      name="SportActivityScreen"
      component={SportActivityScreen}
      options={{
        title: 'Sports Activities',
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
      name="ActivitySettingScreen"
      component={ActivitySettingScreen}
      options={{
        title: ' ',
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
      name="SportActivitiesScreen"
      component={SportActivitiesScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SportActivityTagScreen"
      component={SportActivityTagScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ChangeSportsOrderScreen"
      component={ChangeSportsOrderScreen}
      options={{
        title: 'Change List of Sports',
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
      name="ChangeOtherListScreen"
      component={ChangeOtherListScreen}
      options={{
        title: 'Change List Of Organizers',
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
      name="SportHideUnhideScreen"
      component={SportHideUnhideScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="GroupMembersScreen"
      component={GroupMembersScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
