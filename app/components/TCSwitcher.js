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
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCSwitcher = ({
  tabs,
  onTabPress,
  selectedTab, // 1 OR 2,
  focusedTabColors = [colors.yellowColor, colors.themeColor],
  unFocusedTabColors = [colors.whiteColor, colors.whiteColor],
  focusedTabTextColor = colors.whiteColor,
  unFocusedTabTextColor = colors.themeColor,
  borderColor = colors.yellowColor,
}) => (
  <View style={{ ...styles.eventPrivacyContianer, borderColor }}>
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
                selectedTab === index ? focusedTabColors : unFocusedTabColors
              }
              style={styles.gradiantContainer}>
          <Text
              style={{ ...styles.tabText, color: selectedTab === index ? focusedTabTextColor : unFocusedTabTextColor }}
          >
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
    borderWidth: wp('0.3%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gradiantContainer: {
    flex: 1,
    paddingVertical: hp(1.3),
    alignItems: 'center',
    borderRadius: wp('10%'),
  },
  tabText: {
    fontFamily: fonts.RBold,
    letterSpacing: 0.5,
    fontSize: 12,
  },
});

export default TCSwitcher;
