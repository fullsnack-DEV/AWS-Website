import React, {memo} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCGradientButton = ({
  title,
  onPress,
  style,
  textStyle,
  rightIcon,
  rightIconStyle,
  startGradientColor = colors.darkThemeColor,
  endGradientColor = colors.yellowColor,
  outerContainerStyle,
  disabled = false,
  isDisabled = false,
  accessibilityLabel,
  ...props
}) => (
  <TouchableOpacity
    testID={`${accessibilityLabel}`}
    disabled={disabled || isDisabled}
    onPress={onPress}
    style={[styles.outerContainerStyle, outerContainerStyle, props]}>
    <LinearGradient
      colors={
        disabled || isDisabled
          ? [colors.grayBackgroundColor, colors.grayBackgroundColor]
          : [endGradientColor, startGradientColor]
      }
      style={[styles.containerStyle, style]}>
      <Text
        style={[
          styles.buttonText,
          {
            color:
              isDisabled || disabled
                ? colors.blocklightgraycolor
                : colors.whiteColor,
          },
          textStyle,
        ]}>
        {title}
      </Text>
      {rightIcon && (
        <Image
          style={[styles.rightIconStyle, rightIconStyle]}
          source={rightIcon}
        />
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerContainerStyle: {
    width: '92%',
    alignSelf: 'center',
    // shadowColor: colors.blackColor,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.16,
    // shadowRadius: 3,
    // elevation: 1.5,
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
