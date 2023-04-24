/* eslint-disable */
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
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
import RegisterPlayerForm2 from '../screens/account/registerPlayer/RegisterPlayerForm2';
import IncomingChallengeSettings from '../screens/account/registerPlayer/IncomingChallengeSettings';
import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterScorekeeper from '../screens/account/registerScorekeeper/RegisterScorekeeper';
import RegisterScorekeeperForm2 from '../screens/account/registerScorekeeper/RegisterScorekeeperForm2';
import RegisterScorekeeperSuccess from '../screens/account/registerScorekeeper/RegisterScorekeeperSuccess';

import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';
import {strings} from '../../Localization/translation';
import EntityGallaryScreen from '../screens/home/EntityGallaryScreen';
import UserGalleryScreen from '../screens/home/user/UserGalleryScreen';
import UserConnections from '../screens/account/connections/UserConnections';
import LanguageSettingScreen from '../screens/account/userSettingPrivacy/LanguageSettingScreen';
import GroupsScreen from '../screens/account/GroupSetting/GroupsScreen';
import WhoCanInviteMemberScreen from '../screens/account/GroupSetting/WhoCanInviteMemberScreen';
import TeamSettingPrivacyScreen from '../screens/account/GroupSetting/TeamSettingPrivacyScreen';
import TeamJoinClubScreen from '../screens/account/GroupSetting/TeamJoinClubScreen';
import ClubInviteTeamScreen from '../screens/account/GroupSetting/ClubInviteTeamScreen';
import ClubSettingPrivacyScreen from '../screens/account/GroupSetting/ClubSettingPrivacyScreen';
import WhoCanInviteEventScreen from '../screens/account/GroupSetting/WhoCanInviteEventScreen';
import WhoCreateEventScreen from '../screens/account/GroupSetting/WhoCreateEventScreen';
import EventSettingPrivacyScreen from '../screens/account/GroupSetting/EventSettingPrivacyScreen';
import GroupInviteSettingPrivacyScreen from '../screens/account/GroupSetting/GroupInviteSettingPrivacyScreen';
import WhatEventInviteScreen from '../screens/account/GroupSetting/WhatEventInviteScreen';
import UserEventSettingPrivacyScreen from '../screens/account/GroupSetting/UserEventSettingPrivacyScreen';
import GroupInviteYouScreen from '../screens/account/GroupSetting/GroupInviteYouScreen';
import WhoCanJoinTeamScreen from '../screens/account/GroupSetting/WhoCanJoinTeamScreen';
import RecruitingMemberScreen from '../screens/account/GroupSetting/RecruitingMemberScreen';
import GroupMembersSettingScreen from '../screens/account/GroupSetting/GroupMembersSettingScreen';
import SportAccountSettingScreen from '../screens/account/SportAccountSettingScreen';
import RespondForInviteScreen from '../screens/notificationsScreen/RespondForInviteScreen';
import SearchScreen from '../screens/search/SearchScreen';
import TerminateAccountScreen from '../components/Home/TerminateAccountScreen';
import PauseGroupScreen from '../components/Home/PauseGroupScreen';
import DeactivateAccountScreen from '../components/Home/DeactivateAccountScreen';
import DeactivateSportScreen from '../components/Home/DeactivateSportScreen';
import ReservationAcceptDeclineScreen from '../screens/referee/ReservationAcceptDeclineScreen';
import LookingForSettingScreen from '../screens/home/playInModule/LookingForSettingScreen';
import ScorekeeperFee from '../screens/game/bookScorekeeper/scorekeeperSetting/ScorekeeperFee';
import AvailableAreaScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/AvailableAreaScorekeeper';
import RefereeFee from '../screens/game/bookReferee/refereeSetting/RefereeFee';
import RefundPolicyScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/RefundPolicyScorekeeper';
import RefundPolicyReferee from '../screens/game/bookReferee/refereeSetting/RefundPolicyReferee';
import AvailableAreaReferee from '../screens/game/bookReferee/refereeSetting/AvailableAreaReferee';
import AvailibilityReferee from '../screens/game/bookReferee/refereeSetting/AvailibilityReferee';
import InvoiceFilterScreen from '../screens/account/payment/InvoiceFilterScreen';
import InviteToMemberScreen from '../screens/account/groupConnections/createMemberProfile/InviteToMemberScreen';
import CanceledInvoicesScreen from '../screens/account/payment/CanceledInvoicesScreen';
import LogDetailScreen from '../screens/account/payment/LogDetailScreen';
import InvoiceDetailScreen from '../screens/account/payment/InvoiceDetailScreen';
import UserInvoiceScreen from '../screens/account/payment/UserInvoiceScreen';
import AddLogScreen from '../screens/account/payment/AddLogScreen';
import TeamInvoiceDetailScreen from '../screens/account/payment/TeamInvoiceDetailScreen';
import BatchDetailScreen from '../screens/account/payment/BatchDetailScreen';
import MembersDetailScreen from '../screens/account/payment/MembersDetailScreen';
import InvoiceScreen from '../screens/account/payment/InvoiceScreen';
import RespondToInviteScreen from '../screens/account/createGroup/createTeam/RespondToInviteScreen';
import InviteToChallengeSentScreen from '../screens/challenge/createChallenge/InviteToChallengeSentScreen';
import ChooseTimeSlotScreen from '../screens/challenge/createChallenge/ChooseTimeSlotScreen';
import ChallengePaymentScreen from '../screens/challenge/createChallenge/ChallengePaymentScreen';
import ChallengePreviewScreen from '../screens/challenge/createChallenge/ChallengePreviewScreen';
import ChooseVenueScreen from '../screens/challenge/manageChallenge/ChooseVenueScreen';
import InviteChallengeScreen from '../screens/challenge/createChallenge/InviteChallengeScreen';
import ChallengeScreen from '../screens/challenge/createChallenge/ChallengeScreen';
import UserScoreboardScreen from '../screens/home/user/UserScoreboardScreen';
import GameTennisDuration from '../screens/challenge/manageChallenge/settings/GameTennisDuration';
import GameDuration from '../screens/challenge/manageChallenge/settings/GameDuration';
import ScorekeepersSetting from '../screens/challenge/manageChallenge/settings/ScorekeepersSetting';
import RefereesSetting from '../screens/challenge/manageChallenge/settings/RefereesSetting';
import Availibility from '../screens/challenge/manageChallenge/settings/Availibility';
import HomeAway from '../screens/challenge/manageChallenge/settings/HomeAway';
import Venue from '../screens/challenge/manageChallenge/settings/Venue';
import GameRules from '../screens/challenge/manageChallenge/settings/GameRules';
import GameFee from '../screens/challenge/manageChallenge/settings/GameFee';
import RefundPolicy from '../screens/challenge/manageChallenge/settings/RefundPolicy';
import GameType from '../screens/challenge/manageChallenge/settings/GameType';
import ScorekeeperReservationSetting from '../screens/game/bookScorekeeper/ScorekeeperReservationSetting';
import RefereeReservationSetting from '../screens/game/bookReferee/RefereeReservationSetting';
import SportHideUnhideScreen from '../screens/home/SportHideUnhideScreen';
import ChangeOtherListScreen from '../screens/account/schedule/ChangeOtherListScreen';
import ChangeSportsOrderScreen from '../screens/account/schedule/ChangeSportsOrderScreen';
import SportActivityTagScreen from '../screens/home/SportActivityTagScreen';
import SportActivitiesScreen from '../components/Home/SportActivitiesScreen';
import DeactivatedSportsListScreen from '../components/Home/DeactivatedSportsListScreen';
import ActivitySettingScreen from '../screens/account/userSettingPrivacy/sportsActivity/ActivitySettingScreen';
import SportActivityScreen from '../screens/home/SportActivityScreen';
import ManageChallengeScreen from '../screens/challenge/manageChallenge/ManageChallengeScreen';
import SingleNotificationScreen from '../screens/notificationsScreen/SingleNotificationScreen';
import ReservationNavigator from './ReservationNavigator';
import NotificationNavigator from './NotificationNavigator';
import ScorekeeperReviewScreen from '../components/game/soccer/home/review/reviewForScorekeeper/ScorekeeperReviewScreen';
import ScorekeeperAcceptDeclineScreen from '../screens/scorekeeper/ScorekeeperAcceptDeclineScreen';
import ScorekeeperSelectMatch from '../screens/game/bookScorekeeper/selectMatch/ScorekeeperSelectMatch';
import AlterScorekeeperScreen from '../screens/scorekeeper/alterScorekeeper/AlterScorekeeperScreen';
import CurruentScorekeeperReservationScreen from '../screens/scorekeeper/alterScorekeeper/CurruentScorekeeperReservationScreen';
import PayAgainScorekeeperScreen from '../screens/scorekeeper/PayAgainScorekeeperScreen';
import EditScorekeeperFeeScreen from '../screens/scorekeeper/alterScorekeeper/EditScorekeeperFeeScreen';
import EditScorekeeperReservation from '../screens/scorekeeper/alterScorekeeper/EditScorekeeperReservation';
import ScorekeeperRequestSent from '../screens/scorekeeper/ScorekeeperRequestSent';
import ScorekeeperReservationScreen from '../screens/scorekeeper/ScorekeeperReservationScreen';
import WriteReviewScreen from '../components/game/soccer/home/review/WriteReviewScreen';
import RefereeReviewScreen from '../components/game/soccer/home/review/reviewForReferee/RefereeReviewScreen';
import ReviewRefereeList from '../components/game/soccer/home/review/reviewForReferee/ReviewRefereeList';
import PlayerReviewScreen from '../components/game/soccer/home/review/reviewForPlayer/PlayerReviewScreen';
import ReviewPlayerList from '../components/game/soccer/home/review/reviewForPlayer/ReviewPlayerList';
import CurrencySettingScreen from '../screens/account/CurrencySettingScreen';
import AlterChallengeScreen from '../screens/challenge/alterChallenge/AlterChallengeScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';
import PendingRequestScreen from '../screens/notificationsScreen/PendingRequestScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import EditChallenge from '../screens/challenge/alterChallenge/EditChallenge';
import MessageNavigator from './MessageNavigator';
import AddCardScreen from '../screens/account/payment/AddCardScreen';
import PayoutMethodScreen from '../screens/account/payment/PayoutMethodScreen';
import PayoutMethodList from '../screens/account/payment/PayoutMethodList';
import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import GameFeeEditScreen from '../screens/home/GameFeeEditScreen';
import EditGroupBasicInfoScreen from '../screens/home/EditGroupBasicInfoScreen';
import EditGroupContactScreen from '../screens/home/EditGroupContactScreen';
import GroupLongTextScreen from '../screens/home/GroupLongTextScreen';
import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';
import RefereeRequestSent from '../screens/referee/RefereeRequestSent';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import EditFeeScreen from '../screens/challenge/alterChallenge/EditFeeScreen';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import CurruentReservationScreen from '../screens/challenge/alterChallenge/CurruentReservationScreen';
import ChangeReservationInfoScreen from '../screens/challenge/alterChallenge/ChangeReservationInfoScreen';
import PayAgainRefereeScreen from '../screens/referee/PayAgainRefereeScreen';
import PayAgainScreen from '../screens/challenge/alterChallenge/PayAgainScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';
import EditClubNotesScreen from '../screens/account/groupConnections/editMemberProfile/EditClubNotesScreen';
import EditMemberAuthInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberAuthInfoScreen';
import EditMemberTeamInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberTeamInfoScreen';
import RequestBasicInfoScreen from '../screens/account/groupConnections/RequestBasicInfoScreen';
import EditMemberBasicInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberBasicInfoScreen';
import EditMemberInfoScreen from '../screens/account/groupConnections/editMemberProfile/EditMemberInfoScreen';
import ConnectMemberAccountScreen from '../screens/account/groupConnections/ConnectMemberAccountScreen';
import ClubSettingScreen from '../screens/account/groupConnections/ClubSettingScreen';
import ConnectionReqSentScreen from '../screens/account/groupConnections/ConnectionReqSentScreen';
import CreateMemberProfileClubForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileClubForm3';
import CreateMemberProfileForm2 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm2';
import CreateMemberProfileTeamForm3 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileTeamForm3';
import CreateMemberProfileForm1 from '../screens/account/groupConnections/createMemberProfile/CreateMemberProfileForm1';
import MembersViewPrivacyScreen from '../screens/account/groupConnections/MembersViewPrivacyScreen';
import UserFoundScreen from '../screens/account/groupConnections/UserFoundScreen';
import MemberProfileCreatedScreen from '../screens/account/groupConnections/MemberProfileCreatedScreen';
import UserNotFoundScreen from '../screens/account/groupConnections/UserNotFoundScreen';
import InvitationSentScreen from '../screens/account/groupConnections/InvitationSentScreen';
import RequestMultipleBasicInfoScreen from '../screens/account/groupConnections/RequestMultipleBasicInfoScreen';
import InviteMembersBySearchScreen from '../screens/account/groupConnections/InviteMemberBySearchScreen';
import InviteMembersByEmailScreen from '../screens/account/groupConnections/InviteMembersByEmailScreen';
import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';
import BasicInfoScreen from '../screens/account/userSettingPrivacy/BasicInfoScreen';
import AccountInfoScreen from '../screens/account/userSettingPrivacy/AccountInfoScreen';
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import ScorekeeperApprovalScreen from '../screens/scorekeeper/ScorekeeperApprovalScreen';
import RefereeApprovalScreen from '../screens/referee/RefereeApprovalScreen';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import JoinedClubsScreen from '../screens/account/JoinedClubsScreen';
import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import SearchPlayerScreen from '../screens/account/createGroup/createTeam/SearchPlayerScreen';
import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import EditRosterScreen from '../screens/game/soccer/EditRosterScreen';
import EditLineUpCoachScreen from '../screens/game/soccer/lineUp/EditRosterCoacheScreen';
import EditLineUpScreen from '../screens/game/soccer/lineUp/EditLineUpScreen';
import BookScorekeeperSuccess from '../screens/game/bookScorekeeper/BookScorekeeperSuccess';
import ScorekeeperBookingDateAndTime from '../screens/game/bookScorekeeper/scorekeeperBookDateTime/ScorekeeperBookingDateAndTime';
import fonts from '../Constants/Fonts';
import BookRefereeSuccess from '../screens/game/bookReferee/BookRefereeSuccess';
import BookScorekeeper from '../screens/game/bookScorekeeper/scorekeeperList/BookScorekeeper';
import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import BookReferee from '../screens/game/bookReferee/refereeList/BookReferee';
import TennisDeletedRecordScreen from '../screens/game/tennis/TennisDeletedRecordScreen';
import TennisRecordList from '../screens/game/tennis/TennisRecordList';
import GameDetailRecord from '../screens/game/soccer/GameDetailRecord';
import SoccerApproveDisapproveConfirmation from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import TennisRecording from '../screens/game/tennis/TennisRecording';
import SoccerRecording from '../screens/game/soccer/SoccerRecording';
import LeaveReview from '../screens/game/leaveReview/LeaveReview';
import ViewPrivacyScreen from '../screens/account/schedule/ViewPrivacyScreen';
import GroupEventScreen from '../screens/account/schedule/GroupEventScreen';
import DefaultColorScreen from '../screens/account/schedule/DefaultColorScreen';
import EditChallengeAvailability from '../screens/account/schedule/EditChallengeAvailability';
import CreateEventScreen from '../screens/account/schedule/CreateEventScreen';
import EditEventScreen from '../screens/account/schedule/EditEventScreen';
import InviteToEventScreen from '../screens/account/schedule/InviteToEventScreen';
import AcceptEventInviteScreen from '../screens/account/schedule/AcceptEventInviteScreen';
import GoingListScreen from '../screens/account/schedule/GoingListScreen';
import EventScreen from '../screens/account/schedule/EventScreen';
import GameDetail from '../screens/account/schedule/GameDetail';
import EntityScoreboardScreen from '../screens/home/EntityScoreboardScreen';
import EntityStatScreen from '../screens/home/EntityStatScreen';
import EntityReviewScreen from '../screens/home/EntityReviewScreen';
import EntityInfoScreen from '../screens/home/EntityInfoScreen';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import AccountScreen from '../screens/account/AccountScreen';
import GroupListScreen from '../screens/home/GroupListScreen';
import EditPersonalProfileScreen from '../screens/home/user/EditPersonalProfileScreen';
import EditGroupProfileScreen from '../screens/home/EditGroupProfileScreen';
import EditPostScreen from '../screens/newsfeeds/EditPostScreen';
import UserTagSelectionListScreen from '../screens/newsfeeds/UserTagSelectionListScreen';
import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import UserAboutScreen from '../screens/home/user/UserAboutScreen';
import UserBasicInfoScreen from '../screens/home/user/UserBasicInfoScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';
import ReviewDetailsScreen from '../screens/home/SportActivity/ReviewDetailsScreen';
import IncomingReservationSettings from '../screens/account/registerReferee/IncomingReservationSettings';
import TimeZoneScreen from '../screens/account/userSettingPrivacy/TimeZoneScreen';

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
        title: strings.groupsRecruitingMembers,
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
        title: strings.individualsLookingforGroups,
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
        title: strings.refereesAvailable,
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
        title: strings.scoreKeeperAvailable,
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
      name="ReviewDetailsScreen"
      component={ReviewDetailsScreen}
      options={{headerShown: false}}
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
      options={{headerShown: false}}
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
      name="UserGalleryScreen"
      component={UserGalleryScreen}
      options={{
        title: 'Gallery',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
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
      name="AccountScreen"
      component={AccountScreen}
      options={{headerShown: false}}
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
        headerShown: false,
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
      name="PayoutMethodList"
      component={PayoutMethodList}
      options={{
        title: 'Payout Methods',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="GameType"
      component={GameType}
      options={{
        title: 'Game Type',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Refund Policies',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Match Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Game Rules',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Availibility',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="ScorekeepersSetting"
      component={ScorekeepersSetting}
      options={{
        title: 'Scorekeeper',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Game Duration',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Sets, points & Duration',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="ChallengeScreen"
      component={ChallengeScreen}
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
      name="InviteChallengeScreen"
      component={InviteChallengeScreen}
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
      name="ChooseVenueScreen"
      component={ChooseVenueScreen}
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
      name="ChallengePreviewScreen"
      component={ChallengePreviewScreen}
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
      name="ChallengePaymentScreen"
      component={ChallengePaymentScreen}
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
      name="InvoiceScreen"
      component={InvoiceScreen}
      options={{
        title: 'Invoicing',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="MembersDetailScreen"
      component={MembersDetailScreen}
      options={{
        title: 'Invoicing',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="BatchDetailScreen"
      component={BatchDetailScreen}
      options={{
        title: 'Membership Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="TeamInvoiceDetailScreen"
      component={TeamInvoiceDetailScreen}
      options={{
        title: 'Membership Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="AddLogScreen"
      component={AddLogScreen}
      options={{
        title: 'Log Manually',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="UserInvoiceScreen"
      component={UserInvoiceScreen}
      options={{
        title: 'Invoices',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="InvoiceDetailScreen"
      component={InvoiceDetailScreen}
      options={{
        title: 'Membership Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="LogDetailScreen"
      component={LogDetailScreen}
      options={{
        title: 'Log',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Canceled invoices',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="InvoiceFilterScreen"
      component={InvoiceFilterScreen}
      options={{
        title: 'Invoicing',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />

    <Stack.Screen
      name="AvailibilityReferee"
      component={AvailibilityReferee}
      options={{
        title: 'Availibility',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Available Area',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Refund Policy',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Refund Policy',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Referee Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Available Area',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
        title: 'Scorekeeper Fee',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="DeactivateAccountScreen"
      component={DeactivateAccountScreen}
      options={{
        title: 'Deactivate Account',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
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
      options={{
        title: 'Terminate Account',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
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
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="WhoCanJoinTeamScreen"
      component={WhoCanJoinTeamScreen}
      options={{
        title: 'Who Can Join Team',
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
        title: 'Who Can Join Team',
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
        title: 'Who Can Join Team',
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
        title: 'Who Can Create Event',
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
        title: 'Who Can Invite People',
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
        title: 'Club',
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
        title: 'Can Club Invite Team',
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
        title: 'Team',
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
        title: 'Who Can Invite Member',
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

export default LocalHomeNavigator;
