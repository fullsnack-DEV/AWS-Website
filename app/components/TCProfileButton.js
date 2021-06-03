import React, { memo } from 'react';
import {
  StyleSheet, Text, TouchableWithoutFeedback, View, Image,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCProfileButton = ({
  title = 'Profile',
  showArrow = true,
  onPressProfile = () => {},
  style,
  rightImage = images.arrowGraterthan,
  imageStyle,
  textStyle,
}) => (
  <TouchableWithoutFeedback onPress={onPressProfile}>
    <View style={[styles.buttonView, style]}>
      <Text style={[styles.textStyle, textStyle]} numberOfLines={1}>{title}</Text>
      {showArrow && <Image source={ rightImage } style={ [styles.arrowImage, imageStyle] } />}
    </View>
  </TouchableWithoutFeedback>
  )
const styles = StyleSheet.create({

  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    tintColor: colors.lightBlackColor,
  },
});

export default memo(TCProfileButton);
