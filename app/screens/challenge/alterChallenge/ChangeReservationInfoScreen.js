import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {acceptDeclineChallenge} from '../../../api/Challenge';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCGradientButton from '../../../components/TCGradientButton';
import {strings} from '../../../../Localization/translation';

let entity = {};
export default function ChangeReservationInfoScreen({navigation, route}) {
  const {challengeObj, screen} = route.params ?? {};
  const [screenName] = useState(screen);
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [loading, setloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        (screenName &&
          screenName === 'change' &&
          strings.changeMatchReservation) ||
        (screenName &&
          screenName === 'cancel' &&
          strings.cancelMatchReservation),
    });
  }, [navigation, screenName]);

  const getOpponentEntity = () => {
    if (
      entity?.uid === challengeObj?.home_team?.user_id ||
      entity?.uid === challengeObj?.home_team?.group_id
    ) {
      return challengeObj?.away_team;
    }
    return challengeObj?.home_team;
  };

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
          teamObj: getOpponentEntity(),
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
              {strings.whatHappensChangeReservation}
            </Text>
          ) : (
            <Text style={styles.titleText}>{strings.noteForCancelGame}</Text>
          )}

          {screenName === 'change' ? (
            <Text style={styles.descText}>
              {strings.changeGameReservationDesc}
            </Text>
          ) : (
            <Text style={styles.descText}>
              {strings.cancelGameReservationDesc}
            </Text>
          )}
        </View>
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          title={
            screenName === 'change' ? strings.nextTitle : strings.cancelMatch
          }
          onPress={() => {
            if (screenName === 'change') {
              navigation.navigate('EditChallenge', {
                groupObj: getOpponentEntity(),
                sportName: challengeObj?.sport,
                sportType: challengeObj?.sport_type,
                challengeObj,
                lastConfirmVersion: challengeObj,
                settingObj: route?.params?.settingObj,
              });
            } else {
              Alert.alert(
                strings.areYouSureCancelReservation,
                '',
                [
                  {
                    text: strings.yes,
                    onPress: () => {
                      acceptDeclineChallengeOperation(
                        entity.uid,
                        challengeObj?.challenge_id,
                        challengeObj?.version,
                        'cancel',
                      );
                    },
                  },
                  {
                    text: strings.no,
                    style: 'cancel',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }}
        />
      </SafeAreaView>
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
