import React, {
    useState, useContext, useLayoutEffect,
  } from 'react';
  import {
    View, StyleSheet, Text,

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

let entity = {}
  export default function InvoiceScreen({ navigation }) {
    // const [loading, setloading] = useState(false);

    const authContext = useContext(AuthContext)
    entity = authContext.entity
    // const isFocused = useIsFocused();

    const [selectedDuration, setSelectedDuration] = useState();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={styles.navTitle}>{entity?.obj?.full_name ?? entity?.obj?.group_name}</Text>
        ),
      });
    }, [navigation])

    return (
      <View style={styles.mainContainer}>
        {/* <ActivityLoader visible={loading} /> */}
        <TCSelectionView
        dataSource={invoiceMonthsSelectionData}
        placeholder={strings.selectInvoiceDuration}
        value={selectedDuration}
        onValueChange={(index) => setSelectedDuration(index)}
        containerStyle ={{ height: 45, width: '90%', marginTop: 15 }}
        />

        <InvoiceAmount
        currencyType = {'CAD'}
        totalAmount = {'99.00'}
        paidAmount = {'85.00'}
        openAmount = {'55.00'}
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
