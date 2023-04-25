import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';
import {getJSDate} from '../../utils';

export default function BatchInvoiceView({data, onPressCard}) {
  const getStatus = () => {
    if (data.invoice_total === data.invoice_paid_total) {
      return strings.allpaid;
    }
    return `${
      data.invoices.filter(
        (inv) =>
          inv.invoice_status === Verbs.UNPAID ||
          inv.invoice_status === Verbs.PARTIALLY_PAID ||
          inv.invoice_status === Verbs.INVOICE_REJECTED,
      ).length
    } ${strings.openText}`;
  };

  const getRecipientsInString = () => {
    if (data.invoices.length === 1) {
      return `1 ${strings.recipient}`;
    }
    return `${data.invoices.length} ${strings.recipients}`;
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
          {moment(getJSDate(data.due_date)).format('LLL')}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            fontFamily: fonts.RRegular,
            lineHeight: 24,
          }}>
          {data.invoice_description}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.RMedium,
            lineHeight: 24,
          }}>
          {getRecipientsInString()}
        </Text>
      </View>

      {/* amount Container */}

      <View style={styles.invoiveAmountContainer}>
        <Text style={styles.invoiceAmountTexStyle}>
          {data.invoice_total} {data.invoices[0].currency_type}
          {/* {data.invvoicetopaid} */}
        </Text>
        {data.invoice_total !== data.invoice_paid_total && (
          <Text
            style={[
              styles.invoiceAmountTexStyle,
              {color: colors.darkThemeColor},
            ]}>
            {data.invoice_open_total} {data.invoices[0].currency_type}
          </Text>
        )}
        <View>
          <Text
            style={[
              styles.invoiceAmountTexStyle,
              {
                color:
                  data.invoice_total === data.invoice_paid_total
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
    paddingVertical: 15,
  },

  invoiveAmountContainer: {
    // marginVertical: 15,
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
