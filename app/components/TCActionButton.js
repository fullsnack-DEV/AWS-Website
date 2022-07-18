import React, {memo} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity, View} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCActionButton = ({
  title,
  onPress,
  style,
  textStyle,
  rightIcon,
  rightIconStyle,
  outerContainerStyle,
  disabled = false,
  isDisabled = false,

  ...props
}) => (
  <TouchableOpacity
    disabled={disabled || isDisabled}
    onPress={onPress}
    style={[styles.outerContainerStyle, outerContainerStyle, props]}
  >
    <View style={[styles.containerStyle, style]}>
      <Text style={[styles.buttonText, {color: colors.themeColor}, textStyle]}>
        {title}
      </Text>
      {rightIcon && (
        <Image
          style={[styles.rightIconStyle, rightIconStyle]}
          source={rightIcon}
        />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerContainerStyle: {
    width: '92%',
    alignSelf: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
  },
  containerStyle: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: colors.offwhite,
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

export default memo(TCActionButton);
