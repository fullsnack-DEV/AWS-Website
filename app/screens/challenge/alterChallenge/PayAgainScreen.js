import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import { payAgainAlter, payAgain } from '../../../api/Challenge';
import ReservationStatus from '../../../Constants/ReservationStatus';
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

export default function PayAgainScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [challengeObj, setChallengeObj] = useState();
  const [sorceScreen, setSourceScreen] = useState()

  useEffect(() => {
    if (isFocused) {
      const { body, comeFrom } = route.params ?? {};
      setSourceScreen(comeFrom);
      setChallengeObj(body)
      console.log('Body Object of pay again screen: ', JSON.stringify(body));
      // getFeeDetail();
    }
  }, [isFocused]);

  const payAgainForAlterRequest = () => {
    setloading(true)
    const bodyParams = {}
    const { paymentMethod } = route.params ?? {};
    if (paymentMethod && paymentMethod !== {}) {
      bodyParams.source = paymentMethod.id;
      bodyParams.payment_method_type = 'card'
      console.log('body params::', bodyParams);
      if (sorceScreen === ReservationStatus.pendingrequestpayment) {
        payAgainAlter(challengeObj.challenge_id, bodyParams, authContext).then((response) => {
          setloading(false)
          console.log(response.payload);
        }).catch((e) => {
          setloading(false)
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 0.7);
        })
      } else {
        payAgain(challengeObj.challenge_id, bodyParams, authContext).then((response) => {
          setloading(false)
          console.log(response.payload);
        }).catch((e) => {
          setloading(false)
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 0.7);
        })
      }
    } else {
      Alert.alert(strings.selectPaymentText)
    }
  }

  //   const getFeeDetail = () => {
  //     console.log('FEE CALLED:');
  //     if (route && route.params && route.params.body) {
  //       const feeBody = { ...route.params.body };
  //       console.log('FEE BODY AVAILABLE:', feeBody);
  //       feeBody.start_datetime = parseFloat(
  //         (feeBody.start_datetime / 1000).toFixed(0),
  //       );
  //       feeBody.end_datetime = parseFloat(
  //         (feeBody.end_datetime / 1000).toFixed(0),
  //       );
  //       feeBody.manual_fee = false;
  //       setloading(true);
  //       let entityID;
  //       if (route.params.body.home_team.group_id === entity.uid || route.params.body.home_team.user_id === entity.uid) {
  //         entityID = route.params.body.away_team.group_id || route.params.body.away_team.user_id
  //       } else {
  //         entityID = route.params.body.home_team.group_id || route.params.body.home_team.user_id
  //       }
  //       getFeesEstimation(
  //         entityID,
  //         feeBody,
  //         authContext,
  //       )
  //         .then((response) => {
  //           if (route && route.params && route.params.body) {
  //             const body = route.params.body;
  //             body.total_payout = response.payload.total_payout;
  //             body.service_fee1_charges = response.payload.total_service_fee1;
  //             body.service_fee2_charges = response.payload.total_service_fee2;
  //             body.total_charges = response.payload.total_amount;
  //             body.total_game_charges = response.payload.total_game_fee;
  //             setEstimationFee({ ...body });
  //           }

  //           setloading(false);
  //         })
  //         .catch((e) => {
  //           setloading(false);
  //           setTimeout(() => {
  //             Alert.alert(strings.alertmessagetitle, e.message);
  //           }, 0.7);
  //         });
  //     }
  //   };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment'} />
        {/* paymentData={paymentInfo} homeTeam={homeTeam && homeTeam} awayTeam={awayTeam && awayTeam} */}
        <MatchFeesCard
          challengeObj={challengeObj}
          senderOrReceiver={'sender'}
        />
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment Method'} />
        <View>
          <TCTouchableLabel
            title={
              route.params.paymentMethod
                ? Utility.capitalize(route.params.paymentMethod.card.brand)
                : strings.addOptionMessage
            }
            subTitle={route.params.paymentMethod?.card.last4}
            showNextArrow={true}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                comeFrom: 'PayAgainScreen',
              });
            }}
          />
        </View>
      </View>

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
            payAgainForAlterRequest()
          }}
        />
      </View>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
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
