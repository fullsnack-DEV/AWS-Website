import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import {payAgainAlterReferee, payAgainReferee} from '../../api/Challenge';
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

export default function PayAgainRefereeScreen({navigation, route}) {
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
  const payAgainForRefereeRequest = () => {
    setloading(true);
    const bodyParams = {};
    if (defaultCard) {
      bodyParams.source = defaultCard.id;
      bodyParams.payment_method_type = 'card';
      if (sorceScreen === ReservationStatus.pendingrequestpayment) {
        payAgainAlterReferee(
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
        payAgainReferee(reservationObj.reservation_id, bodyParams, authContext)
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
        {/* paymentData={paymentInfo} homeTeam={homeTeam && homeTeam} awayTeam={awayTeam && awayTeam} */}
        <MatchFeesCard
          challengeObj={reservationObj}
          senderOrReceiver={'sender'}
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
                comeFrom: 'PayAgainRefereeScreen',
              });
            }}
          />
        </View>
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={strings.refundPolicy} />
        <Text style={styles.responsibilityText}>
          {strings.cancellationPolicyText}
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
            payAgainForRefereeRequest();
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
