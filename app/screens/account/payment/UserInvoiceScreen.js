import React, { useState } from 'react';
import {
 View, StyleSheet, FlatList,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import AuthContext from '../../../auth/context';
// import ActivityLoader from '../../../components/loader/ActivityLoader';

import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import UserInvoiceView from '../../../components/invoice/UserInvoiceView';

// let entity = {};
export default function UserInvoiceScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const authContext = useContext(AuthContext);
  // entity = authContext.entity;
  // const isFocused = useIsFocused();

  const [tabNumber, setTabNumber] = useState(0);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={styles.navTitle}>
//           {entity?.obj?.full_name ?? entity?.obj?.group_name}
//         </Text>
//       ),
//     });
//   }, [navigation]);

  const renderUserInvoiceView = ({ item }) => {
    console.log('item', item);
    return (
      <UserInvoiceView
        data={item}
        onPressCard={() => navigation.navigate('InvoiceDetailScreen')}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <TopFilterBar/>

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
