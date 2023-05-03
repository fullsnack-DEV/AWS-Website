/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {View, StyleSheet, Text, FlatList, SafeAreaView} from 'react-native';

import {format} from 'react-string-format';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getJSDate} from '../../../utils';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import CancelInvoivebybatchModal from './CancelInvoivebybatchModal';
import AddRecipientsInBatchModal from './AddRecipientsInBatchModal';
import {InvoiceActionType} from '../../../Constants/GeneralConstants';

import ScreenHeader from '../../../components/ScreenHeader';

export default function BatchDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const [batchData] = useState(route.params.batchData);
  const [loading] = useState(false);
  const [currency_type] = useState(route.params.currency_type);
  const batchActionsheet = useRef();
  const [showResendInvoicesModal, setShowResendInvoicesModal] = useState();
  const [showAddRecipientsModal, setShowAddRecipientsModal] = useState();
  const [showCancelInvoices, setShowCancelInvoices] = useState();

  const authContext = useContext(AuthContext);

  const [tabNumber, setTabNumber] = useState(0);
  const [tabs, setTabs] = useState([
    strings.all,
    strings.paidText,
    strings.openText,
  ]);

  const getStatus = () => {
    if (batchData.invoice_total === batchData.invoice_paid_total) {
      return strings.allpaid;
    }
    return `${strings.openText}`;
  };

  useEffect(() => {
    const allTitle = format(
      strings.allNInvoice,
      batchListByFilter(Verbs.allStatus).length,
    );

    const paidTitle = format(
      strings.paidNInvoice,
      batchListByFilter(Verbs.paid).length,
    );

    const openTitle = format(
      strings.openNInvoice,
      batchListByFilter(Verbs.open).length,
    );

    setTabs([allTitle, paidTitle, openTitle]);
  }, [batchData]);

  const renderRecipientView = ({item}) => (
    <MemberInvoiceView
      invoice={item}
      onPressCard={() =>
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
        })
      }
    />
  );

  const batchListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return batchData.invoices;
      }
      if (status === Verbs.paid) {
        return batchData.invoices.filter(
          (obj) => obj.invoice_status === Verbs.paid,
        );
      }
      if (status === Verbs.open) {
        return batchData.invoices.filter(
          (obj) =>
            obj.invoice_status === Verbs.UNPAID ||
            obj.invoice_status === Verbs.PARTIALLY_PAID ||
            obj.invoice_status === Verbs.INVOICE_REJECTED,
        );
      }
    },
    [batchData],
  );

  const getPaidInvoices = () => {
    let PaidInvoices = 0;

    batchData.invoices.map((item) => {
      if (item.invoice_status !== Verbs.UNPAID) {
        PaidInvoices += PaidInvoices;
      }
    });

    return PaidInvoices;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.batch}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => batchActionsheet.current.show()}
      />

      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View
          style={{
            backgroundColor: colors.lightGrayBackground,
            flex: 1,
          }}>
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 15,
            }}>
            {/* invoivw title */}

            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontFamily: fonts.RBold,
              }}>
              {batchData.invoice_description}
            </Text>

            {/* Recepints */}
            <View
              style={{
                marginTop: 20,
              }}>
              <Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    lineHeight: 30,
                  }}>
                  {batchData.invoices.length}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 30,
                  }}>
                  {' '}
                  {strings.recipients}
                </Text>
              </Text>
            </View>

            <Text
              style={{
                color: colors.userPostTimeColor,
                fontSize: 13,
                fontFamily: fonts.RRegular,
                lineHeight: 18,
                marginBottom: 15,
              }}>{`${strings.issuedBy} ${
              authContext.entity.obj.full_name ??
              authContext.entity.obj.group_name
            }`}</Text>

            {/* Issues At */}

            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
                marginBottom: 5,
              }}>
              {format(
                strings.issuedAt,
                moment(getJSDate(batchData.created_date)).format(
                  Verbs.DATE_FORMAT,
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
                moment(getJSDate(batchData.due_date)).format(Verbs.DATE_FORMAT),
              )}
            </Text>

            {/* Amount invoives / Copy */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  lineHeight: 24,
                }}>
                {strings.amountInvoicedCopy}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RMedium,
                  lineHeight: 24,
                }}>
                {` ${batchData.invoice_open_total} ${currency_type}`}
              </Text>
            </View>
            {/* Total Amount invoices section */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  lineHeight: 24,
                }}>
                {strings.totalAmountInvoice}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RMedium,
                  lineHeight: 24,
                }}>
                {` ${batchData.invoice_total} ${currency_type}`}
              </Text>
            </View>

            {/* Progress Bar */}

            <LinearGradient
              colors={[colors.progressBarColor, colors.progressBarColor]}
              style={styles.paymentProgressView}>
              {/* this need to show conditionally when there is 0% amount paid */}

              {batchData.amount_due === batchData.amount_remaining && (
                <Text
                  style={{
                    color: colors.neonBlue,
                    fontFamily: fonts.RBold,
                    fontSize: 12,
                    marginLeft: 10,
                    height: 18,

                    alignSelf: 'flex-start',
                  }}>
                  {`${
                    (batchData.invoice_paid_total /
                      batchData.invoice_open_total) *
                    100
                  }%`}
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
                  width: `${
                    (batchData.invoice_paid_total /
                      batchData.invoice_open_total) *
                    100
                  }%`,
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
                  {`${
                    (batchData.invoice_paid_total /
                      batchData.invoice_open_total) *
                    100
                  }%`}
                </Text>
              </LinearGradient>
            </LinearGradient>

            {/* status container */}

            <View style={{marginBottom: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.statusText}>{strings.status}</Text>
                <Text
                  style={[
                    styles.amountTextStyle,
                    {
                      color:
                        batchData.amount_due === batchData.amount_remaining
                          ? colors.darkThemeColor
                          : colors.gameDetailColor,
                    },
                  ]}>
                  {getStatus()}
                </Text>
              </View>
              <View style={styles.statusRows}>
                <Text style={styles.statusText}>Total Number of Invoices</Text>
                <Text
                  style={[
                    styles.amountTextStyle,
                    {color: colors.lightBlackColor},
                  ]}>
                  {`${batchData.invoices.length}`}
                </Text>
              </View>
              <View style={styles.statusRows}>
                <Text style={styles.statusText}>{strings.paidText} </Text>
                <Text
                  style={[styles.amountTextStyle, {color: colors.neonBlue}]}>
                  {getPaidInvoices()}
                  {/* {`${batchData.invoice_paid_total}`} */}
                </Text>
              </View>
              <View style={styles.statusRows}>
                <Text style={styles.statusText}>Open</Text>
                <Text
                  style={[
                    styles.amountTextStyle,
                    {color: colors.darkThemeColor},
                  ]}>
                  {`${batchData.invoices.length}` - `${getPaidInvoices()}   `}
                </Text>
              </View>
            </View>
          </View>

          <View style={{backgroundColor: colors.whiteColor}}>
            <TCScrollableProfileTabs
              tabItem={tabs}
              tabVerticalScroll={false}
              onChangeTab={(Tab) => setTabNumber(Tab.i)}
              currentTab={tabNumber}
              customStyle={{
                marginTop: 15,
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'red',
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: colors.whiteColor,
                flex: 1,
              }}
              data={
                (tabNumber === 0 && batchListByFilter(Verbs.allStatus)) ||
                (tabNumber === 1 && batchListByFilter(Verbs.paid)) ||
                (tabNumber === 2 && batchListByFilter(Verbs.open))
              }
              renderItem={renderRecipientView}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <ActionSheet
          ref={batchActionsheet}
          options={[
            strings.resendInvoiceText,
            strings.addRecipientText,
            strings.cancelInvoicesInBatch,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              setShowResendInvoicesModal(true);
            }
            if (index === 1) {
              setShowAddRecipientsModal(true);
            }
            if (index === 2) {
              setShowCancelInvoices(true);
            }
          }}
        />

        {/* cancel Invoice Modal */}
        <CancelInvoivebybatchModal
          visible={showCancelInvoices}
          batchData={batchData}
          closeModal={() => setShowCancelInvoices(false)}
        />

        {/* Resend Bybatch Modal */}
        <AddRecipientsInBatchModal
          visible={showResendInvoicesModal}
          batchData={batchData}
          title={strings.resendInvoiceText}
          invoiceAction={InvoiceActionType.ResendBatch}
          closeModal={() => setShowResendInvoicesModal(false)}
        />

        {/* Add recepints Modal */}
        <AddRecipientsInBatchModal
          visible={showAddRecipientsModal}
          batchData={batchData}
          title={strings.addRecipientText}
          invoiceAction={InvoiceActionType.AddRecipient}
          closeModal={() => setShowAddRecipientsModal(false)}
        />
      </View>
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

    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.darkThemeColor,
    marginTop: 15,
    marginBottom: 25,
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
  statusRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
