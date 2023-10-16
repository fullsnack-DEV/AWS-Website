import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import ReservationScreen from '../screens/reservation/ReservationScreen';
import ReservationDetailScreen from '../screens/reservation/ReservationDetailScreen';
import HomeScreen from '../screens/home/HomeScreen';

import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import ScorekeeperReservationScreen from '../screens/scorekeeper/ScorekeeperReservationScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';
import AlterScorekeeperScreen from '../screens/scorekeeper/alterScorekeeper/AlterScorekeeperScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';
import RefereeRequestSent from '../screens/referee/RefereeRequestSent';
import ChangeReservationInfoScreen from '../screens/challenge/alterChallenge/ChangeReservationInfoScreen';
import CurruentReservationScreen from '../screens/challenge/alterChallenge/CurruentReservationScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import TennisHome from '../screens/game/tennis/TennisHome';

import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';

import PayAgainScreen from '../screens/challenge/alterChallenge/PayAgainScreen';
import PayAgainRefereeScreen from '../screens/referee/PayAgainRefereeScreen';
import EditFeeScreen from '../screens/challenge/alterChallenge/EditFeeScreen';
import EditChallenge from '../screens/challenge/alterChallenge/EditChallenge';
import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';

import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';

import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';

import colors from '../Constants/Colors';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import AlterChallengeScreen from '../screens/challenge/alterChallenge/AlterChallengeScreen';
import RefereeApprovalScreen from '../screens/referee/RefereeApprovalScreen';
import ScorekeeperApprovalScreen from '../screens/scorekeeper/ScorekeeperApprovalScreen';
import ScorekeeperSelectMatch from '../screens/game/bookScorekeeper/selectMatch/ScorekeeperSelectMatch';
import PendingRequestScreen from '../screens/notificationsScreen/PendingRequestScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import {strings} from '../../Localization/translation';

const Stack = createStackNavigator();

const ReservationNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      // headerTintColor: colors.blackColor,
      // headerTransparent: true,
      // headerTitle: true,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="ReservationScreen"
      component={ReservationScreen}
      options={{
        title: strings.reservations,
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.whiteColor,
          borderBottomColor: colors.grayColor,
          borderBottomWidth: 0.3,
        },
      }}
    />
    <Stack.Screen
      name="ReservationDetailScreen"
      component={ReservationDetailScreen}
      options={{
        title: 'Reservation Detail',
        headerTintColor: colors.blackColor,
        headerTitleStyle: {
          fontWeight: '500',
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
      name="ChallengeAcceptedDeclinedScreen"
      component={ChallengeAcceptedDeclinedScreen}
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
      name="AlterRequestSent"
      component={AlterRequestSent}
      options={{
        headerShown: false,
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
      name="SoccerHome"
      component={SoccerHome}
      options={{
        tabBarVisible: false,
        headerShown: false,
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
      name="TennisHome"
      component={TennisHome}
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
      name="RefereeRequestSent"
      component={RefereeRequestSent}
      options={{
        headerShown: false,
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
        headerShown: false,
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
      name="AlterRequestAccept"
      component={AlterRequestAccept}
      options={{
        headerShown: false,
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
  </Stack.Navigator>
);

export default ReservationNavigator;
