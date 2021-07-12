import React from 'react';
import {
 View, StyleSheet, TouchableOpacity, Text,
 } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCTabView({
    totalTabs = 3,
  firstTabTitle,
  secondTabTitle,
  thirdTabTitle,
  onFirstTabPress,
  onSecondTabPress,
  onThirdTabPress,
  indexCounter,
  viewContainer,
}) {
  return (
    <View style={[styles.eventPrivacyContianer, viewContainer]}>
      <LinearGradient
        colors={[
          indexCounter === 0 ? colors.yellowColor : colors.lightGrayBackground,
          indexCounter === 0 ? colors.darkThemeColor : colors.lightGrayBackground,
        ]}
        style={
          indexCounter === 0
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }>
        <TouchableOpacity
          onPress={onFirstTabPress}
          style={
            indexCounter === 0
              ? styles.activeEventPricacy
              : styles.inactiveEventPricacy
          }>
          <Text
            style={
              indexCounter === 0
                ? styles.activeEventPrivacyText
                : styles.inactiveEventPrivacyText
            }>
            {firstTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={[
          indexCounter === 1 ? colors.yellowColor : colors.lightGrayBackground,
          indexCounter === 1 ? colors.darkThemeColor : colors.lightGrayBackground,
        ]}
        style={
          indexCounter === 1
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }>
        <TouchableOpacity
          onPress={onSecondTabPress}
          style={
            indexCounter === 1
              ? styles.activeEventPricacy
              : styles.inactiveEventPricacy
          }>
          <Text
            style={
              indexCounter === 1
                ? styles.activeEventPrivacyText
                : styles.inactiveEventPrivacyText
            }>
            {secondTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      {totalTabs === 3 && <LinearGradient
        colors={[
          indexCounter === 2 ? colors.yellowColor : colors.lightGrayBackground,
          indexCounter === 2 ? colors.darkThemeColor : colors.lightGrayBackground,
        ]}
        style={
          indexCounter === 2
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }>
        <TouchableOpacity
          onPress={onThirdTabPress}
          style={
            indexCounter === 2
              ? styles.activeEventPricacy
              : styles.inactiveEventPricacy
          }>
          <Text
            style={
              indexCounter === 2
                ? styles.activeEventPrivacyText
                : styles.inactiveEventPrivacyText
            }>
            {thirdTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>}
    </View>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
     backgroundColor: colors.lightGrayBackground,
    flexDirection: 'row',
    borderRadius: wp('10%'),
    // borderColor: colors.themeColor,
    // borderWidth: wp('0.3%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    marginVertical: 20,
    width: wp('90%'),
    alignSelf: 'center',
  },
  activeEventPricacy: {
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('10%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('10%'),
    backgroundColor: colors.lightGrayBackground,

  },
  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 14,
  },
  inactiveEventPrivacyText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    letterSpacing: 0.5,
    fontSize: 14,
  },
});
