/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  Image,
  StyleSheet,
  NativeEventEmitter,
  StatusBar,
  View,
  Alert,
  // Dimensions,
  // Platform,
} from 'react-native';

import {useNavigationState} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import QB from 'quickblox-react-native-sdk';
import NewsFeedNavigator from './NewsFeedNavigator';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import MessageNavigator from './MessageNavigator';
// import NotificationNavigator from './NotificationNavigator';
// import AccountDrawerNavigator from './AccountDrawerNavigator';
import {QB_UNREAD_MESSAGE_COUNT_API} from '../utils/QuickBlox';
import AuthContext from '../auth/context';
import {getUnreadCount} from '../api/Notificaitons';
import AccountNavigator from './AccountNavigator';
import LocalHomeNavigator from './LocalHomeNavigator';
import {strings} from '../../Localization/translation';
import ScheduleNavigator from './ScheduleNavigator';
import MembersNavigator from './MembersNavigator';

// import HomeNavigator from './HomeNavigator';
// import HomeNavigator from './HomeNavigator';
// import AccountScreen from '../screens/account/AccountScreen';

const MAX_COUNT_FOR_BOTTOM_TAB = 8;
// const DEFAULT_1X_HEIGHT = 30;

const Tab = createBottomTabNavigator();

// const getHeight = () => {
//   if (Platform.OS === 'ios') {
//     if (Dimensions.get('window').height <= 320) {
//       return DEFAULT_1X_HEIGHT
//     }
//     if (Dimensions.get('window').height > 320 && Dimensions.get('window').height <= 828) {
//       return DEFAULT_1X_HEIGHT * 2
//     }
//     if (Dimensions.get('window').height > 828 && Dimensions.get('window').height <= 1242) {
//       return DEFAULT_1X_HEIGHT * 3
//     }
//   }
// }

