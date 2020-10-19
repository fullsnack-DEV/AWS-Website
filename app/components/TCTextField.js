import React from 'react';
import {
  StyleSheet,

  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';

const {
  colors, fonts,
} = constants;

function TCTextField({
  placeholder,
  secureText = false,
  keyboardType = 'default',
  ...otherProps
}) {
  return (
      <TextInput
      style={ styles.textInput }
      placeholder={ placeholder }
      placeholderTextColor={ colors.themeColor }
      secureTextEntry={ secureText }
      keyboardType={ keyboardType }
      { ...otherProps }
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    height: 40,
    marginBottom: hp('1.5%'),
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    paddingLeft: 17,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});

export default TCTextField;

/*
keyboardType :
The following values work across platforms:

default
number-pad
decimal-pad
numeric
email-address
phone-pad
*/
