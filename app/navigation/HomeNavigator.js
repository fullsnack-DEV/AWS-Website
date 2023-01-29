import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import GroupListScreen from '../screens/home/GroupListScreen';
import EditPersonalProfileScreen from '../screens/home/user/EditPersonalProfileScreen';
import EditGroupProfileScreen from '../screens/home/EditGroupProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';

import colors from '../Constants/Colors';
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import {strings} from '../../Localization/translation';
import UserAboutScreen from '../screens/home/user/UserAboutScreen';
import UserBasicInfoScreen from '../screens/home/user/UserBasicInfoScreen';
import GroupLongTextScreen from '../screens/home/GroupLongTextScreen';
import GameFeeEditScreen from '../screens/home/GameFeeEditScreen';
import EditGroupContactScreen from '../screens/home/EditGroupContactScreen';
import EditGroupBasicInfoScreen from '../screens/home/EditGroupBasicInfoScreen';

// Account's Screens
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import SoccerRecording from '../screens/game/soccer/SoccerRecording';
import TennisRecording from '../screens/game/tennis/TennisRecording';
import GameDetailRecord from '../screens/game/soccer/GameDetailRecord';

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

import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import AddCardScreen from '../screens/account/payment/AddCardScreen';
import PayoutMethodScreen from '../screens/account/payment/PayoutMethodScreen';

// import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import JoinedClubsScreen from '../screens/account/JoinedClubsScreen';

import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen';
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen';

import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import UserNotFoundScreen from '../screens/account/groupConnections/UserNotFoundScreen';
import MemberProfileCreatedScreen from '../screens/account/groupConnections/MemberProfileCreatedScreen';
import UserFoundScreen from '../screens/account/groupConnections/UserFoundScreen';
import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import CreateMemberProfileTeamForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm3';
import CreateMemberProfileForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm2';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';
import ConnectionReqSentScreen from '../screens/account/groupConnections/ConnectionReqSentScreen';
import ClubSettingScreen from '../screens/account/groupConnections/ClubSettingScreen';
import ConnectMemberAccountScreen from '../screens/account/groupConnections/ConnectMemberAccountScreen';
import EditMemberInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberInfoScreen';
import EditMemberBasicInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberBasicInfoScreen';
import EditMemberTeamInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberTeamInfoScreen';
import EditClubNotesScreen from '../screens/account/groupConnections/editMemberProfile/EditClubNotesScreen';

import EventScreen from '../screens/account/schedule/EventScreen';
import CreateEventScreen from '../screens/account/schedule/CreateEventScreen';
import DefaultColorScreen from '../screens/account/schedule/DefaultColorScreen';
import GroupEventScreen from '../screens/account/schedule/GroupEventScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';

// Create challenge

import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';
import PayAgainScreen from '../screens/challenge/alterChallenge/PayAgainScreen';
import PayAgainRefereeScreen from '../screens/referee/PayAgainRefereeScreen';

import ViewPrivacyScreen from '../screens/account/schedule/ViewPrivacyScreen';
import EditEventScreen from '../screens/account/schedule/EditEventScreen';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import TennisHome from '../screens/game/tennis/TennisHome';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import SoccerApproveDisapproveConfirmation from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';
import EditLineUpScreen from '../screens/game/soccer/lineUp/EditLineUpScreen';
import EditLineUpCoachScreen from '../screens/game/soccer/lineUp/EditRosterCoacheScreen';
import EditChallengeAvailability from '../screens/account/schedule/EditChallengeAvailability';
import LeaveReview from '../screens/game/soccer/review/leaveReview/LeaveReview';
import TennisRecordList from '../screens/game/tennis/TennisRecordList';
import EditRosterScreen from '../screens/game/soccer/EditRosterScreen';
import EditFeeScreen from '../screens/challenge/alterChallenge/EditFeeScreen';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import CurruentReservationScreen from '../screens/challenge/alterChallenge/CurruentReservationScreen';
import BookReferee from '../screens/game/bookReferee/refereeList/BookReferee';
import RegisterRefereeSuccess from '../screens/account/registerReferee/RegisterRefereeSuccess';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import EditChallenge from '../screens/challenge/alterChallenge/EditChallenge';

