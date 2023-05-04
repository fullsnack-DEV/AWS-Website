/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

import React, {
  useState,
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
  SafeAreaView,
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
import ScreenHeader from '../../../components/ScreenHeader';
import {getTCDate} from '../../../utils';

export default function InvoiceSentScreen({navigation}) {
  const defaultRecords = [
    {
      currency_type: 'USD',
      invoice_total: 0,
      invoice_paid_total: 0,
      invoice_open_total: 0,
      members: [],
      batches: [],
      total_invoice: 0,
    },
  ];
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const [showSendNewInvoice, setShowSendNewInvoice] = useState(false);
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
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [data, setData] = useState(defaultRecords);

  const [currentRecordSet, setCurrentRecordSet] = useState(defaultRecords[0]);
  const [selectedCurrency, setSelectedCurrency] = useState();

  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const [visibleCurrencySheet, setVisibleCurrencySheet] = useState();

  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setDate(new Date().getDate() - 90)),
  );
  const [endDateTime, setEndDateTime] = useState(new Date());

  const InvoiceSentMainTab = {
    Recipients: 0,
    Batches: 1,
  };
  const InvoiceSentSubTab = {
    ALL: 0,
    PAID: 1,
    OPEN: 2,
  };

  const tabChangePress = useCallback((changeTab) => {
    setMaintabNumber(changeTab.i);
  }, []);

  const getSendInvoices = () => {
    const startDate = getTCDate(startDateTime);
    const endDate = getTCDate(endDateTime);

    setLoading(true);
    getSenderInvoices(authContext, startDate, endDate)
      .then((response) => {
        let records = defaultRecords;
        if (response.payload.length > 0) {
          records = response.payload;
        }

        const record = records[0];
        let total = 0;
        records.forEach((obj) => {
          total += obj.total_invoice;
        });
        setData(records);
        setTotalInvoices(total);
        if (selectedCurrency) {
          if (selectedCurrency !== strings.all) {
            const selectedRecord = records.find(
              (obj) => obj.currency_type === selectedCurrency,
            );
            if (selectedRecord) {
              setCurrentRecordSet(selectedRecord);
            } else {
              setCurrentRecordSet(record);
              setSelectedCurrency(record.currency_type);
              setMaintabNumber(InvoiceSentMainTab.Recipients);
              setCurrentSubTab(InvoiceSentSubTab.ALL);
            }
          }
        } else {
          setCurrentRecordSet(record);
          setSelectedCurrency(record.currency_type);
        }

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
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
      getSendInvoices();
    }
  }, [authContext, isFocused, selectedMonth]);

  useEffect(() => {
    updateTabs(
      currentRecordSet.members.length,
      currentRecordSet.batches.length,
    );
  }, [currentRecordSet]);

  useEffect(() => {
    updateSubTabs(maintabNumber);
  }, [maintabNumber]);

  // useLayoutEffect(() => {
  //   updateSubTabs(maintabNumber);
  // }, [maintabNumber]);

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
    updateSubTabs(maintabNumber);
  };

  const updateSubTabs = (mainTabN) => {
    const allTitle = format(
      strings.allNInvoice,
      mainTabN === InvoiceSentMainTab.Recipients
        ? memberListByFilter(Verbs.allVerb).length
        : batchListByFilter(Verbs.allVerb).length,
    );

    const paidTitle = format(
      strings.paidNInvoice,
      mainTabN === InvoiceSentMainTab.Recipients
        ? memberListByFilter(Verbs.paid).length
        : batchListByFilter(Verbs.paid).length,
    );

    const openTitle = format(
      strings.openNInvoice,
      mainTabN === InvoiceSentMainTab.Recipients
        ? memberListByFilter(Verbs.open).length
        : batchListByFilter(Verbs.open).length,
    );

    setSubTabs([allTitle, paidTitle, openTitle]);
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
      receiver_id: recipient.receiver_id,
      startDate: startDateTime,
      endDate: endDateTime,

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
      onPressCard={() => {
        navigation.navigate('BatchDetailScreen', {
          from: Verbs.INVOICESENT,
          batchData: item,
          batchId: item.batch_id
        });
      }}
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.lightGrayBackground,
      }}>
      <ScreenHeader
        title={strings.invoicesent}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon1={
          authContext.entity.obj.entity_type !== Verbs.entityTypePlayer
            ? images.newinvoiceIcon
            : null
        }
        rightIcon2={images.vertical3Dot}
        rightIcon1Press={() => setShowSendNewInvoice(true)}
        rightIcon2Press={() => actionSheet.current.show()}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,
          borderBottomWidth: 1,
          paddingBottom: 13,
        }}
      />

      <View style={styles.mainContainer}>
        {/* screen header */}

        <ActivityLoader visible={loading} />

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

        {/* invoices DropDown */}

        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.lightGrayBackground,
            marginTop: 20,
            marginBottom: selectedCurrency === strings.all ? 20 : 0,
          }}>
          <TouchableOpacity
            onPress={() => {
              setVisibleCurrencySheet(true);
            }}
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
            {selectedCurrency === strings.all
              ? totalInvoices
              : currentRecordSet.total_invoice}
          </Text>
        </View>

        {selectedCurrency === strings.all ? (
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
                  totalInvoices={item.total_invoice}
                  totalAmount={item.invoice_total}
                  paidAmount={item.invoice_paid_total}
                  openAmount={item.invoice_open_total}
                  allCurrencySelected={selectedCurrency === strings.all}
                />
              )}
            />
          </View>
        ) : (
          <View style={{flex: 1, backgroundColor: colors.lightGrayBackground}}>
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
                currentTab={maintabNumber}
                bounces={false}
                tabStyle={{
                  marginTop: -2,
                }}
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
                          index === currentSubTab
                            ? fonts.RBold
                            : fonts.RRegular,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {maintabNumber === InvoiceSentMainTab.Recipients ? (
              <FlatList
                style={{backgroundColor: colors.whiteColor}}
                showsVerticalScrollIndicator={false}
                data={
                  (currentSubTab === InvoiceSentSubTab.ALL &&
                    memberListByFilter(Verbs.allStatus)) ||
                  (currentSubTab === InvoiceSentSubTab.PAID &&
                    memberListByFilter(Verbs.paid)) ||
                  (currentSubTab === InvoiceSentSubTab.OPEN &&
                    memberListByFilter(Verbs.open))
                }
                renderItem={renderMemberView}
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
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <FlatList
                style={{backgroundColor: colors.whiteColor}}
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
                data={
                  (currentSubTab === InvoiceSentSubTab.ALL &&
                    batchListByFilter(Verbs.allStatus)) ||
                  (currentSubTab === InvoiceSentSubTab.PAID &&
                    batchListByFilter(Verbs.paid)) ||
                  (currentSubTab === InvoiceSentSubTab.OPEN &&
                    batchListByFilter(Verbs.open))
                }
                renderItem={renderBatchView}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        )}

        <BottomSheet
          isVisible={visibleCurrencySheet}
          optionList={[strings.all, ...data.map((item) => item.currency_type)]}
          closeModal={() => setVisibleCurrencySheet(false)}
          onSelect={(option) => {
            if (option === strings.all) {
              setSelectedCurrency(strings.all);
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
          isVisible={showSendNewInvoice}
          onClose={() => setShowSendNewInvoice(false)}
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

  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 2,
  },
});
