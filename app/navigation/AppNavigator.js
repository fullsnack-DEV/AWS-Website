import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import HomeScreen from '../screens/home/HomeScreen';

import NewsFeedNavigator from './NewsFeedNavigator';
import * as Utility from '../utils/index';

import colors from '../Constants/Colors'
import images from '../Constants/ImagePath'

import ReservationNavigator from './ReservationNavigator';
import NotificationNavigator from './NotificationNavigator';
// import HomeNavigator from './HomeNavigator';
// import AccountDrawerNavigator from './AccountDrawerNavigator';

import AccountDrawerNavigator from './AccountDrawerNavigator';

const Tab = createBottomTabNavigator();

const getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (
    routeName === 'GameRecording'
    || routeName === 'GameDetailRecord'
    || routeName === 'GameRecordList'
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
    || routeName === 'InvitationSentScreen'
    || routeName === 'UserFoundScreen'
    || routeName === 'UserNotFoundScreen'
    || routeName === 'MemberProfileCreatedScreen'
    || routeName === 'ConnectionReqSentScreen'
    || routeName === 'EventScreen'
    || routeName === 'CreateEventScreen'
    || routeName === 'DefaultColorScreen'
    || routeName === 'GroupEventScreen'
    || routeName === 'UserFoundScreen'
    || routeName === 'UserNotFoundScreen'
    || routeName === 'MemberProfileCreatedScreen'
    || routeName === 'InvitationSentScreen'
    || routeName === 'ConnectionReqSentScreen'
  ) {
    return false;
  }

  return true;
};

function AppNavigator({ navigation }) {
  const [role, setRole] = useState('user');
  useEffect(() => {
    changeRole();
  }, [navigation]);

  const changeRole = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    setRole(entity.role);
  };

  return (
    <Tab.Navigator
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
        name="Home"
        component={ NewsFeedNavigator }
        options={ ({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => (
            <Image
              source={ focused ? images.tab_home_selected : images.tab_home }
              style={ styles.tabImg }
            />
          ),
        }) }
      />
      <Tab.Screen
        name="Reservation"
        component={ ReservationNavigator }
        options={ ({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? images.tab_reservation_selected : images.tab_reservation
              }
              style={ styles.tabImg }
            />
          ),
        }) }
      />
      <Tab.Screen
        name="Notification"
        component={ NotificationNavigator }
        options={ {
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? images.tab_notification_selected : images.tab_notification
              }
              style={ focused ? styles.selectedTabImg : styles.tabImg }
            />
          ),
        } }
      />
      <Tab.Screen
        name="Message"
        component={ NewsFeedNavigator }
        options={ ({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused }) => (
            <Image
              source={ focused ? images.tab_message_selected : images.tab_message }
              style={ focused ? styles.selectedTabImg : styles.tabImg }
            />
          ),
        }) }
      />

      {role === 'team' && (
        <Tab.Screen
          name="Account"
          component={ AccountDrawerNavigator }
          options={ ({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? images.tab_account_group_selected
                    : images.tab_account_group
                }
                style={ focused ? styles.selectedEntity : styles.tabEntity }
              />
            ),
          }) }
        />
      )}
      {role === 'user' && (
        <Tab.Screen
          name="Account"
          component={ AccountDrawerNavigator }
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
          component={ AccountDrawerNavigator }
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
