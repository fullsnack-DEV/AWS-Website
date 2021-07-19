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

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import QB from 'quickblox-react-native-sdk';
import NewsFeedNavigator from './NewsFeedNavigator';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import MessageNavigator from './MessageNavigator';
// import NotificationNavigator from './NotificationNavigator';
// import AccountDrawerNavigator from './AccountDrawerNavigator';
import { QB_UNREAD_MESSAGE_COUNT_API } from '../utils/QuickBlox';
import AuthContext from '../auth/context';
import { getUnreadCount } from '../api/Notificaitons';
import AccountNavigator from './AccountNavigator';
import LocalHomeNavigator from './LocalHomeNavigator';
import strings from '../Constants/String';
import ScheduleNavigator from './ScheduleNavigator';

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
  const routeName = route?.state?.routes?.[route?.state?.index]?.name ?? '';
  // if (route.name === 'Account') {
  //   const lastIndex = route?.state?.routes?.[0]?.state?.routes?.length - 1;
  //   routeName = route?.state?.routes?.[0]?.state?.routes?.[lastIndex]?.name;
  // } else {
  //   routeName = route?.state?.routes?.[route?.state?.index]?.name ?? '';
  // }
  if (
    routeName === 'SoccerRecording'
    || routeName === 'GameDetailRecord'
    || routeName === 'TennisRecordList'
    || routeName === 'TennisDeletedRecordScreen'
    || routeName === 'NewsFeedVideoPlayer'
    || routeName === 'RegisterPlayer'
    || routeName === 'RegisterPlayerForm2'
    || routeName === 'RegisterReferee'
    || routeName === 'RegisterRefereeForm2'
    || routeName === 'CreateTeamForm1'
    || routeName === 'CreateTeamForm2'
    || routeName === 'CreateTeamForm3'
    || routeName === 'CreateTeamForm4'
    || routeName === 'CreateClubForm1'
    || routeName === 'CreateClubForm2'
    || routeName === 'CreateClubForm3'
    || routeName === 'TeamCreatedScreen'
    || routeName === 'WritePostScreen'
    || routeName === 'EditPostScreen'
    || routeName === 'WriteCommentScreen'
    || routeName === 'SearchLocationScreen'
    || routeName === 'SearchPlayerScreen'
    || routeName === 'ClubCreatedScreen'
    || routeName === 'ChangePasswordScreen'
    || routeName === 'PersonalInformationScreen'
    || routeName === 'FullVideoScreen'
    || routeName === 'ReservationDetailScreen'
    || routeName === 'MembersProfileScreen'
    || routeName === 'TagUserScreen'
    || routeName === 'UserTagSelectionListScreen'
    || routeName === 'InvitationSentScreen'
    || routeName === 'UserFoundScreen'
    || routeName === 'UserNotFoundScreen'
    || routeName === 'MemberProfileCreatedScreen'
    || routeName === 'ConnectionReqSentScreen'
    || routeName === 'EventScreen'
    || routeName === 'EditEventScreen'
    // || routeName === 'CreateEventScreen'
    || routeName === 'EditChallengeAvailability'
    || routeName === 'MessageChat'
    || routeName === 'MessageInviteScreen'
    || routeName === 'MessageNewGroupScreen'
    || routeName === 'MessageEditGroupScreen'
    || routeName === 'MessageSearchScreen'
    || routeName === 'MessageEditInviteeScreen'
    || routeName === 'DefaultColorScreen'
    || routeName === 'GroupEventScreen'
    || routeName === 'ViewPrivacy'
    || routeName === 'UserFoundScreen'
    || routeName === 'UserNotFoundScreen'
    || routeName === 'MemberProfileCreatedScreen'
    || routeName === 'InvitationSentScreen'
    || routeName === 'ConnectionReqSentScreen'
    || routeName === 'TennisRecording'
    || routeName === 'RegisterRefereeSuccess'
    || routeName === 'RegisterScorekeeperSuccess'
    || routeName === 'RegisterPlayerSuccess'
    || routeName === 'BookRefereeSuccess'
    || routeName === 'RefereeRequestSent'
    || routeName === 'BookScorekeeperSuccess'
    || routeName === 'ChallengeSentScreen'
    || routeName === 'ChallengeAcceptedDeclinedScreen'
    || routeName === 'AlterRequestSent'
    || routeName === 'ReservationAcceptDeclineScreen'
    || routeName === 'AlterRequestAccept'
    || routeName === 'RegisterScorekeeper'
    || routeName === 'RegisterScorekeeperForm2'
    || routeName === 'ScorekeeperRequestSent'
    || routeName === 'ScorekeeperAcceptDeclineScreen'
    || routeName === 'ShortsPlayScreen'
    || routeName === 'FeedViewScreen'
    || routeName === 'SingleNotificationScreen'
    || routeName === 'ManageChallengeScreen'
    || routeName === 'GameType'
    || routeName === 'RefundPolicy'
    || routeName === 'GameFee'
    || routeName === 'GameRules'
    || routeName === 'Venue'
    || routeName === 'HomeAway'
    || routeName === 'Availibility'
    || routeName === 'RefereesSetting'
    || routeName === 'ScorekeepersSetting'
    || routeName === 'GameDuration'
    || routeName === 'ChallengeScreen'
    || routeName === 'InviteChallengeScreen'
    || routeName === 'ChooseVenueScreen'
    || routeName === 'ChallengePreviewScreen'
    || routeName === 'ChallengePaymentScreen'
    || routeName === 'ChooseTimeSlotScreen'
    || routeName === 'InviteToChallengeSentScreen'
    || routeName === 'ChangeReservationInfoScreen'
    || routeName === 'EditChallenge'
    || routeName === 'RespondToInviteScreen'
    || routeName === 'InvoiceScreen'
    || routeName === 'MembersDetailScreen'
    || routeName === 'InviteToMemberScreen'
    || routeName === 'UserInvoiceScreen'
    || routeName === 'InvoiceDetailScreen'
    || routeName === 'LogDetailScreen'
    || routeName === 'BatchDetailScreen'
    || routeName === 'TeamInvoiceDetailScreen'
    || routeName === 'AddLogScreen'
    || routeName === 'CanceledInvoicesScreen'
  ) {
    return false;
  }

  return true;
};
const QbMessageEmitter = new NativeEventEmitter(QB.chat);

