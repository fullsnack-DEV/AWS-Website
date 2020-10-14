import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
const {fonts} = constants;

function ImageButton({source, onImagePress, imageStyle}) {
  return (
    <TouchableOpacity onPress={onImagePress}>
      <Image source={source} style={[styles.imageStyle, imageStyle]} resizeMode={'contain'}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: hp('2.5%'),
    width: hp('2.5%'),
    marginVertical: hp('0.5%')
  },
});

export default ImageButton;
