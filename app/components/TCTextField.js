import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function TCTextField({
  placeholder,
  secureText = false,
  keyboardType = 'default',
  ...otherProps
}) {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor={colors.themeColor}
      secureTextEntry={secureText}
      keyboardType={keyboardType}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    marginBottom: hp('1.5%'),
    borderRadius: 5,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,
    // fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    color: colors.blackColor,
    paddingLeft: 17,
    height: 40,
    backgroundColor: colors.whiteColor,
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
