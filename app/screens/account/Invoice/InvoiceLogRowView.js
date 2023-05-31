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
    <TouchableOpacity
      style={styles.viewContainer}
      onPress={onPressCard}
      disabled={data.is_deleted}>
      {/* date and fee cotaainer */}
      <View
        style={{
          flex: 1,
          opacity: data.is_deleted ? 0.3 : 1,
        }}>
        <Text
          style={{
            lineHeight: 24,
            fontFamily: fonts.RBold,
            fontSize: 16,
          }}>
          {moment(getJSDate(data.payment_date)).format('LL')}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            fontFamily: fonts.RRegular,
            lineHeight: 24,
            marginTop: -2,
          }}>
          {getPaymentModeText()}
        </Text>
      </View>

      {/* amount Container */}

      <View
        style={[
          styles.invoiveAmountContainer,
          {opacity: data.is_deleted ? 0.3 : 1},
        ]}>
        {data.is_deleted && (
          <Text
            style={{
              alignSelf: 'flex-end',
            }}>
            {strings.deleted}
          </Text>
        )}
        <Text
          style={[
            styles.invoiceAmountTexStyle,
            {
              color:
                data.transaction_type === Verbs.PAYMENT
                  ? colors.neonBlue
                  : colors.lightBlackColor,
            },
          ]}>
          {data.transaction_type === Verbs.PAYMENT ? (
            <Text>{`${data.amount} ${currency}`}</Text>
          ) : (
            <Text>{`-${data.amount} ${currency}`}</Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 15,
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

    alignSelf: 'flex-end',
    lineHeight: 24,
  },
});
