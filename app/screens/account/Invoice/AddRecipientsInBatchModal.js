import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import ReadMore from '@fawazahmed/react-native-read-more';
import moment from 'moment';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {
  ModalTypes,
  InvoiceType,
  InvoiceActionType,
  InvoiceRowType,
} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {
  createBatchInvoice,
  resendInvoice,
  addRecipientList,
  resendBatchInvoice,
} from '../../../api/Invoice';
import {getJSDate} from '../../../utils';
import AddRecipientsModal from './AddRecipientsModal';
import RecipientCell from './RecipientCell';
import Verbs from '../../../Constants/Verbs';
import ResendInvoiceCell from './ResendInvoiceCell';
import ResendRecipientCell from './ResendRecipientCell';
import AddResendRecipientsModal from './AddResendRecipientsModal';

export default function AddRecipientsInBatchModal({
  visible,
  closeModal,
  invoice,
  batchData,
  invoiceAction,
  title,
  onDonePressForAddRecipients = () => {},
  onDonePressForResend = () => {},
}) {
  const [newMembers, setNewMembers] = useState([]);
  const [newTeams, setNewTeams] = useState([]);
  const [resendMessage, setResendMessage] = useState();
  const [mLoading, setMLoading] = useState();
  const [currentInvoice] = useState(invoice ?? batchData.invoices[0]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [showChooseRecipientsModal, setShowChooseRecipientsModal] =
    useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (visible) {
      setResendMessage();
      if (invoiceAction === InvoiceActionType.AddRecipient) {
        setMLoading(true);
        addRecipientList(batchData.batch_id, authContext)
          .then((response) => {
            setMLoading(false);
            setNewMembers(response.payload.members ?? []);
            setNewTeams(response.payload.teams ?? []);
          })
          .catch((e) => {
            setMLoading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    }
  }, [visible]);

  const showRecipientsClicked = () => {
    setShowRecipientsModal(true);
  };

  const onChooseRecipientsClicked = () => {
    setShowChooseRecipientsModal(true);
  };

  const onAddRecipients = (recipients) => {
    setSelectedRecipients(recipients);
    setShowRecipientsModal(false);
  };

  const onAddResendRecipients = (recipients) => {
    setSelectedRecipients(recipients);
    setShowRecipientsModal(false);
  };

  const renderRecipient = ({item, index}) => (
    <RecipientCell
      item={item}
      index={index}
      onSelectCancel={removeRecipient}
      rowType={InvoiceRowType.CancelRecipient}
    />
  );

  const renderResendRecipient = ({item, index}) => (
    <ResendRecipientCell
      item={item}
      index={index}
      onSelectCancel={removeRecipient}
    />
  );

  const getModalTitle = () => {
    if (invoiceAction === InvoiceActionType.ResendBatch) {
      return strings.resendInvoiceModalTitle;
    }
    if (invoiceAction === InvoiceActionType.Resend) {
      return strings.resendInvoiceSingleTitle;
    }

    return strings.chooseReciepientModaltitle;
  };

  /* eslint-disable no-unused-vars */
  const removeRecipient = ({item, index}) => {
    selectedRecipients.splice(index, 1);
    const result = [...selectedRecipients];
    setSelectedRecipients(result);
  };

  const sendInvoiceValidation = () => {
    if (selectedRecipients.length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }
    return true;
  };

  const onAddRecipientsInBatch = () => {
    if (sendInvoiceValidation()) {
      setMLoading(true);
      const body = {};
      body.email_sent = true;
      body.new_message = resendMessage;
      const recipients = selectedRecipients.map((entity) => {
        if (entity.user_id) {
          if (currentInvoice.invoice_type === InvoiceType.Event) {
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

      createBatchInvoice(batchData.batch_id, body, authContext)
        .then(() => {
          setMLoading(false);
          setSelectedRecipients([]);
          onDonePressForAddRecipients();
        })
        .catch((e) => {
          setMLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const onResendInvoicesInBatch = () => {
    if (sendInvoiceValidation()) {
      setMLoading(true);
      const body = {};
      body.email_sent = true;
      body.resend_msg = resendMessage;
      const recipients = selectedRecipients.map((obj) => obj.invoice_id);
      body.resend_invoices = recipients;

      resendBatchInvoice(batchData.batch_id, body, authContext)
        .then(() => {
          setMLoading(false);
          setSelectedRecipients([]);
          onDonePressForResend();
        })
        .catch((e) => {
          setMLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const onResendInvoice = () => {
    setMLoading(true);
    const body = {};
    body.email_sent = true;
    body.resend_msg = resendMessage;
    resendInvoice(currentInvoice.invoice_id, body, authContext)
      .then(() => {
        setMLoading(false);
        setSelectedRecipients([]);
        closeModal();
        onDonePressForResend();
      })
      .catch((e) => {
        setMLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onDonePress = () => {
    if (invoiceAction === InvoiceActionType.AddRecipient) {
      onAddRecipientsInBatch();
    } else if (invoiceAction === InvoiceActionType.Resend) {
      onResendInvoice();
    } else if (invoiceAction === InvoiceActionType.ResendBatch) {
      onResendInvoicesInBatch();
    }
  };

  const listEmptyComponent = () => (
    <View style={styles.ListemptyContainer}>
      <Text style={styles.ListEmptyTextstyle}>{strings.noRecipient}</Text>
    </View>
  );

  const onCloseModal = () => {
    setResendMessage('');

    setSelectedRecipients([]);
    setShowRecipientsModal([]);
    setNewMembers([]);
    setNewTeams([]);
    closeModal();
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={() => onCloseModal()}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.send}
      title={title}
      onRightButtonPress={onDonePress}
      containerStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <ActivityLoader visible={mLoading} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={styles.headertitle}>
          <Text style={styles.headerTextstyle}>{getModalTitle()}</Text>
        </View>
        {/* Detail fields */}
        <View style={styles.detailfielsstyle}>
          {/* title  */}
          <View style={styles.Rowsstyle}>
            <Text style={styles.titleStyles}>
              {strings.title.toUpperCase()}
            </Text>
            <Text style={styles.invoicetitletext}>
              {currentInvoice.invoice_title}
            </Text>
          </View>

          {/* amount */}
          <View style={styles.Rowsstyle}>
            <Text style={styles.titleStyles}>
              {strings.amountTitle.toUpperCase()}
            </Text>
            <Text style={styles.invoicetitletext}>
              {`${currentInvoice.amount_due} ${currentInvoice.currency_type}`}
            </Text>
          </View>

          {/* Due Date */}
          <View style={styles.Rowsstyle}>
            <Text style={styles.titleStyles}>
              {strings.duedate.toUpperCase()}
            </Text>
            <Text style={styles.invoicetitletext}>
              {moment(getJSDate(currentInvoice.due_date)).format(
                Verbs.DATE_FORMAT,
              )}
            </Text>
          </View>

          {/* description */}
          <View style={styles.Rowsstyle}>
            <Text style={styles.titleStyles}>
              {strings.description.toUpperCase()}
            </Text>

            <ReadMore
              numberOfLines={3}
              style={styles.ReadMorestyles}
              seeMoreText={strings.moreText}
              seeLessText={strings.lessText}
              seeLessStyle={[
                styles.moreLessText,
                {
                  color: colors.userPostTimeColor,
                },
              ]}
              seeMoreStyle={[
                styles.moreLessText,
                {
                  color: colors.userPostTimeColor,
                },
              ]}>
              {currentInvoice.invoice_desc}
            </ReadMore>
          </View>

          {/* Add new ,essage */}
          <View
            style={{
              marginTop: 25,
            }}>
            <Text style={styles.titleStyles}>
              {strings.addnewMessage.toUpperCase()}
            </Text>

            {/* Textinp */}

            <TextInput
              style={styles.TextInputStyles}
              multiline
              textAlignVertical="top"
              onChangeText={(text) => setResendMessage(text)}
              value={resendMessage}
            />
          </View>

          {/* Recipients  * */}
          {invoiceAction === InvoiceActionType.AddRecipient && (
            <View style={styles.RecepintContainerStyle}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.RecipentTextStyle}>
                  {`${strings.newRecipents} `.toUpperCase()}
                </Text>
                {selectedRecipients.length > 0 && (
                  <Text style={styles.selectedText}>
                    {' ('}
                    {selectedRecipients.length}
                    {')'}
                  </Text>
                )}
                <Text style={{marginTop: 4, color: 'red'}}>
                  {' '}
                  {strings.star}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                }}
                onPress={() => showRecipientsClicked()}>
                <Text style={styles.addTextStyle}>{strings.addText}</Text>
                <Image source={images.nextArrow} style={styles.ArrowStyle} />
              </TouchableOpacity>
            </View>
          )}
          {invoiceAction === InvoiceActionType.ResendBatch && (
            <View style={styles.RecepintContainerStyle}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    lineHeight: 24,
                  }}>
                  {`${strings.recipients} `.toUpperCase()}
                </Text>
                {selectedRecipients.length > 0 && (
                  <Text style={styles.selectedText}>
                    {' ('}
                    {selectedRecipients.length}
                    {')'}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                }}
                onPress={() => onChooseRecipientsClicked()}>
                <Text style={styles.addTextStyle}>{strings.choose}</Text>
                <Image source={images.nextArrow} style={styles.ArrowStyle} />
              </TouchableOpacity>
            </View>
          )}
          {invoiceAction === InvoiceActionType.Resend && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 25,
                color: colors.lightBlackColor,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.RecipentTextStyle}>
                  {`${strings.recipients} `.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* recipient lists */}

        {invoiceAction === InvoiceActionType.Resend && (
          <ResendInvoiceCell invoice={currentInvoice} />
        )}

        {invoiceAction === InvoiceActionType.AddRecipient && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedRecipients}
            style={{marginTop: 10}}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
            renderItem={renderRecipient}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={() => <View style={{marginBottom: 100}} />}
          />
        )}

        {invoiceAction === InvoiceActionType.ResendBatch && (
          <FlatList
            style={{marginTop: 10}}
            data={selectedRecipients}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
            renderItem={renderResendRecipient}
            ListEmptyComponent={listEmptyComponent}
            nestedScrollEnabled
          />
        )}

        <AddRecipientsModal
          isVisible={showRecipientsModal}
          onDone={onAddRecipients}
          onClose={() => setShowRecipientsModal(false)}
          recipientMembers={newMembers}
          recipientTeams={newTeams}
          selectedRecipients={selectedRecipients}
          invoiceType={currentInvoice.invoice_type}
          rightbuttonText={strings.addText}
        />

        {invoiceAction === InvoiceActionType.ResendBatch && (
          <AddResendRecipientsModal
            isVisible={showChooseRecipientsModal}
            onDone={onAddResendRecipients}
            onClose={() => setShowChooseRecipientsModal(false)}
            invoices={batchData.invoices ?? []}
            selectedRecipients={selectedRecipients}
            ModalTitle={strings.addresendRecipintModaltitle}
          />
        )}
      </ScrollView>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  headertitle: {
    marginTop: 15,
  },
  titleStyles: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
  },
  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 1,
  },
  ListemptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  ListEmptyTextstyle: {
    marginTop: 25,
    fontFamily: fonts.RRegular,
    color: colors.grayColor,
    fontSize: 26,
    lineHeight: 24,
  },
  headerTextstyle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    lineHeight: 30,
    paddingHorizontal: 15,
  },
  detailfielsstyle: {
    paddingHorizontal: 15,
  },
  Rowsstyle: {
    marginTop: 25,
  },
  invoicetitletext: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    marginTop: 5,
  },
  ReadMorestyles: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginTop: 5,
    color: colors.lightBlackColor,
  },
  TextInputStyles: {
    height: 100,
    backgroundColor: colors.lightGrey,
    marginTop: 10,
    color: colors.lightBlackColor,
    borderRadius: 4,
  },
  RecepintContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    color: colors.lightBlackColor,
  },
  RecipentTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 24,
  },
  selectedText: {
    color: colors.orangeColorCard,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RBold,
    lineHeight: 24,
  },
  addTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    marginRight: 5,
    color: colors.orangeColorCard,
  },
  ArrowStyle: {
    tintColor: colors.orangeColorCard,
    marginTop: 2,
    alignSelf: 'center',
    height: 15,
    width: 15,

    resizeMode: 'contain',
  },
});
