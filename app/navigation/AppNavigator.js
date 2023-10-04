import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {Image, StyleSheet, StatusBar, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import NewsFeedNavigator from './NewsFeedNavigator';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import MessageNavigator from './MessageNavigator';
import {QB_UNREAD_MESSAGE_COUNT_API} from '../utils/QuickBlox';
import AuthContext from '../auth/context';
import AccountNavigator from './AccountNavigator';
import LocalHomeNavigator from './LocalHomeNavigator';
import ScheduleNavigator from './ScheduleNavigator';
import MembersNavigator from './MembersNavigator';
import {getUnreadNotificationCount} from '../utils/accountUtils';
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

  const getTabIcon = (focused = false) => {
    if (focused) {
      if (
        authContext.entity.role === Verbs.entityTypeTeam ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        return images.tab_members_selected;
      }
      return images.tabSelectedFeed;
    }
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      return images.tab_members;
    }
    return images.tabFeed;
  };

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
        },
      }}>
      <Tab.Screen
        name="Local Home"
        component={LocalHomeNavigator}
        options={() => ({
          tabBarTestID: 'localhome-tab',
          headerShown: false,

          tabBarStyle: {display: 'none'},
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate('Local Home', {
              screen: 'LocalHomeScreen',
            });
          },
        }}
      />
      <Tab.Screen
        name="News Feed"
        component={
          authContext.entity.role === 'team' ||
          authContext.entity.role === 'club'
            ? MembersNavigator
            : NewsFeedNavigator
        }
        options={() => ({
          tabBarTestID: 'newsfeed-tab',
          headerShown: false,
          unmountOnBlur: true,
          tabBarStyle: {display: 'none'},
          tabBarIcon: ({focused}) => {
            if (focused);
            return (
              <Image
                source={getTabIcon(focused)}
                style={focused ? styles.selectedTabImg : styles.tabImg}
              />
            );
          },
        })}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (
              authContext.entity.role === 'team' ||
              authContext.entity.role === 'club'
            ) {
              navigation.navigate('News Feed', {
                screen: 'GroupMembersScreen',
              });
            } else {
              navigation.navigate('News Feed', {
                screen: 'FeedsScreen',
              });
            }
          },
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={() => ({
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate('Schedule', {
              screen: 'EventScheduleScreen',
            });
          },
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageNavigator}
        options={() => ({
          tabBarTestID: 'message-tab',
          headerShown: false,

          ...(unreadCount > 0 && {
            tabBarBadge: unreadCount > 300 ? '300+' : unreadCount,
          }),
          tabBarStyle: {display: 'none'},
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate('Message', {
              screen: 'MessageMainScreen',
            });
          },
        }}
      />
      <Tab.Screen
        name="Account"
        navigation={navigation}
        component={AccountNavigator}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate('Account', {
              screen: 'AccountScreen',
            });
          },
        }}
        options={() => ({
          ...(authContext.totalNotificationCount > 0 && {
            tabBarBadge:
              authContext.totalNotificationCount > 300
                ? '300+'
                : authContext.totalNotificationCount,
          }),
          unmountOnBlur: false,
          freezeOnBlur: false,
          tabBarBadgeStyle: {zIndex: 10, fontSize: 12},
          tabBarStyle: {display: 'none'},
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
