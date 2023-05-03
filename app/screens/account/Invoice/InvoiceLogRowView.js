import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getJSDate} from '../../../utils';
import Verbs from '../../../Constants/Verbs';
import {strings} from '../../../../Localization/translation';

export default function InvoiceLogRowView({data, currency, onPressCard}) {
  const getPaymentModeText = () => {
    if (data.transaction_type === Verbs.PAYMENT) {
      if (data.payment_mode === Verbs.CASH) {
        return strings.paidInCash;
      }
      if (data.payment_mode === Verbs.card) {
        return strings.paidthroughStripe;
      }
      return strings.paidbyCheque;
    }
    if (data.payment_mode === Verbs.CASH) {
      return strings.refundInCash;
    }
    if (data.payment_mode === Verbs.card) {
      return strings.refundthroughStripe;
    }
    return strings.refundByCheck;
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
          {moment(getJSDate(data.payment_date)).format('LLL')}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            lineHeight: 24,
          }}>
          {getPaymentModeText()}
        </Text>
      </View>

      {/* amount Container */}

      <View style={styles.invoiveAmountContainer}>
        <Text style={styles.invoiceAmountTexStyle}>
          {`$${data.amount} ${currency}`}
        </Text>
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
