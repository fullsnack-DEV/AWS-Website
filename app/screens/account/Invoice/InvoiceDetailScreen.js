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
  Alert,
  Platform,
} from 'react-native';

import moment from 'moment';
import ReadMore from '@fawazahmed/react-native-read-more';
import ActionSheet from 'react-native-actionsheet';
import {format} from 'react-string-format';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import images from '../../../Constants/ImagePath';

import {
  // getInvoiceDetail,
  rejectInvoice,
  cancelInvoice,
  // payStripeInvoice,
  // resendInvoice,
  // deleteInvoiceLog,
} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getJSDate} from '../../../utils';
import Verbs from '../../../Constants/Verbs';

export default function InvoiceDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const [invoice, setInvoice] = useState(route.params.invoice);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const userActionSheet = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          {from !== Verbs.INVOICERECEVIED ? (
            <TouchableOpacity
              onPress={() => {
                userActionSheet.current.show();
              }}>
              <Image
                source={images.vertical3Dot}
                style={styles.townsCupSettingIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ),

      headerTitle: () => (
        <View>
          <Text style={styles.navTitle}>{strings.invoice}</Text>
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
  }, [navigation]);

  const getStatus = () => {
    if (invoice.invoice_status === Verbs.paid) {
      return strings.paidText;
    }

    if (invoice.invoice_status === Verbs.INVOICE_CANCELLED) {
      return strings.Cancelled;
    }

    if (invoice.invoice_status === Verbs.INVOICE_REJECTED) {
      return strings.rejected;
    }

    return strings.openText;
  };

  const onRejectInvoice = () => {
    setLoading(true);
    rejectInvoice(invoice.invoice_id, authContext)
      .then(() => {
        setLoading(false);
        invoice.invoice_status = Verbs.INVOICE_REJECTED;
        setInvoice(invoice);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onCancelInvoice = () => {
    setLoading(true);
    cancelInvoice(invoice.invoice_id, authContext)
      .then(() => {
        setLoading(false);
        invoice.invoice_status = Verbs.INVOICE_CANCELLED;
        navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  // const payNowClicked = () => {
  //   if (route.params.paymentMethod) {
  //     console.log(route.params.paymentMethod);

  //     setLoading(true);
  //     const body = {};
  //     body.source = route.params.paymentMethod?.id;
  //     body.payment_method_type = 'card';
  //     body.currency_type = invoice.currency_type;
  //     payStripeInvoice(invoice.invoice_id, body, authContext)
  //       .then(() => {
  //         setLoading(false);
  //         navigation.goBack();
  //       })
  //       .catch((e) => {
  //         setLoading(false);
  //         setTimeout(() => {
  //           Alert.alert(strings.alertmessagetitle, e.message);
  //         }, 10);
  //       });
  //   } else {
  //     Alert.alert(strings.choosePayment);
  //   }
  // };


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
                from === Verbs.INVOICERECEVIED
                  ? invoice.full_name
                  : authContext.entity.obj.full_name ??
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
                  {from === Verbs.INVOICERECEVIED ? strings.from : strings.to}:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {invoice.thumbnail ? (
                    <Image
                      style={styles.profileContainer}
                      source={{
                        uri: invoice.thumbnail,
                      }}
                    />
                  ) : null}

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
                      invoice.invoice_status === Verbs.UNPAID
                        ? colors.darkThemeColor
                        : colors.gameDetailColor,
                  },
                ]}>
                {getStatus()}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}>{strings.invoicedtxt}</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.lightBlackColor},
                ]}>
                {`${invoice.amount_due.toFixed(2)} ${invoice.currency_type}`}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}> {strings.paidText} </Text>
              <Text style={[styles.amountTextStyle, {color: colors.neonBlue}]}>
                {`${invoice.amount_paid.toFixed(2)} ${invoice.currency_type}`}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}> {strings.balance}</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.darkThemeColor},
                ]}>
                {`${invoice.amount_remaining.toFixed(2)} ${
                  invoice.currency_type
                }`}
              </Text>
            </View>
          </View>
          <TCThinDivider
            marginTop={15}
            width={'94%'}
            color={colors.thinDividerColor}
            height={2}
          />
          <View
            style={{
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
                lineHeight: 16,
                marginBottom: 15,
                marginLeft: 15,
              }}>
              {strings.describeText}
            </Text>
            <View
              style={{
                marginLeft: 25,
              }}>
              <ReadMore
                numberOfLines={3}
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  lineHeight: 24,
                }}
                seeMoreText={strings.moreText}
                seeLessText={strings.lessText}
                seeLessStyle={[
                  styles.moreLessText,
                  {
                    color: colors.userPostTimeColor,
                  },
                ]}
                seeMoreStyle={[
                  styles.moreLessText,
                  {
                    color: colors.userPostTimeColor,
                  },
                ]}>
                {invoice?.invoice_description}
              </ReadMore>
            </View>
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
                color: colors.lightBlackColor,
                lineHeight: 24,
              }}>
              {strings.log}
            </Text>
            {from === Verbs.INVOICESENT && (
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
            )}
          </View>

          {invoice.amount_due !== invoice.amount_remaining && (
            <View style={{paddingHorizontal: 25, marginTop: 20}}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  lineHeight: 24,
                  color: colors.userPostTimeColor,
                }}>
                {strings.noLogFoundText}
              </Text>
            </View>
          )}

          {/* Pay Now Button */}

          {from === Verbs.INVOICERECEVIED && (
            <>
              {invoice.invoice_status === Verbs.UNPAID ? (
                <>
                  <TouchableOpacity style={styles.btncontainer}>
                    <Text style={styles.btntextstyle}>{strings.PAYNOW}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onRejectInvoice();
                    }}>
                    <Text style={styles.rejectTextstyle}>
                      {strings.rejectText}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </>
          )}
        </View>
      )}

      <ActionSheet
        ref={userActionSheet}
        options={[
          strings.resendInvoiceText,
          strings.refund,
          strings.cancelInvoiceText,
          strings.cancel,
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            console.log('In development');

            // setSelectedActionSheetOpetion(0);
            // resendModalRef.current.open();
          }
          if (index === 1) {
            console.log('In development');
            // setSelectedActionSheetOpetion(1);
            // resendModalRef.current.open();
            Alert.alert(
              Platform.OS === 'android' ? '' : strings.invoiceRefundText,
              Platform.OS === 'android' ? strings.invoiceRefundText : '',
              [
                {
                  text: strings.OkText,
                  onPress: () => console.log('no'),
                },
              ],
            );
          }
          if (index === 2) {
            Alert.alert(
              Platform.OS === 'android' ? '' : strings.cancelSingleInvoice,
              Platform.OS === 'android' ? strings.cancelSingleInvoice : '',
              [
                {
                  text: strings.no,
                  onPress: () => console.log('no'),
                },
                {
                  text: strings.cancel,
                  onPress: () => { onCancelInvoice()},
                  style: 'destructive',
                },
              ],
            );

            // setSelectedActionSheetOpetion(2);
            // recipientModalRef.current.open();
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  townsCupSettingIcon: {
    height: 25,
    resizeMode: 'contain',
    width: 25,
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
    borderRadius: 50,
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
  navTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    lineHeight: 24,
  },
  btncontainer: {
    width: 345,
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeColorCard,
    borderRadius: 20,
    marginTop: 36,
  },
  btntextstyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  rejectTextstyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    lineHeight: 50,
    alignSelf: 'center',
    color: colors.blockZoneText,
    textDecorationLine: 'underline',
  },
});
