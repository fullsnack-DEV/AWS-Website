import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

const TCGradientButton = ({
  title,
  onPress,
  style,
  textStyle,
  rightIcon,
  rightIconStyle,
  startGradientColor = colors.orangeGradientColor,
  endGradientColor = colors.yellowColor,
  outerContainerStyle,
  disabled = false,
  isDisabled = false,

  ...props
}) => (
  <TouchableOpacity disabled={disabled || isDisabled} onPress={ onPress } style={ [styles.outerContainerStyle, outerContainerStyle, props] }>
    <LinearGradient
       colors={isDisabled ? [colors.grayBackgroundColor, colors.grayBackgroundColor] : [endGradientColor, startGradientColor]}
       style={[styles.containerStyle, style]}>
      <Text style={ [styles.buttonText, { color: isDisabled ? colors.blocklightgraycolor : colors.whiteColor }, textStyle] }>{title}</Text>
      {rightIcon && <Image style={[styles.rightIconStyle, rightIconStyle]} source={rightIcon} />}
    </LinearGradient>
  </TouchableOpacity>
  )

const styles = StyleSheet.create({
  outerContainerStyle: {
    overflow: 'hidden',
    width: '92%',
    alignSelf: 'center',
  },
  containerStyle: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
  rightIconStyle: {
    alignSelf: 'center',
  },
});

export default memo(TCGradientButton);
