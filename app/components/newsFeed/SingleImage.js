import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import { loaderImage } from '../../Constants/LoaderImages';
const { fonts, colors } = constants;

function SingleImage({ data }) {
  let uploadImageURL = data && typeof data.thumbnail === "string" && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  const randomImage = Math.floor(Math.random() * loaderImage.length);
  return (
    <View
      style={[
        styles.uploadedImage,
        {
          height:
            data.media_height > data.media_width
              ? wp('114%')
              : data.media_height < data.media_width
                ? wp('74%')
                : wp('94%'),
        },
      ]}>
      <View style={[styles.uploadedImage, { 
        borderWidth: 1, borderColor: colors.lightgrayColor, height:
        data.media_height > data.media_width
          ? wp('114%')
          : data.media_height < data.media_width
            ? wp('74%')
            : wp('94%'),
        }]}>
        <FastImage
          style={styles.imageStyle}
          source={loaderImage[randomImage].image}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      <FastImage
        style={[
          styles.uploadedImage,
          {
            height:
              data.media_height > data.media_width
                ? wp('114%')
                : data.media_height < data.media_width
                  ? wp('74%')
                  : wp('94%'),
            position: 'absolute'
          },
        ]}
        source={{
          uri: uploadImageURL,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    height: wp('94%'),
    width: wp('94%'),
    marginVertical: '2%',
    borderRadius: wp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
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

export default SingleImage;
