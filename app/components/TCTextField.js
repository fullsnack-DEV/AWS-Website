import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCTextField({
  testID = '',
  placeholder,
  placeholderTextColor = colors.userPostTimeColor,
  secureText = false,
  keyboardType = 'default',
  style,
  textStyle,
  height = 40,
  multiline = false,
  leftView,
  editable = true,
  ...otherProps
}) {
  return (
    <View style={[styles.textContainer, style, {height}]}>
      <TextInput
        testID={testID}
        style={[styles.textInput, textStyle, {height}]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCapitalize={'none'}
        autoCorrect={false}
        editable={editable}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...otherProps}
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
    borderRadius: 4,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
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
