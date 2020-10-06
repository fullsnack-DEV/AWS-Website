import React, {useEffect, useState, useContext} from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import HomeScreen from '../screens/home/HomeScreen';

import AccountNavigator from './AccountNavigator';
import NewsFeedNavigator from './NewsFeedNavigator';

import AuthContext from '../auth/context';
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
    routeName === 'CreateClubForm2' ||
    routeName === 'CreateClubForm3' ||
    routeName === 'TeamCreatedScreen' ||
    routeName === 'SearchLocationScreen' ||
    routeName === 'SearchPlayerScreen' ||
    routeName === 'ClubCreatedScreen'
  ) {
    return false;
  }

  return true;
};

function AppNavigator() {
  const authContext = useContext(AuthContext);
  const [switchBy, setSwitchBy] = useState('user');
  useEffect(() => {
    switchByEntity();
  });
  switchByEntity = async () => {
    const switchEntities = await Utility.getStorage('switchBy');
    setSwitchBy(switchEntities);
    console.log('SWITCH BY :', switchBy);
  };
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
      {authContext.switchBy == 'team' && (
        <Tab.Screen
          name="Account"
          component={AccountNavigator}
          options={({route}) => ({
            tabBarVisible: this.getTabBarVisibility(route),
            tabBarIcon: ({focused}) => (
              <Image
                source={PATH.team_ph}
                style={focused ? styles.selectedEntity : styles.tabEntity}
              />
            ),
          })}
        />
      )}
      {authContext.switchBy == 'user' && (
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
      )}
      {authContext.switchBy == 'club' && (
        <Tab.Screen
          name="Account"
          component={AccountNavigator}
          options={({route}) => ({
            tabBarVisible: this.getTabBarVisibility(route),
            tabBarIcon: ({focused}) => (
              <Image
                source={PATH.club_ph}
                style={focused ? styles.selectedEntity : styles.tabEntity}
              />
            ),
          })}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
    //tintColor: colors.grayColor,
  },
  selectedTabImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
    tintColor: colors.themeColor,
  },
  tabEntity: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grayColor,

    //tintColor: colors.grayColor,
  },
  selectedEntity: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.themeColor,
    //tintColor: colors.themeColor,
  },
});
export default AppNavigator;
