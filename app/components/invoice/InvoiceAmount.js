import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function InvoiceAmount({
  currencyType,
  totalAmount,
  paidAmount,
  openAmount,
  style,
}) {
  return (
    <View style={[styles.containerStyle, style]}>
      <View style={styles.containerView}>
        <Text style={styles.titleText}>Total Invoiced</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}>{`$${totalAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>Paid</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.greenColorCard,
          }}>{`$${paidAmount} ${currencyType}`}
        </Text>
      </View>

      <View style={styles.containerView}>
        <Text style={styles.titleText}>Open</Text>
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
  containerStyle: {},
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginBottom: 0,
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});
