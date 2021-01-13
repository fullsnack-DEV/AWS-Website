import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import HomeScreen from '../screens/home/HomeScreen';
import EditRosterScreen from '../screens/game/soccer/EditRosterScreen';
import EditLineUpScreen from '../screens/game/soccer/lineUp/EditLineUpScreen';
import EditLineUpCoachScreen from '../screens/game/soccer/lineUp/EditRosterCoacheScreen';
import ChallengeSentScreen from '../screens/challenge/createChallenge/ChallengeSentScreen';

import colors from '../Constants/Colors';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';
import RefereeRequestSent from '../screens/referee/RefereeRequestSent';
import ReservationAcceptDeclineScreen from '../screens/referee/ReservationAcceptDeclineScreen';

import ChangeReservationInfoScreen from '../screens/challenge/alterChallenge/ChangeReservationInfoScreen';
import CurruentReservationScreen from '../screens/challenge/alterChallenge/CurruentReservationScreen';
import SoccerHome from '../screens/game/soccer/SoccerHome';
import TennisHome from '../screens/game/tennis/TennisHome';

import AlterAcceptDeclineScreen from '../screens/challenge/alterChallenge/AlterAcceptDeclineScreen';
import PayAgainScreen from '../screens/challenge/alterChallenge/PayAgainScreen';
import PayAgainRefereeScreen from '../screens/referee/PayAgainRefereeScreen';
import EditFeeScreen from '../screens/challenge/alterChallenge/EditFeeScreen';
import EditChallenge from '../screens/challenge/alterChallenge/EditChallenge';

import CreateChallengeForm1 from '../screens/challenge/createChallenge/CreateChallengeForm1';
import CreateChallengeForm2 from '../screens/challenge/createChallenge/CreateChallengeForm2';
import CreateChallengeForm3 from '../screens/challenge/createChallenge/CreateChallengeForm3';
import CreateChallengeForm4 from '../screens/challenge/createChallenge/CreateChallengeForm4';
import CreateChallengeForm5 from '../screens/challenge/createChallenge/CreateChallengeForm5';
import ChooseDateTimeScreen from '../screens/challenge/createChallenge/ChooseDateTimeScreen';
import ChooseAddressScreen from '../screens/challenge/createChallenge/ChooseAddressScreen';

import PaymentMethodsScreen from '../screens/account/payment/PaymentMethodsScreen';
import MessageDrawerNavigator from './MessageDrawerNavigator';

import AlterRequestAccept from '../screens/challenge/alterChallenge/AlterRequestAccept';
import BookReferee from '../screens/game/bookReferee/refereeList/BookReferee';
import RefereeBookingDateAndTime from '../screens/game/bookReferee/refereeBookDateTime/RefereeBookingDateAndTime';
import RefereeSelectMatch from '../screens/game/bookReferee/selectMatch/RefereeSelectMatch';
import BookRefereeSuccess from '../screens/game/bookReferee/BookRefereeSuccess';
import BookScorekeeper from '../screens/game/bookScorekeeper/scorekeeperList/BookScorekeeper';
import ScorekeeperBookingDateAndTime
  from '../screens/game/bookScorekeeper/scorekeeperBookDateTime/ScorekeeperBookingDateAndTime';
import BookScorekeeperSuccess from '../screens/game/bookScorekeeper/BookScorekeeperSuccess';
import SoccerRecordList from '../screens/game/soccer/SoccerRecordList';
import SoccerApproveDisapproveConfirmation
  from '../screens/game/soccer/summary/approveDisapprove/SoccerApproveDisapproveConfirmation';

const Stack = createStackNavigator();

function NotificationNavigator() {
  return (
    <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}>
      <Stack.Screen
         name="NotificationsListScreen"
         component={NotificationsListScreen}
         options={{
           title: 'Notification',
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
         name="TrashScreen"
         component={TrashScreen}
         options={{
           title: 'Trash',
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
         name="AcceptDeclineChallengeScreen"
         component={AcceptDeclineChallengeScreen}
         options={{
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
         }}
        />
      <Stack.Screen
         name="ChallengeAcceptedDeclinedScreen"
         component={ChallengeAcceptedDeclinedScreen}
         options={{
           headerShown: false,
         }}
        />
      <Stack.Screen
         name="ReservationAcceptDeclineScreen"
         component={ReservationAcceptDeclineScreen}
         options={{
           headerShown: false,
         }}
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
            name="AlterRefereeScreen"
            component={AlterRefereeScreen}
            options={{
              title: 'Change Referee Reservation',
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
            name="EditRefereeReservation"
            component={EditRefereeReservation}
            options={{
              title: 'Change Referee Reservation',
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
            name="EditChallenge"
            component={EditChallenge}
            options={{
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
            }}
        />
      <Stack.Screen
        name="CurruentRefereeReservationScreen"
        component={ CurruentRefereeReservationScreen }
        options={ {
          title: 'Curruent Referee Reservation',
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
        name="EditRefereeFeeScreen"
        component={ EditRefereeFeeScreen }
        options={ {
          title: 'Referee Fee',
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
        name="AlterRequestSent"
        component={ AlterRequestSent }
        options={ {
          headerShown: false,
        } }
      />
      <Stack.Screen
        name="ChangeReservationInfoScreen"
        component={ ChangeReservationInfoScreen }
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
        name="CurruentReservationScreen"
        component={ CurruentReservationScreen }
        options={ {
          title: 'Curruent Match Reservation',
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
          name="SoccerHome"
          component={SoccerHome}
          options={{
            tabBarVisible: false,
            headerShown: false,
          }}
      />
      <Stack.Screen
          name="TennisHome"
          component={TennisHome}
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
        name="PayAgainScreen"
        component={ PayAgainScreen }
        options={ {
          title: 'Pay',
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
        name="PayAgainRefereeScreen"
        component={ PayAgainRefereeScreen }
        options={ {
          title: 'Pay',
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
        name="EditFeeScreen"
        component={ EditFeeScreen }
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
        name="RefereeRequestSent"
        component={ RefereeRequestSent }
        options={ {
          headerShown: false,
        } }
      />
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
          name="EditLineUpScreen"
          component={EditLineUpScreen}
          options={{
            title: 'Edit Lineup',
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
      name="EditLineUpCoachScreen"
      component={EditLineUpCoachScreen}
      options={{
        title: 'Edit Lineup',
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
      name="EditRosterScreen"
      component={EditRosterScreen}
      options={{
        title: 'Edit Roster',
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
      {/*  Book A Referee */}
      <Stack.Screen
            name="BookReferee"
            component={BookReferee}
            options={{
              headerShown: false,
            }}
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
      {/*  Book A Scorekeeper */}
      <Stack.Screen
            name="BookScorekeeper"
            component={BookScorekeeper}
            options={{
              headerShown: false,
            }}
        />
      <Stack.Screen
            name="ScorekeeperBookingDateAndTime"
            component={ScorekeeperBookingDateAndTime}
            options={{
              headerShown: false,
            }}
        />

      <Stack.Screen
            name="BookScorekeeperSuccess"
            component={ BookScorekeeperSuccess }
            options={ {
              headerShown: false,
            } }
        />
      <Stack.Screen
            name="SoccerRecordList"
            component={ SoccerRecordList }
            options={ {
              title: 'Match Record',
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
            name="SoccerApproveDisapproveConfirmation"
            component={ SoccerApproveDisapproveConfirmation }
            options={ {
              title: 'Match Record',
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
}

export default NotificationNavigator;
