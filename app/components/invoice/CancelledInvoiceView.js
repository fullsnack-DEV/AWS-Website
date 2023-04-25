import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors';
import { getJSDate } from '../../utils';
import fonts from '../../Constants/Fonts';
import GroupIcon from '../GroupIcon';
import Verbs from '../../Constants/Verbs';
import { strings } from '../../../Localization/translation';

export default function CancelledInvoiceView({invoice, onPressCard, from}) {
  const getStatus = () => {
    if (invoice.invoice_status === Verbs.INVOICE_CANCELLED) {
      return strings.Cancelled;
    }
    return strings.rejected;
  };
  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
    {/* group icon */}
    <GroupIcon
      entityType={from === Verbs.INVOICERECEVIED ? invoice.sender_type : invoice.receiver_type}
      imageUrl={from === Verbs.INVOICERECEVIED ? invoice.sender.thumbnail : invoice.receiver.thumbnail}
      containerStyle={styles.profileContainer}
      groupName={from === Verbs.INVOICERECEVIED ? invoice.sender.sender_name : invoice.receiver.full_name}
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
      <View style={{marginLeft: 15}}>
        <Text style={styles.userInfoStyle}>{from === Verbs.INVOICERECEVIED ? invoice.sender.sender_name : invoice.receiver.full_name }</Text>
        <Text style={styles.secondaryTextStyle}>{invoice.invoice_title}</Text>
        <Text style={styles.secondaryTextStyle}>{moment(getJSDate(invoice.created_date)).format('LLL')}</Text>
      </View>

      {/* invoice amount */}
      <View style={styles.invoiveAmountContainer}>
        <Text style={styles.invoiceAmountTexStyle}>
          {invoice.amount_due.toFixed(2)}{' '}
          {invoice.currency_type}
        </Text>
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
  userInfoStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 17,
  },
  secondaryTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    lineHeight: 21,
  },
  invoiveAmountContainer: {
    marginVertical: 15,
  },
  invoiceAmountTexStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: '#333333',
    alignSelf: 'flex-end',
    lineHeight: 24,
  },
});
