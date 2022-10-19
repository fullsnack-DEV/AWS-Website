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
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';
import {format} from 'react-string-format';

import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getGroupMembers} from '../../../api/Groups';
import {createInvoice, getTeamInvoice} from '../../../api/Invoice';

import AuthContext from '../../../auth/context';

import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import BatchFeeView from '../../../components/invoice/BatchFeeView';
import {strings} from '../../../../Localization/translation';
import TCThinDivider from '../../../components/TCThinDivider';
import {heightPercentageToDP as hp} from '../../../utils';
import DataSource from '../../../Constants/DataSource';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import Verbs from '../../../Constants/Verbs';

let totalInvoiced, paidInvoice, openInvoice;

export default function InvoiceScreen({navigation}) {
  const filterByDate = [
    strings.allInvoiceText,
    strings.past90DaysText,
    moment().subtract(1, 'month').format('MMMM'),
    moment().format('YYYY'),
    moment().format('YYYY') - 1,
    strings.chooseDateRangeText,
  ];
  const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);

  const createInvoiceModalRef = useRef();
  const recipientModalRef = useRef();
  const filterModalRef = useRef();
  const actionSheet = useRef();

  // const isFocused = useIsFocused();
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState();
  const [invoiceTitle, setInvoiceTitle] = useState();
  const [showCalender, setShowCalender] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState();
  const [markingDays, setMarkingDays] = useState({});

  const [filterFromDate, setFilterFromDate] = useState(new Date());
  const [filterToDate, setFilterToDate] = useState(new Date());
  const [fromdateVisisble, setFromdateVisisble] = useState(false);
  const [todateVisisble, setTodateVisisble] = useState(false);
  const [toggle, setToggle] = useState(true);

  const [filterPayment, setFilterPayment] = useState(
    DataSource.filterByPayment[0],
  );
  const [filterBatch, setFilterBatch] = useState(DataSource.filterByBatch[0]);
  const [filterDate, setFilterDate] = useState(filterByDate[0]);

  const [maintabNumber, setMaintabNumber] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);

  const [searchText, setSearchText] = useState();
  const [filterSetting, setFilterSetting] = useState([
    DataSource.filterByPayment[0],
    DataSource.filterByBatch[0],
    filterByDate[0],
  ]);

  const [memberList, setMemberList] = useState([]);
  const [batchList, setBatchList] = useState([]);

  const [recipientData, setRecipientData] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState([]);

  const [recipientAllData, setRecipientAllData] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.navTitle}>Invoicing</Text>,
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => createInvoiceModalRef.current.open()}>
            <Image
              source={images.plusInvoice}
              style={styles.townsCupPlusIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => actionSheet.current.show()}>
            <Image
              source={images.threeDotIcon}
              style={styles.townsCupthreeDotIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, memberList]);

  useEffect(() => {
    setloading(true);
    getGroupMembers(authContext.entity.uid, authContext)
      .then((response) => {
        console.log('');
        setloading(false);

        setRecipientData(response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getTeamInvoice(authContext)
        .then((response) => {
          setloading(false);

          setMemberList(response.payload.members);
          setBatchList(response.payload.batches);
          totalInvoiced = response.payload.invoice_total;
          paidInvoice = response?.payload?.invoice_paid_total;
          openInvoice = response.payload.invoice_open_total;
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  const renderMemberView = ({item}) => (
    <MemberInvoiceView
      data={item}
      onPressCard={() =>
        navigation.navigate('MembersDetailScreen', {
          from: 'member',
          memberData: item,
        })
      }
    />
  );

  const renderBatchView = ({item}) => (
    <BatchFeeView
      data={item}
      onPressCard={() =>
        navigation.navigate('BatchDetailScreen', {
          from: 'batch',
          batchData: item,
        })
      }
    />
  );

  const createInvoiceModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => createInvoiceModalRef.current.close()}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>{strings.newInvoice}</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            if (createInvoiceValidation()) {
              setloading(true);

              const body = {};
              body.member_ids = selectedRecipient;
              body.due_date = Number(
                (new Date(selectedDueDate).getTime() / 1000).toFixed(0),
              );
              body.invoice_title = invoiceTitle;
              body.amount_due = Number(parseFloat(amount).toFixed(2));
              body.currency_type = authContext.entity.obj.currency_type;
              body.invoice_description = note;

              console.log(body);
              createInvoice(body, authContext)
                .then((response) => {
                  setloading(false);
                  createInvoiceModalRef?.current?.close();
                  getTeamInvoice(authContext)
                    .then((data) => {
                      setloading(false);

                      setMemberList(data.payload.members);
                      setBatchList(data.payload.batches);
                      totalInvoiced = data.payload.invoice_total;
                      paidInvoice = data?.payload?.invoice_paid_total;
                      openInvoice = data.payload.invoice_open_total;
                    })
                    .catch((e) => {
                      setloading(false);
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, e.message);
                      }, 10);
                    });
                })
                .catch((e) => {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                });
            }
          }}>
          {strings.send}
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const RecipientsModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => recipientModalRef.current.close()}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>{strings.recipients}</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            const selectedMember = recipientData.filter((e) => e.selected);
            const result = selectedMember.map((obj) => {
              if (obj.selected) {
                return obj.user_id;
              }
            });
            console.log(result);
            setSelectedRecipient(result);
            recipientModalRef.current.close();
          }}>
          {strings.done}
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const filterModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => filterModalRef.current.close()}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>{strings.filter}</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            filterModalRef.current.close();
          }}>
          {strings.apply}
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const renderRecipients = ({item, index}) => (
    <>
      <View style={styles.recipientContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                item?.thumbnail && item?.thumbnail !== ''
                  ? {uri: item?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImgStyle}
            />
          </View>
          <Text style={styles.profilenameStyle}>
            {item?.first_name} {item?.last_name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // onTagCancelPress({ item, index }
            setRecipientAllData(false);
            const tempObj = item;
            tempObj.selected = !tempObj?.selected;
            recipientData[index] = tempObj;
            setRecipientData([...recipientData]);
          }}>
          <Image
            source={
              item?.selected ? images.orangeCheckBox : images.uncheckEditor
            }
            style={styles.checkButton}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const getSelectedDayEvents = useCallback((date) => {
    const markedDates = {};
    markedDates[date] = {selected: true};
    setMarkingDays(markedDates);
  }, []);

  const handleStartDatePress = (date) => {
    setFilterFromDate(
      toggle
        ? new Date(date).setHours(0, 0, 0, 0)
        : new Date(new Date(date).getTime()),
    );
    setFilterToDate(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : moment(date).add(5, 'm').toDate(),
    );

    setFromdateVisisble(!fromdateVisisble);
  };
  const handleCancelPress = () => {
    setFromdateVisisble(false);
    setTodateVisisble(false);
  };

  const handleEndDatePress = (date) => {
    let dateValue = new Date();
    if (toggle) {
      dateValue = `${moment(date).format('ddd MMM DD YYYY')} 11:59:59 PM`;
      setFilterToDate(dateValue);
    } else {
      setFilterToDate(date);
    }
    setTodateVisisble(!todateVisisble);
  };

  const createInvoiceValidation = () => {
    console.log(selectedDueDate);
    if (selectedRecipient.length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }
    if (!selectedDueDate) {
      Alert.alert(strings.dueDateValidation);
      return false;
    }
    if (new Date(selectedDueDate) < new Date()) {
      Alert.alert(strings.validDueDateValidation);
      return false;
    }
    if (!invoiceTitle) {
      Alert.alert(strings.invoiceTitleValidation);
      return false;
    }
    if (!amount) {
      Alert.alert(strings.dueAmountValidation);
      return false;
    }
    if (amount < 1 && amount >= 0) {
      Alert.alert(strings.lessThan1AmountValidation);
      return false;
    }
    return true;
  };

  const memberListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return memberList;
      }
      if (status === 'Paid') {
        return memberList.filter((obj) =>
          obj.invoices.some((innerObj) => innerObj.invoice_status === 'Paid'),
        );
      }
      if (status === 'Open') {
        return memberList.filter((obj) =>
          obj.invoices.some(
            (innerObj) =>
              innerObj.invoice_status === 'Unpaid' ||
              innerObj.invoice_status === 'Partially Paid',
          ),
        );
      }
    },
    [memberList],
  );
  const IsNumeric = (num) => num >= 0 || num < 0;

  const batchListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return batchList;
      }
      if (status === 'Paid') {
        return batchList.filter((obj) =>
          obj.invoices.some((innerObj) => innerObj.invoice_status === 'Paid'),
        );
      }
      if (status === 'Open') {
        return batchList.filter((obj) =>
          obj.invoices.some(
            (innerObj) =>
              innerObj.invoice_status === 'Unpaid' ||
              innerObj.invoice_status === 'Partially Paid',
          ),
        );
      }
    },
    [batchList],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TopFilterBar
        onFilterPress={() => filterModalRef?.current?.open()}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        searchSubmit={() => {
          navigation.navigate('InvoiceFilterScreen');
        }}
      />

      <View style={{flex: 1}}>
        <TCTabView
          totalTabs={2}
          firstTabTitle={format(strings.membersNText, memberList.length)}
          secondTabTitle={format(strings.batchesNText, batchList.length)}
          indexCounter={maintabNumber}
          eventPrivacyContianer={{width: 100}}
          onFirstTabPress={() => setMaintabNumber(0)}
          onSecondTabPress={() => setMaintabNumber(1)}
          activeHeight={36}
          inactiveHeight={40}
        />

        <InvoiceAmount
          currencyType={strings.defaultCurrency}
          totalAmount={totalInvoiced ?? strings.total00}
          paidAmount={paidInvoice ?? strings.total00}
          openAmount={openInvoice ?? strings.total00}
        />

        <TCTabView
          totalTabs={3}
          firstTabTitle={format(
            strings.openNInvoice,
            maintabNumber === 0
              ? memberListByFilter('Open').length
              : batchListByFilter('Open').length,
          )}
          secondTabTitle={format(
            strings.paidNInvoice,
            maintabNumber === 0
              ? memberListByFilter('Paid').length
              : batchListByFilter('Paid').length,
          )}
          thirdTabTitle={format(
            strings.allNInvoice,
            maintabNumber === 0
              ? memberListByFilter('All').length
              : batchListByFilter('All').length,
          )}
          indexCounter={tabNumber}
          eventPrivacyContianer={{width: 100}}
          onFirstTabPress={() => {
            setTabNumber(0);
          }}
          onSecondTabPress={() => {
            setTabNumber(1);
          }}
          onThirdTabPress={() => {
            setTabNumber(2);
          }}
          activeHeight={30}
          inactiveHeight={30}
        />

        <SafeAreaView style={{flex: 1}}>
          {maintabNumber === 0 ? (
            <FlatList
              data={
                (tabNumber === 0 && memberListByFilter('Open')) ||
                (tabNumber === 1 && memberListByFilter('Paid')) ||
                (tabNumber === 2 && memberListByFilter('All'))
              }
              renderItem={renderMemberView}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <FlatList
              data={
                (tabNumber === 0 && batchListByFilter('Open')) ||
                (tabNumber === 1 && batchListByFilter('Paid')) ||
                (tabNumber === 2 && batchListByFilter('All'))
              }
              renderItem={renderBatchView} // renderInvoiceView
              keyExtractor={(item, index) => index.toString()}
            />
          )}
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
              from: maintabNumber === 0 ? 'member' : 'batch',
            });
          }
        }}
      />

      <Portal>
        <Modalize
          withHandle={false}
          // adjustToContentHeight={true}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          // snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          HeaderComponent={createInvoiceModalHeader}
          ref={createInvoiceModalRef}>
          <View>
            <View>
              <TouchableOpacity
                onPress={() => recipientModalRef.current.open()}
                style={{
                  marginBottom: 15,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: 15,
                  marginRight: 15,
                  flexDirection: 'row',
                }}>
                <Text
                  style={
                    selectedRecipient.length > 0
                      ? styles.totalRecipient
                      : styles.recipientText
                  }>
                  {selectedRecipient.length > 0
                    ? format(strings.NreciepientText, selectedRecipient.length)
                    : strings.recipients}
                </Text>
                <Image style={styles.nextIconStyle} source={images.nextArrow} />
              </TouchableOpacity>
              <TCThinDivider width={'92%'} marginBottom={15} />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowCalender(!showCalender);
                }}
                style={{
                  marginBottom: 15,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: 15,
                  marginRight: 15,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  {strings.dueDate}
                </Text>
                <Text
                  style={
                    selectedDueDate
                      ? styles.dueDateSelectedText
                      : styles.dueDateText
                  }>
                  {selectedDueDate
                    ? moment(selectedDueDate).format('MMM DD, YYYY')
                    : strings.pleaseSelectText}
                </Text>
              </TouchableOpacity>
              <TCThinDivider
                width={'92%'}
                marginBottom={showCalender ? 10 : 0}
              />

              {showCalender && (
                <EventAgendaSection
                  showTimeTable={true}
                  isMenu={true}
                  horizontal={false}
                  onDayPress={(date) => {
                    console.log(date);
                    setSelectedDueDate(new Date(date.timestamp));
                    getSelectedDayEvents(date.dateString);
                  }}
                  calendarMarkedDates={markingDays}
                />
              )}
            </View>

            <View>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 15,
                  marginTop: 15,
                }}>
                {strings.invoiceTitle}
              </Text>
              <TextInput
                style={styles.amountTxt}
                onChangeText={(text) => setInvoiceTitle(text)}
                value={invoiceTitle}></TextInput>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 15,
                  marginTop: 15,
                }}>
                {strings.amountDueTitle}
              </Text>
              <TextInput
                style={styles.amountTxt}
                onChangeText={(text) => {
                  if (IsNumeric(text)) {
                    setAmount(text);
                  }
                }}
                keyboardType="numeric"
                value={amount}></TextInput>
            </View>

            <View style={{marginBottom: 10}}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 15,
                  marginTop: 15,
                }}>
                {strings.invoiceDescTitle}
              </Text>
              <TextInput
                style={styles.noteTxt}
                multiline
                onChangeText={(text) => setNote(text)}
                value={note}></TextInput>
            </View>
          </View>
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight={true}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          HeaderComponent={RecipientsModalHeader}
          ref={recipientModalRef}>
          <View>
            <View>
              <View>
                <View
                  style={{
                    marginBottom: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 15,
                    marginRight: 15,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.RRegular,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                    {strings.all}
                  </Text>
                  {/* <Image source={images.orangeCheckBox} style={styles.checkButton} /> */}
                  <TouchableOpacity
                    onPress={() => {
                      // onTagCancelPress({ item, index }
                      setRecipientAllData(!recipientAllData);
                      const result = recipientData.map((el) => {
                        const o = {...el};
                        o.selected = !recipientAllData;
                        return o;
                      });

                      setRecipientData([...result]);
                    }}>
                    <Image
                      source={
                        recipientAllData
                          ? images.orangeCheckBox
                          : images.uncheckEditor
                      }
                      style={styles.checkButton}
                    />
                  </TouchableOpacity>
                </View>
                <TCThinDivider width={'92%'} />
              </View>

              <View style={{margin: 15}}>
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  {strings.membersTitle}
                </Text>
                <FlatList
                  data={recipientData}
                  renderItem={renderRecipients}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
        </Modalize>
      </Portal>

      {/* Filter modal */}

      <Portal>
        <Modalize
          withHandle={false}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          HeaderComponent={filterModalHeader}
          ref={filterModalRef}>
          <View>
            <View>
              <Text style={styles.radioHeader}>Filter by payment</Text>
              <View>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() =>
                    setFilterPayment(DataSource.filterByPayment[0])
                  }>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByPayment[0]}
                  </Text>
                  <Image
                    source={
                      filterPayment === DataSource.filterByPayment[0]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() =>
                    setFilterPayment(DataSource.filterByPayment[1])
                  }>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByPayment[1]}
                  </Text>
                  <Image
                    source={
                      filterPayment === DataSource.filterByPayment[1]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() =>
                    setFilterPayment(DataSource.filterByPayment[2])
                  }>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByPayment[2]}
                  </Text>
                  <Image
                    source={
                      filterPayment === DataSource.filterByPayment[2]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              </View>
              <TCThinDivider width={'92%'} marginTop={15} />
            </View>
            {/* filter by batch */}
            <View style={{marginTop: 10}}>
              <Text style={styles.radioHeader}>Filter by Member of Batch</Text>
              <View>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterBatch(DataSource.filterByBatch[0])}>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByBatch[0]}
                  </Text>
                  <Image
                    source={
                      filterBatch === DataSource.filterByBatch[0]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterBatch(DataSource.filterByBatch[1])}>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByBatch[1]}
                  </Text>
                  <Image
                    source={
                      filterBatch === DataSource.filterByBatch[1]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterBatch(DataSource.filterByBatch[2])}>
                  <Text style={styles.radioTitle}>
                    {DataSource.filterByBatch[2]}
                  </Text>
                  <Image
                    source={
                      filterBatch === DataSource.filterByBatch[2]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              </View>
              <TCThinDivider width={'92%'} marginTop={15} />
            </View>

            {/* filter by date */}
            <View style={{marginTop: 10}}>
              <Text style={styles.radioHeader}>Filter by date</Text>
              <View>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[0])}>
                  <Text style={styles.radioTitle}>{filterByDate[0]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[0]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[1])}>
                  <Text style={styles.radioTitle}>{filterByDate[1]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[1]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[2])}>
                  <Text style={styles.radioTitle}>{filterByDate[2]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[2]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[3])}>
                  <Text style={styles.radioTitle}>{filterByDate[3]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[3]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[4])}>
                  <Text style={styles.radioTitle}>{filterByDate[4]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[4]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setFilterDate(filterByDate[5])}>
                  <Text style={styles.radioTitle}>{filterByDate[5]}</Text>
                  <Image
                    source={
                      filterDate === filterByDate[5]
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              </View>
              {filterDate === filterByDate[5] && (
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 0.5,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.fromToTitle}>From</Text>
                    <TouchableOpacity
                      style={styles.dateView}
                      onPress={() => setFromdateVisisble(!fromdateVisisble)}>
                      <Text
                        style={[
                          styles.radioTitle,
                          {paddingLeft: 15, paddingRight: 15},
                        ]}>
                        {moment(filterFromDate).format('MMM DD, YYYY')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 0.5,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.fromToTitle}>To</Text>
                    <TouchableOpacity
                      style={styles.dateView}
                      onPress={() => setTodateVisisble(!todateVisisble)}>
                      <Text
                        style={[
                          styles.radioTitle,
                          {paddingLeft: 15, paddingRight: 15},
                        ]}>
                        {moment(filterToDate).format('MMM DD, YYYY')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modalize>
      </Portal>
      <DateTimePickerView
        date={filterFromDate}
        visible={fromdateVisisble}
        onDone={handleStartDatePress}
        onCancel={handleCancelPress}
        onHide={handleCancelPress}
        minimumDate={new Date()}
        minutesGap={5}
        mode={'date'}
      />
      <DateTimePickerView
        date={filterToDate}
        visible={todateVisisble}
        onDone={handleEndDatePress}
        onCancel={handleCancelPress}
        onHide={handleCancelPress}
        minimumDate={filterFromDate}
        minutesGap={5}
        mode={'date'}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },
  navTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  townsCupthreeDotIcon: {
    resizeMode: 'contain',
    height: 19,
    width: 8,
    marginLeft: 10,
    tintColor: colors.lightBlackColor,
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

  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  headerButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  cancelText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RLight,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    marginLeft: 15,
  },
  sendText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    marginRight: 15,
  },
  headerSeparator: {
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
    height: 2,
    marginBottom: 15,
  },
  nextIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 14,
    width: 8,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },

  amountTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: '92%',
  },

  noteTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    height: 100,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: '92%',
  },

  checkButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  profileImgStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 60,
  },
  profilenameStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    height: 34,
    width: 34,
    backgroundColor: colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  dueDateText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.userPostTimeColor,
  },
  dueDateSelectedText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.themeColor,
  },
  radioItem: {
    margin: 15,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  radioHeader: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  radioImage: {height: 20, width: 20, resizeMode: 'contain'},
  fromToTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.userPostTimeColor,
    marginRight: 15,
  },
  dateView: {
    height: 38,
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  recipientText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  totalRecipient: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.themeColor,
  },
});
