import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function InvoiceAmount({
  status,
  currencyType,
  totalAmount,
  paidAmount,
  openAmount,
  style,
}) {
  return (
    <View style={ style}>
      {status && <View style={styles.containerView}>
        <Text style={ styles.titleText}>Status</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: status === 'Paid' ? colors.greenColorCard : colors.darkThemeColor,
          }}>{status}
        </Text>
      </View>

      }
      <View style={styles.containerView}>
        <Text style={styles.titleText}>{status ? 'Invoiced Amount' : 'Total Invoiced'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}>{`$${totalAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>{status ? 'Paid Amount' : 'Paid'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.greenColorCard,
          }}>{`$${paidAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>{status ? 'Balance' : 'Open'}</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.darkThemeColor,
          }}>{`$${openAmount} ${currencyType}`}
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
