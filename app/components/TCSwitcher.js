import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCSwitcher = ({
  firstTabText,
  secondTabText,
  onFirstTabPress,
  onSecondTabPress,
  selectedTab, // 1 OR 2
}) => (
  <View style={styles.eventPrivacyContianer}>
    <TouchableOpacity
                onPress={onFirstTabPress}
                style={selectedTab === 1 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
            >
      <Text style={selectedTab === 1 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
        {firstTabText}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
                onPress={onSecondTabPress}
                style={selectedTab === 2 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
            >
      <Text style={selectedTab === 2 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
        {secondTabText}
      </Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: wp('10%'),
    borderColor: colors.themeColor,
    borderWidth: wp('0.3%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    marginVertical: 20,
    marginHorizontal: 10,
    // width: wp('60%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.activeIndexColor,
    paddingVertical: hp(1.3),
    alignItems: 'center',
    borderRadius: wp('10%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp(1.3),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 12,
  },
  inactiveEventPrivacyText: {
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 12,
  },
});

export default TCSwitcher;
