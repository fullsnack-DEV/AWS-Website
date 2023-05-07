import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function EventVenueTogglebtn({
  onFirstTabPress,
  onSecondTabPress,
  offline,
  style,
  startGradientColor = colors.grayBackgroundColor,
  endGradientColor = colors.grayBackgroundColor,
  firstTabTitle,
  secondTabTitle,
  activeEventPricacy,
  inactiveEventPricacy,
  activeEventPrivacyText,
  inactiveEventPrivacyText,
}) {
  return (
    <LinearGradient
      colors={[startGradientColor, endGradientColor]}
      style={[styles.eventPrivacyContianer, style]}>
      <TouchableOpacity
        onPress={onFirstTabPress}
        style={
            offline ? [styles.activeEventPricacy, activeEventPricacy] : 
            [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            offline ? [styles.activeEventPrivacyText, activeEventPrivacyText] : 
            [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {firstTabTitle} 
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={
        !offline ? 
         [styles.activeEventPricacy, activeEventPricacy] : 
         [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            !offline ? 
          [styles.activeEventPrivacyText, activeEventPrivacyText] : 
          [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {secondTabTitle}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('1%'),
    marginVertical: 15,
    width: wp('40%'),
    alignSelf: 'center',
    height: 30,
    backgroundColor: colors.greeColor,
    position: 'absolute',
    right: 5,
    top: -10
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.whiteColor,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('5%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp('0.5'),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: colors.greeColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 11,
  },
  inactiveEventPrivacyText: {
    color: colors.grayColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 11,
  },
});
