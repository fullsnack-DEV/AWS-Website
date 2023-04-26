/* eslint-disable no-else-return */

import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';
import {getJSDate} from '../../utils';

export default function RecipientInvoiceView({invoice, onPressCard}) {
  const getStatus = () => {
    if (invoice.amount_due === invoice.amount_paid) {
      return strings.paidText;
    }
    if (invoice.invoice_status === Verbs.INVOICE_REJECTED) {
      return strings.openrejectedtext;
    }
    return strings.openText;
  };

  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      {/* date and fee cotaainer */}
      <View
        style={{
          flex: 1,
        }}>
        <Text
          style={{
            lineHeight: 24,
            fontFamily: fonts.RRegular,
            fontSize: 14,
          }}>
          {moment(getJSDate(invoice.due_date)).format('LLL')}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            lineHeight: 24,
          }}>
          {invoice.invoice_title}
        </Text>
      </View>

      {/* amount Container */}

      <View style={styles.invoiveAmountContainer}>
        <Text style={styles.invoiceAmountTexStyle}>
          {`${invoice.amount_due.toFixed(2)} ${invoice.currency_type}`}
        </Text>
        {invoice.amount_due !== invoice.amount_paid && (
          <Text
            style={[
              styles.invoiceAmountTexStyle,
              {color: colors.darkThemeColor},
            ]}>
            {`${invoice.amount_remaining.toFixed(2)} ${invoice.currency_type}`}
          </Text>
        )}
        <View>
          <Text
            style={[
              styles.invoiceAmountTexStyle,
              {
                color:
                  invoice.amount_due === invoice.amount_paid
                    ? colors.gameDetailColor
                    : colors.darkThemeColor,
                alignSelf: 'flex-end',
              },
            ]}>
            {getStatus()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: colors.whiteColor,
    borderBottomColor: '#EFEFEF',
  },

  invoiveAmountContainer: {
    marginVertical: 15,
    flex: 0.5,
  },
  invoiceAmountTexStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: '#333333',
    alignSelf: 'flex-end',
    lineHeight: 24,
  },
});
