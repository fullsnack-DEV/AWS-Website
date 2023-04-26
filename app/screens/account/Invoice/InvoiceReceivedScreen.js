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
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import ActionSheet from 'react-native-actionsheet';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getReceiverInvoice} from '../../../api/Invoice';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import InvoiceReceivedCellView from '../../../components/invoice/InvoiceReceivedCellView';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {groupBy} from '../../../utils';
import colors from '../../../Constants/Colors';

import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import images from '../../../Constants/ImagePath';
import BottomSheet from '../../../components/modals/BottomSheet';
import fonts from '../../../Constants/Fonts';
import {MonthData} from '../../../Constants/GeneralConstants';

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
  const [selectedMonth, setSelectedMonth] = useState(strings.past30DaysText);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const actionSheet = useRef();

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

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getReceiverInvoice(authContext)
        .then((response) => {
          setloading(false);
          const dataObj = [];
          const objects = [];
          if (response.payload.length > 0) {
            const result = groupBy(response.payload, 'currency_type');
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
            setCurrencyData(objects);
            setCurrentRecordSet(dataObj[0]);
          }
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

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
        console.log('item', item.invoice_id);
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
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

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

      <View style={{flex: 1}}>
        <InvoiceAmount
          currency={currentRecordSet.currency_type}
          totalInvoices={currentRecordSet.invoices.length}
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
        <FlatList
          data={
            (tabNumber === 0 && memberListByFilter(Verbs.allStatus)) ||
            (tabNumber === 1 && memberListByFilter(Verbs.paid)) ||
            (tabNumber === 2 && memberListByFilter(Verbs.open))
          }
          renderItem={renderRecipientView}
          keyExtractor={(index) => index.toString()}
        />
      </View>

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
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
