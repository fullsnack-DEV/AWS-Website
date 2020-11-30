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
  startGradientColor = colors.orangeGradientColor,
  endGradientColor = colors.yellowColor,
  outerContainerStyle,
  ...props
}) {
  return (
    <TouchableOpacity onPress={ onPress } style={ [styles.outerContainerStyle, outerContainerStyle, props] }>
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
    margin: 15,
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
