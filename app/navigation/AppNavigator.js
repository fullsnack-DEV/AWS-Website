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
    routeName === 'WritePostScreen' ||
    routeName === 'WriteCommentScreen' ||
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
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.themeColor,
        inactiveTintColor: colors.grayColor,
        labelStyle: {
          fontSize: 11,
          marginTop: -8,
          paddingTop: 5,
        },
        style: {
          height: 85,
          backgroundColor: colors.offwhite,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.4,
          shadowRadius: 15,
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={NewsFeedNavigator}
        options={({route}) => ({
          tabBarVisible: this.getTabBarVisibility(route),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? PATH.tab_home_selected : PATH.tab_home}
              style={styles.tabImg}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Reservation"
        component={HomeScreen}
        options={({route}) => ({
          tabBarVisible: this.getTabBarVisibility(route),
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused ? PATH.tab_reservation_selected : PATH.tab_reservation
              }
              style={styles.tabImg}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Notification"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused ? PATH.tab_notification_selected : PATH.tab_notification
              }
              style={focused ? styles.selectedTabImg : styles.tabImg}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? PATH.tab_message_selected : PATH.tab_message}
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
                source={
                  focused
                    ? PATH.tab_account_group_selected
                    : PATH.tab_account_group
                }
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
                source={focused ? PATH.tab_account_selected : PATH.tab_account}
                style={styles.tabImg}
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
                source={
                  focused
                    ? PATH.tab_account_group_selected
                    : PATH.tab_account_group
                }
                style={styles.tabEntity}
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
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
  },
  selectedTabImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
  },
  tabEntity: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
  },
  selectedEntity: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
  },
});
export default AppNavigator;
