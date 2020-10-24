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
  ...otherProps
}) {
  return (
    <View style={[styles.textContainer, style]}>
      <TextInput
        style={ [styles.textInput, textStyle] }
        placeholder={ placeholder }
        placeholderTextColor={ placeholderTextColor }
        secureTextEntry={ secureText }
        keyboardType={ keyboardType }
        { ...otherProps }
    />
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    height: 40,
    marginHorizontal: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,

  },
  textInput: {
    height: '100%',
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
