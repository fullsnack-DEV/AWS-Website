import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import GroupListScreen from '../screens/home/GroupListScreen';
import EditPersonalProfileScreen from '../screens/home/user/EditPersonalProfileScreen';
import EditGroupProfileScreen from '../screens/home/EditGroupProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';

import colors from '../Constants/Colors';
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
import IncomingChallengeSettings from '../screens/account/registerPlayer/IncomingChallengeSettings';
import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/RegisterPlayerForm2';
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
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
import PayoutMethodList from '../screens/account/payment/PayoutMethodList';
// import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import JoinedClubsScreen from '../screens/account/JoinedClubsScreen';

import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen';
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen';

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
import LeaveReview from '../screens/game/leaveReview/LeaveReview';
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
import SingleNotificationScreen from '../screens/notificationsScreen/SingleNotificationScreen';
import ManageChallengeScreen from '../screens/challenge/manageChallenge/ManageChallengeScreen';
import GameType from '../screens/challenge/manageChallenge/settings/GameType';
import RefundPolicy from '../screens/challenge/manageChallenge/settings/RefundPolicy';
import GameFee from '../screens/challenge/manageChallenge/settings/GameFee';
import GameRules from '../screens/challenge/manageChallenge/settings/GameRules';
import Venue from '../screens/challenge/manageChallenge/settings/Venue';
import HomeAway from '../screens/challenge/manageChallenge/settings/HomeAway';
import Availibility from '../screens/challenge/manageChallenge/settings/Availibility';
import RefereesSetting from '../screens/challenge/manageChallenge/settings/RefereesSetting';
import ScorekeepersSetting from '../screens/challenge/manageChallenge/settings/ScorekeepersSetting';
import GameDuration from '../screens/challenge/manageChallenge/settings/GameDuration';
import UserGalleryScreen from '../screens/home/user/UserGalleryScreen';
import UserScoreboardScreen from '../screens/home/user/UserScoreboardScreen';
import InviteToChallengeSentScreen from '../screens/challenge/createChallenge/InviteToChallengeSentScreen';
import ChooseTimeSlotScreen from '../screens/challenge/createChallenge/ChooseTimeSlotScreen';
import ChallengePaymentScreen from '../screens/challenge/createChallenge/ChallengePaymentScreen';
import ChallengePreviewScreen from '../screens/challenge/createChallenge/ChallengePreviewScreen';
import ChooseVenueScreen from '../screens/challenge/manageChallenge/ChooseVenueScreen';
import InviteChallengeScreen from '../screens/challenge/createChallenge/InviteChallengeScreen';
import ChallengeScreen from '../screens/challenge/createChallenge/ChallengeScreen';
import RespondToInviteScreen from '../screens/account/createGroup/createTeam/RespondToInviteScreen';
import InvoiceSentScreen from '../screens/account/Invoice/InvoiceSentScreen';
import PayInvoiceScreen from '../screens/account/Invoice/PayInvoiceScreen';
import RecipientDetailScreen from '../screens/account/Invoice/RecipientDetailScreen';
import InviteToMemberScreen from '../screens/account/groupConnections/createMemberProfile/InviteToMemberScreen';
import InvoiceReceivedScreen from '../screens/account/Invoice/InvoiceReceivedScreen';
import BatchDetailScreen from '../screens/account/Invoice/BatchDetailScreen';
import InvoiceDetailScreen from '../screens/account/Invoice/InvoiceDetailScreen';
import CanceledInvoicesScreen from '../screens/account/Invoice/CanceledInvoicesScreen';
import RefereeReservationSetting from '../screens/game/bookReferee/RefereeReservationSetting';
import AvailibilityReferee from '../screens/game/bookReferee/refereeSetting/AvailibilityReferee';
import RefereeFee from '../screens/game/bookReferee/refereeSetting/RefereeFee';
import AvailableAreaReferee from '../screens/game/bookReferee/refereeSetting/AvailableAreaReferee';
import ScorekeeperReservationSetting from '../screens/game/bookScorekeeper/ScorekeeperReservationSetting';

import AvailibilityScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/AvailibilityScorekeeper';
import ScorekeeperFee from '../screens/game/bookScorekeeper/scorekeeperSetting/ScorekeeperFee';
import AvailableAreaScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/AvailableAreaScorekeeper';
import RefundPolicyReferee from '../screens/game/bookReferee/refereeSetting/RefundPolicyReferee';
import RefundPolicyScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/RefundPolicyScorekeeper';
import ReservationAcceptDeclineScreen from '../screens/referee/ReservationAcceptDeclineScreen';
import fonts from '../Constants/Fonts';
import AlterChallengeScreen from '../screens/challenge/alterChallenge/AlterChallengeScreen';
import RefereeAgreementScreen from '../screens/challenge/createChallenge/RefereeAgreementScreen';
import ScorekeeperAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperAgreementScreen';
import RefereeInviteAgreementScreen from '../screens/challenge/createChallenge/RefereeInviteAgreementScreen';
import ScorekeeperInviteAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperInviteAgreementScreen';
import RefereeApprovalScreen from '../screens/referee/RefereeApprovalScreen';
import ScorekeeperApprovalScreen from '../screens/scorekeeper/ScorekeeperApprovalScreen';
import LookingForSettingScreen from '../screens/home/playInModule/LookingForSettingScreen';
import SportActivityScreen from '../screens/home/SportActivityScreen';
import SportActivityTagScreen from '../screens/home/SportActivityTagScreen';
import DeactivateSportScreen from '../components/Home/DeactivateSportScreen';
import SearchScreen from '../screens/search/SearchScreen';
import EntityInfoScreen from '../screens/home/EntityInfoScreen';
import EntityScoreboardScreen from '../screens/home/EntityScoreboardScreen';
import EntityGallaryScreen from '../screens/home/EntityGallaryScreen';
import EntityReviewScreen from '../screens/home/EntityReviewScreen';
import EntityStatScreen from '../screens/home/EntityStatScreen';

