import React from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import NotificationsListScreen from '../screens/notificationsScreen/NotificationsListScreen';
import TrashScreen from '../screens/notificationsScreen/TrashScreen';
import AcceptDeclineChallengeScreen from '../screens/challenge/AcceptDeclineChallengeScreen';
import ChallengeAcceptedDeclinedScreen from '../screens/challenge/ChallengeAcceptedDeclinedScreen';
import colors from '../Constants/Colors';
import AlterRequestSent from '../screens/challenge/alterChallenge/AlterRequestSent';
import RefereeReservationScreen from '../screens/referee/RefereeReservationScreen';
import AlterRefereeScreen from '../screens/referee/alterReferee/AlterRefereeScreen';
import EditRefereeReservation from '../screens/referee/alterReferee/EditRefereeReservation';
import CurruentRefereeReservationScreen from '../screens/referee/alterReferee/CurruentRefereeReservationScreen';
import EditRefereeFeeScreen from '../screens/referee/alterReferee/EditRefereeFeeScreen';
import RefereeRequestSent from '../screens/referee/RefereeRequestSent';
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
              title: 'Change Reservation',
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
      {/* <Stack.Screen name="HomeScreen" component={ HomeScreen } options={ {} } /> */}
    </Stack.Navigator>
  );
}

export default NotificationNavigator;
