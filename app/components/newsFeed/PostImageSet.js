import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import { loaderImage } from '../../Constants/LoaderImages';

const { fonts, colors } = constants;

function PostImageSet({ data, itemNumber, totalItemNumber }) {
  const randomImage = Math.floor(Math.random() * loaderImage.length);
  const uploadImageURL = data && typeof data.thumbnail === 'string' && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  return (
      <View style={ styles.uploadedImage }>
          <View style={ [styles.uploadedImage, { borderWidth: 1, borderColor: colors.lightgrayColor }] }>
              <FastImage
          style={ styles.imageStyle }
          source={ loaderImage[randomImage].image }
          resizeMode={ FastImage.resizeMode.contain }
        />
              <Text style={ styles.loadingTextStyle }>Loading...</Text>
          </View>
          <Image
        style={ [styles.uploadedImage, { position: 'absolute' }] }
        source={ {
          uri: uploadImageURL,
        } }
        resizeMode={ FastImage.resizeMode.cover }
      />
          <View style={ styles.lengthViewStyle }>
              <Text style={ styles.lengthTextStyle }>
                  {itemNumber}
                  {'/'}
                  {totalItemNumber}
              </Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 50,
    width: 50,
  },
  lengthTextStyle: {
    color: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 15,
    paddingHorizontal: wp('1.5%'),
  },
  lengthViewStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    padding: wp('1.5%'),
    position: 'absolute',
    right: wp('3%'),
    top: wp('5%'),
  },
  loadingTextStyle: {
    color: colors.googleColor,
    fontFamily: fonts.RBold,
    fontSize: 14,
    marginTop: 25,
  },
  uploadedImage: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('91%'),
    justifyContent: 'center',
    marginVertical: '1%',
    width: wp('91%'),
  },
});

export default PostImageSet;
