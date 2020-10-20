import React from 'react';
import {
  StyleSheet,

  Text,
  TouchableOpacity,

} from 'react-native';
import constants from '../config/constants';

const {
  colors, fonts,
} = constants;

function TCButton({
  title,
  onPress,
  extraStyle,
  textColor = { color: colors.themeColor },
}) {
  return (
      <TouchableOpacity onPress={ onPress } style={ [styles.allButton, extraStyle] }>
          <Text style={ [styles.signUpText, textColor] }>{title}</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  allButton: {
    alignContent: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    height: 50,
    marginLeft: '7%',
    marginRight: '5%',
    shadowColor: colors.googleColor,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '86%',
  },

  signUpText: {
    fontFamily: fonts.RBold,
    fontSize: 17,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
});

export default TCButton;
