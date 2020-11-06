import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function BackForwardView({
  textValue, onBackArrowPress, onForwardArrowPress,
}) {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={onBackArrowPress}>
        <Image source={images.backArrow} style={styles.imageViewStyle} />
      </TouchableOpacity>
      <Text style={styles.textViewStyle}>{textValue}</Text>
      <TouchableOpacity onPress={onForwardArrowPress}>
        <Image source={images.arrowGraterthan} style={styles.imageViewStyle} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewStyle: {
    height: 15,
    width: 15,
    tintColor: colors.orangeColor,
  },
  textViewStyle: {
    fontSize: 15,
    fontFamily: fonts.RBold,
    color: colors.orangeColor,
    paddingHorizontal: 10,
  },
});
