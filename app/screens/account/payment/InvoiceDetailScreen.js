import React, { useLayoutEffect, useRef } from 'react';
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
import ActionSheet from 'react-native-actionsheet';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import images from '../../../Constants/ImagePath';
import PaymentLogs from '../../../components/invoice/PaymentLogs';

export default function InvoiceDetailScreen({ navigation }) {
  // const [loading, setloading] = useState(false);
  const actionSheet = useRef();

  // const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity onPress={() => {
            actionSheet.current.show()
          }}>
            <Image
              source={images.threeDotIcon}
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
        onPressCard={() => {
          navigation.navigate('LogDetailScreen')
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <View style={{ margin: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={images.dummyPhoto}
            style={styles.invoiceProfileStyle}
          />
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {'Michael Jordan'}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Invoice no.: TR-7077071
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Due at: May 11, 2020
        </Text>
      </View>

      <LinearGradient
        colors={[colors.grayBackgroundColor, colors.grayBackgroundColor]}
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
          Membership fee for May
        </Text>
      </View>

      {/* <View style={{ marginBottom: 50, backgroundColor: 'red' }}>
        <TCTouchableLabel
            title={strings.addOptionMessage}
            showNextArrow={true}
            onPress={() => {
              Alert.alert('Open card screen');
            }}
            style={{ backgroundColor: colors.blackColor }}
          />
      </View> */}
      <View style={styles.paymentContainer}>
        <Text style={styles.cardDetailText}>Visa Visa **** 4242</Text>
        <Image style={styles.nextIconStyle} source={images.nextArrow} />
      </View>

      <LinearGradient
        colors={[colors.yellowColor, colors.darkThemeColor]}
        style={styles.activeEventPricacy}>
        <TouchableOpacity onPress={() => Alert.alert('Add payment')}>
          <Text style={styles.activeEventPrivacyText}>{'PAY NOW'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* <LinearGradient
        colors={[colors.yellowColor, colors.darkThemeColor]}
        style={styles.activeEventPricacy}>
          <TouchableOpacity
          onPress={() => Alert.alert('Add payment')}
          style={styles.activeEventPricacy}>
            <Text style={styles.activeEventPrivacyText}>
              {'+Add Payment or Refund'}
            </Text>
          </TouchableOpacity>
        </LinearGradient> */}

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

      <ActionSheet
        ref={actionSheet}
        options={['Delete This Invoice', 'Cancel']}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            Alert.alert('Delete');
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  townsCupSettingIcon: {
    resizeMode: 'contain',
    height: 19,
    width: 9,
    marginRight: 10,
    tintColor: colors.lightBlackColor,
  },
  invoiceProfileStyle: {
    resizeMode: 'contain',
    height: 17,
    width: 17,
    marginRight: 10,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 25,
  },

  activeEventPricacy: {
    height: 40,
    width: '94%',
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    fontSize: 14,
    textAlign: 'center',
  },

  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
  },
  nextIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 14,
    width: 8,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },
  paymentContainer: {
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: colors.offwhite,
    flexDirection: 'row',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 13,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDetailText: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
