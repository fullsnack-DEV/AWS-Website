import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ScheduleTabView({
  firstTabTitle,
  secondTabTitle,
  onFirstTabPress,
  onSecondTabPress,
  indexCounter,
  eventPrivacyContianer,
}) {
  return (
    <View style={[styles.eventPrivacyContianer, eventPrivacyContianer]}>
      <LinearGradient
          colors={[indexCounter === 0 ? colors.orangeColor : colors.whiteColor, indexCounter === 0 ? colors.yellowColor : colors.whiteColor]}
          style={indexCounter === 0 ? styles.activeEventPricacy : styles.inactiveEventPricacy}>
        <TouchableOpacity
          onPress={onFirstTabPress}
          style={indexCounter === 0 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
        >
          <Text style={indexCounter === 0 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
            {firstTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
          colors={[indexCounter === 1 ? colors.orangeColor : colors.whiteColor, indexCounter === 1 ? colors.yellowColor : colors.whiteColor]}
          style={indexCounter === 1 ? styles.activeEventPricacy : styles.inactiveEventPricacy}>
        <TouchableOpacity
          onPress={onSecondTabPress}
          style={indexCounter === 1 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
        >
          <Text style={indexCounter === 1 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
            {secondTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: wp('10%'),
    borderColor: colors.themeColor,
    borderWidth: wp('0.3%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    marginVertical: 20,
    width: wp('60%'),
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
  },
  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  inactiveEventPrivacyText: {
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 16,
  },
});
