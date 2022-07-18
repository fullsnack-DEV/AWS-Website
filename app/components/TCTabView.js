import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
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
  inactiveHeight,
  activeHeight,
}) {
  return (
    <View style={[styles.eventPrivacyContianer, viewContainer]}>
      <LinearGradient
        colors={[
          indexCounter === 0 ? colors.offwhite : colors.grayBackgroundColor,
          indexCounter === 0 ? colors.offwhite : colors.grayBackgroundColor,
        ]}
        style={
          indexCounter === 0
            ? [styles.activeEventPricacy, {height: activeHeight}]
            : [styles.inactiveEventPricacy, {height: inactiveHeight}]
        }
      >
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
            {firstTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      {totalTabs !== 2 && (
        <View
          style={{
            height: 30,
            width: 1,
            backgroundColor: colors.veryLightGray,
            alignSelf: 'center',
          }}
        />
      )}
      <LinearGradient
        colors={[
          indexCounter === 1 ? colors.offwhite : colors.grayBackgroundColor,
          indexCounter === 1 ? colors.offwhite : colors.grayBackgroundColor,
        ]}
        style={
          indexCounter === 1
            ? [styles.activeEventPricacy, {height: activeHeight}]
            : [styles.inactiveEventPricacy, {height: inactiveHeight}]
        }
      >
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
            {secondTabTitle}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      {totalTabs !== 2 && (
        <View
          style={{
            height: 30,
            width: 1,
            backgroundColor: colors.veryLightGray,
            alignSelf: 'center',
          }}
        />
      )}
      {totalTabs === 3 && (
        <LinearGradient
          colors={[
            indexCounter === 2 ? colors.offwhite : colors.grayBackgroundColor,
            indexCounter === 2 ? colors.offwhite : colors.grayBackgroundColor,
          ]}
          style={
            indexCounter === 2
              ? [styles.activeEventPricacy, {height: activeHeight}]
              : [styles.inactiveEventPricacy, {height: inactiveHeight}]
          }
        >
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
              {thirdTabTitle}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  eventPrivacyContianer: {
    backgroundColor: colors.grayBackgroundColor,
    flexDirection: 'row',
    borderRadius: wp('2%'),
    // borderColor: colors.themeColor,
    // borderWidth: wp('0.3%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    marginVertical: 20,
    width: wp('92%'),
    alignSelf: 'center',
  },
  activeEventPricacy: {
    flex: 1,
    height: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('10%'),
    backgroundColor: colors.grayBackgroundColor,
  },
  activeEventPrivacyText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
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
