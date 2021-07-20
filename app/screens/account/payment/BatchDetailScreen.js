/* eslint-disable consistent-return */
import React, {
 useState, useContext, useLayoutEffect, useCallback,
} from 'react';
import {
 View, StyleSheet, Text, FlatList, TouchableOpacity, Image,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

import moment from 'moment';
import AuthContext from '../../../auth/context';
// import ActivityLoader from '../../../components/loader/ActivityLoader';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import images from '../../../Constants/ImagePath';
import BatchDetailView from '../../../components/invoice/BatchDetailView';

let entity = {};
export default function BatchDetailScreen({ navigation, route }) {
  const { from, batchData } = route?.params
  // const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  // const isFocused = useIsFocused();

  const [tabNumber, setTabNumber] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.navTitle}>
          {'Membership Fee'}
        </Text>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>

          <TouchableOpacity onPress={() => console.log('Ok')}>
            <Image
              source={images.threeDotIcon}
              style={styles.townsCupthreeDotIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const renderBatchDetailView = ({ item }) => {
    console.log('item', item);
    return (
      <BatchDetailView
        data={item}
        onPressCard={() => navigation.navigate('TeamInvoiceDetailScreen', { from, invoiceObj: item })}
      />
    );
  };

  const batchListByFilter = useCallback(
    (status) => {
      console.log('Status', status);

      if (status === 'All') {
        return batchData?.invoices;
      }
      if (status === 'Paid') {
        return batchData?.invoices.filter((obj) => obj.invoice_status === 'Paid');
      }
      if (status === 'Open') {
        return batchData?.invoices.filter((obj) => obj.invoice_status === 'Unpaid'
              || obj?.invoice_status === 'Partially Paid');
      }
    },
    [batchData?.invoices],
  );

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <TopFilterBar/>

      <View
        style={{

         margin: 15,
        }}>
        <Text
          style={styles.dateView}>
          {`Due : ${moment(batchData?.due_date * 1000).format('ddd, MMM DD, YYYY')}`}
        </Text>
        <Text
          style={styles.dateView}>
          {`${batchData?.invoices?.length} Recepients`}
        </Text>
      </View>

      <InvoiceAmount
        currencyType={'CAD'}
        totalAmount={batchData?.invoice_total ?? '00.00'}
        paidAmount={ batchData?.invoice_paid_total ?? '00.00'}
        openAmount={ batchData?.invoice_open_total ?? '00.00'}
      />

      <TCTabView
        totalTabs={3}
        firstTabTitle={`Open (${batchListByFilter('Open').length})`}
        secondTabTitle={`Paid (${batchListByFilter('Paid').length})`}
        thirdTabTitle={`All (${batchListByFilter('All').length})`}
        indexCounter={tabNumber}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setTabNumber(0)}
        onSecondTabPress={() => setTabNumber(1)}
        onThirdTabPress={() => setTabNumber(2)}
      />

      <FlatList
        data={
          (tabNumber === 0 && batchListByFilter('Open'))
          || (tabNumber === 1 && batchListByFilter('Paid'))
          || (tabNumber === 2 && batchListByFilter('All'))
        }
        renderItem={renderBatchDetailView}
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

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  dateView: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
