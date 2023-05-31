/* eslint-disable no-else-return */

import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../GroupIcon';

export default function MemberInvoicesView({data, onPressCard}) {
  const getInvoices = () => {
    const paidInvoices = data.invoices.filter(
      (inv) => inv.invoice_status === Verbs.paid,
    );
    if (paidInvoices.length === 0) {
      return `${data.invoices.length}  ${strings.invoicesTitle.toLowerCase()}`;
    } else {
      return `${paidInvoices.length} / ${
        data.invoices.length
      } ${strings.invoicesTitle.toLowerCase()}`;
    }
  };

  const getStatus = () => {
    if (
      data.invoices.some(
        (invoice) => invoice.invoice_status === Verbs.INVOICE_REJECTED,
      )
    ) {
      return strings.openrejectedtext1;
    } else if (
      data.invoices.some(
        (invoice) =>
          invoice.invoice_status === Verbs.UNPAID ||
          invoice.invoice_status === Verbs.PARTIALLY_PAID,
      )
    ) {
      return strings.openText;
    }
    return strings.paidText;
  };

  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      {/* group icon */}
      <View>
        <GroupIcon
          entityType={data.receiver_type}
          imageUrl={data.thumbnail}
          containerStyle={styles.profileContainer}
          groupName={data.full_name}
          grpImageStyle={{
            height: 32,
            width: 28,
          }}
          textstyle={{
            fontSize: 12,
          }}
        />
      </View>

      <View style={styles.playerInvoiceInfoContainer}>
        {/* Player name and invoces text */}
        <View style={{marginLeft: 15, flex: 1}}>
          <Text
            numberOfLines={2}
            style={styles.userInfoStyle}>{`${data?.full_name}`}</Text>

          <Text style={styles.invoiceTextStyle}>{getInvoices()}</Text>
        </View>

        {/* invoice amount */}
        <View style={styles.invoiveAmountContainer}>
          <Text style={styles.invoiceAmountTexStyle}>
            {`${data.invoice_total.toFixed(2)} ${
              data.invoices[0].currency_type
            }`}

            {/* {data.invvoicetopaid} */}
          </Text>
          {data.invoice_total !== data.invoice_paid_total && (
            <Text
              style={[
                styles.invoiceAmountTexStyle,
                {color: colors.darkThemeColor},
              ]}>
              {`${data.invoice_open_total.toFixed(2)} ${
                data.invoices[0].currency_type
              }`}
            </Text>
          )}
          <View>
            <Text
              style={[
                styles.invoiceAmountTexStyle,
                {
                  color:
                    data.invoice_total === data.invoice_paid_total
                      ? colors.neonBlue
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
    // alignItems: 'flex-start',
    borderBottomWidth: 1,

    borderBottomColor: colors.bordercolor,
  },

  invoiveAmountContainer: {
    marginVertical: 15,
    flex: 1,
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
  invoiceTextStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
    lineHeight: 21,
  },
});