const getTabBarVisibility = (route) => {
  // let routeName = '';
  const routeObj = route?.routes?.[route?.index] ?? {};

  const routeName = routeObj?.state?.routes?.[routeObj?.state?.index]?.name;

  // console.log('routeNamerouteNamerouteNamerouteName:=>', route);
  // if (route.name === 'Account') {
  //   const lastIndex = route?.state?.routes?.[0]?.state?.routes?.length - 1;
  //   routeName = route?.state?.routes?.[0]?.state?.routes?.[lastIndex]?.name;
  // } else {
  //   routeName = route?.state?.routes?.[route?.state?.index]?.name ?? '';
  // }
  if (
    routeName === 'SoccerRecording' ||
    routeName === 'GameDetailRecord' ||
    routeName === 'TennisRecordList' ||
    routeName === 'TennisDeletedRecordScreen' ||
    routeName === 'NewsFeedVideoPlayer' ||
    routeName === 'RegisterPlayer' ||
    routeName === 'RegisterPlayerForm2' ||
    routeName === 'RegisterReferee' ||
    routeName === 'RegisterRefereeForm2' ||
    routeName === 'CreateTeamForm1' ||
    routeName === 'CreateTeamForm2' ||
    routeName === 'CreateTeamForm3' ||
    routeName === 'CreateTeamForm4' ||
    routeName === 'CreateClubForm1' ||
    routeName === 'CreateClubForm2' ||
    routeName === 'CreateClubForm3' ||
    routeName === 'TeamCreatedScreen' ||
    routeName === 'WritePostScreen' ||
    routeName === 'EditPostScreen' ||
    routeName === 'WriteCommentScreen' ||
    routeName === 'SearchLocationScreen' ||
    routeName === 'SearchPlayerScreen' ||
    routeName === 'ClubCreatedScreen' ||
    routeName === 'ChangePasswordScreen' ||
    routeName === 'PersonalInformationScreen' ||
    routeName === 'FullVideoScreen' ||
    routeName === 'ReservationDetailScreen' ||
    routeName === 'MembersProfileScreen' ||
    routeName === 'TagUserScreen' ||
    routeName === 'UserTagSelectionListScreen' ||
    routeName === 'InvitationSentScreen' ||
    routeName === 'UserFoundScreen' ||
    routeName === 'UserNotFoundScreen' ||
    routeName === 'MemberProfileCreatedScreen' ||
    routeName === 'ConnectionReqSentScreen' ||
    routeName === 'EventScreen' ||
    routeName === 'EditEventScreen' ||
    routeName === 'InviteToEventScreen' ||
    routeName === 'GoingListScreen' ||
    routeName === 'EditChallengeAvailability' ||
    routeName === 'MessageInviteScreen' ||
    routeName === 'MessageNewGroupScreen' ||
    routeName === 'MessageEditGroupScreen' ||
    routeName === 'MessageSearchScreen' ||
    routeName === 'MessageEditInviteeScreen' ||
    routeName === 'DefaultColorScreen' ||
    routeName === 'GroupEventScreen' ||
    routeName === 'ViewPrivacy' ||
    routeName === 'UserFoundScreen' ||
    routeName === 'UserNotFoundScreen' ||
    routeName === 'MemberProfileCreatedScreen' ||
    routeName === 'InvitationSentScreen' ||
    routeName === 'ConnectionReqSentScreen' ||
    routeName === 'TennisRecording' ||
    routeName === 'RegisterRefereeSuccess' ||
    routeName === 'RegisterScorekeeperSuccess' ||
    routeName === 'RegisterPlayerSuccess' ||
    routeName === 'BookRefereeSuccess' ||
    routeName === 'RefereeRequestSent' ||
    routeName === 'BookScorekeeperSuccess' ||
    routeName === 'ChallengeSentScreen' ||
    routeName === 'ChallengeAcceptedDeclinedScreen' ||
    routeName === 'AlterRequestSent' ||
    routeName === 'ReservationAcceptDeclineScreen' ||
    routeName === 'AlterRequestAccept' ||
    routeName === 'RegisterScorekeeper' ||
    routeName === 'RegisterScorekeeperForm2' ||
    routeName === 'ScorekeeperRequestSent' ||
    routeName === 'ScorekeeperAcceptDeclineScreen' ||
    routeName === 'ShortsPlayScreen' ||
    routeName === 'FeedViewScreen' ||
    routeName === 'SingleNotificationScreen' ||
    routeName === 'ManageChallengeScreen' ||
    routeName === 'GameType' ||
    routeName === 'RefundPolicy' ||
    routeName === 'GameFee' ||
    routeName === 'GameRules' ||
    routeName === 'Venue' ||
    routeName === 'HomeAway' ||
    routeName === 'Availibility' ||
    routeName === 'RefereesSetting' ||
    routeName === 'ScorekeepersSetting' ||
    routeName === 'GameDuration' ||
    routeName === 'GameTennisDuration' ||
    routeName === 'ChallengeScreen' ||
    routeName === 'InviteChallengeScreen' ||
    routeName === 'ChooseVenueScreen' ||
    routeName === 'ChallengePreviewScreen' ||
    routeName === 'ChallengePaymentScreen' ||
    routeName === 'ChooseTimeSlotScreen' ||
    routeName === 'InviteToChallengeSentScreen' ||
    routeName === 'ChangeReservationInfoScreen' ||
    routeName === 'EditChallenge' ||
    routeName === 'RespondToInviteScreen' ||
    routeName === 'InvoiceScreen' ||
    routeName === 'MembersDetailScreen' ||
    routeName === 'InviteToMemberScreen' ||
    routeName === 'UserInvoiceScreen' ||
    routeName === 'InvoiceDetailScreen' ||
    routeName === 'LogDetailScreen' ||
    routeName === 'BatchDetailScreen' ||
    routeName === 'TeamInvoiceDetailScreen' ||
    routeName === 'AddLogScreen' ||
    routeName === 'CanceledInvoicesScreen' ||
    routeName === 'RefereeReservationSetting' ||
    routeName === 'ScorekeeperReservationSetting' ||
    routeName === 'AvailibilityReferee' ||
    routeName === 'RefereeFee' ||
    routeName === 'AvailableAreaReferee' ||
    routeName === 'AvailibilityScorekeeper' ||
    routeName === 'ScorekeeperFee' ||
    routeName === 'AvailableAreaScorekeeper' ||
    routeName === 'RefundPolicyScorekeeper' ||
    routeName === 'RefundPolicyReferee' ||
    routeName === 'RefereeBookingDateAndTime' ||
    routeName === 'BookReferee' ||
    routeName === 'AlterRefereeScreen' ||
    routeName === 'EditRefereeReservation' ||
    routeName === 'BookScorekeeper' ||
    routeName === 'AlterScorekeeperScreen' ||
    routeName === 'EditScorekeeperReservation' ||
    routeName === 'ScorekeeperBookingDateAndTime' ||
    routeName === 'ReservationNavigator' ||
    routeName === 'ScorekeeperReservationScreen' ||
    routeName === 'RefereeReservationScreen' ||
    routeName === 'AlterChallengeScreen' ||
    routeName === 'RefereeAgreementScreen' ||
    routeName === 'ScorekeeperAgreementScreen' ||
    routeName === 'ScorekeeperInviteAgreementScreen' ||
    routeName === 'RefereeInviteAgreementScreen' ||
    routeName === 'RefereeApprovalScreen' ||
    routeName === 'ScorekeeperApprovalScreen' ||
    routeName === 'RefereeSelectMatch' ||
    routeName === 'ScorekeeperSelectMatch' ||
    routeName === 'UpcomingMatchScreen' ||
    routeName === 'RecentMatchScreen' ||
    routeName === 'ScorekeeperListScreen' ||
    routeName === 'RefereesListScreen' ||
    routeName === 'LookingForChallengeScreen' ||
    routeName === 'RecruitingPlayerScreen' ||
    routeName === 'LookingTeamScreen' ||
    routeName === 'SportSettingScreen' ||
    routeName === 'AddOrDeleteSport' ||
    routeName === 'LookingForSettingScreen' ||
    routeName === 'SportActivityScreen' ||
    routeName === 'DeactivatedSportsListScreen' ||
    routeName === 'SportActivitiesScreen' ||
    routeName === 'ActivitySettingScreen' ||
    routeName === 'SportActivityTagScreen' ||
    routeName === 'ChangeSportsOrderScreen' ||
    routeName === 'ChangeOtherListScreen' ||
    routeName === 'SportHideUnhideScreen' ||
    routeName === 'DeactivateSportScreen' ||
    routeName === 'DeactivateAccountScreen' ||
    routeName === 'TerminateAccountScreen' ||
    routeName === 'EditRosterScreen' ||
    routeName === 'CreateEventScreen' ||
    routeName === 'AcceptEventInviteScreen' ||
    routeName === 'EditLineUpScreen' ||
    routeName === 'SearchScreen' ||
    routeName === 'MembersViewPrivacyScreen' ||
    routeName === 'NotificationsListScreen' ||
    routeName === 'PendingRequestScreen' ||
    routeName === 'UserConnections' ||
    routeName === 'EditGroupProfileScreen' ||
    routeName === 'EntityInfoScreen' ||
    routeName === 'EntityScoreboardScreen' ||
    routeName === 'EntityGallaryScreen' ||
    routeName === 'EntityReviewScreen' ||
    routeName === 'RespondForInviteScreen' ||
    routeName === 'JoinedTeamsScreen' ||
    routeName === 'ClubSettingScreen' ||
    routeName === 'EditMemberBasicInfoScreen' ||
    routeName === 'EditClubNotesScreen' ||
    routeName === 'EditMemberAuthInfoScreen' ||
    routeName === 'EditMemberTeamInfoScreen' ||
    routeName === 'EntityStatScreen' ||
    routeName === 'CreateMemberProfileForm1' ||
    routeName === 'CreateMemberProfileForm2' ||
    routeName === 'CreateMemberProfileForm3' ||
    routeName === 'EditMemberInfoScreen' ||
    routeName === 'CreateMemberProfileForm2' ||
    routeName === 'CreateMemberProfileClubForm3' ||
    routeName === 'CreateMemberProfileTeamForm3' ||
    routeName === 'InviteMembersBySearchScreen' ||
    routeName === 'RequestBasicInfoScreen' ||
    routeName === 'RequestMultipleBasicInfoScreen' ||
    routeName === 'EditPersonalProfileScreen' ||
    routeName === 'AddCardScreen' ||
    routeName === 'PaymentMethodsScreen' ||
    routeName === 'WriteReviewScreen' ||
    routeName === 'SoccerHome' ||
    routeName === 'TennisHome' ||
    routeName === 'LeaveReviewTennis' ||
    routeName === 'GroupSettingPrivacyScreen' ||
    routeName === 'UserSettingPrivacyScreen' ||
    routeName === 'PauseGroupScreen' ||
    routeName === 'PayoutMethodScreen' ||
    routeName === 'SportAccountSettingScreen' ||
    routeName === 'GroupMembersSettingScreen' ||
    routeName === 'RecruitingMemberScreen' ||
    routeName === 'WhoCanJoinTeamScreen' ||
    routeName === 'ClubInviteTeamScreen' ||
    routeName === 'GroupInviteSettingPrivacyScreen' ||
    routeName === 'GroupInviteYouScreen' ||
    routeName === 'EventSettingPrivacyScreen' ||
    routeName === 'WhoCreateEventScreen' ||
    routeName === 'WhoCanInviteEventScreen' ||
    routeName === 'ClubSettingPrivacyScreen' ||
    routeName === 'TeamJoinClubScreen' ||
    routeName === 'TeamSettingPrivacyScreen' ||
    routeName === 'WhoCanInviteMemberScreen' ||
    routeName === 'WhatEventInviteScreen' ||
    routeName === 'UserEventSettingPrivacyScreen' ||
    routeName === 'GroupsScreen' ||
    routeName === 'TrashScreen' ||
    routeName === 'LanguageSettingScreen' ||
    routeName === 'MessageChat' ||
    routeName === 'InviteMembersByEmailScreen'
  ) {
    return false;
  }

  return true;
};
const QbMessageEmitter = new NativeEventEmitter(QB.chat);

