/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, {useState, useLayoutEffect, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, Image, Alert, Button} from 'react-native';

// import { PaymentCardTextField } from 'tipsi-stripe'

import {
  CardField,
  initStripe,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';
import {format} from 'react-string-format';
import * as Utility from '../../../utils';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {attachPaymentMethod, paymentMethods} from '../../../api/Users';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
// import * as Utility from '../../../utils';
// import images from '../../../Constants/ImagePath';

export default function AddCardScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [card, setCard] = useState({valid: false, params: {}});
  const [valid, setValid] = useState(false);
  const {createPaymentMethod} = useStripe();

  const createPaymentMethodByCard = async () => {
    const {paymentMethod, error} = await createPaymentMethod({
      paymentMethodType: 'Card',
    });

    if (error) {
      Alert.alert(format(strings.errorCodeText, error.message));
      setloading(false);
    } else if (paymentMethod) {
      console.log('createPaymentMethod ', paymentMethod);
      setCard(paymentMethod?.card);
      onSaveCard(paymentMethod);
    }
  };

  useEffect(() => {
    Utility.getStorage('appSetting').then(async (setting) => {
      console.log('paymentsetting:=>', setting);

      initStripe({
        publishableKey: setting.publishableKey,
      });
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings.addacard,
      headerRight: () =>
        valid ? (
          <Text
            style={{
              marginEnd: 16,
              fontSize: 14,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}
            onPress={() => {
              setloading(true);
              createPaymentMethodByCard();
            }}>
            {strings.done}
          </Text>
        ) : (
          <Text
            style={{
              marginEnd: 16,
              fontSize: 14,
              fontFamily: fonts.RRegular,
              color: colors.lightgrayColor,
            }}>
            {strings.done}
          </Text>
        ),
    });
  }, [navigation, card, valid]);

  const getPaymentMethods = () =>
    new Promise((resolve, reject) => {
      paymentMethods(authContext)
        .then((response) => {
          const newCards = response.payload.filter(
            (v, i, a) =>
              a.findIndex((t) => t.card.fingerprint === v.card.fingerprint) ===
              i,
          );

          setCard([...newCards]);
          // setloading(false)

          resolve(true);
        })
        .catch((e) => {
          reject(new Error(e.message));
          // setloading(false)
          // setTimeout(() => {
          //   Alert.alert(strings.alertmessagetitle, e.message);
          // }, 0.3)
        });
    });

  const onSaveCard = async (paymentMethod) => {
    setloading(true);
    const params = {
      payment_method: paymentMethod.id,
    };
    attachPaymentMethod(params, authContext)
      .then(() => {
        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        console.log('error in onSaveCard', e);
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.3);
      });
  };

  return (
    <View accessibilityLabel="add-card-screen">
      <ActivityLoader visible={loading} />
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: 'XXXX XXXX XXXX XXXX',
        }}
        cardStyle={styles.cardStyle}
        style={{
          width: '100%',
          height: 100,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
          setValid(cardDetails.complete);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: colors.whiteColor,
    textColor: colors.lightBlackColor,
  },
});
