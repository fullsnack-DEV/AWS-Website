import React, {memo} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCGradientButton = ({
  title,
  onPress,
  style,
  textStyle,
  rightIcon,
  rightIconStyle,
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
    style={[
      styles.outerContainerStyle,
      outerContainerStyle,
      props,
      isDisabled || disabled
        ? {backgroundColor: colors.grayBackgroundColor}
        : {},
    ]}>
    <Text
      style={[
        styles.buttonText,
        textStyle,
        isDisabled || disabled ? {color: colors.blocklightgraycolor} : {},
      ]}>
      {title}
    </Text>
    {rightIcon && (
      <Image
        style={[styles.rightIconStyle, rightIconStyle]}
        source={rightIcon}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeColor,
    padding: 8,
    borderRadius: 5,
  },

  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  rightIconStyle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});

export default memo(TCGradientButton);
