import React, { memo } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCSwitcher = ({
  tabs,
  onTabPress,
  selectedTab, // 1 OR 2
}) => (
  <View style={styles.eventPrivacyContianer}>
    {tabs.map((item, index) => (

      <TouchableOpacity
          activeOpacity={0.8}
          key={index}
            onPress={() => onTabPress(index)}
          style={{ flex: 1 }}
        >
        <LinearGradient
              key={index?.toString()}
              colors={
                selectedTab === index
                  ? [colors.yellowColor, colors.themeColor]
                  : [colors.whiteColor, colors.whiteColor]
              }
              style={selectedTab === index ? styles.activeEventPricacy : styles.inactiveEventPricacy}>
          <Text style={selectedTab === index ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
            {item}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    ))}
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
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  activeEventPricacy: {
    flex: 1,
    paddingVertical: hp(1.3),
    alignItems: 'center',
    borderRadius: wp('10%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp(1.3),
    alignItems: 'center',
    borderRadius: wp('10%'),
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

export default memo(TCSwitcher);
