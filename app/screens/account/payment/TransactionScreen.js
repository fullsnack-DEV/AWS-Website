import React, {
    useState, useContext, useLayoutEffect,
  } from 'react';
  import {
    View, StyleSheet, Text, FlatList,

  } from 'react-native';

  // import { useIsFocused } from '@react-navigation/native';

  import AuthContext from '../../../auth/context'
 // import ActivityLoader from '../../../components/loader/ActivityLoader';

  import strings from '../../../Constants/String'
  import colors from '../../../Constants/Colors'
  import fonts from '../../../Constants/Fonts';
import TCSelectionView from '../../../components/TCSelectionView';
import { invoiceMonthsSelectionData } from '../../../utils/constant';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import TCTabView from '../../../components/TCTabView';
import MembershipFeeView from '../../../components/invoice/MembershipFeeView'

let entity = {}
  export default function TransactionScreen({ navigation }) {
    // const [loading, setloading] = useState(false);

    const authContext = useContext(AuthContext)
    entity = authContext.entity
    // const isFocused = useIsFocused();

    const [selectedDuration, setSelectedDuration] = useState();
    const [tabNumber, setTabNumber] = useState(0);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={styles.navTitle}>{entity?.obj?.full_name ?? entity?.obj?.group_name}</Text>
        ),
      });
    }, [navigation])

    const renderInvoiceView = ({ item }) => {
      console.log('item', item);
      return (
        <MembershipFeeView data={item} onPressCard={() => navigation.navigate('MemberInvoiceScreen')}/>
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
        containerStyle ={{ height: 45, width: '92%', marginTop: 15 }}
        />

        <InvoiceAmount
        currencyType = {'CAD'}
        totalAmount = {'99.00'}
        paidAmount = {'85.00'}
        openAmount = {'55.00'}
        />

        <TCTabView
        totalTabs = {3}
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
        data={ (tabNumber === 0 && ['1']) || (tabNumber === 1 && ['1', '2', '3']) || (tabNumber === 2 && ['1', '2', '3', '4'])}
        renderItem={ renderInvoiceView }
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

  })
