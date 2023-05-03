/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import ActionSheet from 'react-native-actionsheet';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getRecieverInvoices} from '../../../api/Invoice';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import InvoiceReceivedCellView from '../../../components/invoice/InvoiceReceivedCellView';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {getTCDate, groupBy} from '../../../utils';
import colors from '../../../Constants/Colors';

import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import images from '../../../Constants/ImagePath';
import BottomSheet from '../../../components/modals/BottomSheet';
import fonts from '../../../Constants/Fonts';
import {MonthData} from '../../../Constants/GeneralConstants';
import ScreenHeader from '../../../components/ScreenHeader';

export default function InvoiceReceivedScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [tabNumber, setTabNumber] = useState(0);
  const [currencyData, setCurrencyData] = useState([
    {currency: 'USD', invoices: 0},
  ]);
  const [tabs, setTabs] = useState([
    strings.allNInvoice,
    strings.paidNInvoice,
    strings.openNInvoice,
  ]);
  const [currentRecordSet, setCurrentRecordSet] = useState({
    currency_type: 'USD',
    invoice_total: 0,
    invoice_paid_total: 0,
    invoice_open_total: 0,
    invoices: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const actionSheet = useRef();
  const [visibleCurrencySheet, setVisibleCurrencySheet] = useState();

  const [totalInvoices, setTotalInvoices] = useState(0);
  const [allCurrencies, setAllCurrencies] = useState();
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setDate(new Date().getDate() - 90)),
  );
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [currencies, setCurrencies] = useState([currencyData[0].currency]);
  const [currency, setCurrency] = useState(currencyData[0].currency);
  const [currencyInvoiceAmount, setCurrencyInvoiceAmount] = useState();

  const tabChangePress = useCallback((changeTab) => {
    setTabNumber(changeTab.i);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
      headerTitle: () => (
        <View>
          <Text style={styles.navTitle}>{strings.invoicesreceived}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity onPress={() => actionSheet.current.show()}>
            <Image
              source={images.vertical3Dot}
              style={styles.townsCupthreeDotIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const getReceviedInvoices = () => {
    const TcstartDate = getTCDate(startDateTime);
    const TCendDate = getTCDate(endDateTime);
    setloading(true);
    getRecieverInvoices(authContext, TcstartDate, TCendDate)
      .then((response) => {
        setloading(false);
        const dataObj = [];
        const objects = [];

        if (response.payload.length > 0) {
          const result = groupBy(response.payload, 'currency_type');

          const totalLength = Object.values(result).reduce(
            (acc, curr) => acc + curr.length,
            0,
          );

          setTotalInvoices(totalLength);

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
            objects.push({
              currency: currencyKey,
              invoices: receiverInvoices.invoices.length,
            });
            dataObj.push(receiverInvoices);
          }
          setData(dataObj);
          setCurrencies([strings.all, ...objects.map((item) => item.currency)]);

          setCurrencyData(objects);

          setCurrentRecordSet(dataObj[0]);
          setCurrency(dataObj[0].currency_type);

          setCurrencyInvoiceAmount(objects[0].invoices);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
    setloading(true);
  };

  const getDates = (optionsState) => {
    const startDate = new Date();
    const endDate = new Date();

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
    setEndDateTime(endDate);
  };

  useEffect(() => {
    if (isFocused) {
      getReceviedInvoices();
    }
  }, [authContext, isFocused, selectedMonth]);

  useEffect(() => {
    const allTitle = format(
      strings.allNInvoice,
      memberListByFilter(Verbs.allStatus).length,
    );
    const paidTitle = format(
      strings.paidNInvoice,
      memberListByFilter(Verbs.paid).length,
    );
    const openTitle = format(
      strings.openNInvoice,
      memberListByFilter(Verbs.open).length,
    );
    setTabs([allTitle, paidTitle, openTitle]);
  }, [currentRecordSet]);

  const onCurrencyPress = (item) => {
    const record = data.find((obj) => obj.currency_type === item);
    if (record) {
      setCurrentRecordSet(record);
    }
  };

  const renderRecipientView = ({item}) => (
    <InvoiceReceivedCellView
      invoice={item}
      onPressCard={() => {
        navigation.navigate('InvoiceDetailScreen', {
          from: Verbs.INVOICERECEVIED,
          invoice: item,
        });
      }}
    />
  );

  const memberListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return currentRecordSet.invoices;
      }
      if (status === Verbs.paid) {
        return currentRecordSet.invoices.filter(
          (obj) => obj.invoice_status === Verbs.paid,
        );
      }
      if (status === Verbs.open) {
        return currentRecordSet.invoices.filter(
          (obj) =>
            obj.invoice_status === Verbs.UNPAID ||
            obj.invoice_status === Verbs.PARTIALLY_PAID,
        );
      }
    },
    [currentRecordSet],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.invoicesreceived}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => actionSheet.current.show()}
      />

      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />

        <BottomSheet
          isVisible={visiblemonthModal}
          closeModal={() => setVisibleMonthModal(false)}
          optionList={MonthData}
          onSelect={(option) => {
            setSelectedMonth(option);
            setVisibleMonthModal(false);
            setCurrencyInvoiceAmount(totalInvoices);
            getDates(option);
          }}
        />

        <Pressable
          onPress={() => setVisibleMonthModal(true)}
          style={{
            backgroundColor: colors.lightGrayBackground,

            paddingHorizontal: 15,
          }}>
          <View
            style={{
              marginTop: 15,
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
                color: colors.lightBlackColor,
              }}>
              {selectedMonth}
            </Text>
            <Image
              source={images.dropDownArrow2}
              style={{
                height: 13,
                width: 13,
                marginRight: 15,
                tintColor: colors.userPostTimeColor,
                alignSelf: 'center',
              }}
            />
          </View>
        </Pressable>

        {/* invoices DropDown */}

        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.lightGrayBackground,
            marginTop: 20,
            marginBottom: allCurrencies ? 20 : 0,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (currencyData.length > 1) {
                setVisibleCurrencySheet(true);
              }
            }}
            style={{
              flexDirection: 'row',
            }}>
            {currencyData.length === 1 ? (
              <Text
                style={{
                  fontFamily: fonts.RMedium,
                  fontSize: 20,
                  color: colors.lightBlackColor,
                }}>
                {strings.invoicesTitle}
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 20,
                    color: colors.lightBlackColor,
                  }}>
                  {allCurrencies
                    ? strings.allInvoiceText
                    : `${strings.invoicesIn} ${currency}`}
                </Text>

                <Image
                  source={images.dropDownArrow}
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
              </>
            )}
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.RMedium,
              lineHeight: 30,
              color: colors.lightBlackColor,
            }}>
            {currencyInvoiceAmount}
          </Text>
        </View>

        {allCurrencies ? (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.whiteColor,
            }}>
            <FlatList
              extraData={data}
              data={data}
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: colors.whiteColor}}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
              renderItem={({item}) => (
                <InvoiceAmount
                  style={{
                    backgroundColor: colors.whiteColor,
                    marginTop: 15,
                  }}
                  currency={item.currency_type}
                  currencyInvoiceAmount={item.invoices.length}
                  totalAmount={item.invoice_total}
                  paidAmount={item.invoice_paid_total}
                  openAmount={item.invoice_open_total}
                  allCurrencies={allCurrencies}
                />
              )}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <InvoiceAmount
              currency={currentRecordSet.currency_type}
              totalAmount={currentRecordSet.invoice_total}
              paidAmount={currentRecordSet.invoice_paid_total}
              openAmount={currentRecordSet.invoice_open_total}
            />

            <View style={{backgroundColor: colors.whiteColor}}>
              <TCScrollableProfileTabs
                tabItem={tabs}
                tabVerticalScroll={false}
                onChangeTab={tabChangePress}
                currentTab={tabNumber}
                customStyle={{
                  paddingVertical: 0,
                }}
                bounces={false}
                tabStyle={{
                  marginTop: -4,
                }}
              />
            </View>
            <FlatList
              data={
                (tabNumber === 0 && memberListByFilter(Verbs.allStatus)) ||
                (tabNumber === 1 && memberListByFilter(Verbs.paid)) ||
                (tabNumber === 2 && memberListByFilter(Verbs.open))
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
              renderItem={renderRecipientView}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

        {/* BottomSheet */}

        <BottomSheet
          isVisible={visibleCurrencySheet}
          optionList={currencies}
          closeModal={() => setVisibleCurrencySheet(false)}
          onSelect={(option) => {
            if (option === strings.all) {
              setAllCurrencies(true);
              setCurrencyInvoiceAmount(totalInvoices);
              setVisibleCurrencySheet(false);
              return;
            }

            setVisibleCurrencySheet(false);

            const selectedIndex = currencyData.findIndex(
              (obj) => obj.currency === option,
            );

            setAllCurrencies(false);
            setCurrencyInvoiceAmount(currencyData[selectedIndex].invoices);
            onCurrencyPress(currencyData[selectedIndex].currency);
            setCurrency(currencyData[selectedIndex].currency);
          }}
        />

        <ActionSheet
          ref={actionSheet}
          options={[strings.cancelledandRejected, strings.cancel]}
          cancelButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('CanceledInvoicesScreen', {
                from: Verbs.INVOICERECEVIED,
              });
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
    backgroundColor: colors.lightGrayBackground,
  },
  townsCupthreeDotIcon: {
    height: 25,
    marginRight: 10,
    resizeMode: 'contain',
    width: 25,
  },
  navTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 18,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