const AppNavigator = ({navigation}) => {
  const routes = useNavigationState((state) => state);
  const authContext = useContext(AuthContext);
  const count = useRef(0);
  const [role, setRole] = useState('user');
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    if (authContext?.entity?.QB) QBeventListeners();
    else setUnreadCount(0);
  }, [authContext?.entity?.QB, navigation]);

  useEffect(() => {
    changeRole();
  }, [authContext.entity.role]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('white');
  }, []);

  const getQBToken = useMemo(
    async () => authContext.entity?.QB?.token ?? null,
    [authContext.entity?.QB?.token],
  );

  const getUnReadMessageHandler = useCallback(async () => {
    const token = await getQBToken;
    if (token) {
      fetch(QB_UNREAD_MESSAGE_COUNT_API + token)
        .then((response) => response.json())
        .then((jsonData) => {
          setUnreadCount(jsonData?.total ?? 0);
        })
        .catch(() => {
          setUnreadCount(0);
        });
    }
  }, [getQBToken]);

  const getUnReadNotificationHandler = useCallback(() => {
    getUnreadCount(authContext)
      .then((response) => {
        if (response.status === true) {
          const {teams} = response.payload;
          const {clubs} = response.payload;
          const {user} = response.payload;

          const groups = [{...user}, ...clubs, ...teams];
          let notificationCount = 0;
          (groups || []).map((e) => {
            if (e.unread) {
              notificationCount += e.unread;
            }
          });
          console.log('notificationCount', notificationCount);
          setUnreadNotificationCount(notificationCount);
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  const changeRole = useCallback(async () => {
    setRole(authContext.entity.role);
  }, [authContext.entity.role]);

  const QBeventListeners = useCallback(() => {
    QbMessageEmitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      getUnReadMessageHandler,
    );
  }, [getUnReadMessageHandler]);

  const onTabPress = useCallback(() => {
    console.log('On tab press');
    count.current += 1;
    if (count.current === MAX_COUNT_FOR_BOTTOM_TAB) {
      count.current = 0;
      getUnReadNotificationHandler();
      getUnReadMessageHandler();
    }
  }, [getUnReadMessageHandler, getUnReadNotificationHandler]);

  const renderTabIcon = useCallback(
    ({focused}) => {
      if (role === 'user') {
        if (authContext?.entity?.obj?.thumbnail) {
          if (focused) {
            onTabPress();
            return (
              <LinearGradient
                colors={[colors.yellowColor, colors.assistTextColor]}
                style={styles.profileTabBorder}>
                <View style={styles.profileImageCover}>
                  <Image
                    source={{uri: authContext?.entity?.obj?.thumbnail}}
                    style={styles.profileTabImg}
                  />
                </View>
              </LinearGradient>
            );
          }
          return (
            <View
              style={[
                styles.profileTabBorder,
                {backgroundColor: colors.whiteColor},
              ]}>
              <Image
                source={{uri: authContext?.entity?.obj?.thumbnail}}
                style={[styles.profileTabImg, {height: 27, width: 27}]}
              />
            </View>
          );
        }
        if (focused) {
          return (
            <Image source={images.tab_account_selected} style={styles.tabImg} />
          );
        }
        return <Image source={images.tab_account} style={styles.tabImg} />;
      }
      if (role === 'team') {
        if (authContext?.entity?.obj?.thumbnail) {
          if (focused) {
            return (
              <LinearGradient
                colors={[colors.yellowColor, colors.assistTextColor]}
                style={styles.profileTabBorder}>
                <View style={styles.profileImageCover}>
                  <Image
                    source={{uri: authContext?.entity?.obj?.thumbnail}}
                    style={styles.profileTabImg}
                  />
                </View>
              </LinearGradient>
            );
          }
          return (
            <View
              style={[
                styles.profileTabBorder,
                {backgroundColor: colors.whiteColor},
              ]}>
              <Image
                source={{uri: authContext?.entity?.obj?.thumbnail}}
                style={styles.profileTabImg}
              />
            </View>
          );
        }
        if (focused) {
          return (
            <Image
              source={images.tab_account_group_selected}
              style={styles.tabImg}
            />
          );
        }
        return (
          <Image source={images.tab_account_group} style={styles.tabImg} />
        );
      }
      if (role === 'club') {
        if (authContext?.entity?.obj?.thumbnail) {
          if (focused) {
            return (
              <LinearGradient
                colors={[colors.yellowColor, colors.assistTextColor]}
                style={styles.profileTabBorder}>
                <View style={styles.profileImageCover}>
                  <Image
                    source={{uri: authContext?.entity?.obj?.thumbnail}}
                    style={styles.profileTabImg}
                  />
                </View>
              </LinearGradient>
            );
          }
          return (
            <View
              style={[
                styles.profileTabBorder,
                {backgroundColor: colors.whiteColor},
              ]}>
              <Image
                source={{uri: authContext?.entity?.obj?.thumbnail}}
                style={styles.profileTabImg}
              />
            </View>
          );
        }
        if (focused) {
          return (
            <Image
              source={images.tab_account_group_selected}
              style={styles.tabImg}
            />
          );
        }
        return (
          <Image source={images.tab_account_group} style={styles.tabImg} />
        );
      }
    },
    [authContext?.entity?.obj?.thumbnail, role],
  );

  return (
    <Tab.Navigator
      lazy={true}
      backBehaviour="initialRoute"
      navigation={navigation}
      options={() => ({
        headerShown: false,
      })}
      tabBarOptions={{
        headerShown: false,
        showLabel: false,
        activeTintColor: colors.tabFontColor,
        inactiveTintColor: colors.userPostTimeColor,
        style: {
          backgroundColor: colors.offwhite,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -10},
          shadowOpacity: 0.15,
          shadowRadius: 50,
          elevation: 50,
          borderTopColor: colors.thinLineGrayColor,
          // height:
          //   Platform.OS === 'android'
          //     ? '7.5%'
          //     : getHeight(),
          // borderTopWidth: 5,
          // height: heightPercentageToDP(10),
        },
        tabStyle: {
          // height: heightPercentageToDP(9),
          // marginTop: 7,
        },
      }}>
      <Tab.Screen
        name="Local Home"
        component={LocalHomeNavigator}
        options={({route}) => ({
          tabBarTestID: 'localhome-tab',
          headerShown: false,
          // tabBarVisible: getTabBarVisibility(routes),
          tabBarStyle: {display: getTabBarVisibility(routes) ? 'flex' : 'none'},
          tabBarIcon: ({focused}) => {
            if (focused);
            return (
              <Image
                source={focused ? images.tab_home_selected : images.tab_home}
                style={styles.tabImg}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="News Feed"
        component={
          authContext.entity.role === 'team' ||
          authContext.entity.role === 'club'
            ? MembersNavigator
            : NewsFeedNavigator
        }
        options={({route}) => ({
          tabBarTestID: 'newsfeed-tab',
          headerShown: false,
          // tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {display: getTabBarVisibility(routes) ? 'flex' : 'none'},
          tabBarIcon: ({focused}) => {
            if (focused);
            return (
              <Image
                source={
                  focused
                    ? authContext.entity.role === 'team' ||
                      authContext.entity.role === 'club'
                      ? images.tab_members_selected
                      : images.tabSelectedFeed
                    : authContext.entity.role === 'team' ||
                      authContext.entity.role === 'club'
                    ? images.tab_members
                    : images.tabFeed
                }
                style={focused ? styles.selectedTabImg : styles.tabImg}
              />
            );
          },
        })}
      />

      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={({route}) => ({
          tabBarTestID: 'schedule-tab',
          headerShown: false,
          // tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {display: getTabBarVisibility(routes) ? 'flex' : 'none'},
          tabBarIcon: ({focused}) => {
            if (focused);
            return (
              <Image
                source={
                  focused
                    ? images.tab_reservation_selected
                    : images.tab_reservation
                }
                style={styles.tabImg}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="Message"
        component={MessageNavigator}
        options={({route}) => ({
          tabBarTestID: 'message-tab',
          headerShown: false,
          unmountOnBlur: true,
          ...(unreadCount > 0 && {
            tabBarBadge: unreadCount > 300 ? '300+' : unreadCount,
          }),
          // tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {display: getTabBarVisibility(routes) ? 'flex' : 'none'},
          tabBarIcon: ({focused}) => {
            if (focused) onTabPress();
            return (
              <Image
                source={
                  focused ? images.tab_message_selected : images.tab_message
                }
                style={focused ? styles.selectedTabImg : styles.tabImg}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="Account"
        navigation={navigation}
        component={AccountNavigator}
        options={({route}) => ({
          ...(unreadNotificationCount > 0 && {
            tabBarBadge:
              unreadNotificationCount > 300 ? '300+' : unreadNotificationCount,
          }),
          tabBarBadgeStyle: {zIndex: 10, fontSize: 12},
          // tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {display: getTabBarVisibility(routes) ? 'flex' : 'none'},
          tabBarIcon: renderTabIcon,
          headerShown: false,
          tabBarTestID: 'account-tab',
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profileImageCover: {
    height: 27,
    width: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
  },
  selectedTabImg: {
    alignSelf: 'center',
    height: 34,
    resizeMode: 'cover',
    width: 34,
    // borderRadius: 80,
  },

  tabImg: {
    alignSelf: 'center',
    height: 36,
    resizeMode: 'cover',
    width: 36,
    // borderRadius: 80,
  },
  profileTabImg: {
    alignSelf: 'center',
    height: 24,
    resizeMode: 'cover',
    width: 24,
    borderRadius: 48,
  },
  profileTabBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,
    borderRadius: 60,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AppNavigator;
