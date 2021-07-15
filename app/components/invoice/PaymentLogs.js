import React from 'react';
import {
 View, StyleSheet, Text, TouchableOpacity,
 } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function PaymentLogs({ data, onPressCard }) {
  console.log(data);
  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      <View
        style={{
          width: '80%',
          justifyContent: 'center',
          marginLeft: 15,
        }}>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {'August 22, 2020'}
        </Text>

        <Text
          style={{
            fontFamily: fonts.RLight,
            fontSize: 14,
            color: colors.lightBlackColor,
          }}>
          Paid in cash
        </Text>
        {/* <Text
          style={{
            fontFamily: fonts.RLight,
            fontSize: 14,
            color: colors.lightBlackColor,
          }}>
          Recorded by Michael Jordan
        </Text> */}

      </View>
      <View
        style={{
          width: '20%',
          alignItems: 'center',
        }}>
        <Text style={styles.dateView}>{'$0.02'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: colors.offwhite,
    flexDirection: 'row',
    borderRadius: wp('2%'),
    justifyContent: 'space-between',
    marginBottom: 15,
    width: wp('90%'),
    height: 85,
    alignSelf: 'center',

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },

  dateView: {
    textAlign: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
    marginTop: 15,
    color: colors.greeColor,
  },
});
