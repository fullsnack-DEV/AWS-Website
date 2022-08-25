import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCSmallButton = ({
  title,
  onPress,
  style,
  isBorderButton = false,
  textStyle,
  borderstyle,
  startGradientColor = colors.orangeGradientColor,
  endGradientColor = colors.yellowColor,
}) => (
  <TouchableOpacity onPress={onPress}>
    {!isBorderButton ? (
      <LinearGradient
        colors={[endGradientColor, startGradientColor]}
        style={[styles.containerStyle, {borderRadius: 20}, borderstyle, style]}>
        <Text
          style={[styles.buttonText, {color: colors.whiteColor}, textStyle]}>
          {title}
        </Text>
      </LinearGradient>
    ) : (
      <View style={[styles.containerStyle, borderstyle, style]}>
        <Text
          style={[styles.buttonText, {color: colors.whiteColor}, textStyle]}>
          {title}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
});

export default memo(TCSmallButton);
