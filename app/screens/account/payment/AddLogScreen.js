import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

import ActivityLoader from '../../../components/loader/ActivityLoader';

import TCTabView from '../../../components/TCTabView';
import TCThinDivider from '../../../components/TCThinDivider';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import {addLog} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';

export default function AddLogScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [invoiceDetail] = useState(route?.params?.invoiceDetail);
  console.log('IDetail:=>', invoiceDetail);
  // const isFocused = useIsFocused();
  const [paymentSwitchSelection, setPaymentSwitchSelection] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.rightHeaderView}
          onPress={() => {
            if (addLogValidation()) {
              setloading(true);
              const body = {};
              body.payment_mode = paymentType === 0 ? 'Cash' : 'Cheque';
              body.amount = Number(parseFloat(amount).toFixed(2));
              body.payment_date = Number(
                (new Date().getTime() / 1000).toFixed(0),
              );
              body.transaction_type =
                paymentSwitchSelection === 0 ? 'payment' : 'refund';
              body.notes = note;

              addLog(invoiceDetail?.invoice_id, body, authContext)
                .then(() => {
                  setloading(false);
                  navigation.pop(3);
                })
                .catch((e) => {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                });
            }
          }}>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [authContext, navigation, amount, note, paymentSwitchSelection]);

  const IsNumeric = (num) => num >= 0 || num < 0;

  const addLogValidation = () => {
    if (!amount) {
      Alert.alert('Please select due amount.');
      return false;
    }
    if (amount < 1 && amount >= 0) {
      Alert.alert('User should not allow less than $1 amount.');
      return false;
    }
    if (amount > invoiceDetail?.amount_due) {
      Alert.alert('User should not allow more than invoice amount.');
      return false;
    }
    if (paymentSwitchSelection === 1 && amount > invoiceDetail?.amount_paid) {
      Alert.alert('User should not refund more than invoice paid amount.');
      return false;
    }
    if (!note) {
      Alert.alert('Please select invoice note.');
      return false;
    }
    return true;
  };

  return (
    <ScrollView bounces={false}>
      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />

        <TCTabView
          totalTabs={2}
          firstTabTitle={'PAYMENT'}
          secondTabTitle={'REFUND'}
          indexCounter={paymentSwitchSelection}
          eventPrivacyContianer={{width: 100}}
          onFirstTabPress={() => setPaymentSwitchSelection(0)}
          onSecondTabPress={() => setPaymentSwitchSelection(1)}
          activeHeight={36}
          inactiveHeight={40}
        />

        <TouchableOpacity
          style={{
            margin: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => setPaymentType(0)}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            In Cash
          </Text>
          <Image
            source={
              paymentType === 0 ? images.radioCheckYellow : images.radioUnselect
            }
            style={{height: 22, width: 22}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            margin: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => setPaymentType(1)}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            By check
          </Text>
          <Image
            source={
              paymentType === 1 ? images.radioCheckYellow : images.radioUnselect
            }
            style={{height: 22, width: 22, resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        <TCThinDivider marginTop={10} width={'94%'} />

        <View>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
              marginLeft: 15,
              marginTop: 15,
            }}>
            {strings.amountTitle}
          </Text>
          <TextInput
            placeholder={strings.amountPlaceholder}
            style={styles.amountTxt}
            onChangeText={(text) => {
              if (IsNumeric(text)) {
                setAmount(text);
              }
            }}
            keyboardType="numeric"
            value={amount}></TextInput>
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
            {strings.noteTitle}
          </Text>
          <TextInput
            placeholder={strings.enterNotePlaceholder}
            style={styles.noteTxt}
            multiline
            onChangeText={(text) => setNote(text)}
            value={note}></TextInput>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
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
});
