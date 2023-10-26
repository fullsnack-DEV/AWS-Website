import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useContext} from 'react';
import moment from 'moment';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {getJSDate} from '../../../utils';
import TCThinDivider from '../../../components/TCThinDivider';
import Verbs from '../../../Constants/Verbs';
import {addLog, deleteInvoiceLog} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function LogDetailModal({
  isVisible,
  invoice,
  log,
  closeList,
  from,
  onActionPress = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const onDeleteLog = () => {
    setLoading(true);
    deleteInvoiceLog(invoice.invoice_id, log.transaction_id, authContext)
      .then(() => {
        setLoading(false);
        onActionPress();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onrefundLog = () => {
    const body = {};
    body.payment_mode = log.payment_mode; // Verbs.CASH
    body.amount = Number(parseFloat(log.amount).toFixed(2));
    body.strip_refund = true;
    body.payment_date = Number((new Date().getTime() / 1000).toFixed(0));
    body.transaction_type = Verbs.refundStatus;

    setLoading(true);
    addLog(invoice.invoice_id, body, authContext)
      .then(() => {
        setLoading(false);
        onActionPress();
        closeList();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onDeletePress = () => {
    Alert.alert(
      Platform.OS === 'android' ? '' : strings.deleteLogText,
      Platform.OS === 'android' ? strings.deleteLogText : '',
      [
        {
          text: strings.cancel,
        },
        {
          text: strings.delete,
          onPress: () => onDeleteLog(),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const onRefundPress = () => {
    onrefundLog();
  };

  const getPaymentModeText = () => {
    if (log.transaction_type === Verbs.PAYMENT) {
      if (log.payment_mode === Verbs.CASH) {
        return strings.inCashtext;
      }
      if (log.payment_mode === Verbs.card) {
        return strings.throughStripe;
      }
      return strings.byChequeText;
    }
    if (log.payment_mode === Verbs.CASH) {
      return strings.inCashtext;
    }
    if (log.payment_mode === Verbs.card) {
      return strings.throughStripe;
    }
    return strings.byChequeText;
  };

  const RenderDeleteRefundButtons = () => {
    if (log.transaction_type === Verbs.PAYMENT) {
      if (log.payment_mode === Verbs.card) {
        return (
          <TouchableOpacity
            onPress={() => onRefundPress()}
            style={styles.refundbtnstyle}>
            <Text
              style={[
                styles.btntextstyle,
                {
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  lineHeight: 24,
                  textTransform: 'uppercase',
                  color: colors.lightBlackColor,
                },
              ]}>
              {strings.refund}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    if (log.transaction_type === Verbs.refundStatus) {
      if (log.payment_mode === Verbs.card) {
        return null;
      }
    }

    return (
      <TouchableOpacity onPress={() => onDeletePress()} style={styles.btnstyle}>
        <Text style={styles.btntextstyle}>{strings.deletelogbtntext}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style8}
      headerRightButtonText={strings.done}
      title={strings.log}
      containerStyle={{padding: 0, flex: 1}}
      showBackButton>
      <ActivityLoader visible={loading} />
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 20,
          flex: 1,
        }}>
        {/* transction */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.textStyle}>{strings.transctionNumber}</Text>
          <Text style={styles.textStyle}>{log.transaction_id}</Text>
        </View>

        {/* logged by */}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 6,
          }}>
          <Text
            style={[
              styles.textStyle,
              {color: colors.userPostTimeColor, fontSize: 12, lineHeight: 18},
            ]}>
            {strings.loggedbytxt}{' '}
          </Text>
          <Text
            style={[
              styles.textStyle,
              {color: colors.userPostTimeColor, fontSize: 12, lineHeight: 18},
            ]}>
            {`${log.done_by?.first_name} ${log.done_by?.last_name}`}
          </Text>
        </View>

        {/* lig Detail */}

        <View
          style={{
            marginTop: 29,
            marginBottom: 25,
          }}>
          <View style={styles.rowStyle}>
            <Text style={styles.textStyle}>{strings.logType}</Text>
            <Text
              style={[styles.statusTextStyle, {textTransform: 'capitalize'}]}>
              {' '}
              {log.transaction_type}{' '}
            </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.amountTitle}:</Text>
            <Text
              style={[
                styles.statusTextStyle,
                {
                  color:
                    log?.transaction_type === Verbs.PAYMENT
                      ? colors.neonBlue
                      : colors.darkThemeColor,
                },
              ]}>
              {log.transaction_type === Verbs.PAYMENT ? (
                <Text>
                  {`${log.amount?.toFixed(2)} ${invoice?.currency_type}`}
                </Text>
              ) : (
                <Text>{`-${log.amount?.toFixed(2)} ${
                  invoice?.currency_type
                }`}</Text>
              )}
            </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.method}:</Text>
            <Text style={styles.statusTextStyle}> {getPaymentModeText()} </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.loggedat}</Text>
            <Text style={styles.statusTextStyle}>
              {moment(getJSDate(log.transaction_date)).format(
                Verbs.DATE_FORMAT,
              )}
            </Text>
          </View>
        </View>

        <TCThinDivider width={'100%'} />

        <View style={{marginTop: 25}}>
          <Text style={styles.textStyle}>{strings.noteTitle}</Text>
          <Text style={[styles.textStyle, {marginTop: 10, marginLeft: 5}]}>
            {log.notes}
          </Text>
        </View>

        {/* Delete Log */}

        {from !== Verbs.INVOICERECEVIED ? RenderDeleteRefundButtons() : null}
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  refundbtnstyle: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,

    paddingVertical: 8,
    width: '100%',
    marginHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextStyle: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    flex: 1,
    textAlign: 'right',
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnstyle: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  btntextstyle: {
    color: colors.darkThemeColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
});
