/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import {getMemberInvoice} from '../../../api/Invoice';

import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import UserInvoiceView from '../../../components/invoice/UserInvoiceView';
import strings from '../../../Constants/String';

export default function UserInvoiceScreen({navigation}) {
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [invoiceList, setInvoiceList] = useState([]);
  const [tabNumber, setTabNumber] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [openAmount, setOpenAmount] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getMemberInvoice(authContext)
        .then((response) => {
          console.log('Invoice list updated....', response);
          setloading(false);

          setInvoiceList(response.payload);
          let totalInvoiced = 0;
          let paidInvoice = 0;
          let openInvoice = 0;
          response.payload.map((e) => {
            paidInvoice += e.amount_paid;
            openInvoice += e.amount_remaining;
            totalInvoiced += e.amount_due;
          });

          setTotalAmount(totalInvoiced);
          setOpenAmount(openInvoice);
          setPaidAmount(paidInvoice);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  const renderUserInvoiceView = ({item}) => {
    console.log('item', item);
    return (
      <UserInvoiceView
        data={item}
        onPressCard={() => {
          // navigation.navigate('InvoiceDetailScreen')
          navigation.navigate('TeamInvoiceDetailScreen', {
            from: 'user',
            invoiceObj: item,
          });
        }}
      />
    );
  };

  const memberListByFilter = useCallback(
    (status) => {
      console.log('Status', status);

      if (status === 'All') {
        return invoiceList;
      }
      if (status === 'Paid') {
        return invoiceList.filter((obj) => obj.invoice_status === 'Paid');
      }
      if (status === 'Open') {
        return invoiceList.filter(
          (obj) =>
            obj.invoice_status === 'Unpaid' ||
            obj.invoice_status === 'Partially Paid',
        );
      }
    },
    [invoiceList],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TopFilterBar />

      <InvoiceAmount
        currencyType={strings.defaultCurrency}
        totalAmount={totalAmount ?? '00.00'}
        paidAmount={paidAmount ?? '00.00'}
        openAmount={openAmount ?? '00.00'}
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

      <FlatList
        data={
          (tabNumber === 0 && memberListByFilter('Open')) ||
          (tabNumber === 1 && memberListByFilter('Paid')) ||
          (tabNumber === 2 && memberListByFilter('All'))
        }
        renderItem={renderUserInvoiceView}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },
});