import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import ChangeReservationInfoScreen from '../screens/challenge/alterChallenge/ChangeReservationInfoScreen';
import BookRefereeSuccess from '../screens/game/bookReferee/BookRefereeSuccess';
import BookScorekeeper from '../screens/game/bookScorekeeper/scorekeeperList/BookScorekeeper';
import ScorekeeperBookingDateAndTime from '../screens/game/bookScorekeeper/scorekeeperBookDateTime/ScorekeeperBookingDateAndTime';
import BookScorekeeperSuccess from '../screens/game/bookScorekeeper/BookScorekeeperSuccess';
import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';
import UserConnections from '../screens/account/connections/UserConnections';
import RefereeRequestSent from '../screens/referee/RefereeRequestSent';

import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';

import UserTagSelectionListScreen from '../screens/newsfeeds/UserTagSelectionListScreen';
import CurrencySettingScreen from '../screens/account/CurrencySettingScreen';
import TennisDeletedRecordScreen from '../screens/game/tennis/TennisDeletedRecordScreen';
import ReviewPlayerList from '../components/game/soccer/home/review/reviewForPlayer/ReviewPlayerList';
import PlayerReviewScreen from '../components/game/soccer/home/review/reviewForPlayer/PlayerReviewScreen';
import ReviewRefereeList from '../components/game/soccer/home/review/reviewForReferee/ReviewRefereeList';
import RefereeReviewScreen from '../components/game/soccer/home/review/reviewForReferee/RefereeReviewScreen';
import WriteReviewScreen from '../components/game/soccer/home/review/WriteReviewScreen';

import RegisterScorekeeper from '../screens/account/registerScorekeeper/RegisterScorekeeper';
import RegisterScorekeeperForm2 from '../screens/account/registerScorekeeper/RegisterScorekeeperForm2';
import RegisterScorekeeperSuccess from '../screens/account/registerScorekeeper/RegisterScorekeeperSuccess';
import EditPostScreen from '../screens/newsfeeds/EditPostScreen';

// Scorekeeper reservation screens
import ScorekeeperReservationScreen from '../screens/scorekeeper/ScorekeeperReservationScreen';
import ScorekeeperRequestSent from '../screens/scorekeeper/ScorekeeperRequestSent';
import EditScorekeeperReservation from '../screens/scorekeeper/alterScorekeeper/EditScorekeeperReservation';
import EditScorekeeperFeeScreen from '../screens/scorekeeper/alterScorekeeper/EditScorekeeperFeeScreen';
import PayAgainScorekeeperScreen from '../screens/scorekeeper/PayAgainScorekeeperScreen';
import CurruentScorekeeperReservationScreen from '../screens/scorekeeper/alterScorekeeper/CurruentScorekeeperReservationScreen';
import AlterScorekeeperScreen from '../screens/scorekeeper/alterScorekeeper/AlterScorekeeperScreen';
import ScorekeeperSelectMatch from '../screens/game/bookScorekeeper/selectMatch/ScorekeeperSelectMatch';
import ScorekeeperAcceptDeclineScreen from '../screens/scorekeeper/ScorekeeperAcceptDeclineScreen';
// Scorekeeper reservation screens

