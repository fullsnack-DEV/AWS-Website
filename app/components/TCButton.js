import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
} from 'react-native';
import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function TCButton({
  title,
  onPress,
  extraStyle,
  textColor = {color: colors.themeColor},
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.allButton, extraStyle]}>
      <Text style={[styles.signUpText, textColor]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  allButton: {
    backgroundColor: colors.whiteColor,
    marginLeft: '7%',
    marginRight: '5%',
    borderRadius: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,

    height: 50,
    alignContent: 'center',
    width: '86%',
  },

  signUpText: {
    fontSize: 17,
    fontFamily: fonts.RBold,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
});

export default TCButton;
