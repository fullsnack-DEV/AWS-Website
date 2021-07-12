import React, { useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import images from '../../../Constants/ImagePath';
import PaymentLogs from '../../../components/invoice/PaymentLogs';

export default function MemberInvoiceScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.navTitle}>May 19 Membership Fee</Text>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity>
            <Image
              source={images.home_setting}
              style={styles.townsCupSettingIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const renderLogView = ({ item }) => {
    console.log('item', item);
    return (
      <PaymentLogs
        data={item}
        onPressCard={() => navigation.navigate('TransactionScreen')}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <View style={{ margin: 15 }}>
        <Text
          style={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {'Michael Jordan'}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Invoice no. TR 7077071
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Due : SAT, May 11, 2020
        </Text>
      </View>

      <LinearGradient
        colors={[colors.kHexColorFF8A01, colors.darkThemeColor]}
        style={styles.paymentProgressView}>
        <LinearGradient
          colors={[colors.greenGradientEnd, colors.greenGradientStart]}
          style={{
            height: 20,
            backgroundColor: colors.thinDividerColor,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: fonts.RBold,
              fontSize: 12,
            }}>
            $12.50 CAD
          </Text>
        </LinearGradient>
      </LinearGradient>

      <InvoiceAmount
        status={'Open'}
        currencyType={'CAD'}
        totalAmount={'99.00'}
        paidAmount={'85.00'}
        openAmount={'55.00'}
      />

      <TCThinDivider marginTop={15} width={'94%'} />

      <View style={{ margin: 15 }}>
        <Text
          style={{
            fontFamily: fonts.RLight,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {'Description '}
        </Text>

        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Recorded by Michael Jordan
        </Text>
      </View>

      <LinearGradient
        colors={[colors.yellowColor, colors.darkThemeColor]}
        style={styles.activeEventPricacy}>
        <TouchableOpacity
          onPress={() => Alert.alert('Add payment')}
          style={styles.activeEventPricacy}>
          <Text style={styles.activeEventPrivacyText}>
            {'+Add Payment or Refund'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text
        style={{
          fontFamily: fonts.RMedium,
          fontSize: 20,
          color: colors.lightBlackColor,
          margin: 15,
        }}>
        Log
      </Text>
      <FlatList
        data={['1', '2', '3', '4', '5']}
        renderItem={renderLogView}
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
  townsCupSettingIcon: {
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

  activeEventPricacy: {
    height: 31,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    alignSelf: 'center',
  },

  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 14,
  },

  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
  },
});