// Scorekeeper Review Screen
import ReviewScorekeeperList from '../components/game/soccer/home/review/reviewForScorekeeper/ReviewScorekeeperList';
import ScorekeeperReviewScreen from '../components/game/soccer/home/review/reviewForScorekeeper/ScorekeeperReviewScreen';
import RegisterPlayerSuccess from '../screens/account/registerPlayer/RegisterPlayerSuccess';
import AccountScreen from '../screens/account/AccountScreen';
import NotificationNavigator from './NotificationNavigator';
import ReservationNavigator from './ReservationNavigator';
import LeaveReviewTennis from '../screens/game/tennis/review/leaveReview/LeaveReviewTennis';
import SingleNotificationScreen from '../screens/notificationsScreen/SingleNotificationScreen';
import ManageChallengeScreen from '../screens/challenge/manageChallenge/ManageChallengeScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';
import RespondToInviteScreen from '../screens/account/createGroup/createTeam/RespondToInviteScreen';
import RefereeReservationSetting from '../screens/game/bookReferee/RefereeReservationSetting';
import ScorekeeperReservationSetting from '../screens/game/bookScorekeeper/ScorekeeperReservationSetting';
import ReservationAcceptDeclineScreen from '../screens/referee/ReservationAcceptDeclineScreen';
import fonts from '../Constants/Fonts';
import AlterChallengeScreen from '../screens/challenge/alterChallenge/AlterChallengeScreen';
import ScorekeeperAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperAgreementScreen';
import RefereeAgreementScreen from '../screens/challenge/createChallenge/RefereeAgreementScreen';
import RefereeInviteAgreementScreen from '../screens/challenge/createChallenge/RefereeInviteAgreementScreen';
import ScorekeeperInviteAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperInviteAgreementScreen';
import RefereeApprovalScreen from '../screens/referee/RefereeApprovalScreen';
import ScorekeeperApprovalScreen from '../screens/scorekeeper/ScorekeeperApprovalScreen';
import LookingForSettingScreen from '../screens/home/playInModule/LookingForSettingScreen';
import SportActivityScreen from '../screens/home/SportActivityScreen';
import SportActivityTagScreen from '../screens/home/SportActivityTagScreen';
import DeactivateSportScreen from '../components/Home/DeactivateSportScreen';
import EntitySearchScreen from '../screens/EntitySearchScreen';

