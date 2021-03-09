import React from 'react';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import FeedsScreen from '../screens/newsfeeds/FeedsScreen';
import NewsFeedVideoPlayer from '../screens/newsfeeds/NewsFeedVideoPlayer';
import WritePostScreen from '../screens/newsfeeds/WritePostScreen';
import WriteCommentScreen from '../screens/newsfeeds/WriteCommentScreen';
import FullVideoScreen from '../screens/newsfeeds/FullVideoScreen';
import EditPostScreen from '../screens/newsfeeds/EditPostScreen';
import HomeScreen from '../screens/home/HomeScreen';

import colors from '../Constants/Colors'
import EntitySearchScreen from '../screens/EntitySearchScreen';
import UserConnections from '../screens/account/connections/UserConnections';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';
import BookRefereeSuccess from '../screens/game/bookReferee/BookRefereeSuccess';
import MessageDrawerNavigator from './MessageDrawerNavigator';
import GroupMembersScreen from '../screens/account/groupConnections/GroupMembersScreen';
import UserTagSelectionListScreen from '../screens/newsfeeds/UserTagSelectionListScreen';
import CreateChallengeForm1 from '../screens/challenge/createChallenge/CreateChallengeForm1';
import CreateChallengeForm2 from '../screens/challenge/createChallenge/CreateChallengeForm2';
import CreateChallengeForm3 from '../screens/challenge/createChallenge/CreateChallengeForm3';
import CreateChallengeForm4 from '../screens/challenge/createChallenge/CreateChallengeForm4';
import CreateChallengeForm5 from '../screens/challenge/createChallenge/CreateChallengeForm5';
import ChooseDateTimeScreen from '../screens/challenge/createChallenge/ChooseDateTimeScreen';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterAcceptDeclineScreen from '../screens/challenge/alterChallenge/AlterAcceptDeclineScreen';
import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';
import MembersProfileScreen from '../screens/account/groupConnections/MembersProfileScreen';

import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import AddCardScreen from '../screens/account/payment/AddCardScreen';

const Stack = createStackNavigator();

const NewsFeedNavigator = () => (
  <Stack.Navigator
      screenOptions={ {
        headerBackTitleVisible: false,
      } }>
    <Stack.Screen
        name="FeedsScreen"
        component={ FeedsScreen }
        options={ {
          title: 'Newsfeed',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            // borderBottomWidth: 0.3,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 5,
            shadowColor: colors.grayColor,
            elevation: 5,
          },
        } }
      />
    <Stack.Screen
        name="WritePostScreen"
        component={ WritePostScreen }
        options={ {
          title: 'Write Post',
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
        } }
      />
    <Stack.Screen
      name="UserTagSelectionListScreen"
      component={UserTagSelectionListScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
        name="AlterRequestAccept"
        component={ AlterRequestAccept }
        options={ {
          headerShown: false,
        } }
      />
    <Stack.Screen
        name="EditPostScreen"
        component={ EditPostScreen }
        options={ {
          title: 'Edit Post',
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
        } }
      />
    <Stack.Screen
        name="WriteCommentScreen"
        component={ WriteCommentScreen }
        options={ {
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
        } }
      />
    <Stack.Screen
        name="NewsFeedVideoPlayer"
        component={ NewsFeedVideoPlayer }
        options={ {
          title: '',
          headerTintColor: colors.whiteColor,
          borderBottomWidth: 0,
          headerStyle: {
            backgroundColor: colors.blackColor,
            shadowOffset: {
              height: 0,
            },
          },
        } }
        // options={{headerShown: false}}
      />
    <Stack.Screen
        name="FullVideoScreen"
        component={ FullVideoScreen }
        options={ {
          title: '',
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
        } }
      />
    <Stack.Screen
        name="EntitySearchScreen"
        component={ EntitySearchScreen }
        options={ {
          title: 'Search',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          // headerShown: false,
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />

    <Stack.Screen
        name="HomeScreen"
        component={ HomeScreen }
        options={ {
          title: 'Home',
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
        } }
      />
    <Stack.Screen
          name="UserConnections"
          component={ UserConnections }
          options={ {
            title: 'Connections',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="RefereeBookingDateAndTime"
          component={RefereeBookingDateAndTime}
          options={{
            headerShown: false,
          }}
      />
    <Stack.Screen
          name="RefereeSelectMatch"
          component={RefereeSelectMatch}
          options={{
            headerShown: false,
          }}
      />
    <Stack.Screen
          name="BookRefereeSuccess"
          component={ BookRefereeSuccess }
          options={ {
            headerShown: false,
          } }
      />

    <Stack.Screen
          name="GroupMembersScreen"
          component={ GroupMembersScreen }
          options={ {
            title: 'Connection',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="MessageChat"
          component={MessageDrawerNavigator}
          options={{

            title: 'Message Chat',
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
      />
    {/*    Challenge */}
    <Stack.Screen
          name="CreateChallengeForm1"
          component={ CreateChallengeForm1 }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />

    <Stack.Screen
          name="CreateChallengeForm2"
          component={ CreateChallengeForm2 }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="CreateChallengeForm3"
          component={ CreateChallengeForm3 }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="CreateChallengeForm4"
          component={ CreateChallengeForm4 }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="CreateChallengeForm5"
          component={ CreateChallengeForm5 }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="ChooseDateTimeScreen"
          component={ ChooseDateTimeScreen }
          options={ {
            title: 'Challenge',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="ChooseAddressScreen"
          component={ ChooseAddressScreen }
          options={ {
            title: 'Venue',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
          name="ChallengeSentScreen"
          component={ ChallengeSentScreen }
          // options={({ navigation }) => ({
          //   headerTintColor: colors.whiteColor,
          //   headerTransparent: true,
          //   headerTitle: false,
          //   headerLeft: (props) => (
          //     <HeaderBackButton
          //       {...props}
          //       onPress={() => navigation.popToTop()}
          //     />
          //   ),
          // })}
          options={ {
            headerShown: false,
          } }
      />
    <Stack.Screen
            name="RefereeReservationScreen"
            component={RefereeReservationScreen}
            options={{
              title: 'Referee Reservation',
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
        name="AlterAcceptDeclineScreen"
        component={ AlterAcceptDeclineScreen }
        options={ {
          title: 'Change Match Reservation',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
    <Stack.Screen
          name="MembersProfileScreen"
          component={ MembersProfileScreen }
          options={ {
            title: 'Member Profile',
            headerTintColor: colors.blackColor,
            headerTitleStyle: {
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: colors.whiteColor,
              borderBottomColor: colors.grayColor,
              borderBottomWidth: 0.3,
            },
          } }
      />
    <Stack.Screen
        name="PaymentMethodsScreen"
        component={ PaymentMethodsScreen }
        options={ {
          title: 'Payment Methods',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />

    <Stack.Screen
        name="AddCardScreen"
        component={ AddCardScreen }
        options={ {
          title: 'Add a Card',
          headerTintColor: colors.blackColor,
          headerTitleStyle: {
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.whiteColor,
            borderBottomColor: colors.grayColor,
            borderBottomWidth: 0.3,
          },
        } }
      />
  </Stack.Navigator>
);

export default NewsFeedNavigator;
