import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import HomeScreen from '../screens/home/HomeScreen';

import AccountNavigator from './AccountNavigator';
import NewsFeedNavigator from './NewsFeedNavigator';

import constants from '../config/constants';
const {urls, colors, fonts, endPoints} = constants;
import PATH from '../Constants/ImagePath';
import strings from '../Constants/String';

const Tab = createBottomTabNavigator();

getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (
    routeName === 'GameRecording' ||
    routeName === 'GameDetailRecord' ||
    routeName === 'GameRecordList' ||
    routeName === 'NewsFeedVideoPlayer' ||
    routeName === 'RegisterPlayer' ||
    routeName === 'RegisterReferee' ||
    routeName === 'CreateTeamForm1' ||
    routeName === 'CreateTeamForm2' ||
    routeName === 'CreateTeamForm3' ||
    routeName === 'CreateTeamForm4' ||
    routeName === 'CreateClubForm1' ||
    routeName === 'CreateClubForm2'
  ) {
    return false;
  }

  return true;
};

function AppNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.themeColor,
        inactiveTintColor: colors.grayColor,
        labelStyle: {
          fontSize: 11,
          marginTop: -6,
          paddingTop: 5,
        },
        style: {
          tabBackgroundColor: colors.tabBackgroundColor,

          borderTopColor: colors.googleColor,
        },
      }}>
      <Tab.Screen
        name="Newsfeed"
        component={NewsFeedNavigator}
        options={({route}) => ({
          tabBarVisible: this.getTabBarVisibility(route),
          tabBarIcon: ({focused}) => (
            <Image
              source={PATH.tab_newsfeed}
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={PATH.tab_search}
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={PATH.tab_home}
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={PATH.tab_notification}
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={({route}) => ({
          tabBarVisible: this.getTabBarVisibility(route),
          tabBarIcon: ({focused}) => (
            <Image
              source={PATH.tab_account}
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: colors.grayColor,
  },
  selectedTabImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: colors.themeColor,
  },
});
export default AppNavigator;