import EntityInfoScreen from '../screens/home/EntityInfoScreen';
import EntityScoreboardScreen from '../screens/home/EntityScoreboardScreen';
import EntityGallaryScreen from '../screens/home/EntityGallaryScreen';
import EntityReviewScreen from '../screens/home/EntityReviewScreen';
import RespondForInviteScreen from '../screens/notificationsScreen/RespondForInviteScreen';
import EntityStatScreen from '../screens/home/EntityStatScreen';
import RequestBasicInfoScreen from '../screens/account/groupConnections/RequestBasicInfoScreen';
import RequestMultipleBasicInfoScreen from '../screens/account/groupConnections/RequestMultipleBasicInfoScreen';
import EditMemberAuthInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberAuthInfoScreen';
import MessageNavigator from './MessageNavigator';
import SportSettingScreen from '../screens/localhome/SportSettingScreen';
import DeactivatedSportsListScreen from '../components/Home/DeactivatedSportsListScreen';
import ActivitySettingScreen from '../screens/account/userSettingPrivacy/sportsActivity/ActivitySettingScreen';
import SportAccountSettingScreen from '../screens/account/SportAccountSettingScreen';
import SportHideUnhideScreen from '../screens/home/SportHideUnhideScreen';
import SportActivitiesScreen from '../components/Home/SportActivitiesScreen';
import ChangeSportsOrderScreen from '../screens/account/schedule/ChangeSportsOrderScreen';
import ChangeOtherListScreen from '../screens/account/schedule/ChangeOtherListScreen';
import InviteToEventScreen from '../screens/account/schedule/InviteToEventScreen';
import AcceptEventInviteScreen from '../screens/account/schedule/AcceptEventInviteScreen';
import GoingListScreen from '../screens/account/schedule/GoingListScreen';
import AccountInfoScreen from '../screens/account/userSettingPrivacy/AccountInfoScreen';
import BasicInfoScreen from '../screens/account/userSettingPrivacy/BasicInfoScreen';
import PendingRequestScreen from '../screens/notificationsScreen/PendingRequestScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import LanguageSettingScreen from '../screens/account/userSettingPrivacy/LanguageSettingScreen';
// Scorekeeper Review Screen

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
      name="AccountScreen"
      component={AccountScreen}
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
      name="GroupListScreen"
      component={GroupListScreen}
      options={{
        title: 'Club',
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
      name="EditGroupProfileScreen"
      component={EditGroupProfileScreen}
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
      name="EditPostScreen"
      component={EditPostScreen}
      options={{
        title: 'Edit Post',
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
      name="UserTagSelectionListScreen"
      component={UserTagSelectionListScreen}
      options={{
        title: 'Tag',
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
      name="WriteCommentScreen"
      component={WriteCommentScreen}
      options={{
        title: 'Write Comment',
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
      component={GroupMembersScreen}
      options={{
        title: strings.membersTitle,
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

    {/* Accounts screens */}

    <Stack.Screen
      name="ScheduleScreen"
      component={ScheduleScreen}
      options={{
        title: 'Schedule',
        headerShown: false,
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
        title: 'Review',
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
      name="EntityStatScreen"
      component={EntityStatScreen}
      options={{
        title: 'Stats',
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
      name="RespondForInviteScreen"
      component={RespondForInviteScreen}
      options={{
        title: 'Respond',
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
      name="EntityScoreboardScreen"
      component={EntityScoreboardScreen}
      options={{
        title: 'Scoreboard',
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
      name="EntityGallaryScreen"
      component={EntityGallaryScreen}
      options={{
        title: 'Gallary',
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
        title: 'Event',
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
      name="GoingListScreen"
      component={GoingListScreen}
      options={{
        title: 'Going',
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
      name="AcceptEventInviteScreen"
      component={AcceptEventInviteScreen}
      options={{
        title: 'Respond',
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
      name="InviteToEventScreen"
      component={InviteToEventScreen}
      options={{
        title: 'Invite',
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
      name="EditEventScreen"
      component={EditEventScreen}
      options={{
        title: 'Edit Event',
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
      name="CreateEventScreen"
      component={CreateEventScreen}
      options={{
        title: 'Create an Event',
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
        title: 'Group Events',
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
      name="ViewPrivacyScreen"
      component={ViewPrivacyScreen}
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
    <Stack.Screen
      name="RefereeSelectMatch"
      component={RefereeSelectMatch}
      options={{
        title: 'Choose a match',
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
      name="BookRefereeSuccess"
      component={BookRefereeSuccess}
      options={{
        headerShown: false,
      }}
    />
    {/*  Book A Scorekeeper */}
    <Stack.Screen
      name="BookScorekeeper"
      component={BookScorekeeper}
      options={{
        title: 'Book a scorekeeper',
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
      name="ScorekeeperBookingDateAndTime"
      component={ScorekeeperBookingDateAndTime}
      options={{
        title: 'Book a scorekeeper',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontSize: 16,
          fontFamily: fonts.RBold,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="BookScorekeeperSuccess"
      component={BookScorekeeperSuccess}
      options={{
        headerShown: false,
      }}
    />

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
      name="EditLineUpScreen"
      component={EditLineUpScreen}
      options={{
        title: 'Edit Lineup',
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
      name="EditLineUpCoachScreen"
      component={EditLineUpCoachScreen}
      options={{
        title: 'Edit Lineup',
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
      name="EditRosterScreen"
      component={EditRosterScreen}
      options={{
        title: 'Edit Roster',
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
      }}
    />
    <Stack.Screen
      name="RegisterPlayerForm2"
      component={RegisterPlayerForm2}
      options={{
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
      name="RegisterPlayerSuccess"
      component={RegisterPlayerSuccess}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AcceptDeclineChallengeScreen"
      component={AcceptDeclineChallengeScreen}
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
      name="JoinedTeamsScreen"
      component={JoinedTeamsScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="JoinedClubsScreen"
      component={JoinedClubsScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="RefereeReservationScreen"
      component={RefereeReservationScreen}
      options={{
        title: 'Referee Reservation',
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
      name="RefereeApprovalScreen"
      component={RefereeApprovalScreen}
      options={{
        title: 'Referee Approval Request',
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
      name="ScorekeeperApprovalScreen"
      component={ScorekeeperApprovalScreen}
      options={{
        title: 'Scorekeeper Approval Request',
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
      name="GroupSettingPrivacyScreen"
      component={GroupSettingPrivacyScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="UserSettingPrivacyScreen"
      component={UserSettingPrivacyScreen}
      options={{
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
      }}
    />

    <Stack.Screen
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="PersonalInformationScreen"
      component={PersonalInformationScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="AccountInfoScreen"
      component={AccountInfoScreen}
      options={{
        title: 'Account Info',
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
      name="BasicInfoScreen"
      component={BasicInfoScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="MembersProfileScreen"
      component={MembersProfileScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="InviteMembersByEmailScreen"
      component={InviteMembersByEmailScreen}
      options={{
        title: strings.inviteByEmail,
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
      name="InviteMembersBySearchScreen"
      component={InviteMembersBySearchScreen}
      options={{
        title: strings.inviteBySearchText,
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
      name="RequestMultipleBasicInfoScreen"
      component={RequestMultipleBasicInfoScreen}
      options={{
        title: 'Send request for basic info',
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
      name="InvitationSentScreen"
      component={InvitationSentScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserNotFoundScreen"
      component={UserNotFoundScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="MemberProfileCreatedScreen"
      component={MemberProfileCreatedScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />
    <Stack.Screen
      name="UserFoundScreen"
      component={UserFoundScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
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
      name="CreateMemberProfileForm1"
      component={CreateMemberProfileForm1}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileTeamForm3"
      component={CreateMemberProfileTeamForm3}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileForm2"
      component={CreateMemberProfileForm2}
      options={{
        title: strings.createMemberProfileText,
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
      name="CreateMemberProfileClubForm3"
      component={CreateMemberProfileClubForm3}
      options={{
        title: strings.createMemberProfileText,
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
      name="ConnectionReqSentScreen"
      component={ConnectionReqSentScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
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
      name="ConnectMemberAccountScreen"
      component={ConnectMemberAccountScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="EditMemberInfoScreen"
      component={EditMemberInfoScreen}
      options={{
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
      }}
    />
    <Stack.Screen
      name="EditMemberBasicInfoScreen"
      component={EditMemberBasicInfoScreen}
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
      name="RequestBasicInfoScreen"
      component={RequestBasicInfoScreen}
      options={{
        title: strings.requestBasicInfoTitle,
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
      name="EditMemberTeamInfoScreen"
      component={EditMemberTeamInfoScreen}
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
      name="EditMemberAuthInfoScreen"
      component={EditMemberAuthInfoScreen}
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
      name="ChallengeSentScreen"
      component={ChallengeSentScreen}
      // options={({ navigation }) => ({
      //   headerTintColor: colors.whiteColor,
      //   headerTransparent: true,
      //   headerTitle: false,
      //   headerLeft: (props) => (
      //     <HeaderBackButton
      //       {...props}
      //       onPress={() => navigation.popToTop()}
      //     />
      //   ),
      // })}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ChallengeAcceptedDeclinedScreen"
      component={ChallengeAcceptedDeclinedScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="PayAgainScreen"
      component={PayAgainScreen}
      options={{
        title: 'Pay',
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
      name="PayAgainRefereeScreen"
      component={PayAgainRefereeScreen}
      options={{
        title: 'Pay',
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
      name="ChangeReservationInfoScreen"
      component={ChangeReservationInfoScreen}
      options={{
        title: 'Change Match Reservation',
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
      name="CurruentReservationScreen"
      component={CurruentReservationScreen}
      options={{
        title: 'Curruent Match Reservation',
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
      name="CurruentRefereeReservationScreen"
      component={CurruentRefereeReservationScreen}
      options={{
        title: 'Curruent Referee Reservation',
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
      name="EditFeeScreen"
      component={EditFeeScreen}
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
      name="AlterRequestSent"
      component={AlterRequestSent}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="RefereeRequestSent"
      component={RefereeRequestSent}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AlterRequestAccept"
      component={AlterRequestAccept}
      options={{
        headerShown: false,
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
      name="PaymentMethodsScreen"
      component={PaymentMethodsScreen}
      options={{
        title: 'Payment Methods',
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
      name="PayoutMethodScreen"
      component={PayoutMethodScreen}
      options={{
        title: 'Payout Method',
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
      name="AddCardScreen"
      component={AddCardScreen}
      options={{
        title: 'Add a Card',
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
      name="MessageChat"
      component={MessageNavigator}
      options={{
        title: 'Message Chat',
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
      name="EditChallenge"
      component={EditChallenge}
      options={{
        title: 'Change Match Reservation',
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
      name="NotificationsListScreen"
      component={NotificationsListScreen}
      options={{
        title: 'Notifications',
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
      name="TrashScreen"
      component={TrashScreen}
      options={{
        title: 'Trash',
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
      name="PendingRequestScreen"
      component={PendingRequestScreen}
      options={{
        title: 'Pending Request',
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
      name="EditRefereeReservation"
      component={EditRefereeReservation}
      options={{
        title: 'Change Referee Reservation',
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
      name={'FeedViewScreen'}
      component={FeedViewScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="AlterRefereeScreen"
      component={AlterRefereeScreen}
      options={{
        title: 'Change Referee Reservation',
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
      name="AlterChallengeScreen"
      component={AlterChallengeScreen}
      options={{
        title: 'Game Reservation',
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
      name="LanguageSettingScreen"
      component={LanguageSettingScreen}
      options={{
        title: strings.appLanguage,
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
      name="RegisterScorekeeperSuccess"
      component={RegisterScorekeeperSuccess}
      options={{
        headerShown: false,
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
      name="LeaveReviewTennis"
      component={LeaveReviewTennis}
      options={{
        headerShown: false,
      }}
    />
    {/* Scorekeeper screens */}
    <Stack.Screen
      name="ScorekeeperReservationScreen"
      component={ScorekeeperReservationScreen}
      options={{
        title: 'Scorekeeper Reservation',
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
      name="ScorekeeperRequestSent"
      component={ScorekeeperRequestSent}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditScorekeeperReservation"
      component={EditScorekeeperReservation}
      options={{
        title: 'Change Scorekeeper Reservation',
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
      name="EditScorekeeperFeeScreen"
      component={EditScorekeeperFeeScreen}
      options={{
        title: strings.scorekeeperFee,
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
      name="PayAgainScorekeeperScreen"
      component={PayAgainScorekeeperScreen}
      options={{
        title: 'Pay',
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
      name="CurruentScorekeeperReservationScreen"
      component={CurruentScorekeeperReservationScreen}
      options={{
        title: 'Curruent Scorekeeper Reservation',
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
      name="AlterScorekeeperScreen"
      component={AlterScorekeeperScreen}
      options={{
        title: 'Change Scorekeeper Reservation',
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
      name="ScorekeeperSelectMatch"
      component={ScorekeeperSelectMatch}
      options={{
        title: 'Choose a match',
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
      name="ScorekeeperAcceptDeclineScreen"
      component={ScorekeeperAcceptDeclineScreen}
      options={{
        headerShown: false,
      }}
    />

    {/* Scorekeeper Review Screen */}
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
      name="NotificationNavigator"
      component={NotificationNavigator}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReservationNavigator"
      component={ReservationNavigator}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="SingleNotificationScreen"
      component={SingleNotificationScreen}
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
      name="ManageChallengeScreen"
      component={ManageChallengeScreen}
      options={{
        title: 'Manage Challenge',
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
      name="DeactivatedSportsListScreen"
      component={DeactivatedSportsListScreen}
      options={{
        title: 'Deactivated Sports Activities',
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
      name="SportActivityTagScreen"
      component={SportActivityTagScreen}
      options={{
        title: 'Order',
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
      options={{
        title: 'Hide & Unhide',
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
      name="RefereeReservationSetting"
      component={RefereeReservationSetting}
      options={{
        title: 'Referee Reservation Setting',
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
      name="ScorekeeperReservationSetting"
      component={ScorekeeperReservationSetting}
      options={{
        title: 'Scorekeeper Reservation Setting',
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
      name="RespondToInviteScreen"
      component={RespondToInviteScreen}
      options={{
        title: 'Respond to invite to create team',
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
      name="LookingForSettingScreen"
      component={LookingForSettingScreen}
      options={{
        title: 'Setting',
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
      name="DeactivateSportScreen"
      component={DeactivateSportScreen}
      options={{
        title: 'Deactivate Activity',
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
      name="ReservationAcceptDeclineScreen"
      component={ReservationAcceptDeclineScreen}
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
      name="SportAccountSettingScreen"
      component={SportAccountSettingScreen}
      options={{
        title: 'Settings',
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
  </Stack.Navigator>
);

export default HomeNavigator;
