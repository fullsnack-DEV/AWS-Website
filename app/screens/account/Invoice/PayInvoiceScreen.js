import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCThickDivider from '../../../components/TCThickDivider';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';

export default function PayInvoiceScreen({navigation, route}) {
  const [invoiceData] = useState(route.params.data);
  const [visibleInfo, setVisibleInfo] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={'Pay Invoice'}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,
          borderBottomWidth: 1,
          paddingBottom: 13,
        }}
      />
      <View style={styles.header}>
        <Text style={styles.paymenttext}> {strings.paymentMethod} </Text>
        {/* Add payment method */}
        <TouchableOpacity style={styles.paybuttonContainer}>
          <View style={styles.plusIconContainer}>
            <Image source={images.plus} style={styles.plusImageContainer} />
            <Text style={styles.addPayText}>{strings.addpaymentMethod}</Text>
          </View>
          <Image source={images.rightArrow} style={styles.rightIconstyle} />
        </TouchableOpacity>
      </View>
      <TCThickDivider height={7} marginTop={25} />
      {/* Pay detai */}
      <View style={styles.mainContainer}>
        <Text style={styles.paymenttext}> {strings.paymentDetailsText} </Text>

        <View style={styles.AmountBox}>
          <View style={[styles.rowstyle, {marginTop: 10, marginBottom: 5}]}>
            <View style={{flex: 1}}>
              <Text style={styles.textstyle}> {strings.invoicedAmount} </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
                {invoiceData.amount_due}
              </Text>
            </View>
          </View>
          <View style={styles.rowstyle}>
            <View style={{flex: 1}}>
              <Text style={styles.textstyle}> {strings.serviceFee} </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
                0.00
              </Text>
            </View>
          </View>

          <View style={styles.rowstyle}>
            <View style={{flex: 1}}>
              <Text style={styles.textstyle}> {strings.international}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.textstyle}> {strings.transactionFee} </Text>
                <Pressable onPress={() => setVisibleInfo(true)}>
                  <Image
                    source={images.infoIcon}
                    style={{height: 15, width: 15, marginLeft: 2}}
                  />
                </Pressable>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
                0.00
              </Text>
            </View>
          </View>

          <TCThickDivider
            height={1}
            width={'90%'}
            marginTop={10}
            alignSelf={'center'}
            backgroundColor={colors.thinDividerColor}
          />

          <View style={[styles.rowstyle, {marginTop: 10, marginBottom: 10}]}>
            <Text style={styles.textstyle}> {strings.total} </Text>
            <Text style={styles.textstyle}>{invoiceData.amount_due}</Text>
          </View>
        </View>
        <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
          {' '}
          ( {`${strings.currencyText} : ${invoiceData.currency_type} `}){' '}
        </Text>
      </View>

      <TouchableOpacity style={styles.makePayButton}>
        <Text style={styles.makePayButtonText}>{strings.makeAPayment}</Text>
      </TouchableOpacity>
      {/* Modal */}
      <CustomModalWrapper
        isVisible={visibleInfo}
        closeModal={() => setVisibleInfo(false)}
        modalType={ModalTypes.style7}
        containerStyle={{padding: 0, width: '100%', height: '100%'}}
        Top={Platform.OS === 'android' ? 570 : 700}>
        <View style={{flex: 0.9}}>
          <Text style={styles.internationalFeeText}>
            {strings.internationalFeeText}
          </Text>
        </View>
      </CustomModalWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  paymenttext: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    lineHeight: 30,
    textTransform: 'uppercase',
  },
  rowstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  textstyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  paybuttonContainer: {
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
  plusIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    paddingVertical: 8,
  },
  plusImageContainer: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    marginRight: 5,
  },
  addPayText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
  },
  rightIconstyle: {
    height: 11,
    width: 21,
    resizeMode: 'contain',
  },
  mainContainer: {
    marginTop: 25,
    marginHorizontal: 15,
  },
  AmountBox: {
    marginTop: 10,
    backgroundColor: colors.lightGrey,
  },
  makePayButton: {
    marginHorizontal: 15,
    backgroundColor: colors.orangeColor,
    borderRadius: 20,
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    bottom: 15,
  },
  makePayButtonText: {
    fontFamily: fonts.RBold,
    lineHeight: 24,
    fontSize: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    color: colors.whiteColor,
  },
  internationalFeeText: {
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 24,
    fontSize: 16,
  },
});
