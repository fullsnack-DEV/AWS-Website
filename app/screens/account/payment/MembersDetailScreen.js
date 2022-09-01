/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
import React, {
  useState,
  useContext,
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
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import moment from 'moment';
import AuthContext from '../../../auth/context';
import {getGroupMembers} from '../../../api/Groups';
import {createInvoice} from '../../../api/Invoice';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import MembershipFeeView from '../../../components/invoice/MembershipFeeView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import images from '../../../Constants/ImagePath';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import TCThinDivider from '../../../components/TCThinDivider';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import {heightPercentageToDP} from '../../../utils';

let entity = {};
export default function MembersDetailScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const [from] = useState(route?.params?.from);
  const [memberData] = useState(route?.params?.memberData);

  const createInvoiceModalRef = useRef();
  const recipientModalRef = useRef();

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  // const isFocused = useIsFocused();

  const [recipientData, setRecipientData] = useState([]);

  const [tabNumber, setTabNumber] = useState(0);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState();
  const [invoiceTitle, setInvoiceTitle] = useState();
  const [showCalender, setShowCalender] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState();
  const [selectedRecipient, setSelectedRecipient] = useState([]);

  const [recipientAllData, setRecipientAllData] = useState(false);
  const [markingDays, setMarkingDays] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.navTitle}>
          {`${memberData?.first_name} ${memberData?.last_name}`}
        </Text>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => createInvoiceModalRef.current.open()}>
            <Image
              source={images.plusInvoice}
              style={styles.townsCupPlusIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [memberData?.first_name, memberData?.last_name, navigation]);

  useEffect(() => {
    setloading(true);
    getGroupMembers(authContext.entity.uid, authContext)
      .then((response) => {
        console.log('');
        setloading(false);

        const data = response.payload.map((obj) => {
          if (obj?.user_id === memberData?.user_id) {
            const temp = obj;
            temp.selected = true;
            setSelectedRecipient([`${memberData?.user_id}`]);
            return temp;
          }
          const temp = obj;
          temp.selected = false;
          return temp;
        });
        console.log('DATA:=>', data);
        setRecipientData(data);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, memberData?.user_id]);

  const createInvoiceValidation = () => {
    console.log(selectedDueDate);
    if (selectedRecipient.length <= 0) {
      Alert.alert('Please select recipients.');
      return false;
    }
    if (!selectedDueDate) {
      Alert.alert('Please select due date.');
      return false;
    }
    if (new Date(selectedDueDate) < new Date()) {
      Alert.alert('Please select valid due date.');
      return false;
    }
    if (!invoiceTitle) {
      Alert.alert('Please select invoice title.');
      return false;
    }
    if (!amount) {
      Alert.alert('Please select due amount.');
      return false;
    }
    if (amount < 1 && amount > 0) {
      Alert.alert('User should not allow less than $1 amount.');
      return false;
    }
    return true;
  };

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
          Done
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const createInvoiceModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => createInvoiceModalRef.current.close()}>
          Cancel
        </Text>

        <Text style={styles.titleText}>New Invoice</Text>
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
                  console.log('Create invoice res:=>', response.payload);
                  setloading(false);
                  createInvoiceModalRef?.current?.close();
                  navigation.goBack();
                })
                .catch((e) => {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                });
            }
          }}>
          Send
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const renderInvoiceView = ({item}) => {
    console.log('item', item);
    return (
      <MembershipFeeView
        data={item}
        onPressCard={() =>
          navigation.navigate('TeamInvoiceDetailScreen', {
            from,
            invoiceObj: item,
          })
        }
      />
    );
  };

  const memberListByFilter = useCallback(
    (status) => {
      console.log('Status', status);

      if (status === 'All') {
        return memberData?.invoices;
      }
      if (status === 'Paid') {
        return memberData?.invoices.filter(
          (obj) => obj.invoice_status === 'Paid',
        );
      }
      if (status === 'Open') {
        return memberData?.invoices.filter(
          (obj) =>
            obj.invoice_status === 'Unpaid' ||
            obj.invoice_status === 'Partially Paid',
        );
      }
    },
    [memberData?.invoices],
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
  const IsNumeric = (num) => num >= 0 || num < 0;
  const getSelectedDayEvents = useCallback((date) => {
    const markedDates = {};
    console.log('MARKED::', Object.keys(markedDates));
    markedDates[date] = {selected: true};
    setMarkingDays(markedDates);
    console.log('MARKED DATES::', JSON.stringify(markedDates));
  }, []);
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={{flex: 1}}>
        <TopFilterBar />

        <InvoiceAmount
          currencyType={strings.defaultCurrency}
          totalAmount={memberData?.invoice_total ?? '00.00'}
          paidAmount={memberData?.invoice_paid_total ?? '00.00'}
          openAmount={memberData?.invoice_open_total ?? '00.00'}
        />

        <TCTabView
          totalTabs={3}
          firstTabTitle={`Open (${memberListByFilter('Open').length})`}
          secondTabTitle={`Paid (${memberListByFilter('Paid').length})`}
          thirdTabTitle={`All (${memberListByFilter('All').length})`}
          indexCounter={tabNumber}
          eventPrivacyContianer={{width: 100}}
          onFirstTabPress={() => setTabNumber(0)}
          onSecondTabPress={() => setTabNumber(1)}
          onThirdTabPress={() => setTabNumber(2)}
        />
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={
              (tabNumber === 0 && memberListByFilter('Open')) ||
              (tabNumber === 1 && memberListByFilter('Paid')) ||
              (tabNumber === 2 && memberListByFilter('All'))
            }
            renderItem={renderInvoiceView}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </View>

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
                    ? `${selectedRecipient.length} Recipients`
                    : 'Recipients'}
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
          snapPoint={heightPercentageToDP(50)}
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
                    All
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

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },

  // modal style

  townsCupPlusIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
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
