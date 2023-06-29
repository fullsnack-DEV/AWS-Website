import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import NewsFeedVideoPlayer from '../screens/newsfeeds/NewsFeedVideoPlayer';

import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import FullVideoScreen from '../screens/newsfeeds/FullVideoScreen';
import EditPostScreen from '../screens/newsfeeds/EditPostScreen';
import HomeScreen from '../screens/home/HomeScreen';

import colors from '../Constants/Colors';
import EntitySearchScreen from '../screens/EntitySearchScreen';
import UserConnections from '../screens/account/connections/UserConnections';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';
import BookRefereeSuccess from '../screens/game/bookReferee/BookRefereeSuccess';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import UserTagSelectionListScreen from '../screens/newsfeeds/UserTagSelectionListScreen';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';
import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';

import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import AddCardScreen from '../screens/account/payment/AddCardScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import LeaveReview from '../screens/game/leaveReview/LeaveReview';
import SoccerRecording from '../screens/game/soccer/SoccerRecording';
import TennisRecording from '../screens/game/tennis/TennisRecording';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import SoccerApproveDisapproveConfirmation from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';
import GameDetailRecord from '../screens/game/soccer/GameDetailRecord';
import TennisHome from '../screens/game/tennis/TennisHome';
import TennisRecordList from '../screens/game/tennis/TennisRecordList';
import TennisDeletedRecordScreen from '../screens/game/tennis/TennisDeletedRecordScreen';
import BookReferee from '../screens/game/bookReferee/refereeList/BookReferee';
import BookScorekeeper from '../screens/game/bookScorekeeper/scorekeeperList/BookScorekeeper';
import ScorekeeperBookingDateAndTime from '../screens/game/bookScorekeeper/scorekeeperBookDateTime/ScorekeeperBookingDateAndTime';
import BookScorekeeperSuccess from '../screens/game/bookScorekeeper/BookScorekeeperSuccess';
import ChallengeScreen from '../screens/challenge/createChallenge/ChallengeScreen';
import InviteChallengeScreen from '../screens/challenge/createChallenge/InviteChallengeScreen';
import ChooseVenueScreen from '../screens/challenge/manageChallenge/ChooseVenueScreen';
import ChallengePreviewScreen from '../screens/challenge/createChallenge/ChallengePreviewScreen';
import ChallengePaymentScreen from '../screens/challenge/createChallenge/ChallengePaymentScreen';
import ChooseTimeSlotScreen from '../screens/challenge/createChallenge/ChooseTimeSlotScreen';

import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import InviteToChallengeSentScreen from '../screens/challenge/createChallenge/InviteToChallengeSentScreen';
import UserGalleryScreen from '../screens/home/user/UserGalleryScreen';
import UserScoreboardScreen from '../screens/home/user/UserScoreboardScreen';
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
import WriteReviewScreen from '../components/game/soccer/home/review/WriteReviewScreen';
import AvailibilityReferee from '../screens/game/bookReferee/refereeSetting/AvailibilityReferee';
import RefereeFee from '../screens/game/bookReferee/refereeSetting/RefereeFee';
import AvailableAreaReferee from '../screens/game/bookReferee/refereeSetting/AvailableAreaReferee';
import RefundPolicyReferee from '../screens/game/bookReferee/refereeSetting/RefundPolicyReferee';
import RefundPolicyScorekeeper from '../screens/game/bookScorekeeper/scorekeeperSetting/RefundPolicyScorekeeper';
import fonts from '../Constants/Fonts';
import ScorekeeperSelectMatch from '../screens/game/bookScorekeeper/selectMatch/ScorekeeperSelectMatch';
import ScorekeeperAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperAgreementScreen';
import RefereeAgreementScreen from '../screens/challenge/createChallenge/RefereeAgreementScreen';
import ScorekeeperInviteAgreementScreen from '../screens/challenge/createChallenge/ScorekeeperInviteAgreementScreen';
import RefereeInviteAgreementScreen from '../screens/challenge/createChallenge/RefereeInviteAgreementScreen';
import RefereeApprovalScreen from '../screens/referee/RefereeApprovalScreen';
import ScorekeeperApprovalScreen from '../screens/scorekeeper/ScorekeeperApprovalScreen';
import AlterScorekeeperScreen from '../screens/scorekeeper/alterScorekeeper/AlterScorekeeperScreen';
import ScorekeeperReservationScreen from '../screens/scorekeeper/ScorekeeperReservationScreen';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import EntityInfoScreen from '../screens/home/EntityInfoScreen';
import EntityScoreboardScreen from '../screens/home/EntityScoreboardScreen';
import EntityGallaryScreen from '../screens/home/EntityGallaryScreen';
import EntityReviewScreen from '../screens/home/EntityReviewScreen';
import RespondForInviteScreen from '../screens/notificationsScreen/RespondForInviteScreen';
import JoinedTeamsScreen from '../screens/account/JoinedTeamsScreen';
import EntityStatScreen from '../screens/home/EntityStatScreen';
import GameTennisDuration from '../screens/challenge/manageChallenge/settings/GameTennisDuration';
import {strings} from '../../Localization/translation';
import MessageNavigator from './MessageNavigator';
import SportActivityHome from '../screens/home/SportActivity/SportActivityHome';
import EditWrapperScreen from '../screens/home/SportActivity/EditWrapperScreen';
import ReviewDetailsScreen from '../screens/home/SportActivity/ReviewDetailsScreen';
import GroupFollowersScreen from '../screens/account/groupConnections/GroupFollowersScreen';
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';

const Stack = createStackNavigator();

const NewsFeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="FeedsScreen"
      component={FeedsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="WritePostScreen"
      component={WritePostScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserTagSelectionListScreen"
      component={UserTagSelectionListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={'FeedViewScreen'}
      component={FeedViewScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="AlterRequestAccept"
      component={AlterRequestAccept}
      options={{
        headerShown: false,
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
      name="NewsFeedVideoPlayer"
      component={NewsFeedVideoPlayer}
      options={{
        title: '',
        headerTintColor: colors.whiteColor,
        borderBottomWidth: 0,
        headerStyle: {
          backgroundColor: colors.blackColor,
          shadowOffset: {
            height: 0,
          },
        },
      }}
      // options={{headerShown: false}}
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
      name="FullVideoScreen"
      component={FullVideoScreen}
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
      name="EntitySearchScreen"
      component={EntitySearchScreen}
      options={{
        title: strings.searchText,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontFamily: fonts.Roboto,
          fontSize: 16,
          color: colors.lightBlackColor,
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
      name="EntityScoreboardScreen"
      component={EntityScoreboardScreen}
      options={{
        headerShown: false,
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
      name="BookRefereeSuccess"
      component={BookRefereeSuccess}
      options={{
        headerShown: false,
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
    <Stack.Screen
      component={GroupFollowersScreen}
      name="GroupFollowersScreen"
      options={{headerShown: false}}
    />

    {/*    Challenge */}

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

    {/*    New */}

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
      name="ChallengeAcceptedDeclinedScreen"
      component={ChallengeAcceptedDeclinedScreen}
      options={{
        tabBarVisible: false,
        headerShown: false,
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
      name="WriteReviewScreen"
      component={WriteReviewScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default NewsFeedNavigator;
