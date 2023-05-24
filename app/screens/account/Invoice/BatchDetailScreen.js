/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';

import {format} from 'react-string-format';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
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
import {getBatchInvoices} from '../../../api/Invoice';
import InvoiceProgressBar from './InvoiceProgressBar';

export default function BatchDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const batchActionsheet = useRef();
  const [showResendInvoicesModal, setShowResendInvoicesModal] = useState();
  const [showAddRecipientsModal, setShowAddRecipientsModal] = useState();
  const [showCancelInvoices, setShowCancelInvoices] = useState();
  const [batchData, setBatchData] = useState(route.params.batchData);
  const currency = route.params.batchData.invoices[0].currency_type;
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState();
  const [tabNumber, setTabNumber] = useState(0);
  const [tabs, setTabs] = useState([
    strings.all,
    strings.paidText,
    strings.openText,
  ]);
  const [isApiCalled, setIsApiCalled] = useState(false);

  const ActionsheetPress = {
    ResendInvoice: 0,
    Addrecipients: 1,
    CancelInvoice: 2,
  };

  const isFocused = useIsFocused();

  const getStatus = () => {
    if (batchData.invoice_total === batchData.invoice_paid_total) {
      return strings.allpaid;
    }
    return `${strings.openText}`;
  };

  useEffect(() => {
    if (isFocused || isApiCalled) {
      getBatchdata(route.params.batchId, authContext);
    }
  }, [isFocused, isApiCalled]);

  useEffect(() => {
    updateTabs();
  }, [batchData]);

  const updateTabs = () => {
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
  };

  const getBatchdata = (batchid, auth) => {
    setIsApiCalled(false);
    setLoading(true);
    getBatchInvoices(batchid, auth)
      .then((response) => {
        setLoading(false);
        setBatchData(response.payload);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

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
    [tabNumber, batchData],
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
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.batch}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => batchActionsheet.current.show()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}>
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
                {batchData.invoice_title}
              </Text>

              {/* Recepints */}
              <View
                style={{
                  marginTop: 20,
                }}>
                <Text>
                  <Text style={styles.titleTextStyle}>
                    {batchData.invoices?.length}
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

              <Text style={styles.issuedBystyle}>{`${strings.issuedBy} ${
                authContext.entity.obj.full_name ??
                authContext.entity.obj.group_name
              }`}</Text>

              {/* Issues At */}

              <Text style={styles.issuedAt}>
                {format(
                  strings.issuedAt,
                  moment(getJSDate(batchData.created_date)).format(
                    Verbs.DATE_FORMAT,
                  ),
                )}
              </Text>
              <Text style={styles.dueatStyle}>
                {format(
                  strings.dueAtNText,
                  moment(getJSDate(batchData.due_date)).format(
                    Verbs.DATE_FORMAT,
                  ),
                )}
              </Text>

              {/* Amount invoives / Copy */}
              <View style={styles.amountRowStyle}>
                <Text style={styles.dueatStyle}>
                  {strings.amountInvoicedCopy}
                </Text>
                <Text style={[styles.dueatStyle, {fontFamily: fonts.RMedium}]}>
                  {` ${batchData.invoice_open_total.toFixed(2)} ${currency}`}
                </Text>
              </View>
              {/* Total Amount invoices section */}
              <View style={styles.amountRowStyle}>
                <Text style={styles.dueatStyle}>
                  {strings.totalAmountInvoice}
                </Text>
                <Text style={[styles.dueatStyle, {fontFamily: fonts.RMedium}]}>
                  {` ${batchData.invoice_total.toFixed(2)} ${currency}`}
                </Text>
              </View>

              {/* Progress Bar */}
              <InvoiceProgressBar
                paidamount={batchData.invoice_paid_total}
                dueamount={batchData.invoice_total}
                Containerstyles={{
                  marginTop: 15,
                  marginBottom: 20,
                }}
                barStyle={{marginHorizontal: 0}}
              />

              {/* status container */}

              <View style={{marginBottom: 15}}>
                <View style={[styles.statusRows, {marginTop: 0}]}>
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
                  <Text style={styles.statusText}>
                    {strings.toalnumberOfInvoices}
                  </Text>
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
                  <Text style={styles.statusText}>{strings.openText}</Text>
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
          </View>

          <ActionSheet
            ref={batchActionsheet}
            options={[
              strings.resendInvoiceText,
              strings.addRecipientToBatch,
              strings.cancelInvoicesInBatch,
              strings.cancel,
            ]}
            cancelButtonIndex={3}
            destructiveButtonIndex={2}
            onPress={(index) => {
              if (index === ActionsheetPress.ResendInvoice) {
                setShowResendInvoicesModal(true);
              }
              if (index === ActionsheetPress.Addrecipients) {
                setShowAddRecipientsModal(true);
              }
              if (index === ActionsheetPress.CancelInvoice) {
                setShowCancelInvoices(true);
              }
            }}
          />

          {/* cancel Invoice Modal */}
          <CancelInvoivebybatchModal
            visible={showCancelInvoices}
            batchData={batchData}
            onCancelInvoice={() => {
              setTimeout(() => {
                setIsApiCalled(true);
              }, 10);
              setShowCancelInvoices(false);
            }}
            closeModal={() => setShowCancelInvoices(false)}
          />

          {/* Resend Bybatch Modal */}
          <AddRecipientsInBatchModal
            visible={showResendInvoicesModal}
            batchData={batchData}
            title={strings.resendInvoiceText}
            invoiceAction={InvoiceActionType.ResendBatch}
            onDonePressForResend={() => {
              setTimeout(() => {
                setIsApiCalled(true);
              }, 10);
              setShowResendInvoicesModal(false);
            }}
            closeModal={() => setShowResendInvoicesModal(false)}
          />

          {/* Add recepints Modal */}
          <AddRecipientsInBatchModal
            visible={showAddRecipientsModal}
            batchData={batchData}
            title={strings.addRecipientText}
            invoiceAction={InvoiceActionType.AddRecipient}
            onDonePressForAddRecipients={() => {
              setShowAddRecipientsModal(false);
              setTimeout(() => {
                setIsApiCalled(true);
              }, 10);
            }}
            closeModal={() => setShowAddRecipientsModal(false)}
          />
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
            bounces={false}
            tabStyle={{
              marginTop: -15,
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: colors.whiteColor,
              flex: 1,
            }}
            ListEmptyComponent={() => (
              <Text
                style={{
                  marginTop: 50,
                  alignSelf: 'center',
                  color: colors.userPostTimeColor,
                  fontSize: 16,
                  fontFamily: fonts.RMedium,
                  lineHeight: 24,
                }}>
                {strings.noinvoice}
              </Text>
            )}
            data={
              (tabNumber === 0 && batchListByFilter(Verbs.allStatus)) ||
              (tabNumber === 1 && batchListByFilter(Verbs.paid)) ||
              (tabNumber === 2 && batchListByFilter(Verbs.open))
            }
            renderItem={renderRecipientView}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 30,
  },
  issuedBystyle: {
    color: colors.userPostTimeColor,
    fontSize: 13,
    fontFamily: fonts.RRegular,
    lineHeight: 18,
    marginBottom: 15,
  },
  issuedAt: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    marginBottom: 5,
  },
  dueatStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
  },

  amountRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
