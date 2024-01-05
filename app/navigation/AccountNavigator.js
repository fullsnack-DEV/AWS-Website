import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import EditPersonalProfileScreen from '../screens/home/user/EditPersonalProfileScreen';
import EditGroupProfileScreen from '../screens/home/EditGroupProfileScreen';
import SearchLocationScreen from '../screens/account/commonScreen/SearchLocationScreen';

import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';

import EditGroupBasicInfoScreen from '../screens/home/EditGroupBasicInfoScreen';
import IncomingChallengeSettings from '../screens/account/registerPlayer/IncomingChallengeSettings';
import RegisterPlayer from '../screens/account/registerPlayer/RegisterPlayer';
import RegisterReferee from '../screens/account/registerReferee/RegisterReferee';
import CreateTeamForm1 from '../screens/account/createGroup/createTeam/CreateTeamForm1';
import CreateTeamForm2 from '../screens/account/createGroup/createTeam/CreateTeamForm2';

import CreateClubForm1 from '../screens/account/createGroup/createClub/CreateClubForm1';
import CreateClubForm2 from '../screens/account/createGroup/createClub/CreateClubForm2';
import CreateClubForm3 from '../screens/account/createGroup/createClub/CreateClubForm3';

import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import AddCardScreen from '../screens/account/payment/AddCardScreen';
import PayoutMethodScreen from '../screens/account/payment/PayoutMethodScreen';
import PayoutMethodList from '../screens/account/payment/PayoutMethodList';

import GroupSettingPrivacyScreen from '../screens/account/GroupSettingPrivacyScreen';
import UserSettingPrivacyScreen from '../screens/account/userSettingPrivacy/UserSettingPrivacyScreen';
import ChangePasswordScreen from '../screens/account/userSettingPrivacy/ChangePasswordScreen';
import PersonalInformationScreen from '../screens/account/userSettingPrivacy/PersonalInformationScreen';

import RegisterScorekeeper from '../screens/account/registerScorekeeper/RegisterScorekeeper';
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
import InviteToChallengeSentScreen from '../screens/challenge/createChallenge/InviteToChallengeSentScreen';
import InvoiceSentScreen from '../screens/account/Invoice/InvoiceSentScreen';
import PayInvoiceScreen from '../screens/account/Invoice/PayInvoiceScreen';
import RecipientDetailScreen from '../screens/account/Invoice/RecipientDetailScreen';
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
import fonts from '../Constants/Fonts';
import LookingForSettingScreen from '../screens/home/playInModule/LookingForSettingScreen';
import SportActivityTagScreen from '../screens/home/SportActivityTagScreen';
import DeactivateSportScreen from '../components/Home/DeactivateSportScreen';

import RespondForInviteScreen from '../screens/notificationsScreen/RespondForInviteScreen';
import SportSettingScreen from '../screens/localhome/SportSettingScreen';
import DeactivatedSportsListScreen from '../components/Home/DeactivatedSportsListScreen';
import DeactivateAccountScreen from '../components/Home/DeactivateAccountScreen';
import TerminateAccountScreen from '../components/Home/TerminateAccountScreen';
import PauseGroupScreen from '../components/Home/PauseGroupScreen';
import SportAccountSettingScreen from '../screens/account/SportAccountSettingScreen';
import GameTennisDuration from '../screens/challenge/manageChallenge/settings/GameTennisDuration';
import AccountInfoScreen from '../screens/account/userSettingPrivacy/AccountInfoScreen';
import BasicInfoScreen from '../screens/account/userSettingPrivacy/BasicInfoScreen';
import GroupMembersSettingScreen from '../screens/account/GroupSetting/GroupMembersSettingScreen';
import RecruitingMemberScreen from '../screens/account/GroupSetting/RecruitingMemberScreen';
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
import IncomingReservationSettings from '../screens/account/registerReferee/IncomingReservationSettings';
import TimeZoneScreen from '../screens/account/userSettingPrivacy/TimeZoneScreen';

import WhoCanSeeFollowers from '../screens/account/GroupSetting/WhoCanSeeFollwersScreen';
// Scorekeeper Review Screen

import RespondToInviteScreen from '../screens/account/createGroup/createTeam/RespondToInviteScreen';
import ActivityLogScreen from '../screens/account/ActivityLogScreen';
import PersonalUserPrivacySettingsScreen from '../screens/account/privacySettings/PersonalUserPrivacySettingsScreen';
import PrivacyOptionsScreen from '../screens/account/privacySettings/PrivacyOptionsScreen';

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
      name="SearchLocationScreen"
      component={SearchLocationScreen}
      options={{
        headerTransparent: true,
        title: ' ',
        headerTintColor: colors.whiteColor,
      }}
    />

    <Stack.Screen
      name="RegisterPlayer"
      component={RegisterPlayer}
      options={{headerShown: false}}
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
      name="CreateTeamForm1"
      component={CreateTeamForm1}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CreateTeamForm2"
      component={CreateTeamForm2}
      options={{headerShown: false}}
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
      options={{headerShown: false}}
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

    {/* <Stack.Screen
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
    /> */}

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
      name="RegisterScorekeeper"
      component={RegisterScorekeeper}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="ManageChallengeScreen"
      component={ManageChallengeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="DeactivatedSportsListScreen"
      component={DeactivatedSportsListScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="SportActivityTagScreen"
      component={SportActivityTagScreen}
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
      name="InviteToChallengeSentScreen"
      component={InviteToChallengeSentScreen}
      options={{
        tabBarVisible: false,
        headerShown: false,
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
      name="WhoCanSeeFollowers"
      component={WhoCanSeeFollowers}
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
      name="PersonalUserPrivacySettingsScreen"
      component={PersonalUserPrivacySettingsScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="PrivacyOptionsScreen"
      component={PrivacyOptionsScreen}
      options={{headerShown: false}}
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

    {/* <Stack.Screen
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
    /> */}
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

    <Stack.Screen
      name="RespondToInviteScreen"
      component={RespondToInviteScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="ActivityLogScreen"
      component={ActivityLogScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
