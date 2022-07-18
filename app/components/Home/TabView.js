import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function TabView({
  onFirstTabPress,
  onSecondTabPress,
  onThirdTabPress,
  indexCounter,
}) {
  return (
    <View style={styles.eventPrivacyContianer}>
      <TouchableOpacity
        onPress={onFirstTabPress}
        style={
          indexCounter === 0
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }
      >
        <Text
          style={
            indexCounter === 0
              ? styles.activeEventPrivacyText
              : styles.inactiveEventPrivacyText
          }
        >
          {'All'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={
          indexCounter === 1
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }
      >
        <Text
          style={
            indexCounter === 1
              ? styles.activeEventPrivacyText
              : styles.inactiveEventPrivacyText
          }
        >
          {'From me'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onThirdTabPress}
        style={
          indexCounter === 2
            ? styles.activeEventPricacy
            : styles.inactiveEventPricacy
        }
      >
        <Text
          style={
            indexCounter === 2
              ? styles.activeEventPrivacyText
              : styles.inactiveEventPrivacyText
          }
        >
          {'Tagged'}
        </Text>
      </TouchableOpacity>
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
    width: wp('80%'),
    alignSelf: 'center',
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.activeIndexColor,
    paddingVertical: hp('1'),
    alignItems: 'center',
    borderRadius: wp('10%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp('1'),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 15,
  },
  inactiveEventPrivacyText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    letterSpacing: 0.5,
    fontSize: 15,
  },
});
