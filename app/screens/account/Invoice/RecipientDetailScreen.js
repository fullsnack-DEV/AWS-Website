/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
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
import {displayLocation, getTCDate} from '../../../utils';
import BottomSheet from '../../../components/modals/BottomSheet';
import {MonthData} from '../../../Constants/GeneralConstants';
import ScreenHeader from '../../../components/ScreenHeader';
import {getSenderInvoices} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';

export default function RecipientDetailScreen({navigation, route}) {
  const defaultRecords = [
    {
      currency_type: 'USD',
      invoice_total: 0,
      invoice_paid_total: 0,
      invoice_open_total: 0,
      invoices: [],
    },
  ];
  const [receiver] = useState(route.params.receiver);
  const [receiverId] = useState(route.params.receiver_id);
  const [from] = useState(route.params.from);
  const [recipientData, setRecipientData] = useState(
    route.params.recipientData,
  );
  const [totalInvoice, setTotalInvoice] = useState(route.params.totalInvoices);
  const [selectedCurrency, setSelectedCurrency] = useState(
    route.params.currency,
  );
  const [startDateTime, setStartDateTime] = useState(route.params.startDate);
  const [endDateTime, setEndDateTime] = useState(route.params.endDate);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(MonthData[1]);
  const [tabNumber, setTabNumber] = useState(0);
  const [currentRecordSet, setCurrentRecordSet] = useState(defaultRecords[0]);
  const [tabs, setTabs] = useState([
    strings.all,
    strings.paidText,
    strings.openText,
  ]);
  const authContext = useContext(AuthContext);
  const [visiblemonthModal, setVisibleMonthModal] = useState();
  const actionSheet = useRef();
  const [visibleCurrencySheet, setVisibleCurrencySheet] = useState();
  const isFocused = useIsFocused();

  const getRecipientDetail = () => {
    const startDate = getTCDate(startDateTime);
    const endDate = getTCDate(endDateTime);
    setLoading(true);
    getSenderInvoices(authContext, startDate, endDate, receiverId)
      .then((response) => {
        let records = defaultRecords;
        if (response.payload.length > 0) {
          records = response.payload;
          records.forEach((item) => {
            if (item.members[0]) {
              // eslint-disable-next-line no-param-reassign
              item.invoices = item.members[0].invoices;
            }
          });
        }

        setRecipientData(records);

        let totInvoices = 0;
        records.forEach((item) => {
          totInvoices += item.invoices.length;
        });
        setTotalInvoice(totInvoices);
        if (selectedCurrency) {
          if (selectedCurrency !== strings.all) {
            const selectedRecord = records.find(
              (obj) => obj.currency_type === selectedCurrency,
            );
            if (selectedRecord) {
              setCurrentRecordSet(selectedRecord);
            } else {
              setCurrentRecordSet(records[0]);
              setSelectedCurrency(records[0].currency_type);
            }
          }
        } else {
          setCurrentRecordSet(records[0]);
          setSelectedCurrency(records[0].currency_type);
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
    getRecipientDetail();
  }, [isFocused, selectedMonth]);

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

  const renderInvoiceView = ({item}) => (
    <RecipientInvoiceView
      invoice={item}
      onPressCard={() => {
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
          thumbnail: receiver.thumbnail,
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
            obj.invoice_status === Verbs.PARTIALLY_PAID ||
            obj.invoice_status === Verbs.INVOICE_REJECTED,
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

      <ScrollView
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}>
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
                getDates(option);
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
                marginBottom: selectedCurrency === strings.all ? 20 : 0,
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
                    : `${strings.invoicesIn} ${currentRecordSet.currency_type}`}
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
                  ? totalInvoice
                  : currentRecordSet.invoices.length}
              </Text>
            </View>
          </View>
        </View>

        {selectedCurrency !== strings.all && (
          <InvoiceAmount
            currency={currentRecordSet.currency_type}
            totalInvoices={currentRecordSet.invoices.length}
            totalAmount={currentRecordSet.invoice_total}
            paidAmount={currentRecordSet.invoice_paid_total}
            openAmount={currentRecordSet.invoice_open_total}
          />
        )}
        {selectedCurrency === strings.all ? (
          <>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.whiteColor,
              }}>
              <FlatList
                extraData={recipientData}
                showsVerticalScrollIndicator={false}
                data={recipientData}
                keyExtractor={(index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={styles.dividerLine} />
                )}
                renderItem={({item}) => {
                  return (
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
                  );
                }}
              />
            </View>
          </>
        ) : (
          <View style={{backgroundColor: colors.whiteColor}}>
            <TCScrollableProfileTabs
              tabItem={tabs}
              tabVerticalScroll={false}
              onChangeTab={tabChangePress}
              currentTab={tabNumber}
            />
          </View>
        )}

        {selectedCurrency !== strings.all && (
          <View>
            <FlatList
              nestedScrollEnabled
              scrollEnabled
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{marginBottom: 100}} />}
              data={
                (tabNumber === 0 && memberListByFilter(Verbs.allStatus)) ||
                (tabNumber === 1 && memberListByFilter(Verbs.paid)) ||
                (tabNumber === 2 && memberListByFilter(Verbs.open))
              }
              renderItem={renderInvoiceView}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
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

        <BottomSheet
          isVisible={visibleCurrencySheet}
          optionList={[
            strings.all,
            ...recipientData.map((item) => item.currency_type),
          ]}
          closeModal={() => setVisibleCurrencySheet(false)}
          onSelect={(option) => {
            if (option === strings.all) {
              setSelectedCurrency(option);
              setVisibleCurrencySheet(false);
              return;
            }

            setVisibleCurrencySheet(false);

            const selectedRecord = recipientData.find(
              (obj) => obj.currency_type === option,
            );

            if (selectedRecord) {
              setSelectedCurrency(option);
              setCurrentRecordSet(selectedRecord);
            }
          }}
        />
      </ScrollView>
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
