/* eslint-disable no-else-return */

import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../GroupIcon';

export default function MemberInvoiceView({invoice, onPressCard}) {
  const getStatus = () => {
    if (invoice.invoice_status === Verbs.INVOICE_REJECTED) {
      return strings.rejected;
    } else if (invoice.invoice_status === Verbs.paid) {
      return strings.paidText;
    }
    return strings.openText;
  };

  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      {/* group icon */}

      <GroupIcon
        entityType={invoice.receiver_type}
        imageUrl={invoice.thumbnail}
        containerStyle={styles.profileContainer}
        groupName={invoice.full_name}
        grpImageStyle={{
          height: 32,
          width: 28,
        }}
        textstyle={{
          fontSize: 12,
        }}
      />

      <View style={styles.playerInvoiceInfoContainer}>
        {/* Player name and invoces text */}
        <View style={{marginLeft: 15, flex: 1}}>
          <Text style={styles.userInfoStyle} numberOfLines={2}>
            {invoice.full_name}
          </Text>
        </View>

        {/* invoice amount */}
        <View style={styles.invoiveAmountContainer}>
          <Text style={styles.invoiceAmountTexStyle}>
            {`${invoice.amount_due.toFixed(2)} ${invoice.currency_type}`}
          </Text>
          {invoice.invoice_status !== Verbs.paid && (
            <Text
              style={[
                styles.invoiceAmountTexStyle,
                {color: colors.darkThemeColor},
              ]}>
              {`${invoice.amount_remaining.toFixed(2)} ${
                invoice.currency_type
              }`}
            </Text>
          )}
          <View>
            <Text
              style={[
                styles.invoiceAmountTexStyle,
                {
                  color:
                    invoice.amount_remaining === 0
                      ? colors.gameDetailColor
                      : colors.darkThemeColor,
                  alignSelf: 'flex-end',
                },
              ]}>
              {getStatus()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignSelf: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  invoiveAmountContainer: {
    marginVertical: 15,
    flex: 0.5,
  },
  playerInvoiceInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    height: 40,
    width: 40,

    borderWidth: 1,
  },
  invoiceAmountTexStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: '#333333',
    alignSelf: 'flex-end',
    lineHeight: 24,
  },
  userInfoStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 24,
  },
});
