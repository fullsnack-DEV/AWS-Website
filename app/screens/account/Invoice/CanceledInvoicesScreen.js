/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {useState, useContext, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getCancelledInvoice} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import CancelledInvoiceView from '../../../components/invoice/CancelledInvoiceView';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';


export default function CanceledInvoicesScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const [from] = useState(route.params.from);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [invoiceList, setInvoiceList] = useState([]);
  const [tabs, setTabs] = useState([strings.allNInvoice,strings.canceledNInvoice,strings.rejectedNInvoice]);
  const [tabNumber, setTabNumber] = useState(0);

  const tabChangePress = useCallback((changeTab) => {
    setTabNumber(changeTab.i);
  }, []);

  const renderCancelledView = ({item}) => (
    <CancelledInvoiceView
      invoice={item}
      from={from}
      onPressCard={() =>
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
        })
      }
    />
  );

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      let type = 'receiver'
      if(from === Verbs.INVOICESENT){
        type = 'sender'
      }
      getCancelledInvoice(type, authContext)
        .then((response) => {
          setloading(false);
          setInvoiceList(response.payload);
          console.log('response.payload', response.payload)
          const allTitle = format(
            strings.allNInvoice, response.payload.length
          );
          const canceledTitle = format(
            strings.canceledNInvoice, response.payload.filter((obj) => obj.invoice_status === Verbs.INVOICE_CANCELLED).length
          );
          const rejectedTitle = format(
            strings.rejectedNInvoice, response.payload.filter((obj) => obj.invoice_status === Verbs.INVOICE_REJECTED).length
          );
          setTabs([allTitle, canceledTitle, rejectedTitle]);
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
      if (status === Verbs.allStatus) {
        return invoiceList;
      }
      return invoiceList.filter((obj) => obj.invoice_status === status);
    },
    [invoiceList],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={{marginTop: 15}}>

      <View style={{backgroundColor: colors.whiteColor}}>
          <TCScrollableProfileTabs
            tabItem={tabs}
            tabVerticalScroll={false}
            onChangeTab={tabChangePress}
            currentTab={tabNumber}
          />
        </View>
        <FlatList
          data={
            (tabNumber === 0 && invoiceListByFilter(Verbs.allStatus)) ||
            (tabNumber === 1 && invoiceListByFilter(Verbs.INVOICE_CANCELLED)) ||
            (tabNumber === 2 && invoiceListByFilter(Verbs.INVOICE_REJECTED))
          }
          renderItem={renderCancelledView}
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
