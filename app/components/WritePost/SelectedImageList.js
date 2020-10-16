import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';
const {fonts} = constants;

function SelectedImageList({data, onItemPress}) {
  return (
    <View style={styles.uploadedImage}>
      <FastImage
        style={styles.uploadedImage}
        source={{uri: data.path}}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity style={styles.lengthViewStyle} onPress={onItemPress}>
        <Image source={PATH.cancelImage} style={styles.cancelImageStyle} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    height: wp('30%'),
    width: wp('30%'),
    marginVertical: '1%',
    borderRadius: wp('4%'),
  },
  lengthViewStyle: {
    position: 'absolute',
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    top: wp('1%'),
    right: wp('1%'),
    // padding: wp('1.5%'),
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelImageStyle: {
      height: 12,
      width: 12,
  }
});

export default SelectedImageList;
