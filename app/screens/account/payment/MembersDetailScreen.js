import React, { useState, useContext, useLayoutEffect } from 'react';
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
export default function MembersDetailScreen({ navigation }) {
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
          {'Michael Jordan'}
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

  const renderInvoiceView = ({ item }) => {
    console.log('item', item);
    return (
      <MembershipFeeView
        data={item}
        onPressCard={() => navigation.navigate('TeamInvoiceDetailScreen')}
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
