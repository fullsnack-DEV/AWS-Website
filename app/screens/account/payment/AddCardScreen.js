import React, {
  useState, useLayoutEffect, useContext,
} from 'react';
import {
  View, StyleSheet, Text, Image, Alert,
} from 'react-native';

import { PaymentCardTextField } from 'tipsi-stripe'

import AuthContext from '../../../auth/context'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { createPaymentMethod } from '../../../api/Users';
import strings from '../../../Constants/String'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
// import * as Utility from '../../../utils';
// import images from '../../../Constants/ImagePath';

export default function AddCardScreen({ navigation }) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const [card, setCard] = useState({ valid: false, params: {} })

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings.addacard,
      headerRight: () => (
        card.valid ? <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveCard();
        } }>{strings.done}</Text> : <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightgrayColor,
        } } >{strings.done}</Text>
      ),
    });
  }, [navigation, card]);

  const onSaveCard = async () => {
    setloading(true)
    const params = {
      card_number: card.params.number,
      expiry_month: card.params.expMonth,
      expiry_year: card.params.expYear,
      cvc: card.params.cvc,
    }
    createPaymentMethod(params, authContext)
      .then(() => {
        navigation.goBack();
      })
      .catch((e) => {
        Alert.alert(strings.alertmessagetitle, e.message)
      })
      .finally(() => setloading(false));
  }

  const handleFieldParamsChange = (valid, params) => {
    card.valid = valid;
    card.params = params;
    setCard({ ...card })
  }

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Image style={{ width: '100%', height: 250 }}></Image>
      <Text style={{ margin: 15, color: colors.darkGrayColor }}>Card</Text>
      <PaymentCardTextField
            accessible={false}
            style={styles.field}
            onParamsChange={handleFieldParamsChange}
            numberPlaceholder="XXXX XXXX XXXX XXXX"
            expirationPlaceholder="MM/YY"
            cvcPlaceholder="CVC"
            // {...testID('cardTextField')}
          />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  field: {
    width: '100%',
    color: '#449aeb',
    borderColor: colors.lightgrayColor,
    borderWidth: 0.5,
    borderRadius: 0,
    backgroundColor: colors.whiteColor,
    overflow: 'hidden',
  },
})
