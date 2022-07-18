import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCGreenSwitcher = ({
  firstTabText,
  secondTabText,
  onFirstTabPress,
  onSecondTabPress,
  selectedTab, // 1 OR 2
}) => (
  <View style={styles.eventPrivacyContianer}>
    <LinearGradient
      colors={
        selectedTab === 1
          ? [colors.greenGradientStart, colors.greenGradientEnd]
          : [colors.lightgrayColor, colors.lightgrayColor]
      }
      style={
        selectedTab === 1
          ? styles.activeEventPricacy
          : styles.inactiveEventPricacy
      }
    >
      <Text
        onPress={onFirstTabPress}
        style={selectedTab === 1 ? styles.whiteTextColor : styles.grayTextColor}
      >
        {firstTabText}
      </Text>
    </LinearGradient>
    <LinearGradient
      colors={
        selectedTab === 2
          ? [colors.greenGradientStart, colors.greenGradientEnd]
          : [colors.lightgrayColor, colors.lightgrayColor]
      }
      style={
        selectedTab === 2
          ? styles.activeEventPricacy
          : styles.inactiveEventPricacy
      }
    >
      <Text
        onPress={onSecondTabPress}
        style={selectedTab === 2 ? styles.whiteTextColor : styles.grayTextColor}
      >
        {secondTabText}
      </Text>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: 30,
    borderColor: colors.lightgrayColor,
    backgroundColor: colors.lightgrayColor,
    borderWidth: 1,
    paddingHorizontal: '0.5%',
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    height: 21,
    width: '60%',
  },
  activeEventPricacy: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 30,
    alignSelf: 'center',
  },
  inactiveEventPricacy: {
    flex: 1,
    alignItems: 'center',
  },
  whiteTextColor: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  grayTextColor: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.grayColor,
  },
});

export default TCGreenSwitcher;
