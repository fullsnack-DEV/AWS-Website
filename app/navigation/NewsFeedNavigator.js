import React from 'react';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import NewsFeedVideoPlayer from '../screens/newsfeeds/NewsFeedVideoPlayer';
import Feed from '../components/newsFeed/Feed';

const Stack = createStackNavigator();

const NewsFeedNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerTintColor: colors.blackColor,
        // headerTransparent: true,
        // headerTitle: true,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="FeedsScreen"
        component={FeedsScreen}
        options={{
          title: 'Newsfeed',
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
        //options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default NewsFeedNavigator;
