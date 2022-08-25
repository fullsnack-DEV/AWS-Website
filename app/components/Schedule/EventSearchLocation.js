import React from 'react';
import {StyleSheet, Image, Text} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function EventSearchLocation({
  sectionStyle,
  onLocationPress,
  locationText,
}) {
  return (
    <TouchableWithoutFeedback
      style={[styles.sectionStyle, sectionStyle]}
      onPress={onLocationPress}>
      <Image source={images.searchLocation} style={styles.searchImageStyle} />
      <Text style={[styles.textInput, {color: colors.userPostTimeColor}]}>
        {locationText}
      </Text>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    alignItems: 'center',
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    width: wp('92%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 0.8,
    elevation: 2,
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderWidth: 1,
    color: colors.lightBlackColor,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
  searchImageStyle: {
    height: 16,
    width: 16,
    tintColor: colors.magnifyIconColor,
    marginHorizontal: 5,
  },
});
