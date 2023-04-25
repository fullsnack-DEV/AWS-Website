/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable  no-unused-vars */

import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Pressable,
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

export default function RecipientDetailScreen({navigation, route}) {
  const [receiver] = useState(route.params.receiver);
  const [from] = useState(route.params.from);
  const [recipentData] = useState(route.params.recipentData);
  const [loading, setloading] = useState(false);
  const [currencyData, setCurrencyData] = useState([
    {currency: 'USD', invoices: 0},
  ]);
  const [selectedMonth, setSelectedMonth] = useState(strings.past30DaysText);
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
    setCurrencyData(objects);
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
        <Text style={styles.navTitle}>{strings.recipients}</Text>
      ),
      // headerRight: () => (
      //   <View style={styles.rightHeaderView}>
      //     <TouchableOpacity onPress={() => actionSheet.current.show()}>
      //       <Image
      //         source={images.threeDotIcon}
      //         style={styles.townsCupthreeDotIcon}
      //       />
      //     </TouchableOpacity>
      //   </View>
      // ),
    });
  }, [navigation]);
  const onCurrencyPress = (item) => {
    const record = recipentData.find((obj) => obj.currency_type === item);
    if (record) {
      setCurrentRecordSet(record);
    }
  };
  const renderInvoiceView = ({item}) => (
    <RecipientInvoiceView
      invoice={item}
      onPressCard={() =>
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
          currency_type: currentRecordSet.currency_type,
        })
      }
    />
  );
  const memberListByFilter = useCallback(
    (status) => {
      if (status === 'All') {
        return currentRecordSet.invoices;
      }
      if (status === 'Paid') {
        return currentRecordSet.invoices.filter(
          (obj) => obj.invoice_status === Verbs.paid,
        );
      }
      if (status === 'Open') {
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

        <InvoiceAmount
          currency={currentRecordSet.currency_type}
          totalInvoices={route.params.totalInvoices}
          totalAmount={currentRecordSet.invoice_total}
          paidAmount={currentRecordSet.invoice_paid_total}
          openAmount={currentRecordSet.invoice_open_total}
          currencyData={currencyData}
          onCurrencyPress={onCurrencyPress}
        />
        {/* Tabs All / PAID / OPEN */}
        <View style={{backgroundColor: colors.whiteColor}}>
          <TCScrollableProfileTabs
            tabItem={tabs}
            tabVerticalScroll={false}
            onChangeTab={tabChangePress}
            currentTab={tabNumber}
          />
        </View>

        <SafeAreaView style={{flex: 1, backgroundColor: colors.whiteColor}}>
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
      </View>
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
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  navTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  profileContainer: {
    height: 40,
    width: 40,

    borderWidth: 1,
  },

  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
