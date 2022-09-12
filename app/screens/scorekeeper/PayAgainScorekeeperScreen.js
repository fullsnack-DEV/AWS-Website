import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import {
  payAgainAlterScorekeeper,
  payAgainScorekeeper,
} from '../../api/Challenge';
import {paymentMethods} from '../../api/Users';
import ReservationStatus from '../../Constants/ReservationStatus';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCGradientButton from '../../components/TCGradientButton';
import TCKeyboardView from '../../components/TCKeyboardView';
import TCLabel from '../../components/TCLabel';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import MatchFeesCard from '../../components/challenge/MatchFeesCard';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils';

export default function PayAgainScorekeeperScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [reservationObj, setReservationObj] = useState();
  const [sorceScreen, setSourceScreen] = useState();
  const [defaultCard, setDefaultCard] = useState();

  useEffect(() => {
    if (isFocused) {
      const {body, comeFrom} = route.params ?? {};
      setSourceScreen(comeFrom);
      setReservationObj(body);
      if (route?.params?.paymentMethod) {
        setDefaultCard(route?.params?.paymentMethod);
      } else {
        getPaymentMethods(body?.source);
      }
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
  const payAgainForScorekeeperRequest = () => {
    setloading(true);
    const bodyParams = {};
    if (defaultCard) {
      bodyParams.source = defaultCard.id;
      bodyParams.payment_method_type = 'card';
      if (sorceScreen === ReservationStatus.pendingrequestpayment) {
        payAgainAlterScorekeeper(
          reservationObj.reservation_id,
          bodyParams,
          authContext,
        )
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
        payAgainScorekeeper(
          reservationObj.reservation_id,
          bodyParams,
          authContext,
        )
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
        <TCLabel title={strings.payment} />
        <MatchFeesCard
          challengeObj={reservationObj}
          senderOrReceiver={'sender'}
        />
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={strings.paymentMethodTitle} />
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
                comeFrom: 'PayAgainScorekeeperScreen',
              });
            }}
          />
        </View>
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={strings.refundPolicy} />
        <Text style={styles.responsibilityText}>
          {`${strings.cancellationPolicyText} `}
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
            payAgainForScorekeeperRequest();
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
