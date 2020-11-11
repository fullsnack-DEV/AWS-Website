import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function BlockAvailableTabView({
  onFirstTabPress,
  onSecondTabPress,
  blocked,
  style,
  startGradientColor = blocked ? '#9A9A9A' : '#ADDA51',
  endGradientColor = blocked ? '#A9A9A9' : '#4AC285',
  firstTabTitle,
  secondTabTitle,
}) {
  return (
    <LinearGradient
        colors={[startGradientColor, endGradientColor]}
        style={[styles.eventPrivacyContianer, style]}
      >
      <TouchableOpacity
            onPress={onFirstTabPress}
            style={blocked ? styles.activeEventPricacy : styles.inactiveEventPricacy}
        >
        <Text style={blocked ? [styles.activeEventPrivacyText, { color: colors.grayColor }] : styles.inactiveEventPrivacyText}>{firstTabTitle}</Text>
      </TouchableOpacity>
      <TouchableOpacity
            onPress={onSecondTabPress}
            style={!blocked ? styles.activeEventPricacy : styles.inactiveEventPricacy}
        >
        <Text style={!blocked ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>{secondTabTitle}</Text>
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
    marginVertical: 20,
    width: wp('94%'),
    alignSelf: 'center',
    backgroundColor: colors.greeColor,
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    paddingVertical: hp('0.8'),
    alignItems: 'center',
    borderRadius: wp('1.5%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp('0.8'),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: colors.greeColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  inactiveEventPrivacyText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 16,
  },
});
