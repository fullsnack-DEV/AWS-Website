import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
  reducewidth = false,
}) {
  return (
    <LinearGradient
      colors={[startGradientColor, endGradientColor]}
      style={[
        styles.eventPrivacyContianer,
        style,
        {width: reducewidth ? '40%' : '50%'},
      ]}>
      <TouchableOpacity
        onPress={onFirstTabPress}
        style={
          offline
            ? [styles.activeEventPricacy, activeEventPricacy]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            offline
              ? [styles.activeEventPrivacyText, activeEventPrivacyText]
              : [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {firstTabTitle}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={
          !offline
            ? [styles.activeEventPricacy, activeEventPricacy]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            !offline
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
    borderRadius: 100,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginVertical: 15,

    flexShrink: 1,
    height: 30,
    backgroundColor: colors.greeColor,
    position: 'absolute',
    right: 5,
    top: -10,
  },
  activeEventPricacy: {
    paddingHorizontal: 5,
    backgroundColor: colors.whiteColor,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  inactiveEventPricacy: {
    paddingHorizontal: 5,
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    paddingHorizontal: 5,
    color: colors.greeColor,
    fontFamily: fonts.RBold,

    fontSize: 11,
  },
  inactiveEventPrivacyText: {
    paddingHorizontal: 5,
    color: colors.grayColor,
    fontFamily: fonts.RBold,

    fontSize: 11,
  },
});
