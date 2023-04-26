import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors';
import {getJSDate} from '../../utils';
import fonts from '../../Constants/Fonts';
import GroupIcon from '../GroupIcon';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';

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
        entityType={
          from === Verbs.INVOICERECEVIED
            ? invoice.sender_type
            : invoice.receiver_type
        }
        imageUrl={invoice?.thumbnail}
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
          <Text style={styles.secondaryTextStyle}>
            {moment(getJSDate(invoice.created_date)).format('LLL')}
          </Text>
        </View>

        {/* invoice amount */}
        <View style={styles.invoiveAmountContainer}>
          <Text style={styles.invoiceAmountTexStyle}>
            {`${invoice.amount_due.toFixed(2)} ${invoice.currency_type} `}
          </Text>
          <View>
            <Text
              style={[
                styles.invoiceAmountTexStyle,
                {
                  color: colors.googleColor,
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
    paddingVertical: 15,
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
    flex: 1,
  },
  invoiceAmountTexStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
    alignSelf: 'flex-end',
    lineHeight: 24,
  },
});
