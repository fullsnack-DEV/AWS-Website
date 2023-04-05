import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function AvailabilityTypeTabView({
  onFirstTabPress,
  onSecondTabPress,
  oneTime,
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
            oneTime
            ? [styles.activeEventPricacy, activeEventPricacy, {backgroundColor: colors.whiteColor}]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            oneTime
              ? [
                  styles.activeEventPrivacyText,
                  activeEventPrivacyText,
                ]
              : [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {firstTabTitle}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={
          !oneTime
            ? [styles.activeEventPricacy, activeEventPricacy, {backgroundColor: colors.whiteColor}]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            !oneTime
              ? [styles.activeEventPrivacyText, activeEventPrivacyText]
              : [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
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
    borderRadius: wp('1.5%'),
    paddingHorizontal: wp('1%'),
    paddingVertical: wp('1%'),
    marginVertical: 10,
    width: wp('94%'),
    alignSelf: 'center',
    backgroundColor: colors.greeColor,
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1.5%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp('0.5'),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: colors.blackColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 12,
  },
  inactiveEventPrivacyText: {
    color: colors.blackColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 12,
    paddingVertical: hp('0.5'),
  },
});
