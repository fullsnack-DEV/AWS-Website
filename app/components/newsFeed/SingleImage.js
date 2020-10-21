import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { loaderImage } from '../../Constants/LoaderImages';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function SingleImage({ data }) {
  const uploadImageURL = data && typeof data.thumbnail === 'string' && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  const randomImage = Math.floor(Math.random() * loaderImage.length);
  let height = wp('94%');
  height = data.media_height > data.media_width ? height = wp('114%') : height = wp('74%');
  return (
      <View
      style={ [
        styles.uploadedImage,
        {
          height,
        },
      ] }>
          <View style={ [styles.uploadedImage, {
            borderWidth: 1,
            borderColor: colors.lightgrayColor,
            height,
          }]}>
              <FastImage
          style={ styles.imageStyle }
          source={ loaderImage[randomImage].image }
          resizeMode={ FastImage.resizeMode.contain }
        />
              <Text style={ styles.loadingTextStyle }>Loading...</Text>
          </View>
          <FastImage
        style={ [
          styles.uploadedImage,
          {
            height,
            position: 'absolute',
          },
        ] }
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
    borderRadius: wp('5%'),
    height: wp('94%'),
    justifyContent: 'center',
    marginVertical: '2%',
    width: wp('94%'),
  },
});

export default SingleImage;
