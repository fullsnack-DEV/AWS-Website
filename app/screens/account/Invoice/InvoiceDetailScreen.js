/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */

import React, {useRef, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  Pressable,
  FlatList,
  ScrollView,
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
import AddRecipientsInBatchModal from './AddRecipientsInBatchModal';
import {InvoiceActionType, LogType} from '../../../Constants/GeneralConstants';
import ScreenHeader from '../../../components/ScreenHeader';
import LogModal from './LogModal';
import LogDetailModal from './LogDetailModal';
import InvoiceLogRowView from './InvoiceLogRowView';
import AddedMessagesModal from './AddedMessageModal';

export default function InvoiceDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const [invoice] = useState(route.params.invoice);
  const [thumbnail] = useState(route.params.thumbnail);
  const [selectedLog, setSelectedLog] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showLogManually, setShowLogManually] = useState();
  const [showLogModal, setShowLogModal] = useState(false);
  const authContext = useContext(AuthContext);
  const [logModalType, setLogModalType] = useState(LogType.Payment);
  const [showAddedMessages, setShowAddedMessages] = useState(false);
  const userActionSheet = useRef();
  const logManuallyActionSheet = useRef();

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
        navigation.goBack();
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

        navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const setcolor = () => {
    if (invoice.invoice_status === Verbs.paid) {
      return colors.neonBlue;
    }

    if (
      invoice.invoice_status === Verbs.INVOICE_CANCELLED ||
      invoice.invoice_status === Verbs.INVOICE_REJECTED
    ) {
      return colors.darkGrayTrashColor;
    }

    return colors.darkThemeColor;
  };

  const DisplayBalanceRow = () => {
    if (
      from === Verbs.INVOICERECEVIED &&
      (invoice.invoice_status === Verbs.INVOICE_CANCELLED ||
        invoice.invoice_status === Verbs.INVOICE_REJECTED)
    ) {
      return null;
    } else {
      return (
        <View style={styles.statusRows}>
          <Text style={styles.statusText}>{`${strings.balance}`}</Text>
          <Text
            style={[styles.amountTextStyle, {color: colors.darkThemeColor}]}>
            {`${invoice.amount_remaining.toFixed(2)} ${invoice.currency_type}`}
          </Text>
        </View>
      );
    }
  };

  const getCancelandRejectedBy = () => {
    if (invoice.invoice_status === Verbs.INVOICE_CANCELLED) {
      return `${strings.cancelledBy} ${invoice.canceled_by.first_name}  ${
        invoice.canceled_by.last_name
      } ${moment(getJSDate(invoice.canceled_at)).format(
        'MMM DD, YYYY, hh:mm, A',
      )} `;
    } else if (invoice.invoice_status === Verbs.INVOICE_REJECTED) {
      return `${strings.rejectedBy} ${invoice?.rejected_by?.first_name}  ${
        invoice?.rejected_by?.last_name
      } ${moment(getJSDate(invoice?.rejected_at)).format(
        'MMM DD, YYYY, hh:mm, A',
      )} `;
    }

    return null;
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

  const listEmptyComponent = () => (
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
  );

  const renderLogRowView = ({item}) => (
    <InvoiceLogRowView
      data={item}
      currency={invoice.currency_type}
      onPressCard={() => {
        setSelectedLog(item);
        setShowLogModal(true);
      }}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.invoice}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={
          invoice.invoice_status === Verbs.INVOICE_CANCELLED
            ? null
            : images.vertical3Dot
        }
        rightIcon2Press={() => userActionSheet.current.show()}
      />

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          {invoice && (
            <View style={{flex: 1}}>
              <View
                style={{
                  marginHorizontal: 15,

                  marginTop: 17,
                }}>
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
                      marginTop: 5,
                    }}>
                    {`${strings.invoiceNumberText} ${invoice.invoice_id}`}
                  </Text>

                  <Text
                    style={{
                      color: colors.userPostTimeColor,
                      fontSize: 12,
                    }}>
                    {`${strings.issuedBy} ${invoice.created_by.first_name} ${invoice.created_by.last_name}`}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 21,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        fontFamily: fonts.RRegular,
                        marginRight: 5,
                      }}>
                      {from === Verbs.INVOICERECEVIED
                        ? strings.from
                        : strings.to}
                      :
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {invoice.thumbnail || thumbnail ? (
                        <Image
                          style={styles.profileContainer}
                          source={{
                            uri: invoice.thumbnail || thumbnail,
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
                        {invoice.full_name || invoice.receiver_name}
                      </Text>
                    </View>
                  </View>
                </>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    lineHeight: 24,

                    marginTop: 5,
                  }}>
                  {format(
                    strings.issuedAt,
                    moment(getJSDate(invoice.created_date)).format(
                      Verbs.DATE_FORMAT,
                    ),
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    lineHeight: 24,
                    marginTop: 5,
                  }}>
                  {format(
                    strings.dueAtNText,
                    moment(getJSDate(invoice.due_date)).format(
                      Verbs.DATE_FORMAT,
                    ),
                  )}
                </Text>
                {/* Cancelled by only be shown in invoice sent not in invoice recvied   */}

                {from === Verbs.INVOICESENT &&
                (invoice.invoice_status === Verbs.INVOICE_CANCELLED ||
                  invoice.invoice_status === Verbs.INVOICE_REJECTED) ? (
                  <View>
                    <Text
                      style={{
                        color: colors.userPostTimeColor,
                        fontSize: 13,
                        fontFamily: fonts.RRegular,
                        lineHeight: 18,
                        marginTop: 6,
                      }}>
                      {getCancelandRejectedBy()}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Progress Bar */}

              <View style={{marginTop: 25}}>
                <LinearGradient
                  colors={[colors.progressBarColor, colors.progressBarColor]}
                  style={styles.paymentProgressView}>
                  {/* this need to show conditionally when there is 0% amount paid */}

                  {invoice.status !== Verbs.paid && (
                    <Text
                      style={{
                        color: colors.neonBlue,
                        fontFamily: fonts.RBold,
                        fontSize: 12,
                        marginLeft: 5,
                        marginTop: 10,
                        height: 20,

                        position: 'absolute',
                        top: -9,
                      }}>
                      {`${(invoice.amount_paid / invoice.amount_due) * 100}%`}
                    </Text>
                  )}

                  <LinearGradient
                    colors={[
                      colors.progressBarBgColor,
                      colors.progressBarBgColor,
                    ]}
                    style={{
                      borderWidth: 1.5,
                      height: 18,
                      borderColor: colors.neonBlue,

                      borderRadius: 4,
                      width: `${
                        (invoice.amount_paid / invoice.amount_due) * 100
                      }%`,

                      // justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.neonBlue,
                        fontFamily: fonts.RBold,
                        fontSize: 12,
                        marginRight: 12,
                        marginTop: -1,
                        alignSelf: 'flex-end',
                      }}>
                      {`${
                        (invoice.amount_paid / invoice.amount_due).toFixed(2) *
                        100
                      }% `}
                    </Text>
                  </LinearGradient>
                </LinearGradient>
              </View>

              {/* status contINER */}

              <View
                style={{
                  paddingHorizontal: 15,
                  marginTop: 25,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.statusText}>{`${strings.status}`}</Text>
                  <Text
                    style={[
                      styles.amountTextStyle,
                      {
                        color: setcolor(),
                      },
                    ]}>
                    {getStatus()}
                  </Text>
                </View>
                <View style={styles.statusRows}>
                  <Text
                    style={styles.statusText}>{`${strings.invoicedtxt}`}</Text>
                  <Text
                    style={[
                      styles.amountTextStyle,
                      {color: colors.lightBlackColor},
                    ]}>
                    {`${invoice.amount_due.toFixed(2)} ${
                      invoice.currency_type
                    }`}
                  </Text>
                </View>
                <View style={styles.statusRows}>
                  <Text style={styles.statusText}>{`${strings.paidText}`}</Text>
                  <Text
                    style={[styles.amountTextStyle, {color: colors.neonBlue}]}>
                    {`${invoice.amount_paid.toFixed(2)} ${
                      invoice.currency_type
                    }`}
                  </Text>
                </View>
                {/* balance status not shown in invoice recevied ==>  if  invoice status is  cancelled and Rejected */}
                {DisplayBalanceRow()}

                {/* {from === Verbs.INVOICECANCELLED ? (
                <>
                  <View style={styles.statusRows}>
                    <Text style={styles.statusText}>{'Refunded'}</Text>
                    <Text
                      style={[
                        styles.amountTextStyle,
                        {color: colors.lightBlackColor},
                      ]}>
                      {`${invoice.total_refund.toFixed(2)} ${
                        invoice.currency_type
                      }`}
                    </Text>
                  </View>

                  <View style={styles.statusRows}>
                    <Text style={styles.statusText}>Non-Refunded</Text>
                    <Text
                      style={[
                        styles.amountTextStyle,
                        {color: colors.darkThemeColor},
                      ]}>
                      {getNonRefundAmount()}
                    </Text>
                  </View>
                </>
              ) : null} */}
              </View>

              {/* Divider */}
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
                    marginBottom: 10,
                    marginLeft: 15,
                  }}>
                  {strings.describeText}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 15,
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
              {/* Added messages */}

              {/* Divider */}
              <TCThinDivider
                marginTop={15}
                width={'94%'}
                color={colors.thinDividerColor}
                height={2}
              />

              {/* invoice.resend_data?.length > 0 */}

              {invoice.resend_data?.length > 0 && (
                <View style={{marginTop: 25, paddingHorizontal: 15}}>
                  <Text
                    style={{
                      fontFamily: fonts.RRegular,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                      lineHeight: 16,
                      marginBottom: 10,
                    }}>
                    {`${'Added Messages'} (${invoice.resend_data?.length}) `}
                  </Text>

                  <TouchableOpacity onPress={() => setShowAddedMessages(true)}>
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
                      {invoice?.resend_data[0].message}
                    </ReadMore>
                  </TouchableOpacity>

                  <Text
                    style={{
                      marginTop: 15,
                      color: colors.userPostTimeColor,
                      fontSize: 12,
                      lineHeight: 18,
                    }}>
                    {`${strings.sentBy} ${
                      invoice?.resend_data[0].resend_by.first_name
                    } ${invoice?.resend_data[0].resend_by.last_name} ${format(
                      strings.atText,
                      moment(
                        getJSDate(invoice?.resend_data[0].resend_date),
                      ).format(Verbs.DATE_FORMAT),
                    )} `}
                  </Text>
                </View>
              )}

              {/* Divider */}
              <TCThinDivider
                marginTop={15}
                width={'94%'}
                color={colors.thinDividerColor}
                height={2}
              />

              {/* Added Messages Modal */}

              <AddedMessagesModal
                isVisible={showAddedMessages}
                closeList={() => setShowAddedMessages(false)}
                Messages={invoice.resend_data}
              />

              {/* log view */}
              <View style={styles.logViewContainer}>
                <Text
                  style={{
                    fontFamily: fonts.RBold,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                    lineHeight: 24,
                    textTransform: 'uppercase',
                  }}>
                  {strings.log}
                </Text>
                {from === Verbs.INVOICESENT && (
                  <Pressable
                    onPress={() => logManuallyActionSheet.current.show()}>
                    <Text
                      style={{
                        fontFamily: fonts.RRegular,
                        fontSize: 14,
                        lineHeight: 24,
                        color: colors.lightBlackColor,
                        textDecorationLine: 'underline',
                      }}>
                      {strings.logManually}
                    </Text>
                  </Pressable>
                )}
              </View>
              <View style={{marginTop: 5}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={invoice.logs}
                  renderItem={renderLogRowView}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={listEmptyComponent}
                />
              </View>
              {/* Log Manually */}
              <LogModal
                isVisible={showLogManually}
                invoice={invoice}
                closeList={() => setShowLogManually(false)}
                mode={logModalType}
              />

              {/* Log  */}

              <LogDetailModal
                isVisible={showLogModal}
                invoice={invoice}
                log={selectedLog}
                closeList={() => setShowLogModal(false)}
              />
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
                      Alert.alert(
                        Platform.OS === 'android'
                          ? ''
                          : strings.rejectInvoicetext,
                        Platform.OS === 'android'
                          ? strings.rejectInvoicetext
                          : '',
                        [
                          {
                            text: strings.back,
                          },
                          {
                            text: strings.rejectText,
                            onPress: () => onRejectInvoice(),
                          },
                        ],
                      );
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

        <ActionSheet
          ref={userActionSheet}
          options={[
            strings.refudviaStripe,
            strings.resendInvoiceText,

            strings.cancelInvoiceText,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              Alert.alert(
                Platform.OS === 'android' ? '' : strings.invoiceRefundText,
                Platform.OS === 'android' ? strings.invoiceRefundText : '',
                [
                  {
                    text: strings.OkText,
                  },
                ],
              );
            }
            if (index === 1) {
              setShowResendModal(true);
            }

            if (index === 2) {
              Alert.alert(
                Platform.OS === 'android' ? '' : strings.cancelSingleInvoice,
                Platform.OS === 'android' ? strings.cancelSingleInvoice : '',
                [
                  {
                    text: strings.no,
                  },
                  {
                    text: strings.cancel,
                    onPress: () => {
                      onCancelInvoice();
                    },
                  },
                ],
              );
            }
          }}
        />

        <ActionSheet
          ref={logManuallyActionSheet}
          options={[strings.logaPayment, strings.logaRefund, strings.cancel]}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              if (invoice.amount_remaining === 0) {
                Alert.alert(
                  strings.alertmessagetitle,
                  strings.nopaymentrequired,
                );
                return;
              }
              setLogModalType(LogType.Payment);
              setShowLogManually(true);
            }
            if (index === 1) {
              if (invoice.amount_paid === 0) {
                Alert.alert(
                  strings.alertmessagetitle,
                  strings.norefundrequired,
                );
                return;
              }
              setLogModalType(LogType.Refund);
              setShowLogManually(true);
            }
          }}
        />
        {/* Add recepints Modal */}
        <AddRecipientsInBatchModal
          visible={showResendModal}
          invoice={invoice}
          invoiceAction={InvoiceActionType.Resend}
          closeModal={() => setShowResendModal(false)}
          title={strings.resendInvoiceText}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.darkThemeColor,
    // marginTop: 10,
    alignItems: 'flex-start',
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
  logViewContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
