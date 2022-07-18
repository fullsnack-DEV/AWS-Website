import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function InvoiceRefundAmount({
  currencyType,
  totalAmount,
  notRefundedAmount,
  refundedAmount,
  style,
}) {
  return (
    <View style={style}>
      <View style={styles.containerView}>
        <Text style={styles.titleText}>{'Total Invoiced'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}
        >
          {`$${totalAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>{'Not Refunded'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.greenColorCard,
          }}
        >
          {`$${notRefundedAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>{'Refunded'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.darkThemeColor,
          }}
        >
          {`$${refundedAmount} ${currencyType}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 10,
    marginBottom: 0,
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});
