import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { loaderImage } from '../../Constants/LoaderImages';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function MultipleImageWithLoader({
  data,
}) {
  const randomImage = Math.floor(Math.random() * loaderImage.length);
  const uploadImageURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

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
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 50,
    width: 50,
    tintColor: colors.whiteColor,
  },
  loadingTextStyle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 14,
    marginTop: 25,
  },
  uploadedImage: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('98%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default MultipleImageWithLoader;
