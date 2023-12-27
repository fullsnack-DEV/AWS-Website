import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {Image, StyleSheet, StatusBar, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {TransitionPresets} from '@react-navigation/stack';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import AuthContext from '../auth/context';
import {getUnreadNotificationCount} from '../utils/accountUtils';
import MessageMainScreen from '../screens/message/MessageMainScreen';
import ScheduleScreen from '../screens/account/schedule/ScheduleScreen';
import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import LocalHomeScreen from '../screens/localhome/LocalHomeScreen';
import AccountScreen from '../screens/account/AccountScreen';
import Verbs from '../Constants/Verbs';

const MAX_COUNT_FOR_BOTTOM_TAB = 8;
const Tab = createBottomTabNavigator();

const AppNavigator = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const count = useRef(0);
  const [role, setRole] = useState('user');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setRole(authContext.entity.role);
  }, [authContext.entity.role]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('white');
  }, []);

  const getUnReadMessageHandler = useCallback(async () => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    getUnreadNotificationCount(authContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabPress = useCallback(() => {
    count.current += 1;
    if (count.current === MAX_COUNT_FOR_BOTTOM_TAB) {
      count.current = 0;
      getUnReadMessageHandler();
    }
  }, [getUnReadMessageHandler]);

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
          <Image
            source={images.newGroupTabIcon}
            style={[styles.tabImg, {height: 33, width: 33, marginTop: 1}]}
          />
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
          <Image
            source={images.newGroupTabIcon}
            style={[styles.tabImg, {height: 33, width: 33, marginTop: 1}]}
          />
        );
      }
      return null;
    },
    [authContext?.entity?.obj?.thumbnail, role, onTabPress],
  );

  return (
    <Tab.Navigator
      backBehaviour="initialRoute"
      navigation={navigation}
      options={() => ({headerShown: false})}
      detachInactiveScreens
      screenOptions={{
        lazy: true,
        headerShown: false,

        activeTintColor: colors.tabFontColor,
        inactiveTintColor: colors.userPostTimeColor,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: colors.offwhite,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -10},
          shadowOpacity: 0.15,
          shadowRadius: 50,
          borderTopColor: colors.thinLineGrayColor,
        },
      }}>
      <Tab.Screen
        name="LocalHome"
        component={LocalHomeScreen}
        options={() => ({
          lazy: true,
          tabBarTestID: 'localhome-tab',
          headerShown: false,
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

      {authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub ? (
        <Tab.Screen
          name="Members"
          component={GroupMembersScreen}
          options={() => ({
            lazy: true,
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => {
              if (focused);
              return (
                <Image
                  source={
                    focused ? images.tab_members_selected : images.tab_members
                  }
                  style={focused ? styles.selectedTabImg : styles.tabImg}
                />
              );
            },
          })}
        />
      ) : (
        <Tab.Screen
          name="NewsFeed"
          component={FeedsScreen}
          options={() => ({
            lazy: true,
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => {
              if (focused);
              return (
                <Image
                  source={focused ? images.tabSelectedFeed : images.tabFeed}
                  style={focused ? styles.selectedTabImg : styles.tabImg}
                />
              );
            },
          })}
        />
      )}

      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={() => ({
          lazy: true,
          tabBarTestID: 'schedule-tab',
          headerShown: false,
          unmountOnBlur: true,
          tabBarStyle: {display: 'none'},
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
        component={MessageMainScreen}
        options={() => ({
          tabBarTestID: 'message-tab',
          headerShown: false,
          lazy: true,
          unmountOnBlur: false,
          ...(unreadCount > 0 && {
            tabBarBadge: unreadCount > 300 ? '300+' : unreadCount,
          }),
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
          ...(authContext.unreadMessageCount > 0 && {
            tabBarBadge:
              authContext.unreadMessageCount > 300
                ? '300+'
                : authContext.unreadMessageCount,
          }),
        })}
      />
      <Tab.Screen
        name="Account"
        navigation={navigation}
        component={AccountScreen}
        options={() => ({
          lazy: true,
          ...(authContext.totalNotificationCount > 0 && {
            tabBarBadge:
              authContext.totalNotificationCount > 300
                ? '300+'
                : authContext.totalNotificationCount,
          }),
          unmountOnBlur: false,
          freezeOnBlur: false,
          tabBarBadgeStyle: {zIndex: 10, fontSize: 12},
          tabBarIcon: renderTabIcon,
          headerShown: false,
          tabBarTestID: 'account-tab',
          animationEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        })}
        initialParams={{switchToUser: false}}
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
