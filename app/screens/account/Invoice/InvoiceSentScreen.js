/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import {format} from 'react-string-format';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getSenderInvoices} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import images from '../../../Constants/ImagePath';
import MemberInvoicesView from '../../../components/invoice/MemberInvoicesView';
import BatchInvoiceView from '../../../components/invoice/BatchInvoiceView';
import {strings} from '../../../../Localization/translation';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import Verbs from '../../../Constants/Verbs';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';

import SendNewInvoiceModal from './SendNewInvoiceModal';
import BottomSheet from '../../../components/modals/BottomSheet';
import {MonthData} from '../../../Constants/GeneralConstants';

export default function InvoiceSentScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const [sendNewInvoice, SetSendNewInvoice] = useState(false);
  // Reciepients / Batches
  const [maintabNumber, setMaintabNumber] = useState(0);
  const [tabs, setTabs] = useState([strings.recipients, strings.batches]);
  // For All / Paid / Open
  const [subTabs, setSubTabs] = useState([
    strings.allNInvoice,
    strings.paidNInvoice,
    strings.openNInvoice,
  ]);
  const [currentSubTab, setCurrentSubTab] = useState(0);
  const [currencyData, setCurrencyData] = useState([
    {currency: 'USD', invoices: 0},
  ]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [data, setData] = useState([]);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const [selectedMonth, setSelectedMonth] = useState(strings.past30DaysText);
  const [currentRecordSet, setCurrentRecordSet] = useState({
    currency_type: 'USD',
    invoice_total: 0,
    invoice_paid_total: 0,
    invoice_open_total: 0,
    members: [],
    batches: [],
    total_invoice: 0,
  });

  const tabChangePress = useCallback((changeTab) => {
    updateSubTabs(changeTab.i);
    setMaintabNumber(changeTab.i);
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
        <Text style={styles.navTitle}>{strings.invoicesent}</Text>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          {authContext.entity.obj.entity_type !== Verbs.entityTypePlayer ? (
            <TouchableOpacity onPress={() => SetSendNewInvoice(true)}>
              <Image
                source={images.newinvoiceIcon}
                style={styles.townsCupPlusIcon}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={() => actionSheet.current.show()}>
            <Image
              source={images.vertical3Dot}
              style={styles.townsCupthreeDotIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, authContext]);

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getSenderInvoices(authContext)
        .then((response) => {
          if (response.payload.length > 0) {
            let total = 0;
            response.payload.forEach((obj) => {
              total += obj.total_invoice;
            });
            setData(response.payload);
            setTotalInvoices(total);
            updateCurrencyData(response.payload);
            const record = response.payload[0];
            setCurrentRecordSet(record);
          }
          setloading(false);
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
    updateTabs(
      currentRecordSet.members.length,
      currentRecordSet.batches.length,
    );
    updateSubTabs(maintabNumber);
  }, [currentRecordSet]);

  useEffect(() => {
    updateSubTabs(maintabNumber);
  }, [maintabNumber]);

  const updateCurrencyData = (records) => {
    const objects = [];
    records.map((obj) => {
      objects.push({currency: obj.currency_type, invoices: obj.total_invoice});
    });
    setCurrencyData(objects);
  };
  const updateTabs = (peopleCount, batchesCount) => {
    let recipientsTitle = strings.recipients;
    let batchesTitle = strings.batches;
    if (peopleCount > 0) {
      recipientsTitle = `${recipientsTitle} (${peopleCount})`;
    }
    if (batchesCount > 0) {
      batchesTitle = `${batchesTitle} (${batchesCount})`;
    }
    setTabs([recipientsTitle, batchesTitle]);

    const allTitle = format(
      strings.allNInvoice,
      maintabNumber === 0
        ? memberListByFilter(Verbs.allVerb).length
        : batchListByFilter(Verbs.allVerb).length,
    );

    const paidTitle = format(
      strings.paidNInvoice,
      maintabNumber === 0
        ? memberListByFilter(Verbs.paid).length
        : batchListByFilter(Verbs.paid).length,
    );

    const openTitle = format(
      strings.openNInvoice,
      maintabNumber === 0
        ? memberListByFilter(Verbs.open).length
        : batchListByFilter(Verbs.open).length,
    );

    setSubTabs([allTitle, paidTitle, openTitle]);
  };
  const updateSubTabs = (mainTabN) => {
    const allTitle = format(
      strings.allNInvoice,
      mainTabN === 0
        ? memberListByFilter(Verbs.allVerb).length
        : batchListByFilter(Verbs.allVerb).length,
    );

    const paidTitle = format(
      strings.paidNInvoice,
      mainTabN === 0
        ? memberListByFilter(Verbs.paid).length
        : batchListByFilter(Verbs.paid).length,
    );

    const openTitle = format(
      strings.openNInvoice,
      mainTabN === 0
        ? memberListByFilter(Verbs.open).length
        : batchListByFilter(Verbs.open).length,
    );

    setSubTabs([allTitle, paidTitle, openTitle]);
  };
  const onCurrencyPress = (item) => {
    const record = data.find((obj) => obj.currency_type === item);
    if (record) {
      setCurrentRecordSet(record);
    }
  };
  const onRecipientPress = (recipient) => {
    const recipentData = [];
    const receiver = {
      receiver_id: recipient.receiver_id,
      receiver_type: recipient.receiver_type,
      full_name: recipient.full_name,
      thumbnail: recipient.thumbnail,
      city: recipient.city,
      state: recipient.state,
      state_abbr: recipient.state_abbr,
      country: recipient.country,
    };
    let totInvoices = 0;
    data.forEach((item) => {
      const result = item.members.find(
        (memInv) => memInv.receiver_id === recipient.receiver_id,
      );
      if (result && result.invoices.length > 0) {
        totInvoices += result.invoices.length;
        const record = {
          currency_type: item.currency_type,
          invoice_paid_total: 0,
          invoice_open_total: 0,
          invoice_total: 0,
          invoices: result.invoices,
        };
        record.invoices.forEach((invoice) => {
          record.invoice_paid_total += invoice.amount_paid;
          record.invoice_open_total += invoice.amount_remaining;
          record.invoice_total += invoice.amount_due;
        });
        recipentData.push(record);
      }
    });

    navigation.navigate('RecipientDetailScreen', {
      from: Verbs.INVOICESENT,
      recipentData,
      receiver,
      totalInvoices: totInvoices,
      currency: currentRecordSet.currency_type,
    });
  };
  const renderMemberView = ({item}) => (
    <MemberInvoicesView
      data={item}
      onPressCard={() => onRecipientPress(item)}
    />
  );
  const renderBatchView = ({item}) => (
    <BatchInvoiceView
      data={item}
      onPressCard={() =>
        navigation.navigate('BatchDetailScreen', {
          from: Verbs.INVOICESENT,
          batchData: item,
          currency_type: currentRecordSet.currency_type,
        })
      }
    />
  );
  const memberListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return currentRecordSet.members;
      }
      if (status === Verbs.paid) {
        return currentRecordSet.members.filter((obj) =>
          obj.invoices.some((innerObj) => innerObj.invoice_status === 'Paid'),
        );
      }
      if (status === Verbs.open) {
        return currentRecordSet.members.filter((obj) =>
          obj.invoices.some(
            (innerObj) =>
              innerObj.invoice_status === Verbs.UNPAID ||
              innerObj.invoice_status === Verbs.PARTIALLY_PAID,
          ),
        );
      }
    },
    [currentRecordSet],
  );
  const batchListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return currentRecordSet.batches;
      }
      if (status === Verbs.paid) {
        return currentRecordSet.batches.filter((obj) =>
          obj.invoices.some(
            (innerObj) => innerObj.invoice_status === Verbs.paid,
          ),
        );
      }
      if (status === 'Open') {
        return currentRecordSet.batches.filter((obj) =>
          obj.invoices.some(
            (innerObj) =>
              innerObj.invoice_status === Verbs.UNPAID ||
              innerObj.invoice_status === Verbs.PARTIALLY_PAID,
          ),
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
          totalInvoices={totalInvoices}
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
            currentTab={maintabNumber}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: colors.grayBackgroundColor,
            borderBottomWidth: 1,
            backgroundColor: colors.whiteGradientColor,
          }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              marginRight: 40,
            }}>
            {subTabs.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                onPress={() => setCurrentSubTab(index)}>
                <Text
                  style={{
                    color:
                      index === currentSubTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      index === currentSubTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {maintabNumber === 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              (currentSubTab === 0 && memberListByFilter('All')) ||
              (currentSubTab === 1 && memberListByFilter('Paid')) ||
              (currentSubTab === 2 && memberListByFilter('Open'))
            }
            renderItem={renderMemberView}
            keyExtractor={(index) => index.toString()}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              (currentSubTab === 0 && batchListByFilter('All')) ||
              (currentSubTab === 1 && batchListByFilter('Paid')) ||
              (currentSubTab === 2 && batchListByFilter('Open'))
            }
            renderItem={renderBatchView}
            keyExtractor={(index) => index.toString()}
          />
        )}
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
            });
          }
        }}
      />
      <SendNewInvoiceModal
        isVisible={sendNewInvoice}
        onClose={() => SetSendNewInvoice(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor:"red"
  },
  navTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 18,
  },
  townsCupthreeDotIcon: {
    height: 25,

    resizeMode: 'contain',
    width: 25,
  },
  townsCupPlusIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
