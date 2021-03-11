import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';
import TCZoomableImage from '../TCZoomableImage';

function MultipleImageWithLoader({
  data,
}) {
  const uploadImageURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  return (
    <View style={ styles.uploadedImage }>
      <View style={styles.uploadedImage}>
        <Image
          style={ styles.imageStyle }
          source={ images.imageLoadingGIF }
        />
        <Text style={ styles.loadingTextStyle }>Loading...</Text>
      </View>
      {/* <Image
        style={ [styles.uploadedImage, { position: 'absolute' }] }
        source={ {
          uri: uploadImageURL,
        } }
      /> */}
      <TCZoomableImage
                      source={{ uri: uploadImageURL }}
                      style={ [styles.uploadedImage, { position: 'absolute' }] }
                  />
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 50,
    width: 50,
    tintColor: colors.whiteColor,
    resizeMode: 'contain',
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
    resizeMode: 'contain',
  },
});

export default MultipleImageWithLoader;
