import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function TwoTabView({
  onFirstTabPress,
  onSecondTabPress,
  indexCounter,
  firstTabTitle,
  secondTabTitle,
}) {
  return (
    <View style={styles.eventPrivacyContianer}>
      <TouchableOpacity
        onPress={onFirstTabPress}
        style={styles.activeEventPricacy}
      >
        <Text style={indexCounter === 0 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
          {firstTabTitle}
        </Text>
      </TouchableOpacity>
      <View style={styles.itemSepratorView} />
      <TouchableOpacity
        onPress={onSecondTabPress}
        style={styles.activeEventPricacy}
      >
        <Text style={indexCounter === 1 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
          {secondTabTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    paddingHorizontal: wp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
  activeEventPricacy: {
    alignItems: 'center',
  },
  itemSepratorView: {
    height: 15,
    width: 1,
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    marginHorizontal: wp('3%'),
  },
  activeEventPrivacyText: {
    color: colors.orangeColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 14,
  },
  inactiveEventPrivacyText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RLight,
    letterSpacing: 0.5,
    fontSize: 14,
  },
});
