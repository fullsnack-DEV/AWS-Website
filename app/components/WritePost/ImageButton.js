import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

function ImageButton({source, onImagePress, imageStyle, resizeMode, style}) {
  return (
    <TouchableOpacity
      onPress={onImagePress}
      style={[styles.containerStyle, style]}>
      <Image
        source={source}
        style={[styles.imageStyle, imageStyle]}
        resizeMode={'contain' || resizeMode}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: hp('2.5%'),
    marginVertical: hp('0.5%'),
    width: hp('2.5%'),
  },
});

export default ImageButton;
