/* eslint-disable no-nested-ternary */
import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function InvoiceAmount({
  currency,
  totalInvoices,
  totalAmount,
  paidAmount,
  openAmount,
  currencyData,
  style,
  onCurrencyPress = () => {},
}) {
  return (
    <View style={[styles.parent, style]}>
      <View style={{marginVertical: 15}}>
        {/* invitation sent Text */}
        <Text style={{marginLeft: 25}}>
          <Text style={{fontSize: 20, fontFamily: fonts.RMedium}}>{totalInvoices}{' '}</Text>
          <Text style={styles.invoiceSentheading}>
            {strings.invoicessent}
          </Text>
        </Text>
        {/* Currency btn */}
        <View style={{backgroundColor: colors.lightGrayBackground}}>
          <FlatList
            data={currencyData}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginLeft: 5,
              backgroundColor: colors.lightGrayBackground,
              marginTop: 24,
              marginBottom: 12,
            }}
            keyExtractor={({item, index}) => `${item}/${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.currencyBtnStyle}
                onPress={() => onCurrencyPress(item.currency)}>
                <Text
                  style={[
                    styles.currencyTextStyle,
                    {color: item.currency === currency ? colors.themeColor : colors.lightBlackColor},
                  ]}>
                  {`  ${item.currency} (${item.invoices})  `}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.containerView}>
          <Text style={styles.titleText}>{strings.totalAmountInvoice}</Text>
          <Text style={styles.amountTitle}>{`${totalAmount.toFixed(2)} ${currency}`}</Text>
        </View>

        <View style={styles.containerView}>
          <Text style={styles.titleText}>{strings.paidText}</Text>

          <Text style={[styles.amountTitle, {color: colors.neonBlue}]}>
            {`${paidAmount.toFixed(2)} ${currency}`}
          </Text>
        </View>

        <View style={styles.containerView}>
          <Text style={styles.titleText}>{strings.openText}</Text>
          <Text style={[styles.amountTitle, {color: colors.darkThemeColor}]}>
            {`${openAmount.toFixed(2)} ${currency}`}
          </Text>
        </View>
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
    marginTop: 10,
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
  invoiceSentheading: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  currencyBtnStyle: {
    height: 24,

    backgroundColor: colors.whiteColor,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  currencyTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,

    lineHeight: 24,
  },
});
