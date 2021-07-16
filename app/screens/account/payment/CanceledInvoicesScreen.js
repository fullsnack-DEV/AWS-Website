import React, { useState, useContext } from 'react';
import {
 View, StyleSheet, FlatList,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

import AuthContext from '../../../auth/context';
// import ActivityLoader from '../../../components/loader/ActivityLoader';

import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import BatchDetailView from '../../../components/invoice/BatchDetailView';

let entity = {};
export default function CanceledInvoicesScreen({ navigation }) {
  // const { from } = route?.params
  // const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  // const isFocused = useIsFocused();

  const [tabNumber, setTabNumber] = useState(0);

  const renderBatchDetailView = ({ item }) => {
    console.log('item', item);
    return (
      <BatchDetailView
        data={item}
        onPressCard={() => navigation.navigate('TeamInvoiceDetailScreen', { from: 'member' })}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <InvoiceAmount
        currencyType={'CAD'}
        totalAmount={'99.00'}
        paidAmount={'85.00'}
        openAmount={'55.00'}
      />

      <TCTabView
        totalTabs={3}
        firstTabTitle={'Open (1)'}
        secondTabTitle={'Paid (3)'}
        thirdTabTitle={'All (4)'}
        indexCounter={tabNumber}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setTabNumber(0)}
        onSecondTabPress={() => setTabNumber(1)}
        onThirdTabPress={() => setTabNumber(2)}
      />

      <FlatList
        data={
          (tabNumber === 0 && ['1'])
          || (tabNumber === 1 && ['1', '2', '3'])
          || (tabNumber === 2 && ['1', '2', '3', '4'])
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

});
