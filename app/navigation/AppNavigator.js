import React, { useEffect, useState, useContext } from 'react';
import {
    Image, Platform, StyleSheet, NativeEventEmitter, StatusBar,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import QB from 'quickblox-react-native-sdk';
import NewsFeedNavigator from './NewsFeedNavigator';
import colors from '../Constants/Colors'
import images from '../Constants/ImagePath'
import ReservationNavigator from './ReservationNavigator';
import MessageNavigator from './MessageNavigator';
// import NotificationNavigator from './NotificationNavigator';
// import AccountDrawerNavigator from './AccountDrawerNavigator';
import { QB_UNREAD_MESSAGE_COUNT_API } from '../utils/QuickBlox';
import AuthContext from '../auth/context';
import { getUnreadCount } from '../api/Notificaitons';
import AccountNavigator from './AccountNavigator';
// import HomeNavigator from './HomeNavigator';
// import HomeNavigator from './HomeNavigator';
// import AccountScreen from '../screens/account/AccountScreen';

const MAX_COUNT_FOR_BOTTOM_TAB = 8;
const Tab = createBottomTabNavigator();
const getTabBarVisibility = (route) => {
  let routeName = '';
  if (route.name === 'Account') {
    const lastIndex = route?.state?.routes?.[0]?.state?.routes?.length - 1;
    routeName = route?.state?.routes?.[0]?.state?.routes?.[lastIndex]?.name
  } else {
    routeName = route?.state?.routes?.[route?.state?.index]?.name ?? '';
  }
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
    || routeName === 'DefaultColorScreen'
    || routeName === 'GroupEventScreen'
    || routeName === 'ViewPrivacy'
    || routeName === 'UserFoundScreen'
    || routeName === 'UserNotFoundScreen'
    || routeName === 'MemberProfileCreatedScreen'
    || routeName === 'InvitationSentScreen'
    || routeName === 'ConnectionReqSentScreen'
    || routeName === 'MessageNewGroupScreen'
    || routeName === 'TennisRecording'
    || routeName === 'RegisterRefereeSuccess'
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

  ) {
    return false;
  }

  return true;
};
const QbMessageEmitter = new NativeEventEmitter(QB.chat)

function AppNavigator({ navigation }) {
  const authContext = useContext(AuthContext)
  const [role, setRole] = useState('user');
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  useEffect(() => {
    changeRole();
    QBeventListeners();
  }, [navigation]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
    StatusBar.setBackgroundColor('white')
  }, []);

  const getQBToken = async () => authContext.entity?.QB?.token ?? null

  const QBeventListeners = () => {
    QbMessageEmitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      getUnReadMessageHandler,
    )

    getUnReadMessageHandler()
  }
  const getUnReadMessageHandler = async () => {
    const token = await getQBToken();
    if (token) {
      fetch(QB_UNREAD_MESSAGE_COUNT_API + token)
        .then((response) => response.json())
        .then((jsonData) => {
          setUnreadCount(jsonData?.total ?? 0)
        })
        .catch(() => {
          setUnreadCount(0)
        });
    }
  }
  const getUnReadNotificationHandler = () => {
    getUnreadCount(authContext).then((response) => {
      if (response.status === true) {
        const { teams } = response.payload;
        const { clubs } = response.payload;
        const groups = [authContext.entity.auth.user, ...clubs, ...teams];
        const entity_type = authContext?.entity?.role === 'user' ? 'user_id' : 'group_id';
        const entityId = authContext?.entity?.role === 'user' ? authContext?.entity?.obj?.user_id : authContext?.entity?.obj?.group_id;
        const data = groups.filter((item) => item?.[entity_type] === entityId)
        setUnreadNotificationCount(data?.[0]?.unread ?? 0);
      }
    });
  }
  const changeRole = async () => {
    setRole(authContext.entity.role);
  };
  let count = 0;
  const onTabPress = () => {
    count += 1;
    if (count === MAX_COUNT_FOR_BOTTOM_TAB) {
      count = 0;
      getUnReadMessageHandler();
      getUnReadNotificationHandler()
    }
  }
  return (
    <Tab.Navigator
        backBehavior={'history'}
      tabBarOptions={ {
        activeTintColor: colors.themeColor,
        inactiveTintColor: colors.grayColor,
        labelStyle: {
          fontSize: 11,
        },
        style: {
          height: Platform.OS === 'ios' ? 85 : 55,
          backgroundColor: colors.offwhite,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 15,
          elevation: 2,
        },
      } }
      >
      <Tab.Screen
        name="Local Home"
        component={ NewsFeedNavigator }
        options={ ({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
            return (
              <Image
                      source={ focused ? images.tab_home_selected : images.tab_home }
                      style={ styles.tabImg }
                  />
            )
          },
        }) }
      />
      <Tab.Screen
        name="Feed"
        component={ NewsFeedNavigator }
        options={ ({ route }) => ({
          ...(unreadNotificationCount > 0 && { tabBarBadge: unreadNotificationCount }),
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
            return (
              <Image
                      source={
                          focused ? images.tabFeed : images.tabFeed
                      }
                      style={ focused ? styles.selectedTabImg : styles.tabImg }
                  />
            )
          },
        }) }
      />
      <Tab.Screen
        name="Message"
        component={ MessageNavigator }
        options={ ({ route }) => ({
          ...(unreadCount > 0 && { tabBarBadge: unreadCount }),
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
            return (
              <Image
              source={ focused ? images.tab_message_selected : images.tab_message }
              style={ focused ? styles.selectedTabImg : styles.tabImg }
            />
            )
          },
        }) }
      />
      <Tab.Screen
        name="Schedule"
        component={ ReservationNavigator }
        options={ ({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => {
            if (focused) onTabPress();
            return (
              <Image
                      source={
                          focused ? images.tab_reservation_selected : images.tab_reservation
                      }
                      style={ styles.tabImg }
                  />
            )
          },
        }) }
      />

      {role === 'team' && (
        <Tab.Screen
          name="Account"
          component={ AccountNavigator }
          options={ ({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ focused }) => {
              if (focused) onTabPress();
              return (
                <Image
                        source={
                            focused
                              ? images.tab_account_group_selected
                              : images.tab_account_group
                        }
                        style={ focused ? styles.selectedEntity : styles.tabEntity }
                    />
              )
            },
          }) }
        />
      )}
      {role === 'user' && (
        <Tab.Screen
          name="Account"
          component={ AccountNavigator }
          options={ ({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ focused }) => (
              <Image
                source={ focused ? images.tab_account_selected : images.tab_account }
                style={ styles.tabImg }
              />
            ),
          }) }
        />
      )}
      {role === 'club' && (
        <Tab.Screen
          name="Account"
          component={ AccountNavigator }
          options={ ({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? images.tab_account_group_selected
                    : images.tab_account_group
                }
                style={ styles.tabEntity }
              />
            ),
          }) }
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  selectedEntity: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
  selectedTabImg: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
  tabEntity: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
  tabImg: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
});
export default AppNavigator;
