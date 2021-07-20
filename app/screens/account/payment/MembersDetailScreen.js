/* eslint-disable consistent-return */
import React, {
 useState, useContext, useLayoutEffect, useCallback,
} from 'react';
import {
 View, StyleSheet, Text, FlatList, TouchableOpacity, Image,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

import AuthContext from '../../../auth/context';
// import ActivityLoader from '../../../components/loader/ActivityLoader';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import MembershipFeeView from '../../../components/invoice/MembershipFeeView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import images from '../../../Constants/ImagePath';

let entity = {};
export default function MembersDetailScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const { from, memberData } = route?.params ?? {}

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  // const isFocused = useIsFocused();

  const [tabNumber, setTabNumber] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.navTitle}>
          {`${memberData?.first_name} ${memberData?.last_name}`}
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
  }, [memberData?.first_name, memberData?.last_name, navigation]);

  const renderInvoiceView = ({ item }) => {
    console.log('item', item);
    return (
      <MembershipFeeView
        data={item}
        onPressCard={() => navigation.navigate('TeamInvoiceDetailScreen', { from, invoiceObj: item })}
      />
    );
  };

  const memberListByFilter = useCallback(
    (status) => {
      console.log('Status', status);

      if (status === 'All') {
        return memberData?.invoices;
      }
      if (status === 'Paid') {
        return memberData?.invoices.filter((obj) => obj.invoice_status === 'Paid');
      }
      if (status === 'Open') {
        return memberData?.invoices.filter((obj) => obj.invoice_status === 'Unpaid'
              || obj.invoice_status === 'Partially Paid');
      }
    },
    [memberData?.invoices],
  );

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <TopFilterBar/>

      <InvoiceAmount
          currencyType={'CAD'}
          totalAmount={memberData?.invoice_total ?? '00.00'}
          paidAmount={memberData?.invoice_paid_total ?? '00.00'}
          openAmount={memberData?.invoice_open_total ?? '00.00'}
        />

      <TCTabView
        totalTabs={3}
        firstTabTitle={`Open (${memberListByFilter('Open').length})`}
        secondTabTitle={`Paid (${memberListByFilter('Paid').length})`}
        thirdTabTitle={`All (${memberListByFilter('All').length})`}
        indexCounter={tabNumber}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setTabNumber(0)}
        onSecondTabPress={() => setTabNumber(1)}
        onThirdTabPress={() => setTabNumber(2)}
      />

      <FlatList
        data={
          (tabNumber === 0 && memberListByFilter('Open'))
          || (tabNumber === 1 && memberListByFilter('Paid'))
          || (tabNumber === 2 && memberListByFilter('All'))
        }
        renderItem={renderInvoiceView}
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
});
