/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {useState, useContext, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import TCTabView from '../../../components/TCTabView';
import {getCancelledInvoice} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import InvoiceView from '../../../components/invoice/InvoiceView';
import InvoiceRefundAmount from '../../../components/invoice/InvoiceRefundAmount';
import Verbs from '../../../Constants/Verbs';

let entity = {};
export default function CanceledInvoicesScreen({navigation}) {
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  const isFocused = useIsFocused();

  const [invoiceList, setInvoiceList] = useState([]);

  const [tabNumber, setTabNumber] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refundAmount, setrefundAmount] = useState(0);
  const [notRefundAmount, setNotRefundAmount] = useState(0);

  const renderInvoiceView = ({item}) => (
    <InvoiceView
      data={item}
      onPressCard={() =>
        navigation.navigate('TeamInvoiceDetailScreen', {
          from: 'member',
          invoiceObj: item,
        })
      }
    />
  );

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getCancelledInvoice(authContext)
        .then((response) => {
          setloading(false);
          setInvoiceList(response.payload);
          let totalInvoiced = 0;
          let nonRefundedInvoice = 0;
          let refundedInvoice = 0;
          response.payload.map((e) => {
            nonRefundedInvoice += e.amount_paid;
            refundedInvoice += e.amount_remaining;
            totalInvoiced += e.amount_due;
          });

          setTotalAmount(totalInvoiced);
          setNotRefundAmount(refundedInvoice);
          setrefundAmount(nonRefundedInvoice);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  const invoiceListByFilter = useCallback(
    (status) => {
      if (status === 'All') {
        return invoiceList;
      }
      if (status === 'norefund') {
        return invoiceList.filter((obj) => obj.total_refund > 0);
      }
      if (status === 'refund') {
        return invoiceList.filter((obj) => obj.total_refund === 0);
      }
    },
    [invoiceList],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={{marginTop: 15}}>
        <InvoiceRefundAmount
          currencyType={strings.defaultCurrency}
          totalAmount={totalAmount ?? '00.00'}
          notRefundedAmount={notRefundAmount ?? '00.00'}
          refundedAmount={refundAmount ?? '00.00'}
        />

        <TCTabView
          totalTabs={3}
          firstTabTitle={format(
            strings.notRefundedNText,
            invoiceListByFilter(Verbs.norefund).length,
          )}
          secondTabTitle={format(
            strings.refundedNText,
            invoiceListByFilter(strings.refund).length,
          )}
          thirdTabTitle={format(
            strings.allNText,
            invoiceListByFilter(Verbs.allStatus).length,
          )}
          indexCounter={tabNumber}
          eventPrivacyContianer={{width: 100}}
          onFirstTabPress={() => setTabNumber(0)}
          onSecondTabPress={() => setTabNumber(1)}
          onThirdTabPress={() => setTabNumber(2)}
        />

        <FlatList
          data={
            (tabNumber === 0 && invoiceListByFilter(Verbs.norefund)) ||
            (tabNumber === 1 && invoiceListByFilter(Verbs.refundStatus)) ||
            (tabNumber === 2 && invoiceListByFilter(Verbs.allStatus))
          }
          renderItem={renderInvoiceView}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },
});
