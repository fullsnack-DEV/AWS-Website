/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getCancelledInvoice} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import CancelledInvoiceView from '../../../components/invoice/CancelledInvoiceView';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import {MonthData} from '../../../Constants/GeneralConstants';
import BottomSheet from '../../../components/modals/BottomSheet';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import {getTCDate} from '../../../utils';

export default function CanceledInvoicesScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const [from] = useState(route.params.from);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [invoiceList, setInvoiceList] = useState([]);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setDate(new Date().getDate() - 90)),
  );
  const [endDateTime, setEndDateTime] = useState(new Date());

  const [tabs, setTabs] = useState([
    strings.allNInvoice,
    strings.canceledNInvoice,
    strings.rejectedNInvoice,
  ]);
  const [tabNumber, setTabNumber] = useState(0);

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
        <>
          {from === Verbs.INVOICERECEVIED ? (
            <Text style={styles.navTitle}>
              {strings.invoiceCancelledandRejected}
            </Text>
          ) : (
            <Text style={styles.navTitle}>{strings.invoicesCancelled}</Text>
          )}
        </>
      ),
    });
  }, [navigation, authContext]);

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
    const TCendDate = getTCDate(endDateTime);
    console.log(TcstartDate, TCendDate);

    setloading(true);
    let type = 'receiver';
    if (from === Verbs.INVOICESENT) {
      type = 'sender';
    }
    getCancelledInvoice(type, authContext)
      .then((response) => {
        setloading(false);
        setInvoiceList(response.payload);
        const allTitle = format(strings.allNInvoice, response.payload.length);
        const canceledTitle = format(
          strings.canceledNInvoice,
          response.payload.filter(
            (obj) => obj.invoice_status === Verbs.INVOICE_CANCELLED,
          ).length,
        );
        const rejectedTitle = format(
          strings.rejectedNInvoice,
          response.payload.filter(
            (obj) => obj.invoice_status === Verbs.INVOICE_REJECTED,
          ).length,
        );
        setTabs([allTitle, canceledTitle, rejectedTitle]);
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

  const invoiceListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return invoiceList;
      }
      return invoiceList.filter((obj) => obj.invoice_status === status);
    },
    [invoiceList],
  );

  return (
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

        {/* invocies cancelled */}

        <Text style={{marginLeft: 15, marginTop: 30, marginBottom: 15}}>
          <Text style={{fontSize: 20, fontFamily: fonts.RMedium}}>
            {
              invoiceList.filter(
                (obj) => obj.invoice_status === Verbs.INVOICE_CANCELLED,
              ).length
            }
          </Text>
          <Text style={styles.invoiceSentheading}>
            {''} {strings.invoicesCancelled}
          </Text>
        </Text>
      </View>

      <BottomSheet
        isVisible={visiblemonthModal}
        closeModal={() => setVisibleMonthModal(false)}
        optionList={MonthData}
        onSelect={(option) => {
          setSelectedMonth(option);
          setVisibleMonthModal(false);
          getDates(option);
        }}
      />

      <View>
        {from === Verbs.INVOICERECEVIED ? (
          <View style={{backgroundColor: colors.whiteColor}}>
            <TCScrollableProfileTabs
              tabItem={tabs}
              tabVerticalScroll={false}
              onChangeTab={tabChangePress}
              currentTab={tabNumber}
              bounces={false}
              tabStyle={{
                marginTop: -4,
              }}
            />
          </View>
        ) : null}
        <FlatList
          data={
            (tabNumber === 0 && invoiceListByFilter(Verbs.allStatus)) ||
            (tabNumber === 1 && invoiceListByFilter(Verbs.INVOICE_CANCELLED)) ||
            (tabNumber === 2 && invoiceListByFilter(Verbs.INVOICE_REJECTED))
          }
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
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  invoiceSentheading: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  navTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 18,
  },
});
