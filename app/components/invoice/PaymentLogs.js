import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function PaymentLogs({data, onPressCard}) {
  console.log('payment log:=>', data);

  const getPaymentModeText = () => {
    if (data?.transaction_type === 'payment') {
      if (data?.payment_mode === 'Cash') {
        return 'Paid in cash';
      }
      if (data?.payment_mode === 'card') {
        return 'Paid through Stripe';
      }
      return 'Paid by Cheque';
    }
    if (data?.payment_mode === 'Cash') {
      return 'Refund in cash';
    }
    if (data?.payment_mode === 'card') {
      return 'Refund through Stripe';
    }
    return 'Refund by Cheque';
  };

  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.offwhite,
        flexDirection: 'row',
        borderRadius: wp('2%'),

        marginBottom: 15,
        width: wp('90%'),
        height: 85,

        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
      }}
    >
      <View style={{marginLeft: 15}}>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}
        >
          {moment(new Date(data?.payment_date * 1000)).format('MMM DD, YYYY')}
        </Text>

        <Text
          style={{
            fontFamily: fonts.RLight,
            fontSize: 14,
            color: colors.lightBlackColor,
          }}
        >
          {getPaymentModeText()}
        </Text>
      </View>
      <View style={{marginRight: 15}}>
        <Text style={styles.dateView}>{`$${data?.amount}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dateView: {
    fontFamily: fonts.RRegular,
    fontSize: 16,

    color: colors.greeColor,
  },
});
