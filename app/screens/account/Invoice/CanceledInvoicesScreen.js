/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {useState, useContext, useEffect, useCallback, memo} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getCancelledInvoice} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import CancelledInvoiceView from '../../../components/invoice/CancelledInvoiceView';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import {MonthData} from '../../../Constants/GeneralConstants';
import BottomSheet from '../../../components/modals/BottomSheet';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import {getTCDate, groupBy} from '../../../utils';
import DateFilterModal from './DatefilterModal';
import ScreenHeader from '../../../components/ScreenHeader';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import CustomScrollTabs from '../../../components/CustomScrollTabs';

function CanceledInvoicesScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const [from] = useState(route.params.from);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setDate(new Date().getDate() - 90)),
  );

  const defaultRecords = [
    {
      currency_type: 'USD',
      invoice_total: 0,
      invoice_paid_total: 0,
      invoice_open_total: 0,
      invoices: [],
    },
  ];
  const [data, setData] = useState([]);
  const [endDateTime, setEndDateTime] = useState();
  const [showDateModal, setShowDateModal] = useState(false);
  const [tabs, setTabs] = useState([
    strings.allNInvoice,
    strings.canceledNInvoice,
    strings.rejectedNInvoice,
  ]);
  const [currentRecordSet, setCurrentRecordSet] = useState(defaultRecords[0]);
  const [tabNumber, setTabNumber] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [visibleCurrencySheet, setVisibleCurrencySheet] = useState();

  const tabChangePress = useCallback((changeTab) => {
    setTabNumber(changeTab);
  }, []);

  const getDates = (optionsState) => {
    const startDate = new Date();

    if (optionsState === strings.past90DaysText) {
      startDate.setDate(startDate.getDate() - 90);
    } else if (optionsState === strings.past30DaysText) {
      startDate.setDate(startDate.getDate() - 30);
    } else if (optionsState === strings.past180Days) {
      startDate.setDate(startDate.getDate() - 180);
    } else if (optionsState === strings.past1year) {
      startDate.setDate(startDate.getDate() - 360);
    }

    setStartDateTime(startDate);
  };

  const renderCancelledView = ({item}) => (
    <CancelledInvoiceView
      invoice={item}
      from={from}
      onPressCard={() =>
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
        })
      }
    />
  );

  const getCancelInvoices = () => {
    const TcstartDate = getTCDate(startDateTime);

    setloading(true);
    let type = 'receiver';
    if (from === Verbs.INVOICESENT) {
      type = 'sender';
    }
    getCancelledInvoice(type, authContext, TcstartDate, endDateTime)
      .then((response) => {
        setloading(false);

        let dataObj = defaultRecords;
        let totalLength = 0;
        if (response.payload.length > 0) {
          totalLength = response.payload.length;
          const result = groupBy(response.payload, 'currency_type');
          dataObj = [];
          // eslint-disable-next-line guard-for-in
          for (const currencyKey in result) {
            const receiverInvoices = {
              currency_type: currencyKey,
              invoice_paid_total: 0.0,
              invoice_open_total: 0.0,
              invoice_total: 0.0,
              invoices: result[currencyKey],
            };

            receiverInvoices.invoices.map((e) => {
              receiverInvoices.invoice_paid_total += e.amount_paid;
              receiverInvoices.invoice_open_total += e.amount_remaining;
              receiverInvoices.invoice_total += e.amount_due;
            });
            dataObj.push(receiverInvoices);
          }
          setData(dataObj);
        }
        setTotalInvoice(totalLength);

        if (selectedCurrency) {
          if (selectedCurrency !== strings.all) {
            const selectedRecord = dataObj.find(
              (obj) => obj.currency_type === selectedCurrency,
            );
            if (selectedRecord) {
              setCurrentRecordSet(selectedRecord);
            } else {
              setCurrentRecordSet(dataObj[0]);
              setSelectedCurrency(dataObj[0].currency_type);
              setTabNumber(strings.all);
            }
          }
        } else {
          setCurrentRecordSet(dataObj[0]);
          setSelectedCurrency(dataObj[0].currency_type);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  useEffect(() => {
    if (isFocused) {
      getCancelInvoices();
    }
  }, [authContext, isFocused, selectedMonth]);

  useEffect(() => {
    const allTitle = format(
      strings.allNInvoice,
      invoiceListByFilter(Verbs.allStatus).length,
    );
    const canceledTitle = format(
      strings.canceledNInvoice,
      invoiceListByFilter(Verbs.INVOICE_CANCELLED).length,
    );
    const rejectedTitle = format(
      strings.rejectedNInvoice,
      invoiceListByFilter(Verbs.INVOICE_REJECTED).length,
    );

    setTabs([allTitle, canceledTitle, rejectedTitle]);
  }, [currentRecordSet]);

  const invoiceListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return currentRecordSet.invoices;
      }
      if (status === Verbs.INVOICE_CANCELLED) {
        return currentRecordSet.invoices.filter(
          (obj) => obj.invoice_status === Verbs.INVOICE_CANCELLED,
        );
      }
      if (status === Verbs.INVOICE_REJECTED) {
        return currentRecordSet.invoices.filter(
          (obj) => obj.invoice_status === Verbs.INVOICE_REJECTED,
        );
      }
    },
    [currentRecordSet],
  );

  // eslint-disable-next-line no-shadow

  const handleTabSelection = (index) => {
    tabChangePress(index);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={
          from === Verbs.INVOICERECEVIED
            ? strings.invoiceCancelledandRejected
            : strings.invoicesCancelled
        }
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,
          borderBottomWidth: 1,
          paddingBottom: 13,
        }}
      />

      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        {/* Month Bar */}
        <View style={{backgroundColor: colors.lightGrayBackground}}>
          <Pressable
            onPress={() => setVisibleMonthModal(true)}
            style={{
              backgroundColor: colors.lightGrayBackground,

              paddingHorizontal: 15,
            }}>
            <View
              style={{
                marginTop: 25,
                width: '100%',
                height: 40,
                backgroundColor: colors.whiteColor,
                alignSelf: 'center',
                borderRadius: 25,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  lineHeight: 36,
                  paddingHorizontal: 15,
                }}>
                {selectedMonth}
              </Text>
              <Image
                source={images.invoiceLightDownArrow}
                style={{
                  height: 10,
                  width: 16,
                  marginRight: 15,
                  tintColor: colors.userPostTimeColor,
                  alignSelf: 'center',
                }}
              />
            </View>
          </Pressable>

          <View
            style={{
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: colors.lightGrayBackground,
              marginTop: 20,
              marginBottom: selectedCurrency === strings.all ? 20 : 15,
            }}>
            <TouchableOpacity
              onPress={() => setVisibleCurrencySheet(true)}
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: fonts.RMedium,
                  fontSize: 20,
                  color: colors.lightBlackColor,
                }}>
                {selectedCurrency === strings.all
                  ? strings.allInvoiceText
                  : `${strings.invoicesIn}`}
                {selectedCurrency !== strings.all && (
                  <Text
                    style={{
                      fontFamily: fonts.RBold,
                    }}>
                    {' '}
                    {`${currentRecordSet.currency_type}`}
                  </Text>
                )}
              </Text>
              <Image
                source={images.invoiceDarkDownArrow}
                style={{
                  width: 14,
                  height: 26,
                  resizeMode: 'contain',
                  marginLeft: 5,
                  alignItems: 'center',
                  lineHeight: 30,
                  tintColor: colors.lightBlackColor,
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RMedium,
                lineHeight: 30,
                color: colors.lightBlackColor,
              }}>
              {selectedCurrency === strings.all
                ? totalInvoice
                : currentRecordSet.invoices.length}
            </Text>
          </View>
        </View>

        <BottomSheet
          isVisible={visiblemonthModal}
          closeModal={() => setVisibleMonthModal(false)}
          optionList={MonthData}
          onSelect={(option) => {
            if (option === strings.pickaDate) {
              setVisibleMonthModal(false);
              setShowDateModal(true);

              return;
            }
            setEndDateTime();
            setSelectedMonth(option);
            setVisibleMonthModal(false);
            getDates(option);
          }}
        />

        {selectedCurrency === strings.all ? (
          <>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.whiteColor,
              }}>
              <FlatList
                extraData={data}
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={styles.dividerLine} />
                )}
                renderItem={({item}) => (
                  <InvoiceAmount
                    style={{
                      backgroundColor: colors.whiteColor,
                      marginTop: 15,
                    }}
                    currency={item.currency_type}
                    totalInvoices={item.invoices.length}
                    totalAmount={item.invoice_total}
                    paidAmount={item.invoice_paid_total}
                    openAmount={item.invoice_open_total}
                    allCurrencySelected={selectedCurrency === strings.all}
                  />
                )}
              />
            </View>
          </>
        ) : (
          <View style={{flex: 1}}>
            {from === Verbs.INVOICERECEVIED ? (
              <View style={{backgroundColor: colors.whiteColor}}>
                <CustomScrollTabs
                  tabsItem={tabs}
                  setCurrentTab={handleTabSelection}
                  currentTab={tabNumber}
                />

                {/* <ScrollableTabs tabs={tabs} onSelectTab={handleTabSelection} /> */}
              </View>
            ) : null}
            <FlatList
              data={
                (tabNumber === 0 && invoiceListByFilter(Verbs.allStatus)) ||
                (tabNumber === 1 &&
                  invoiceListByFilter(Verbs.INVOICE_CANCELLED)) ||
                (tabNumber === 2 && invoiceListByFilter(Verbs.INVOICE_REJECTED))
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    marginTop: 180,
                    alignSelf: 'center',
                    color: colors.userPostTimeColor,
                    fontSize: 16,
                    fontFamily: fonts.RMedium,
                    lineHeight: 24,
                  }}>
                  {strings.noinvoice}
                </Text>
              )}
              renderItem={renderCancelledView}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        <DateFilterModal
          isVisible={showDateModal}
          closeList={() => setShowDateModal(false)}
          onApplyPress={(startDate, endDate) => {
            setShowDateModal(false);
            setStartDateTime(startDate);
            setEndDateTime(getTCDate(endDate));

            setSelectedMonth(
              `${moment(startDate).format(Verbs.DATE_MDY_FORMAT)} - ${moment(
                endDate,
              ).format(Verbs.DATE_MDY_FORMAT)}`,
            );
          }}
        />

        <BottomSheet
          isVisible={visibleCurrencySheet}
          optionList={[strings.all, ...data.map((item) => item.currency_type)]}
          closeModal={() => setVisibleCurrencySheet(false)}
          onSelect={(option) => {
            if (option === strings.all) {
              setSelectedCurrency(option);
              setVisibleCurrencySheet(false);
              return;
            }

            setVisibleCurrencySheet(false);

            const selectedRecord = data.find(
              (obj) => obj.currency_type === option,
            );

            if (selectedRecord) {
              setSelectedCurrency(option);
              setCurrentRecordSet(selectedRecord);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default memo(CanceledInvoicesScreen);
