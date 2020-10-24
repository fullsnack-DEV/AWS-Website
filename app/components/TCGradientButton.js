import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

function TCGradientButton({
  title,
  onPress,
  style,
  textStyle,
  startGradientColor = colors.yellowColor,
  endGradientColor = colors.themeColor,
  outerContainerStyle,
}) {
  return (
    <TouchableOpacity onPress={ onPress } style={ [styles.outerContainerStyle, outerContainerStyle] }>
      <LinearGradient
       colors={[startGradientColor, endGradientColor]}
       style={[styles.containerStyle, style]}>
        <Text style={ [styles.buttonText, textStyle] }>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainerStyle: {
    marginHorizontal: 15,
    marginVertical: 35,
  },
  containerStyle: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: 17,
    fontFamily: fonts.RBold,
  },
});

export default TCGradientButton;
