import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function AvailabilityTypeTabView({
  optionList = [],
  onFirstTabPress = () => {},
  onSecondTabPress = () => {},
  oneTime = true,
  style = {},
  activeEventPricacy = {},
  inactiveEventPricacy = {},
  activeEventPrivacyText = {},
  inactiveEventPrivacyText = {},
}) {
  return (
    <View style={[styles.eventPrivacyContianer, style]}>
      <TouchableOpacity
        onPress={onFirstTabPress}
        style={
          oneTime
            ? [styles.activeEventPricacy, activeEventPricacy]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            oneTime
              ? [styles.activeEventPrivacyText, activeEventPrivacyText]
              : [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {optionList[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={
          !oneTime
            ? [
                styles.activeEventPricacy,
                activeEventPricacy,
                {backgroundColor: colors.whiteColor},
              ]
            : [styles.inactiveEventPricacy, inactiveEventPricacy]
        }>
        <Text
          style={
            !oneTime
              ? [styles.activeEventPrivacyText, activeEventPrivacyText]
              : [styles.inactiveEventPrivacyText, inactiveEventPrivacyText]
          }>
          {optionList[1]}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 7,
    backgroundColor: colors.textFieldBackground,
  },
  activeEventPricacy: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },
  inactiveEventPricacy: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeEventPrivacyText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  inactiveEventPrivacyText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