const AppNavigator = ({ navigation }) => {
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
          const { teams } = response.payload;
          const { clubs } = response.payload;
          const groups = [authContext.entity.auth.user, ...clubs, ...teams];
          let notificationCount = 0;
          (groups || []).map((e) => {
            if (e.unread) {
              notificationCount += e.unread;
            }
          });
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

  useEffect(() => {
    getUnReadNotificationHandler();
  }, [getUnReadNotificationHandler]);

  const onTabPress = useCallback(() => {
    count.current += 1;
    if (count.current === MAX_COUNT_FOR_BOTTOM_TAB) {
      count.current = 0;
      getUnReadMessageHandler();
    }
  }, [getUnReadMessageHandler]);

  const renderTabIcon = useCallback(
    ({ focused }) => {
      if (role === 'user') {
        if (authContext?.entity?.obj?.thumbnail) {
          if (focused) {
            return (
              <LinearGradient
                colors={[colors.yellowColor, colors.assistTextColor]}
                style={styles.profileTabBorder}>
                <View style={styles.profileImageCover}>
                  <Image
                  source={{ uri: authContext?.entity?.obj?.thumbnail }}
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
                { backgroundColor: colors.whiteColor },
              ]}>
              <Image
                source={{ uri: authContext?.entity?.obj?.thumbnail }}
                style={[styles.profileTabImg, { height: 27, width: 27 }]}
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
                  source={{ uri: authContext?.entity?.obj?.thumbnail }}
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
                { backgroundColor: colors.whiteColor },
              ]}>
              <Image
                source={{ uri: authContext?.entity?.obj?.thumbnail }}
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
                  source={{ uri: authContext?.entity?.obj?.thumbnail }}
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
                { backgroundColor: colors.whiteColor },
              ]}>
              <Image
                source={{ uri: authContext?.entity?.obj?.thumbnail }}
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
    }, [authContext?.entity?.obj?.thumbnail, role],
);

    return (
      <Tab.Navigator
        lazy={true}
      navigation={navigation}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: colors.tabFontColor,
        inactiveTintColor: colors.userPostTimeColor,
        style: {
          backgroundColor: colors.offwhite,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
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
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
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
        component={NewsFeedNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
            return (
              <Image
                source={focused ? images.tabSelectedFeed : images.tabFeed}
                style={focused ? styles.selectedTabImg : styles.tabImg}
              />
            );
          },
        })}
      />
        <Tab.Screen
        name="Message"
        component={MessageNavigator}
        options={({ route }) => ({
            unmountOnBlur: true,
          ...(unreadCount > 0 && {
            tabBarBadge: unreadCount > 300 ? '300+' : unreadCount,
          }),
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
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
        name="Schedule"
        component={ScheduleNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
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
        name="Account"
        navigation={navigation}
        component={AccountNavigator}
        options={({ route }) => ({
          ...(unreadNotificationCount > 0 && {
            tabBarBadge: unreadNotificationCount > 300 ? '300+' : unreadNotificationCount,
          }),
          tabBarBadgeStyle: { zIndex: 10, fontSize: 12 },
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: renderTabIcon,

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
    height: 34,
    resizeMode: 'cover',
    width: 34,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AppNavigator;
