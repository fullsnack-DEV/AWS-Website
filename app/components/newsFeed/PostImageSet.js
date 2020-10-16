import React, { useState } from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import { loaderImage } from '../../Constants/LoaderImages';
const {fonts, colors} = constants;

function PostImageSet({data, itemNumber, totalItemNumber}) {
  const randomImage = Math.floor(Math.random() * loaderImage.length);

  return (
    <View style={styles.uploadedImage}>
      <View style={[styles.uploadedImage, { borderWidth: 1, borderColor: colors.lightgrayColor}]}>
        <FastImage
          style={styles.imageStyle}
          source={loaderImage[randomImage].image}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      <Image
        style={[styles.uploadedImage, {position: 'absolute'}]}
        source={{
          uri: data.thumbnail,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.lengthViewStyle}>
        <Text style={styles.lengthTextStyle}>
          {itemNumber}
          {'/'}
          {totalItemNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    height: wp('91%'),
    width: wp('91%'),
    marginVertical: '1%',
    borderRadius: wp('4%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lengthViewStyle: {
    position: 'absolute',
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    top: wp('5%'),
    right: wp('3%'),
    padding: wp('1.5%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lengthTextStyle: {
    fontSize: 15,
    color: '#fff',
    paddingHorizontal: wp('1.5%'),
    fontFamily: fonts.RRegular,
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  loadingTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.googleColor,
    marginTop: 25
}
});

export default PostImageSet;
