import React, {
  useEffect, useState, useLayoutEffect, useContext,
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, Alert,
} from 'react-native';
import { acceptDeclineChallenge } from '../../../api/Challenge';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCGradientButton from '../../../components/TCGradientButton';
import strings from '../../../Constants/String';

let entity = {};
export default function ChangeReservationInfoScreen({ navigation, route }) {
  const [bodyParams, setBodyParams] = useState();
  const [screenName, setScreenName] = useState();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [awayTeam, setAwayTeam] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: (screenName && screenName === 'change' && 'Change Match Reservation') || (screenName && screenName === 'cancel' && 'Cancel Match Reservation'),
    });
  }, [screenName]);

  useEffect(() => {
    entity = authContext.entity;
    const { body, screen } = route.params ?? {};
    if (entity.obj.group_id === body.home_team.group_id) {
      setAwayTeam(body.away_team)
    } else {
      setAwayTeam(body.home_team)
    }

    if (screen !== {}) {
      setScreenName(screen);
    }
    if (body !== {}) {
      setBodyParams(body);
    }
  }, []);

  const acceptDeclineChallengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineChallenge(
      teamID,
      ChallengeId,
      versionNo,
      status,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('Cancel RESPONSE::', JSON.stringify(response.payload));
        navigation.navigate('ChallengeAcceptedDeclinedScreen', {
          teamObj: awayTeam,
          status: 'cancel',
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View style={styles.mailContainer}>
          {screenName === 'change' ? (
            <Text style={styles.titleText}>
              What happens when you change The match reservation?
            </Text>
          ) : (
            <Text style={styles.titleText}>
              Please note the following instructions before you cancel the Game
              reservation.
            </Text>
          )}

          {screenName === 'change' ? (
            <Text style={styles.descText}>
              • When the opponent team accepts your match reservation alteration
              request and, as a result, the time or venue of the match listed in
              the reservation is changed, a referee reservation alteration
              request will be automatically sent to each referee booked for the
              match.{'\n'}
              {'\n'}• When a referee doesn’t accept the alteration request above
              after the match reservation has been changed, the referee
              reservation will be canceled. The referee fee will be refunded
              according to the cancellation policy.{'\n'}
              {'\n'}• Other users may be able to see who has canceled the
              reservations and how many days prior to the match starting time
              they have been canceled in your scoreboard or schedule.
              Furthermore, your stats may shows the number or percentage of the
              cancellation that you have made.{'\n'}
              {'\n'}
            </Text>
          ) : (
            <Text style={styles.descText}>
              • When the game reservation is canceled, all the referees of the
              game will still remain as booked referees of the game and the team
              which has booked a referee still has to pay the referee fee to the
              referee.{'\n'}{'\n'}• You can cancel the referee reservation. The referee
              fee will be refunded according to the cancellation policy.{'\n'}{'\n'}•
              The game fee will be refunded according to the cancellation
              policy.{'\n'}{'\n'}• The cancellation stats will be displayed on your home
              or stats, which shows the number or percentage of the cancellation
              that your team have made.
            </Text>
          )}
        </View>
      </ScrollView>
      <TCGradientButton
        title={screenName === 'change' ? strings.nextTitle : strings.cancelMatch}
        onPress={() => {
          if (screenName === 'change') {
            navigation.navigate('EditChallenge', { challengeObj: bodyParams });
          } else {
            Alert.alert(
              'Are you sure that you want to cancel the match reservation?',
              '',
              [{
                text: 'Yes',
                onPress: () => {
                  acceptDeclineChallengeOperation(
                    entity.uid,
                    bodyParams.challenge_id,
                    bodyParams.version,
                    'cancel',
                  );
                },
              },
              {
                text: 'No',
                style: 'cancel',
                onPress: () => {
                  navigation.goBack()
                },
              },

              ],
              { cancelable: false },
            );
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  titleText: {
    margin: 15,
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  descText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  mailContainer: {
    flex: 1,
  },
});
