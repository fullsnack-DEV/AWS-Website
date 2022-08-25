import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../Constants/Colors';

function CreateEventButton({
  source,
  onPress,
  style,
  imageStyle,
  startGradientColor = colors.themeColor,
  endGradientColor = colors.yellowColor,
  outerContainerStyle,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.outerContainerStyle, outerContainerStyle]}>
      <LinearGradient
        colors={[startGradientColor, endGradientColor]}
        style={[styles.containerStyle, style]}>
        <Image source={source} style={[styles.imageStyle, imageStyle]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainerStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'flex-end',
    right: 22,
    bottom: 22,
    position: 'absolute',
    shadowOpacity: 0.6,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    elevation: 10,
    shadowColor: colors.googleColor,
  },
  containerStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2.5,
    borderColor: colors.whiteColor,
  },
  imageStyle: {
    height: 20,
    width: 20,
    tintColor: colors.whiteColor,
  },
});

export default CreateEventButton;
