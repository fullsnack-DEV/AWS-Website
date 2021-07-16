/* eslint-disable no-unused-vars */
import React, {
 useState, useLayoutEffect, useRef, useCallback,
 } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
 KeyboardAvoidingView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import BatchFeeView from '../../../components/invoice/BatchFeeView';
import strings from '../../../Constants/String';
import TCThinDivider from '../../../components/TCThinDivider';
import { heightPercentageToDP as hp } from '../../../utils';
import DataSource from '../../../Constants/DataSource';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';

export default function InvoiceScreen({ navigation }) {
  const filterByDate = [
    'All invoices',
    'Past 90 days',
    moment().subtract(1, 'month').format('MMMM'),
    moment().format('YYYY'),
    moment().format('YYYY') - 1,
    'Choose a date range',
  ];
  // const [loading, setloading] = useState(false);
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

  const [recipientData, setRecipientData] = useState([
    { name: 'Kishan Makani' },
    { name: 'Karan Makani' },
    { name: 'Vineet Patidar' },
    { name: 'Arvind Patidar' },
  ]);

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
  }, [navigation]);

  const renderMemberView = ({ item }) => {
    console.log('item', item);
    return (
      <MemberInvoiceView
        data={item}
        onPressCard={() => navigation.navigate('MembersDetailScreen', { from: 'member' })
        }
      />
    );
  };

  const renderBatchView = ({ item }) => {
    console.log('item', item);
    return (
      <BatchFeeView
        data={item}
        onPressCard={() => navigation.navigate('BatchDetailScreen', { from: 'batch' })
        }
      />
    );
  };

  const createInvoiceModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => createInvoiceModalRef.current.close()}>
          Cancel
        </Text>

        <Text style={styles.titleText}>New Invoice</Text>
        <Text style={styles.sendText}>Send</Text>
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
          Cancel
        </Text>

        <Text style={styles.titleText}>Recipients</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            recipientModalRef.current.close();
          }}>
          Done
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
          Cancel
        </Text>

        <Text style={styles.titleText}>Filter</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            filterModalRef.current.close();
          }}>
          Apply
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const renderRecipients = ({ item, index }) => (
    <>
      <View style={styles.recipientContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={images.dummyPhoto} style={styles.profileImgStyle} />
          </View>
          <Text style={styles.profilenameStyle}>{item?.name}</Text>
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
    console.log('MARKED::', Object.keys(markedDates));
    markedDates[date] = { selected: true };
    setMarkingDays(markedDates);
    console.log('MARKED DATES::', JSON.stringify(markedDates));
  }, []);

  const renderTags = ({ item }) => (

    <View style={styles.textContainer}>
      <Text style={styles.tagTitleText}>{item}</Text>
      <Image source={images.tagDivider} style={styles.dividerImage} />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          // onTagCancelPress({ item, index })
          alert('cancel');
        }}>
        <Image source={images.cancelImage} style={styles.closeButton} />
      </TouchableOpacity>
    </View>

  );

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}
      <KeyboardAvoidingView>
        <TopFilterBar
        onFilterPress={() => filterModalRef?.current?.open()}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      </KeyboardAvoidingView>

      {searchText?.length > 0 && (
        <View>
          <FlatList
          data={filterSetting}
          renderItem={renderTags}
          keyExtractor={(item, index) => index.toString()}
          style={styles.tagListStyle}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        </View>
      )}
      {searchText?.length > 0 ? (
        <FlatList
          data={['1', '2', '3', '4']}
          renderItem={renderMemberView} // renderInvoiceView
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View>
          <TCTabView
            totalTabs={2}
            firstTabTitle={'MEMBERS (1)'}
            secondTabTitle={'BATCHES (3)'}
            indexCounter={maintabNumber}
            eventPrivacyContianer={{ width: 100 }}
            onFirstTabPress={() => setMaintabNumber(0)}
            onSecondTabPress={() => setMaintabNumber(1)}
            activeHeight={36}
            inactiveHeight={40}
          />

          {/* <SmallFilterSelectionView
        dataSource={invoiceMonthsSelectionData}
        placeholder={strings.selectInvoiceDuration}
        value={selectedDuration}
        onValueChange={(index) => setSelectedDuration(index)}
        containerStyle={{ height: 45, width: '92%' }}
      /> */}

          <InvoiceAmount
            currencyType={'CAD'}
            totalAmount={'100.00'}
            paidAmount={'85.00'}
            openAmount={'55.00'}
          />

          <TCTabView
            totalTabs={3}
            firstTabTitle={'Open (1)'}
            secondTabTitle={'Paid (3)'}
            thirdTabTitle={'All (4)'}
            indexCounter={tabNumber}
            eventPrivacyContianer={{ width: 100 }}
            onFirstTabPress={() => setTabNumber(0)}
            onSecondTabPress={() => setTabNumber(1)}
            onThirdTabPress={() => setTabNumber(2)}
            activeHeight={30}
            inactiveHeight={30}
          />

          {maintabNumber === 0 && tabNumber === 0 && (
            <FlatList
              data={['1']}
              renderItem={renderMemberView}
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          {maintabNumber === 0 && tabNumber === 1 && (
            <FlatList
              data={['1', '2', '3']}
              renderItem={renderMemberView}
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          {maintabNumber === 0 && tabNumber === 2 && (
            <FlatList
              data={['1', '2', '3', '4']}
              renderItem={renderMemberView} // renderInvoiceView
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          {maintabNumber === 1 && tabNumber === 0 && (
            <FlatList
              data={['1']}
              renderItem={renderBatchView} // renderInvoiceView
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          {maintabNumber === 1 && tabNumber === 1 && (
            <FlatList
              data={['1', '2', '3']}
              renderItem={renderBatchView} // renderInvoiceView
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          {maintabNumber === 1 && tabNumber === 2 && (
            <FlatList
              data={['1', '2', '3', '4']}
              renderItem={renderBatchView} // renderInvoiceView
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      )}

      <ActionSheet
        ref={actionSheet}
        options={['Canceled Invoices', 'Cancel']}
        cancelButtonIndex={1}
        // destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('CanceledInvoicesScreen');
          }
        }}
      />

      <Portal>
        <Modalize
          withHandle={false}
          // adjustToContentHeight={true}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          // snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
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
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Recipients
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
                  Due Date
                </Text>
                <Text
                  style={
                    selectedDueDate
                      ? styles.dueDateSelectedText
                      : styles.dueDateText
                  }>
                  {selectedDueDate
                    ? moment(selectedDueDate).format('MMM DD, YYYY')
                    : 'Please select'}
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
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
                value={amount}></TextInput>
            </View>

            <View style={{ marginBottom: 10 }}>
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
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
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
                    All
                  </Text>
                  {/* <Image source={images.orangeCheckBox} style={styles.checkButton} /> */}
                  <TouchableOpacity
                    onPress={() => {
                      // onTagCancelPress({ item, index }
                      setRecipientAllData(!recipientAllData);
                      const result = recipientData.map((el) => {
                        const o = { ...el };
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

              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Members
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
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
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
                  onPress={() => setFilterPayment(DataSource.filterByPayment[0])
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
                  onPress={() => setFilterPayment(DataSource.filterByPayment[1])
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
                  onPress={() => setFilterPayment(DataSource.filterByPayment[2])
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
            <View style={{ marginTop: 10 }}>
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
            <View style={{ marginTop: 10 }}>
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
                    <View style={styles.dateView}>
                      <Text
                        style={[
                          styles.radioTitle,
                          { paddingLeft: 15, paddingRight: 15 },
                        ]}>
                        Jul 12, 2018
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 0.5,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.fromToTitle}>To</Text>
                    <View style={styles.dateView}>
                      <Text
                        style={[
                          styles.radioTitle,
                          { paddingLeft: 15, paddingRight: 15 },
                        ]}>
                        Jul 12, 2018
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modalize>
      </Portal>
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
  radioImage: { height: 20, width: 20, resizeMode: 'contain' },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  // Tags view
  textContainer: {
    flexDirection: 'row',
     height: 25,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 2,
    backgroundColor: colors.offwhite,
    borderRadius: 13,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
  },

  closeButton: {
    alignSelf: 'center',
    width: 8,
    height: 8,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 10,
  },
  dividerImage: {
    alignSelf: 'center',
    width: 1,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 5,
  },
  tagListStyle: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  tagTitleText: {
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
});
