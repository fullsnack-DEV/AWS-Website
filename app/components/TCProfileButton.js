import React from 'react';
import {
  StyleSheet, Text, TouchableWithoutFeedback, View, Image,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCProfileButton({
  title = 'Profile',
  showArrow = true,
  onPressProfile,
  style,
  rightImage = images.arrowGraterthan,
  imageStyle,
  textStyle,
}) {
  return (

    <TouchableWithoutFeedback onPress={onPressProfile}>
      <View style={[styles.buttonView, style]}>
        <Text style={[styles.textStyle, textStyle]}>{title}</Text>
        {showArrow && <Image source={ rightImage } style={ [styles.arrowImage, imageStyle] } />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    width: 75,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4,
    elevation: 3,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  arrowImage: {
    alignSelf: 'center',
    height: 10,
    resizeMode: 'contain',
    width: 5,
    marginLeft: 8,
  },
});
