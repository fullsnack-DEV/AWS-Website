// @flow
/* eslint-disable no-else-return */

import React, {useState, useContext} from 'react';
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import moment from 'moment';

import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {
  ModalTypes,
  InvoiceType,
  InvoiceRowType,
} from '../../../Constants/GeneralConstants';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';

import AddRecipientsModal from './AddRecipientsModal';
import {getTeamsOfClub, getGroupMembers} from '../../../api/Groups';
import {createInvoice} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getTCDate} from '../../../utils';
import RecipientCell from './RecipientCell';
import CurrencyModal from '../../../components/CurrencyModal/CurrencyModal';

const SendNewInvoiceModal = ({
  isVisible,
  onDone = () => {},
  onClose = () => {},
  invoiceType = InvoiceType.Invoice,
}) => {
  const authContext = useContext(AuthContext);
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [selectedDueDate, setSelectedDueDate] = useState();
  const [description, setDescription] = useState();
  const [dueDateVisible, setDueDateVisible] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [isRecipientDataFetched, setIsRecipientDataFetched] = useState(false);
  const [recipientMemberData, setRecipientMemberData] = useState([]);
  const [recipientTeamData, setRecipientTeamData] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  const IsNumeric = (num) => num >= 0 || num < 0;

  const handleDueDatePress = (date) => {
    setSelectedDueDate(new Date(date));
    setDueDateVisible(false);
  };

  const handleCancelDueDatePress = () => {
    setDueDateVisible(false);
  };

  const getGroupMembersData = async () => {
    setLoading(true);
    if (invoiceType === InvoiceType.Invoice) {
      if (authContext.entity.role === Verbs.entityTypeClub) {
        const promises = [
          getGroupMembers(authContext.entity.uid, authContext),
          getTeamsOfClub(authContext.entity.uid, authContext),
        ];
        Promise.all(promises)
          .then(([res1, res2]) => {
            setLoading(false);
            setRecipientMemberData(res1.payload);
            setRecipientTeamData(res2.payload);
            setShowRecipientsModal(true);
            setIsRecipientDataFetched(true);
          })
          .catch((e) => {
            setLoading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        getGroupMembers(authContext.entity.uid, authContext).then(
          (response) => {
            setLoading(false);
            setRecipientMemberData(response.payload);
            setShowRecipientsModal(true);
            setIsRecipientDataFetched(true);
          },
        );
      }
    } else if (invoiceType === InvoiceType.Event) {
      setLoading(false);
    }
  };

  const showRecipientsClicked = () => {
    if (!isRecipientDataFetched) {
      getGroupMembersData();
    } else {
      setShowRecipientsModal(true);
    }
  };

  const onCloseThisModal = () => {
    setInvoiceTitle('');
    setAmount(0);
    setCurrency('USD');
    setSelectedDueDate(undefined);
    setDescription('');
    setDueDateVisible(false);
    setShowCurrencyModal(false);
    setShowRecipientsModal(false);
    setIsRecipientDataFetched(false);
    setRecipientMemberData([]);
    setRecipientTeamData([]);
    setSelectedRecipients([]);
    setLoading(false);
    onClose();
  };

  const onSendInvoice = () => {
    if (sendInvoiceValidation()) {
      setLoading(true);
      const body = {};
      const recipients = selectedRecipients.map((entity) => {
        if (entity.user_id) {
          if (invoiceType === InvoiceType.Event) {
            return {
              entity_id: entity.user_id,
              entity_type: Verbs.entityTypeUser,
              name: `${entity.first_name} ${entity.last_name}`,
              email: entity.email,
            };
          }
          if (entity.connected) {
            return {
              entity_id: entity.user_id,
              entity_type: Verbs.entityTypeUser,
              name: `${entity.first_name} ${entity.last_name}`,
              email: entity.email,
            };
          }
          return {
            entity_id: entity.user_id,
            entity_type: Verbs.entityTypeGroupMember,
            name: `${entity.first_name} ${entity.last_name}`,
            email: entity.email,
          };
        }
        return {entity_id: entity.group_id, entity_type: entity.entity_type};
      });

      body.receivers = recipients;
      body.due_date = getTCDate(selectedDueDate);
      body.invoice_title = invoiceTitle;
      body.amount_due = Number(parseFloat(amount).toFixed(2));
      body.currency_type = currency;
      body.invoice_description = description;
      body.invoice_type = invoiceType;
      body.email_sent = false;
      body.sender_name = authContext.entity.obj.group_name
        ? authContext.entity.obj.group_name
        : authContext.entity.obj.full_name;

      createInvoice(body, authContext)
        .then(() => {
          setLoading(false);
          let message = `1 ${strings.invoicesent}`;
          if (recipients.length > 1) {
            message = `${recipients.length} ${strings.invoicessent}`;
          }
          Alert.alert(
            message,
            undefined,
            [
              {
                text: strings.okTitleText,
                onPress: () => {
                  onCloseThisModal();
                  onDone();
                },
              },
            ],
            {cancelable: false},
          );
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const sendInvoiceValidation = () => {
    if (!invoiceTitle || invoiceTitle.length < 3) {
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

    if (!selectedDueDate) {
      Alert.alert(strings.dueDateValidation);
      return false;
    }
    if (selectedDueDate <= new Date()) {
      Alert.alert(strings.validDueDateValidation);
      return false;
    }

    if (selectedRecipients.length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }

    return true;
  };

  const onAddRecipients = (recipients) => {
    setSelectedRecipients(recipients);
    setShowRecipientsModal(false);
  };

  /* eslint-disable no-unused-vars */
  const removeRecipient = ({item, index}) => {
    selectedRecipients.splice(index, 1);
    const result = [...selectedRecipients];
    setSelectedRecipients(result);
  };

  const renderRecipient = ({item, index}) => (
    <RecipientCell
      item={item}
      index={index}
      onSelectCancel={removeRecipient}
      rowType={InvoiceRowType.CancelRecipient}
    />
  );

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          marginTop: 25,
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noRecipient}
      </Text>
    </View>
  );

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => onCloseThisModal()}
      modalType={ModalTypes.style1}
      title={strings.newInvoice}
      containerStyle={{padding: 0}}
      headerRightButtonText={strings.send}
      onRightButtonPress={() => onSendInvoice()}>
      <ActivityLoader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Code for Invoice Title */}

        <TCLabel
          style={{marginTop: 28, marginBottom: 6}}
          title={strings.titlePlaceholder.toUpperCase()}
          required={true}
        />
        <TCTextField
          height={35}
          onChangeText={(text) => setInvoiceTitle(text)}
          value={invoiceTitle}
        />

        {/* Code for Invoice Amount */}
        <View style={{height: 96}}>
          <TCLabel
            style={{marginTop: 38}}
            title={strings.amountTitle.toUpperCase()}
            required={true}
          />
          <TCTextField
            onChangeText={(text) => {
              if (IsNumeric(text)) {
                setAmount(text);
              }
            }}
            value={amount}
            style={{
              marginTop: 6,
              height: 35,
            }}
            keyboardType={'decimal-pad'}
            textAlign="right"
            leftView={<Text style={styles.leftViewStyle}>{currency}</Text>}
          />
        </View>
        {/* Code for Change Currency */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setShowCurrencyModal(true)}>
          <Text style={styles.linkButtonText}>{strings.changeCurrency}</Text>
        </TouchableOpacity>
        {/* Code for DueDate */}
        <View style={{height: 70}}>
          <TCLabel
            style={{marginTop: 12}}
            title={strings.duedate.toUpperCase()}
            required={true}
          />
          <TouchableOpacity
            onPress={() => setDueDateVisible(true)}
            style={{
              marginHorizontal: 15,
              flexDirection: 'row',
              alignSelf: 'stretch',
              alignItems: 'center',
              backgroundColor: colors.textFieldBackground,
              borderRadius: 4,
              flex: 1,
              marginTop: 6,
              height: 35,
            }}>
            <Text
              style={{
                textAlign: 'center',
                flex: 1,
                fontFamily: fonts.RRegular,
                fontSize: 16,
                paddingHorizontal: 10,
                color: selectedDueDate
                  ? colors.lightBlackColor
                  : colors.magnifyIconColor,
              }}>
              {selectedDueDate
                ? moment(selectedDueDate).format('LLL')
                : strings.select}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Code for Timezone */}
        <View style={styles.linkButton}>
          <Text style={styles.timeZoneText}>Time zone </Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                Platform.OS === 'android' ? '' : strings.datetimesetting,
                Platform.OS === 'android' ? strings.datetimesetting : '',
                [
                  {
                    text: strings.okTitleText,
                    onPress: () => console.log('no'),
                  },
                ],
              );
            }}>
            <Text style={styles.timeZoneUnderlineText}>
              {Intl.DateTimeFormat()
                ?.resolvedOptions()
                .timeZone.split('/')
                .pop()}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Code for Description */}
        <View style={{height: 132}}>
          <TCLabel
            style={{marginTop: 9}}
            title={strings.descriptionText.toUpperCase()}
          />
          <TextInput
            style={styles.descriptionTxt}
            multiline
            textAlignVertical="top"
            onChangeText={(text) => setDescription(text)}
            value={description}></TextInput>
        </View>
        {/* Code for Recipients Header */}
        <View
          style={{
            height: 59,
            paddingTop: 35,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginLeft: 15,
                color: colors.lightBlackColor,
                fontSize: 16,
                textAlign: 'left',
                fontFamily: fonts.RBold,
                lineHeight: 24,
              }}>
              {strings.recipients.toUpperCase()}
            </Text>
            {selectedRecipients.length > 0 && (
              <Text
                style={{
                  color: colors.orangeColorCard,
                  fontSize: 16,
                  textAlign: 'left',
                  fontFamily: fonts.RBold,
                  lineHeight: 24,
                }}>
                {' ('}
                {selectedRecipients.length}
                {')'}
              </Text>
            )}
            <Text style={{marginTop: 4, color: 'red'}}> {strings.star}</Text>
          </View>
          <TouchableOpacity onPress={() => showRecipientsClicked()}>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: colors.orangeColorCard,
                  fontSize: 16,
                  textAlign: 'right',
                  fontFamily: fonts.RRegular,
                  paddingEnd: 8,
                  lineHeight: 24,
                }}>
                {strings.addText}
              </Text>
              <Image source={images.nextArrow} style={styles.nextArrow} />
            </View>
          </TouchableOpacity>
        </View>
        {/* recipient lists */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedRecipients}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
          renderItem={renderRecipient}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={() => <View style={{marginBottom: 20}} />}
        />
        {/* Code for DueDate Model */}
        <DateTimePickerView
          date={selectedDueDate}
          visible={dueDateVisible}
          onDone={handleDueDatePress}
          onCancel={handleCancelDueDatePress}
          onHide={handleCancelDueDatePress}
          minimumDate={new Date()}
          minutesGap={15}
          mode={'datetime'}
        />

        <CurrencyModal
          isVisible={showCurrencyModal}
          closeList={() => setShowCurrencyModal(false)}
          onNext={(item) => {
            setCurrency(item);
            setShowCurrencyModal(false);
          }}
        />

        {/* <Modal visible={showCurrencyModal} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: colors.whiteColor,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}>
              <View style={modalStyles.headerRow}>
                <View style={{flex: 1}} />
                <View style={modalStyles.headerTitleContainer}>
                  <Text style={modalStyles.headerTitle}>
                    {strings.currencySetting}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Pressable
                    style={{width: 26, height: 26}}
                    onPress={() => setShowCurrencyModal(false)}>
                    <Image
                      source={images.crossImage}
                      style={modalStyles.image}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={modalStyles.divider} />
              <View style={{paddingHorizontal: 15, paddingVertical: 19}}>
                <FlatList
                  data={DataSource.CurrencyType}
                  keyExtractor={(item, index) => index}
                  renderItem={({item}) => (
                    <>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          setCurrency(item.value);
                          setShowCurrencyModal(false);
                        }}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              fontSize: 16,
                              lineHeight: 24,
                              fontFamily: fonts.RMedium,
                            }}>
                            {item.label}
                          </Text>
                        </View>
                        <Image
                          source={
                            currency === item.value
                              ? images.radioCheckYellow
                              : images.radioUnselect
                          }
                          style={{height: 22, width: 22}}
                        />
                      </Pressable>
                      <View style={modalStyles.divider} />
                    </>
                  )}
                />
              </View>
            </View>
          </View>
        </Modal> */}

        <AddRecipientsModal
          isVisible={showRecipientsModal}
          onDone={onAddRecipients}
          onClose={() => setShowRecipientsModal(false)}
          recipientMembers={recipientMemberData}
          recipientTeams={recipientTeamData}
          selectedRecipients={selectedRecipients}
          invoiceType={invoiceType}
        />
      </ScrollView>
    </CustomModalWrapper>
  );
};

export default SendNewInvoiceModal;

const styles = StyleSheet.create({
  leftViewStyle: {
    alignSelf: 'center',
    marginRight: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  linkButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  linkButtonText: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
  },
  timeZoneText: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 23,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  timeZoneUnderlineText: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 23,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textDecorationLine: 'underline',
  },
  descriptionTxt: {
    height: 100,
    marginTop: 6,
    marginHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 4,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
  nextArrow: {
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
  },
  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 1,
  },
});
