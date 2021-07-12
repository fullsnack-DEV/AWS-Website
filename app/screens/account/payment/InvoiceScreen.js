import React, { useState, useLayoutEffect } from 'react';
import {
 View, StyleSheet, Text, TouchableOpacity, Image, FlatList,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCSelectionView from '../../../components/TCSelectionView';
import { invoiceMonthsSelectionData } from '../../../utils/constant';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import MembershipFeeView from '../../../components/invoice/MembershipFeeView';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';

export default function InvoiceScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();

  const [selectedDuration, setSelectedDuration] = useState();
  const [tabNumber, setTabNumber] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.navTitle}>Invoicing</Text>,
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity>
            <Image
              source={images.home_setting}
              style={styles.townsCupSettingIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Ok')}>
            <Image
              source={images.plusInvoice}
              style={styles.townsCupPlusIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

const renderMemberView = ({ item }) => {
  console.log('item', item);
  return (
    <MemberInvoiceView data={item} onPressCard={() => navigation.navigate('TransactionScreen')}/>
  )
}

const renderInvoiceView = ({ item }) => {
  console.log('item', item);
  return (
    <MembershipFeeView data={item} onPressCard={() => navigation.navigate('TransactionScreen')}/>
  )
}

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}
      <TCSelectionView
        dataSource={invoiceMonthsSelectionData}
        placeholder={strings.selectInvoiceDuration}
        value={selectedDuration}
        onValueChange={(index) => setSelectedDuration(index)}
        containerStyle={{ height: 45, width: '92%', marginTop: 15 }}
      />

      <InvoiceAmount
        currencyType={'CAD'}
        totalAmount={'99.00'}
        paidAmount={'85.00'}
        openAmount={'55.00'}
      />

      <TCTabView
        totalTabs={2}
        firstTabTitle={'Members (1)'}
        secondTabTitle={'Batches (3)'}
        indexCounter={tabNumber}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setTabNumber(0)}
        onSecondTabPress={() => setTabNumber(1)}
      />

      {tabNumber === 0 && <FlatList
        data={ ['1', '2', '3', '4', '5'] }
        renderItem={ renderMemberView }
        keyExtractor={(item, index) => index.toString()}
      />}

      {tabNumber === 1 && <FlatList
        data={ ['1', '2', '3', '4', '5'] }
        renderItem={ renderInvoiceView }
        keyExtractor={(item, index) => index.toString()}
      />}

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
  townsCupSettingIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    marginLeft: 10,
  },
  townsCupPlusIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    marginLeft: 10,
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 25,
  },
});
