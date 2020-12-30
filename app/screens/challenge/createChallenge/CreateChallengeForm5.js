/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import { getFeesEstimation, createChallenge } from '../../../api/Challenge';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils';

let entity = {};
export default function CreateChallengeForm5({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [totalZero, setTotalZero] = useState(false);

  const [estimationFee, setEstimationFee] = useState();

  useEffect(() => {
    if (isFocused) {
      getAuthEntity();
      getFeeDetail();
    }
  }, [isFocused]);

  const getAuthEntity = async () => {
    entity = authContext.entity;
  };

  const getFeeDetail = () => {
    if (route && route.params && route.params.teamData && route.params.body) {
      if (route.params.teamData[0].group_id === entity.uid || route.params.teamData[0].user_id === entity.uid) {
        const fees = { ...route.params.body };
        const feeBody = {}
        feeBody.start_datetime = parseFloat((fees.start_datetime).toFixed(0))
        feeBody.end_datetime = parseFloat((fees.end_datetime).toFixed(0))
        feeBody.manual_fee = false;
        feeBody.payment_method_type = 'card';
        feeBody.currency_type = 'cad';
        feeBody.userChallenge = !route.params.teamData[0].group_id
        feeBody.sport = route.params.body.sport
        setloading(true);
        getFeesEstimation(route.params.teamData[1].group_id || route.params.teamData[1].user_id, feeBody, authContext)
          .then((response) => {
            if (route && route.params && route.params.body) {
              const body = route.params.body;
              body.total_payout = response.payload.total_payout;
              body.service_fee1_charges = response.payload.total_service_fee1;
              body.service_fee2_charges = response.payload.total_service_fee2;
              body.total_charges = response.payload.total_amount;
              body.total_game_charges = response.payload.total_game_fee;
              body.manual_fee = false;

              if (!route?.params?.teamData[1]?.group_id) {
                const matchSport = route.params.teamData[1].registered_sports.map((e) => {
                  if (route.params.body.sport.toLowerCase() === e.sport_name.toLowerCase()) {
                    return e
                  }
                })
                body.hourly_game_fee = matchSport[0]?.fee || 0
              }

              if (response.payload.total_game_fee === 0) {
                setTotalZero(true)
              } else {
                setTotalZero(false)
              }
              setEstimationFee({ ...body });
            }

            setloading(false);
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 0.7);
          });
      }
    }
  };

  const createChallengeTeam = () => {
    if (route && route.params && route.params.teamData && route.params.body) {
      const challengeBody = { ...route.params.body };
      challengeBody.start_datetime = parseFloat((challengeBody.start_datetime).toFixed(0))
      challengeBody.end_datetime = parseFloat((challengeBody.end_datetime).toFixed(0))
      challengeBody.userChallenge = false;
      challengeBody.manual_fee = false;
      if (route?.params?.paymentMethod) {
        challengeBody.source = route.params.paymentMethod.id
      }

      if (!totalZero && !route?.params?.paymentMethod) {
        Alert.alert(strings.alertmessagetitle, strings.choosePayment);
      } else {
        challengeBody.payment_method_type = 'card';
        challengeBody.currency_type = challengeBody.currency_type || 'CAD'

        const home_id = route.params.teamData[0].group_id || route.params.teamData[0].user_id
        const away_id = route.params.teamData[1].group_id || route.params.teamData[1].user_id
        delete challengeBody.home_team;
        delete challengeBody.away_team;
        challengeBody.home_team = home_id;
        challengeBody.away_team = away_id;
        if (route.params.teamData[0].group_id) {
          challengeBody.userChallenge = false;
        } else {
          challengeBody.userChallenge = true;
        }
        setloading(true);

        let entityID;
        let type;
        if (route.params.teamData[0].group_id) {
          type = 'teams'
          if (route.params.teamData[0].group_id === entity.uid) {
            entityID = route.params.teamData[1].group_id
          } else {
            entityID = route.params.teamData[0].group_id
          }
        } else {
          type = 'users'
          if (route.params.teamData[0].user_id === entity.uid) {
            entityID = route.params.teamData[1].user_id
          } else {
            entityID = route.params.teamData[0].user_id
          }
        }
        console.log('Challenge Body:', JSON.stringify(challengeBody));
        createChallenge(
          entityID,
          type,
          challengeBody,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.navigate('ChallengeSentScreen', {
              groupObj: route.params.teamData[0].group_id === entity.uid || route.params.teamData[0].user_id === entity.uid
                ? route.params.teamData[1]
                : route.params.teamData[0],
            });
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 0.3);
          });
      }
    }
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment'} />
        {/* paymentData={paymentInfo} homeTeam={homeTeam && homeTeam} awayTeam={awayTeam && awayTeam} */}
        <MatchFeesCard challengeObj={estimationFee} senderOrReceiver={'sender'} />
      </View>

      {estimationFee?.total_game_charges > 0 && <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment Method'} />
        <View>
          <TCTouchableLabel
            title={route.params.paymentMethod ? Utility.capitalize(route.params.paymentMethod.card.brand) : strings.addOptionMessage}
            subTitle={route.params.paymentMethod?.card.last4 }
            showNextArrow={true}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                comeFrom: 'CreateChallengeForm5',
              })
            }}
          />
        </View>
      </View>}

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Cancellation Policy'} />
        <Text style={styles.responsibilityText}>
          When you cancel this game reservation before 3:55pm on August 11, you
          will get a 50% refund, minus the service fee.{' '}
        </Text>
        <Text style={styles.responsibilityNote}>
          By selecting the button below, I agree to the cancellation policy, and
          also agree to pay the total amount shown above.
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ marginBottom: 10 }}>
        <TCGradientButton
          title={strings.confirmAndPayTitle}
          onPress={() => {
            createChallengeTeam();
          }}
        />
      </View>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  viewMarginStyle: {
    marginTop: 10,
    marginBottom: 10,
  },

  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
  responsibilityNote: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 10,
  },
});
