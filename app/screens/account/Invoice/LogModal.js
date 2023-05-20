import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {format} from 'react-string-format';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {LogType, ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AuthContext from '../../../auth/context';
import {addLog} from '../../../api/Invoice';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';

export default function LogModal({
  isVisible,
  invoice,
  closeList,
  mode,
  onActionPress = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState();
  const authContext = useContext(AuthContext);

  const onAddLog = () => {
    if (addLogValidation()) {
      setLoading(true);
      const body = {};
      body.payment_mode = paymentType === 0 ? Verbs.CASH : Verbs.CHEQUE;
      body.amount = Number(parseFloat(amount).toFixed(2));
      body.payment_date = Number((new Date().getTime() / 1000).toFixed(0));
      body.transaction_type =
        mode === LogType.Payment ? Verbs.PAYMENT : Verbs.refundStatus;
      body.notes = notes;

      addLog(invoice.invoice_id, body, authContext)
        .then(() => {
          setLoading(false);
          Clearfileds();
          onActionPress();
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const Clearfileds = () => {
    closeList();
    setNotes('');
    setAmount('');
    setPaymentType(0);
  };

  const IsNumeric = (num) => num >= 0 || num < 0;

  const addLogValidation = () => {
    if (!amount) {
      Alert.alert(strings.dueAmountValidation);
      return false;
    }
    if (amount < 1 && amount >= 0) {
      Alert.alert(
        format(strings.lessThan1AmountValidation, invoice.currency_type),
      );
      return false;
    }
    if (mode === LogType.Payment && amount > invoice.amount_due) {
      Alert.alert(strings.moreThanInvoiceAmountValidation);
      return false;
    }
    if (mode === LogType.Refund && amount > invoice.amount_paid) {
      Alert.alert(strings.notRefundMorethanInvoiceValication);
      return false;
    }
    if (!notes) {
      Alert.alert(strings.invoiceNoteValidation);
      return false;
    }
    return true;
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => Clearfileds()}
      modalType={ModalTypes.style1}
      onRightButtonPress={() => onAddLog()}
      headerRightButtonText={strings.done}
      title={
        mode === LogType.Payment ? strings.logaPayment : strings.logaRefund
      }
      containerStyle={{padding: 0, width: '100%', height: '100%'}}>
      <ActivityLoader visible={loading} />
      <View
        style={{
          paddingHorizontal: 20,
        }}>
        <TCLabel
          style={{marginTop: 35, marginHorizontal: 0}}
          title={
            mode === LogType.Payment
              ? strings.amountRecevied.toUpperCase()
              : strings.amountRefunded.toUpperCase()
          }
          required={true}
        />

        <View
          style={{
            height: 35,
            paddingHorizontal: 0,
            marginTop: 12,
          }}>
          <TCTextField
            onChangeText={(text) => {
              if (IsNumeric(text)) {
                setAmount(text);
              }
            }}
            style={{
              marginTop: Platform.OS === 'android' ? 0 : -5,
              marginHorizontal: 0,
            }}
            keyboardType="numeric"
            placeholder={strings.enterAmount}
            value={amount}
            leftView={
              <Text
                style={{
                  alignSelf: 'center',
                  marginRight: 15,
                  fontFamily: fonts.RRegular,
                  fontSize: 16,

                  color: colors.lightBlackColor,
                }}>
                {invoice.currency_type}
              </Text>
            }
            textAlign="right"
          />
        </View>

        <View>
          <TCLabel
            style={{marginTop: 35, marginHorizontal: 0}}
            title={strings.method.toUpperCase()}
          />

          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => setPaymentType(0)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontFamily: fonts.RRegular,
              }}>
              {strings.inCashtext}
            </Text>
            <Image
              source={
                paymentType === 0
                  ? images.radioSelectYellow
                  : images.radioUnselect
              }
              style={{
                width: 22,
                height: 22,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => setPaymentType(1)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontFamily: fonts.RRegular,
              }}>
              {strings.byChequeText}
            </Text>
            <Image
              source={
                paymentType === 1
                  ? images.radioSelectYellow
                  : images.radioUnselect
              }
              style={{
                width: 22,
                height: 22,
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Notes  */}

        <View>
          <TCLabel
            style={{marginTop: 35, marginHorizontal: 0}}
            title={strings.noteTitle.toUpperCase()}
          />

          <View
            style={{
              height: 100,
              paddingHorizontal: 0,
              marginTop: 10,
            }}>
            <TCTextField
              height={100}
              multiline
              placeholder={strings.enterNotePlaceholder}
              onChangeText={(text) => setNotes(text)}
              style={{
                marginHorizontal: 0,
                textAlignVertical: 'top',
              }}
              value={notes}
            />
          </View>
        </View>
      </View>
    </CustomModalWrapper>
  );
}
