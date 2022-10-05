import React, {memo} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCGrayButton = ({
  title = 'Profile',
  showArrow = true,
  onPressProfile = () => {},
  style,
  rightImage = images.arrowGraterthan,
  imageStyle,
  textStyle,
}) => (
  <Pressable onPress={onPressProfile}>
    <View style={[styles.buttonView, style]}>
      <Text style={[styles.textStyle, textStyle]} numberOfLines={1}>
        {title}
      </Text>
      {showArrow && (
        <Image source={rightImage} style={[styles.arrowImage, imageStyle]} />
      )}
    </View>
  </Pressable>
);
const styles = StyleSheet.create({
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    backgroundColor: colors.grayBackgroundColor,
    paddingHorizontal: 5,
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

export default memo(TCGrayButton);
