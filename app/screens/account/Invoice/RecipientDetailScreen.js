/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable  no-unused-vars */

import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import {format} from 'react-string-format';
import ActionSheet from 'react-native-actionsheet';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import RecipientInvoiceView from '../../../components/invoice/RecipientInvoiceView';
import images from '../../../Constants/ImagePath';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';

import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Verbs from '../../../Constants/Verbs';
import {displayLocation} from '../../../utils';
import BottomSheet from '../../../components/modals/BottomSheet';
import {MonthData} from '../../../Constants/GeneralConstants';
import ScreenHeader from '../../../components/ScreenHeader';

export default function RecipientDetailScreen({navigation, route}) {
  const [receiver] = useState(route.params.receiver);
  const [from] = useState(route.params.from);
  const [recipentData] = useState(route.params.recipentData);
  const [loading, setloading] = useState(false);
  const [currencyData, setCurrencyData] = useState([
    {currency: 'USD', invoices: 0},
  ]);
  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [tabNumber, setTabNumber] = useState(0);
  const [currentRecordSet, setCurrentRecordSet] = useState({
    currency_type: 'USD',
    invoice_total: 0,
    invoice_paid_total: 0,
    invoice_open_total: 0,
    invoices: [],
  });
  const [tabs, setTabs] = useState([
    strings.all,
    strings.paidText,
    strings.openText,
  ]);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const actionSheet = useRef();

  const [currencies, setCurrencies] = useState(currencyData[0].currency);
  const [currency, setCurrency] = useState(currencyData[0].currency);
  const [currencyInvoiceAmount, setCurrencyInvoiceAmount] = useState();
  const [allCurrencies, setAllCurrencies] = useState();
  const [totalInvoice, settotalInvoice] = useState();
  const [visibleCurrencySheet, setVisibleCurrencySheet] = useState();

  useEffect(() => {
    const result = recipentData.find(
      (recipient) => recipient.currency_type === route.params.currency,
    );
    if (result) {
      setCurrentRecordSet(result);
    }
    const objects = [];
    recipentData.map((obj) => {
      objects.push({
        currency: obj.currency_type,
        invoices: obj.invoices.length,
      });
    });

    let total_invoice = 0;

    recipentData.forEach((obj) => {
      total_invoice += obj.invoices.length;
    });

    settotalInvoice(total_invoice);
    setCurrencies([]);
    setCurrencies([strings.all, ...objects.map((item) => item.currency)]);
    setCurrencyData(objects);
    setCurrencyInvoiceAmount(objects[0].invoices);
  }, []);

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
    const record = recipentData.find((obj) => obj.currency_type === item);
    if (record) {
      setCurrentRecordSet(record);
    }
  };
  const renderInvoiceView = ({item}) => (
    <RecipientInvoiceView
      invoice={item}
      onPressCard={() => {
        navigation.navigate('InvoiceDetailScreen', {
          from,
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
  const tabChangePress = useCallback((changeTab) => {
    setTabNumber(changeTab.i);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeader
        title={strings.recipients}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,

          paddingBottom: 13,
          borderBottomWidth: 1,
        }}
      />

      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View style={{flex: 1, backgroundColor: colors.lightGrayBackground}}>
          {/* recipient name and Image View */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
              marginTop: 20,
            }}>
            <GroupIcon
              entityType={receiver.receiver_type}
              imageUrl={receiver.thumbnail}
              containerStyle={styles.profileContainer}
              groupName={receiver.full_name}
              grpImageStyle={{
                height: 32,
                width: 28,
              }}
              textstyle={{
                fontSize: 12,
              }}
            />
            <View
              style={{
                marginLeft: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  lineHeight: 24,
                }}>
                {receiver.full_name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.RRegular,
                  lineHeight: 21,
                }}>
                {displayLocation(receiver)}
              </Text>
            </View>
          </View>

          {/* Implemet the Bottom sheet Here */}

          {/* Todo */}

          <BottomSheet
            isVisible={visiblemonthModal}
            closeModal={() => setVisibleMonthModal(false)}
            optionList={MonthData}
            onSelect={(option) => {
              setSelectedMonth(option);
              setVisibleMonthModal(false);
            }}
          />

          <Pressable
            onPress={() => setVisibleMonthModal(true)}
            style={{
              backgroundColor: colors.lightGrayBackground,
              marginTop: 25,
              paddingHorizontal: 15,
            }}>
            <View
              style={{
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
                source={images.dropDownArrow2}
                style={{
                  height: 15,
                  width: 15,
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
            <>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.whiteColor,
                }}>
                <FlatList
                  extraData={recipentData}
                  data={recipentData}
                  keyExtractor={(index) => index.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={styles.dividerLine} />
                  )}
                  renderItem={({item}) => {
                    console.log(item, 'from item');
                    return (
                      <InvoiceAmount
                        style={{
                          backgroundColor: colors.whiteColor,
                          marginTop: 15,
                        }}
                        currency={item.currency_type}
                        currencyInvoiceAmount={item.total_invoice}
                        totalAmount={item.invoice_total}
                        paidAmount={item.invoice_paid_total}
                        openAmount={item.invoice_open_total}
                        allCurrencies={allCurrencies}
                      />
                    );
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <InvoiceAmount
                currency={currentRecordSet.currency_type}
                totalInvoices={route.params.totalInvoices}
                totalAmount={currentRecordSet.invoice_total}
                paidAmount={currentRecordSet.invoice_paid_total}
                openAmount={currentRecordSet.invoice_open_total}
                currencyData={currencyData}
                onCurrencyPress={onCurrencyPress}
              />
              <View style={{backgroundColor: colors.whiteColor}}>
                <TCScrollableProfileTabs
                  tabItem={tabs}
                  tabVerticalScroll={false}
                  onChangeTab={tabChangePress}
                  currentTab={tabNumber}
                />
              </View>
              <SafeAreaView
                style={{flex: 1, backgroundColor: colors.whiteColor}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={
                    (tabNumber === 0 && memberListByFilter(Verbs.allStatus)) ||
                    (tabNumber === 1 && memberListByFilter(Verbs.paid)) ||
                    (tabNumber === 2 && memberListByFilter(Verbs.open))
                  }
                  renderItem={renderInvoiceView}
                  keyExtractor={(item, index) => index.toString()}
                />
              </SafeAreaView>
            </>
          )}
        </View>

        <BottomSheet
          isVisible={visibleCurrencySheet}
          optionList={currencies}
          closeModal={() => setVisibleCurrencySheet(false)}
          onSelect={(option) => {
            if (option === strings.all) {
              setAllCurrencies(true);
              setCurrencyInvoiceAmount(totalInvoice);
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
          options={[strings.cancelledInvoiceText, strings.cancel]}
          cancelButtonIndex={1}
          // destructiveButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('CanceledInvoicesScreen', {
                from: Verbs.INVOICESENT,
                receiverId: receiver.receiver_id,
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
  },

  profileContainer: {
    height: 40,
    width: 40,

    borderWidth: 1,
  },
});
