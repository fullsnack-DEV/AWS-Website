import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import TCThickDivider from '../../../components/TCThickDivider';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';

export default function CompleteBookingFile({navigation, route}) {
  const [eventData] = useState(route?.params?.data);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.eventCompleteBooking}
        leftIcon={images.backArrow}
        leftIconPress={() =>
          navigation.navigate('EventCheckoutScreen', {
            data: eventData,
          })
        }
      />
      <ScrollView style={{marginBottom: 10}}>
        {/* Pay detai */}
        <View style={styles.mainContainer}>
          <Text style={styles.paymenttext}> {strings.orderDetails} </Text>

          <View style={styles.AmountBox}>
            <View style={[styles.rowstyle, {marginTop: 10}]}>
              <View style={{flex: 1}}>
                <Text style={styles.textstyle}>
                  {eventData?.event_fee.currency_type}{' '}
                  {eventData?.event_fee?.value} x 1 ticket
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
                  {eventData?.event_fee?.value}
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
              <Text style={styles.textstyle}>
                {eventData?.event_fee?.value}
              </Text>
            </View>
          </View>
          <Text style={[styles.textstyle, {alignSelf: 'flex-end'}]}>
            {' '}
            ({' '}
            {`${strings.currencyText} : ${eventData?.event_fee?.currency_type} `}
            ){' '}
          </Text>
        </View>

        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />

        <Text
          style={{
            fontSize: 20,
            fontFamily: fonts.RBold,
            lineHeight: 30,
            marginLeft: 17,
          }}>
          {strings.refundPolicy}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            lineHeight: 24,
            marginTop: 10,
            marginHorizontal: 15,
          }}>
          {strings.eventBookingRefundText}
        </Text>

        <TCThinDivider marginTop={15} marginBottom={15} height={1} />
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            lineHeight: 24,
            marginTop: 10,
            marginHorizontal: 15,
          }}>
          {strings.eventBookingOragnizerRefundText}
        </Text>

        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />

        <View
          style={{
            marginHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={images.invoiceIcon}
            style={{
              width: 45,
              height: 40,
              marginRight: 15,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              lineHeight: 24,
              marginTop: 10,
              flex: 1,
              color: colors.localHomeGradientEnd,
            }}>
            {strings.eventBookingInvoiceText}
          </Text>
        </View>

        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />

        <TouchableOpacity
          style={{
            marginTop: 25,
            backgroundColor: colors.reservationAmountColor,
            marginHorizontal: 15,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RBold,
              lineHeight: 24,
              alignSelf: 'center',
              marginVertical: 8,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            {strings.eventCompleteBooking}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: colors.googleColor,
            lineHeight: 24,
            fontFamily: fonts.RBold,
            fontSize: 16,
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 40,
            textTransform: 'uppercase',
            textDecorationLine: 'underline',
          }}>
          {strings.cancel}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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

  mainContainer: {
    marginTop: 25,
    marginHorizontal: 15,
  },
  AmountBox: {
    marginTop: 10,
    backgroundColor: colors.lightGrey,
  },
});