import RespondForInviteScreen from '../screens/notificationsScreen/RespondForInviteScreen';
import RequestBasicInfoScreen from '../screens/account/groupConnections/RequestBasicInfoScreen';
import RequestMultipleBasicInfoScreen from '../screens/account/groupConnections/RequestMultipleBasicInfoScreen';
import EditMemberAuthInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberAuthInfoScreen';
import SportSettingScreen from '../screens/localhome/SportSettingScreen';
import DeactivatedSportsListScreen from '../components/Home/DeactivatedSportsListScreen';
import ActivitySettingScreen from '../screens/account/userSettingPrivacy/sportsActivity/ActivitySettingScreen';
import DeactivateAccountScreen from '../components/Home/DeactivateAccountScreen';
import TerminateAccountScreen from '../components/Home/TerminateAccountScreen';
import PauseGroupScreen from '../components/Home/PauseGroupScreen';
import SportAccountSettingScreen from '../screens/account/SportAccountSettingScreen';
import SportHideUnhideScreen from '../screens/home/SportHideUnhideScreen';
import SportActivitiesScreen from '../components/Home/SportActivitiesScreen';
import ChangeSportsOrderScreen from '../screens/account/schedule/ChangeSportsOrderScreen';
import ChangeOtherListScreen from '../screens/account/schedule/ChangeOtherListScreen';
import InviteToEventScreen from '../screens/account/schedule/InviteToEventScreen';
import AcceptEventInviteScreen from '../screens/account/schedule/AcceptEventInviteScreen';
import GoingListScreen from '../screens/account/schedule/GoingListScreen';
import GameTennisDuration from '../screens/challenge/manageChallenge/settings/GameTennisDuration';
import AccountInfoScreen from '../screens/account/userSettingPrivacy/AccountInfoScreen';
import BasicInfoScreen from '../screens/account/userSettingPrivacy/BasicInfoScreen';
import GroupMembersSettingScreen from '../screens/account/GroupSetting/GroupMembersSettingScreen';
import RecruitingMemberScreen from '../screens/account/GroupSetting/RecruitingMemberScreen';
import GroupsScreen from '../screens/account/GroupSetting/GroupsScreen';
import PendingRequestScreen from '../screens/notificationsScreen/PendingRequestScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import WhoCanJoinTeamScreen from '../screens/account/GroupSetting/WhoCanJoinTeamScreen';
import WhoCanInviteMemberScreen from '../screens/account/GroupSetting/WhoCanInviteMemberScreen';
import TeamSettingPrivacyScreen from '../screens/account/GroupSetting/TeamSettingPrivacyScreen';
import TeamJoinClubScreen from '../screens/account/GroupSetting/TeamJoinClubScreen';
import ClubSettingPrivacyScreen from '../screens/account/GroupSetting/ClubSettingPrivacyScreen';
import ClubInviteTeamScreen from '../screens/account/GroupSetting/ClubInviteTeamScreen';
import EventSettingPrivacyScreen from '../screens/account/GroupSetting/EventSettingPrivacyScreen';
import WhoCreateEventScreen from '../screens/account/GroupSetting/WhoCreateEventScreen';
import GroupInviteYouScreen from '../screens/account/GroupSetting/GroupInviteYouScreen';
import GroupInviteSettingPrivacyScreen from '../screens/account/GroupSetting/GroupInviteSettingPrivacyScreen';
import UserEventSettingPrivacyScreen from '../screens/account/GroupSetting/UserEventSettingPrivacyScreen';
import WhatEventInviteScreen from '../screens/account/GroupSetting/WhatEventInviteScreen';
import WhoCanInviteEventScreen from '../screens/account/GroupSetting/WhoCanInviteEventScreen';
import LanguageSettingScreen from '../screens/account/userSettingPrivacy/LanguageSettingScreen';
import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';
import PrivacySettingsScreen from '../screens/home/SportActivity/PrivacySettingsScreen';
import ReviewDetailsScreen from '../screens/home/SportActivity/ReviewDetailsScreen';
import ReplyScreen from '../screens/home/SportActivity/contentScreens/ReplyScreen';
import IncomingReservationSettings from '../screens/account/registerReferee/IncomingReservationSettings';
import TimeZoneScreen from '../screens/account/userSettingPrivacy/TimeZoneScreen';
import MembershipFeeScreen from '../screens/home/MembershipFeeScreen';
import GroupFollowersScreen from '../screens/account/groupConnections/GroupFollowersScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import EventsListScreen from '../screens/account/schedule/EventsListScreen';
// Scorekeeper Review Screen
const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTitleStyle: {
        textAlign: 'center',
        fontFamily: fonts.RBold,
        gestureDirection: 'horizontal-inverted',
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
      name="WritePostScreen"
      component={WritePostScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{
        headerShown: false,
        animationEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
      initialParams={{switchToUser: false}}
    />

    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: strings.home,
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
      options={{
        headerShown: false,
      }}
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
      options={{
        title: strings.club,
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
      name="EditPersonalProfileScreen"
      component={EditPersonalProfileScreen}
      options={{
        title: strings.editprofiletitle,
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
        title: strings.editprofiletitle,
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
        title: strings.editPost,
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
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="WriteCommentScreen"
      component={WriteCommentScreen}
      options={{
        title: strings.writeComment,
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
      component={GroupFollowersScreen}
      name="GroupFollowersScreen"
      options={{headerShown: false}}
    />

    {/* Accounts screens */}

    <Stack.Screen
      name="ScheduleScreen"
      component={ScheduleScreen}
      options={{
        title: strings.scheduleTitle,
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
        title: strings.infoTitle,
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
        title: strings.game,
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
      name="GoingListScreen"
      component={GoingListScreen}
      options={{
        title: strings.going,
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
        title: strings.respond,
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
        title: strings.invite,
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
      name="EditEventScreen"
      component={EditEventScreen}
      options={{
        title: strings.editEvent,
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
        title: strings.createAnEvent,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
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
        title: strings.groupEvent,
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
        title: strings.matchRecord,
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
        title: strings.matchRecord,
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
        title: strings.matchRecord,
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
        title: strings.matchRecord,
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
        title: strings.matchRecord,
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
        title: strings.bookaRefree,
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
        title: strings.bookaRefree,
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
      name="RefereeSelectMatch"
      component={RefereeSelectMatch}
      options={{
        title: strings.chooseaMatch,
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
        title: strings.bookScorekeeper,
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
        title: strings.bookScorekeeper,
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
        title: strings.editLinup,
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
        title: strings.editLinup,
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
        title: strings.editRoster,
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
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="RegisterPlayerForm2"
      component={RegisterPlayerForm2}
      options={{
        title: strings.registerAsPlayerTitle,
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
      name="IncomingChallengeSettings"
      component={IncomingChallengeSettings}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="RegisterReferee"
      component={RegisterReferee}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="IncomingReservationSettings"
      component={IncomingReservationSettings}
      options={{headerShown: false}}
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
      name="CreateTeamForm1"
      component={CreateTeamForm1}
      options={{
        headerShown: false,
        title: strings.createTeamText,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
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
        headerShown: false,
        title: strings.createTeamText,
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
        title: strings.createTeamText,
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
        title: strings.createTeamText,
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
        title: strings.createClubText,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RBold,
          fontSize: 16,
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
        title: strings.createClubText,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',
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
        title: strings.createClubText,
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
        title: strings.choosePlayer,
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
        title: strings.teams,
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
        title: strings.clubstitle,
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
        title: strings.refereeScreenTitle,
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
        title: strings.refreeApprovalRequest,
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
        title: strings.scoreKeeperApprovalRequest,
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
        title: strings.settings,
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
        title: strings.settingAndPrivacy,
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
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="PersonalInformationScreen"
      component={PersonalInformationScreen}
      options={{
        title: strings.personalInfoTitle,
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
        title: strings.accountInfo,
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
        title: strings.basicInfoText,
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
        title: strings.inviteMemberText,

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
        title: strings.sendRequestText,
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
        title: strings.viewPrivacy,
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
        title: strings.settings,
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
        title: strings.nameText,
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
          fontFamily: fonts.RMedium,
          fontSize: 16,
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
        title: strings.payText,
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
        title: strings.payText,
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
        title: strings.changeMatchReservation,
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
        title: strings.currentMatchReservation,
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
        title: strings.currentRefreeReservation,
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
      name="MembershipFeeScreen"
      component={MembershipFeeScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="PaymentMethodsScreen"
      component={PaymentMethodsScreen}
      options={{
        title: strings.paymentMethod,
        headerTintColor: colors.blackColor,
        headerShown: false,
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
      name="PayoutMethodList"
      component={PayoutMethodList}
      options={{
        title: strings.paymentMethod,
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
        title: strings.paymentMethod,
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
        title: strings.addacard,
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
      name="EditChallenge"
      component={EditChallenge}
      options={{
        title: strings.changeMatchReservation,
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
        title: strings.notifications,
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
        title: strings.trash,
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
        headerShown: false,
        title: strings.pendingRequest,
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
        title: strings.changeRefereeReservation,
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
      name="AlterRefereeScreen"
      component={AlterRefereeScreen}
      options={{
        title: strings.changeRefereeReservation,
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
        title: strings.gameReservation,
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
        title: strings.currencySetting,
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
        title: strings.playerText,
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
        title: strings.refreeText,
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
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="RegisterScorekeeperForm2"
      component={RegisterScorekeeperForm2}
      options={{
        title: strings.registerScorekeeperTitle,
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

    {/* Scorekeeper screens */}
    <Stack.Screen
      name="ScorekeeperReservationScreen"
      component={ScorekeeperReservationScreen}
      options={{
        title: strings.scorekeeperScreenTitle,
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
        title: strings.changeScorekeeperReservation,
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
        title: strings.payText,
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
        title: strings.currentScoreKeeperReservation,
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
        title: strings.changeScorekeeperReservation,
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
        title: strings.chooseaMatch,
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
        title: strings.refreeText,
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
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SportActivityScreen"
      component={SportActivityScreen}
      options={{
        title: strings.sportActivity,
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
      options={{headerShown: false}}
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
        title: strings.changeListOfSport,
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
        title: strings.chnageListOfOrganizer,
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
      name="RefereeReservationSetting"
      component={RefereeReservationSetting}
      options={{
        title: strings.refreeReservationSetting,
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
        title: strings.scoreKeeperReservationSetting,
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
      name="GameType"
      component={GameType}
      options={{
        title: strings.gameType,
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
      name="RefundPolicy"
      component={RefundPolicy}
      options={{
        title: strings.refundPolicies,
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
      name="GameFee"
      component={GameFee}
      options={{
        title: strings.gameFee,
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
      name="GameRules"
      component={GameRules}
      options={{
        title: strings.gameRules,
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
      name="Venue"
      component={Venue}
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
      name="HomeAway"
      component={HomeAway}
      options={{
        title: strings.homeAndAway,
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
      name="Availibility"
      component={Availibility}
      options={{
        title: strings.availability,
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
      name="RefereesSetting"
      component={RefereesSetting}
      options={{
        title: strings.refreeText,
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
      name="ScorekeepersSetting"
      component={ScorekeepersSetting}
      options={{
        title: strings.scorekeeperText,
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
      name="GameDuration"
      component={GameDuration}
      options={{
        title: strings.gameDuration,
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
      name="GameTennisDuration"
      component={GameTennisDuration}
      options={{
        title: strings.setPointDuration,
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
      name="RefereeAgreementScreen"
      component={RefereeAgreementScreen}
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
      name="ScorekeeperAgreementScreen"
      component={ScorekeeperAgreementScreen}
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
      name="RefereeInviteAgreementScreen"
      component={RefereeInviteAgreementScreen}
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
      name="ScorekeeperInviteAgreementScreen"
      component={ScorekeeperInviteAgreementScreen}
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
      name="InviteToChallengeSentScreen"
      component={InviteToChallengeSentScreen}
      options={{
        tabBarVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="RespondToInviteScreen"
      component={RespondToInviteScreen}
      options={{
        title: strings.respondToInviteCreateTeam,
        headerTintColor: colors.blackColor,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
          fontSize: 16,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="InvoiceSentScreen"
      component={InvoiceSentScreen}
      options={{
        headerShown: false,
        title: strings.invoicingTitleText,
        headerTitleAlign: 'center',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="PayInvoiceScreen"
      component={PayInvoiceScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="RecipientDetailScreen"
      component={RecipientDetailScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="BatchDetailScreen"
      component={BatchDetailScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="InvoiceDetailScreen"
      component={InvoiceDetailScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="InvoiceReceivedScreen"
      component={InvoiceReceivedScreen}
      options={{
        headerShown: false,
        tabBarVisible: false,
        title: strings.invoicesreceived,
        headerTitleAlign: 'center',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="CanceledInvoicesScreen"
      component={CanceledInvoicesScreen}
      options={{
        headerShown: false,
        title: strings.cancelledInvoiceText,
        headerTitleAlign: 'center',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.RMedium,
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="InviteToMemberScreen"
      component={InviteToMemberScreen}
      //  options={{
      //    headerShown: false,
      //  }}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />

    <Stack.Screen
      name="AvailibilityReferee"
      component={AvailibilityReferee}
      options={{
        title: strings.availability,
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
      name="AvailableAreaReferee"
      component={AvailableAreaReferee}
      options={{
        title: strings.availableAreaText,
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
      name="RefundPolicyReferee"
      component={RefundPolicyReferee}
      options={{
        title: strings.refundPolicy,
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
      name="RefundPolicyScorekeeper"
      component={RefundPolicyScorekeeper}
      options={{
        title: strings.refundPolicy,
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
      name="RefereeFee"
      component={RefereeFee}
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
      name="AvailibilityScorekeeper"
      component={AvailibilityScorekeeper}
      options={{
        title: strings.availability,
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
      name="AvailableAreaScorekeeper"
      component={AvailableAreaScorekeeper}
      options={{
        title: strings.availableAreaText,
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
      name="ScorekeeperFee"
      component={ScorekeeperFee}
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
      name="LookingForSettingScreen"
      component={LookingForSettingScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ReservationAcceptDeclineScreen"
      component={ReservationAcceptDeclineScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="DeactivateSportScreen"
      component={DeactivateSportScreen}
      options={{
        title: strings.deactivateActivity,
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
      name="DeactivateAccountScreen"
      component={DeactivateAccountScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="PauseGroupScreen"
      component={PauseGroupScreen}
      options={{
        title: 'Pause Team',
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
      name="TerminateAccountScreen"
      component={TerminateAccountScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
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
    <Stack.Screen
      name="GroupMembersSettingScreen"
      component={GroupMembersSettingScreen}
      options={{
        title: strings.membersTitle,
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
      name="RecruitingMemberScreen"
      component={RecruitingMemberScreen}
      options={{
        title: strings.hiringPlayerTitle,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="WhoCanJoinTeamScreen"
      component={WhoCanJoinTeamScreen}
      options={{
        title: strings.whoCanJoinTeam,
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
      name="GroupInviteYouScreen"
      component={GroupInviteYouScreen}
      options={{
        title: strings.whoCanJoinTeam,
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
      name="UserEventSettingPrivacyScreen"
      component={UserEventSettingPrivacyScreen}
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
      name="WhatEventInviteScreen"
      component={WhatEventInviteScreen}
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
      name="GroupInviteSettingPrivacyScreen"
      component={GroupInviteSettingPrivacyScreen}
      options={{
        title: strings.whoCanJoinTeam,
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
      name="EventSettingPrivacyScreen"
      component={EventSettingPrivacyScreen}
      options={{
        title: 'Event',
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
      name="WhoCreateEventScreen"
      component={WhoCreateEventScreen}
      options={{
        title: strings.whoCanCreateEventText,
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
      name="WhoCanInviteEventScreen"
      component={WhoCanInviteEventScreen}
      options={{
        title: strings.whoCanInvitePeopleText,
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
      name="ClubSettingPrivacyScreen"
      component={ClubSettingPrivacyScreen}
      options={{
        title: strings.club,
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
      name="ClubInviteTeamScreen"
      component={ClubInviteTeamScreen}
      options={{
        title: strings.canClubInviteTeamText,
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
      name="TeamJoinClubScreen"
      component={TeamJoinClubScreen}
      options={{
        title: strings.whatTeamJoinClub,
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
      name="TeamSettingPrivacyScreen"
      component={TeamSettingPrivacyScreen}
      options={{
        title: strings.team,
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
      name="WhoCanInviteMemberScreen"
      component={WhoCanInviteMemberScreen}
      options={{
        title: strings.whoCanInviteMemberText,
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
      name="GroupsScreen"
      component={GroupsScreen}
      options={{
        title: 'Clubs',
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
      name="TimeZoneScreen"
      component={TimeZoneScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
