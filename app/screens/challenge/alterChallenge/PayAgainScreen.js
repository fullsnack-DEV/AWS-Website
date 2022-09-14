import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import {payAgainAlter, payAgain} from '../../../api/Challenge';
import {paymentMethods} from '../../../api/Users';
import ReservationStatus from '../../../Constants/ReservationStatus';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils';
import GameFeeCard from '../../../components/challenge/GameFeeCard';

let entity = {};

export default function PayAgainScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [challengeObj, setChallengeObj] = useState();
  const [sorceScreen, setSourceScreen] = useState();
  const [defaultCard, setDefaultCard] = useState();
  const [body] = useState(route.params?.body);
  const [status] = useState(route.params?.status);

  useEffect(() => {
    if (isFocused) {
      setSourceScreen(status);
      setChallengeObj(body);
      if (route?.params?.paymentMethod) {
        setDefaultCard(route?.params?.paymentMethod);
      } else {
        getPaymentMethods(body?.source);
      }

      console.log('Body Object of pay again screen: ', JSON.stringify(body));
      // getFeeDetail();
    }
  }, [isFocused]);
  const getPaymentMethods = (source) => {
    setloading(true);
    paymentMethods(authContext)
      .then((response) => {
        const matchCard = response.payload.find((card) => card.id === source);
        if (matchCard) {
          setDefaultCard(matchCard);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const payAgainForAlterRequest = () => {
    setloading(true);
    const bodyParams = {};
    if (defaultCard !== {} || defaultCard !== undefined) {
      bodyParams.source = defaultCard.id;
      bodyParams.payment_method_type = 'card';

      bodyParams.total_game_fee = challengeObj?.total_game_fee;
      bodyParams.total_service_fee1 = challengeObj?.total_service_fee1;
      bodyParams.total_service_fee2 = challengeObj?.total_service_fee2;
      bodyParams.international_card_fee = challengeObj?.international_card_fee;
      bodyParams.total_stripe_fee = challengeObj?.total_stripe_fee;
      bodyParams.total_payout = challengeObj?.total_payout;
      bodyParams.total_amount = challengeObj?.total_amount;

      console.log('body params::', bodyParams);
      if (sorceScreen === ReservationStatus.pendingrequestpayment) {
        payAgainAlter(challengeObj.challenge_id, bodyParams, authContext)
          .then(() => {
            setloading(false);
            navigation.navigate('NotificationsListScreen');
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        payAgain(challengeObj.challenge_id, bodyParams, authContext)
          .then(() => {
            setloading(false);
            navigation.navigate('NotificationsListScreen');
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    } else {
      Alert.alert(strings.selectPaymentText);
    }
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      <View style={styles.viewMarginStyle}>
        <TCLabel title={strings.payment} />

        <GameFeeCard
          feeObject={{
            total_game_fee: challengeObj?.total_game_fee,
            total_service_fee1: challengeObj?.total_service_fee1,
            total_service_fee2: challengeObj?.total_service_fee2,
            international_card_fee: challengeObj?.international_card_fee,
            total_stripe_fee: challengeObj?.total_stripe_fee,
            total_payout: challengeObj?.total_payout,
            total_amount: challengeObj?.total_amount,
          }}
          currency={challengeObj?.game_fee?.currency_type}
          isChallenger={challengeObj?.challenger === entity.uid}
        />
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={strings.paymentMethod} />
        <View>
          <TCTouchableLabel
            title={
              defaultCard && defaultCard?.card?.brand
                ? Utility.capitalize(defaultCard?.card?.brand)
                : strings.addOptionMessage
            }
            subTitle={
              (defaultCard && defaultCard?.card?.last4) ??
              defaultCard?.card?.last4
            }
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
        <TCLabel title={strings.refundPolicy} />
        <Text style={styles.responsibilityText}>
          {strings.cancellationPolicyText}{' '}
        </Text>
        <Text style={styles.responsibilityNote}>
          {strings.agreeCancellationPolicy}
        </Text>
      </View>
      <View style={{flex: 1}} />
      <View style={{marginBottom: 10}}>
        <TCGradientButton
          title={strings.confirmAndPayTitle}
          onPress={() => {
            payAgainForAlterRequest();
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
