import React, { useState, useLayoutEffect } from 'react';
import {
 View, StyleSheet, Text, TouchableOpacity, Image, FlatList,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import { invoiceMonthsSelectionData } from '../../../utils/constant';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';
import TopFilterBar from '../../../components/invoice/TopFilterBar';
import BatchFeeView from '../../../components/invoice/BatchFeeView';
import strings from '../../../Constants/String';
import SmallFilterSelectionView from '../../../components/invoice/SmallFilterSelectionView';

export default function InvoiceScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();
  const [selectedDuration, setSelectedDuration] = useState();
  const [maintabNumber, setMaintabNumber] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.navTitle}>Invoicing</Text>,
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity>
            <Image
              source={images.plusInvoice}
              style={styles.townsCupPlusIcon}
            />

          </TouchableOpacity>
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

const renderMemberView = ({ item }) => {
  console.log('item', item);
  return (
    <MemberInvoiceView data={item} onPressCard={() => navigation.navigate('MembersDetailScreen')}/>
  )
}

const renderBatchView = ({ item }) => {
  console.log('item', item);
  return (
    <BatchFeeView data={item} onPressCard={() => navigation.navigate('BatchDetailScreen')}/>
  )
}

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}
      <TopFilterBar/>

      <TCTabView
        totalTabs={2}
        firstTabTitle={'MEMBERS (1)'}
        secondTabTitle={'BATCHES (3)'}
        indexCounter={maintabNumber}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setMaintabNumber(0)}
        onSecondTabPress={() => setMaintabNumber(1)}
        activeHeight={36}
        inactiveHeight={40}
      />

      <SmallFilterSelectionView
        dataSource={invoiceMonthsSelectionData}
        placeholder={strings.selectInvoiceDuration}
        value={selectedDuration}
        onValueChange={(index) => setSelectedDuration(index)}
        containerStyle={{ height: 45, width: '92%' }}
      />

      <InvoiceAmount
        currencyType={'CAD'}
        totalAmount={'100.00'}
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
        activeHeight={30}
        inactiveHeight={30}
      />

      {maintabNumber === 0 && tabNumber === 0 && <FlatList
        data={ ['1'] }
        renderItem={ renderMemberView }
        keyExtractor={(item, index) => index.toString()}
      />}

      {maintabNumber === 0 && tabNumber === 1 && <FlatList
        data={ ['1', '2', '3'] }
        renderItem={ renderMemberView }
        keyExtractor={(item, index) => index.toString()}
      />}

      {maintabNumber === 0 && tabNumber === 2 && <FlatList
        data={ ['1', '2', '3', '4'] }
        renderItem={ renderMemberView }// renderInvoiceView
        keyExtractor={(item, index) => index.toString()}
      />}

      {maintabNumber === 1 && tabNumber === 0 && <FlatList
        data={ ['1'] }
        renderItem={ renderBatchView }// renderInvoiceView
        keyExtractor={(item, index) => index.toString()}
      />}

      {maintabNumber === 1 && tabNumber === 1 && <FlatList
        data={ ['1', '2', '3'] }
        renderItem={ renderBatchView }// renderInvoiceView
        keyExtractor={(item, index) => index.toString()}
      />}

      {maintabNumber === 1 && tabNumber === 2 && <FlatList
        data={ ['1', '2', '3', '4'] }
        renderItem={ renderBatchView }// renderInvoiceView
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
  townsCupthreeDotIcon: {
    resizeMode: 'contain',
    height: 19,
    width: 8,
    marginLeft: 10,
    tintColor: colors.lightBlackColor,
  },
  townsCupPlusIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
});
