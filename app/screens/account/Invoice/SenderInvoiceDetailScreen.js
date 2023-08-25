/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */

import React, {useLayoutEffect, useRef, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import moment from 'moment';
import {format} from 'react-string-format';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import images from '../../../Constants/ImagePath';

// import {
// getInvoiceDetail,
// deleteInvoice,
// cancelInvoice,
// payStripeInvoice,
// resendInvoice,
// deleteInvoiceLog,
// } from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GroupIcon from '../../../components/GroupIcon';
import {getJSDate} from '../../../utils';

export default function SenderInvoiceDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const [invoice] = useState(route.params.invoice);
  const [currency_type] = useState(route.params.currency_type);

  const [loading] = useState(false);

  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const userActionSheet = useRef();
  // const resendModalRef = useRef();

  // const recipientModalRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => {
              if (from === 'user') {
                userActionSheet.current.show();
              } else {
                actionSheet.current.show();
              }
            }}>
            <Image
              source={images.threeDotIcon}
              style={styles.townsCupSettingIcon}
            />
          </TouchableOpacity>
        </View>
      ),

      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [from, navigation]);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {invoice && (
        <View style={{flex: 1}}>
          <View style={{margin: 15}}>
            <>
              <Text
                style={{
                  color: colors.lightBlackColor,
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: fonts.RBold,
                }}>
                {invoice.invoice_title}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  lineHeight: 24,
                }}>
                {`${strings.invoiceNumberText} ${invoice.invoice_id}`}
              </Text>
              {/* Issued by  */}

              <Text
                style={{
                  color: colors.userPostTimeColor,
                  fontSize: 13,
                  fontFamily: fonts.RRegular,
                  lineHeight: 18,
                }}>{`${strings.issuedBy} ${
                authContext.entity.obj.full_name ??
                authContext.entity.obj.group_name
              }`}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 21,
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: fonts.RRegular,
                    marginRight: 5,
                  }}>
                  {strings.to}:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
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
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.RRegular,
                      lineHeight: 24,
                      marginLeft: 5,
                    }}>
                    {invoice.full_name}
                  </Text>
                </View>
              </View>
            </>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
                // marginBottom: 5,
              }}>
              {format(
                strings.issuedAt,
                moment(getJSDate(invoice.created_date)).format(
                  'MMM DD, YYYY, HH:mm',
                ),
              )}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
              }}>
              {format(
                strings.dueAtNText,
                moment(getJSDate(invoice.due_date)).format('MMM DD, YYYY'),
              )}
            </Text>
          </View>

          {/* Progress Bar */}

          <LinearGradient
            colors={[colors.progressBarColor, colors.progressBarColor]}
            style={styles.paymentProgressView}>
            {/* this need to show conditionally when there is 0% amount paid */}

            {invoice.amount_due === invoice.amount_remaining && (
              <Text
                style={{
                  color: colors.neonBlue,
                  fontFamily: fonts.RBold,
                  fontSize: 12,
                  marginLeft: 10,
                  height: 18,

                  alignSelf: 'flex-start',
                }}>
                {`${(invoice.amount_paid / invoice.amount_due) * 100}%`}
              </Text>
            )}

            <LinearGradient
              colors={[colors.progressBarBgColor, colors.progressBarBgColor]}
              style={{
                borderWidth: 1,
                height: 18,
                borderColor: colors.neonBlue,

                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                width: `${(invoice.amount_paid / invoice.amount_due) * 100}%`,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.neonBlue,
                  fontFamily: fonts.RBold,
                  fontSize: 12,
                  marginLeft: 30,
                  height: 18,
                  alignSelf: 'flex-end',
                }}>
                {`${(invoice.amount_paid / invoice.amount_due) * 100}%`}
              </Text>
            </LinearGradient>
          </LinearGradient>

          {/* status contINER */}

          <View
            style={{
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.statusText}> {strings.status}</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {
                    color:
                      invoice.amount_due === invoice.amount_remaining
                        ? colors.darkThemeColor
                        : colors.gameDetailColor,
                  },
                ]}>
                {invoice.amount_due === invoice.amount_remaining
                  ? strings.openText
                  : strings.paidText}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}>{strings.invoicedtxt}</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.lightBlackColor},
                ]}>
                {`${invoice.amount_due.toFixed(2)} ${currency_type} `}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}> {strings.paidText} </Text>
              <Text style={[styles.amountTextStyle, {color: colors.neonBlue}]}>
                {`${invoice.amount_paid.toFixed(2)}  ${currency_type}`}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}> {strings.balance} </Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.darkThemeColor},
                ]}>
                {`${invoice.amount_remaining.toFixed(2)}  ${currency_type}`}
              </Text>
            </View>
          </View>
          <TCThinDivider
            marginTop={15}
            width={'94%'}
            color={colors.thinDividerColor}
            height={2}
          />

          <View style={{margin: 15}}>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
                lineHeight: 16,
                marginBottom: 15,
              }}>
              {strings.describeText}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
                marginLeft: 25,
                lineHeight: 24,
              }}>
              {invoice?.invoice_description}
            </Text>
          </View>

          {/* log view */}
          <View
            style={{
              paddingHorizontal: 25,
              marginTop: 35,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
              }}>
              {strings.log}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                lineHeight: 24,
                color: colors.lightBlackColor,
                textDecorationLine: 'underline',
              }}>
              {strings.logManually}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  townsCupSettingIcon: {
    resizeMode: 'contain',
    height: 19,
    width: 9,
    marginRight: 10,
    tintColor: colors.lightBlackColor,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 25,
  },

  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.darkThemeColor,
    marginTop: 15,
    marginBottom: 25,
  },

  profileContainer: {
    height: 25,
    width: 25,
    borderWidth: 1,
  },
  statusRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
  amountTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.darkThemeColor,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
