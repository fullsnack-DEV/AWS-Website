import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import EditPostScreen from '../screens/newsfeeds/EditPostScreen';
import UserTagSelectionListScreen from '../screens/newsfeeds/UserTagSelectionListScreen';
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import FeedViewScreen from '../components/newsFeed/feedView/FeedViewScreen';

const Stack = createStackNavigator();

const NewsFeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="WritePostScreen"
      component={WritePostScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserTagSelectionListScreen"
      component={UserTagSelectionListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={'FeedViewScreen'}
      component={FeedViewScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="EditPostScreen"
      component={EditPostScreen}
      options={{headerShown: false}}
    />
    {/* <Stack.Screen
      name="WriteCommentScreen"
      component={WriteCommentScreen}
      options={{
        title: 'Write Comment',
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
    /> */}
  </Stack.Navigator>
);

export default NewsFeedNavigator;
