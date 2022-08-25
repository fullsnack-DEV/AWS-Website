import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

function TCArrowView({title, onPress, containerStyle}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.viewContainer, containerStyle]}>
      <Text style={styles.titleStyle}>{title}</Text>
      <Image source={images.nextArrow} style={styles.infoImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },

  infoImage: {
    width: 15,
    height: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 15,
  },
});

export default TCArrowView;
