/* eslint-disable no-nested-ternary */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {strings} from '../../../Localization/translation';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function InvoiceAmount({
  totalAmount,
  currency,
  paidAmount,
  openAmount,
  totalInvoices,
  allCurrencySelected,
  style,
}) {
  return (
    <View style={[styles.parent, style]}>
      <View style={{marginVertical: 15}}>
        {allCurrencySelected && (
          <View
            style={{
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 9,
            }}>
            <Text
              style={{
                fontFamily: fonts.RMedium,
                fontSize: 20,
                color: colors.lightBlackColor,
              }}>
              {`${strings.invoicesIn} ${currency}`}
            </Text>

            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RMedium,
                lineHeight: 30,
                color: colors.lightBlackColor,
              }}>
              {totalInvoices}
            </Text>
          </View>
        )}

        <View style={styles.containerView}>
          <Text style={styles.titleText}>{strings.invoicedtxt}</Text>
          <Text style={styles.amountTitle}>{`${totalAmount.toFixed(
            2,
          )} ${currency}`}</Text>
        </View>
        <View
          style={[
            styles.containerView,
            {
              marginTop: 10,
            },
          ]}>
          <Text style={styles.titleText}>{strings.paidText}</Text>

          <Text style={[styles.amountTitle, {color: colors.neonBlue}]}>
            {`${paidAmount.toFixed(2)} ${currency}`}
          </Text>
        </View>
        <View style={[styles.containerView, {marginTop: 10}]}>
          <Text style={styles.titleText}>{strings.openText}</Text>
          <Text style={[styles.amountTitle, {color: colors.darkThemeColor}]}>
            {`${openAmount.toFixed(2)} ${currency}`}
          </Text>
        </View>

        {/* ActionSheet */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.lightGrayBackground,
  },
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },

  titleText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 24,
  },
  amountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
});
