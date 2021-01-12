import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

function TCTextField({
  placeholder,
  placeholderTextColor = colors.userPostTimeColor,
  secureText = false,
  keyboardType = 'default',
  style,
  textStyle,
  height = 40,
  multiline = false,
  leftView,
  ...otherProps
}) {
  return (
    <View style={[styles.textContainer, style, { height }]}>
      <TextInput
      style={ [styles.textInput, textStyle, { height }] }
      placeholder={ placeholder }
      placeholderTextColor={ placeholderTextColor }
      autoCapitalize={'none'}
      secureTextEntry={ secureText }
      keyboardType={ keyboardType }
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      { ...otherProps }
  />
      {leftView}
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    marginHorizontal: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
    flex: 1,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
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
