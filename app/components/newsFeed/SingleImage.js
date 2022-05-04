/* eslint-disable consistent-return */
import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function SingleImage({
  data,
  item,
  navigation,
  updateCommentCount,
  onLikePress,
}) {
  const defaultImageWidth = 500;
  const defaultImageHeight = 700;
  const uploadImageURL =
    data &&
    typeof data.thumbnail === 'string' &&
    (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1])
      ? null
      : data.thumbnail;

  const getImageDimention = () => {
    const isPortrait = data.media_height > data.media_width;
    const imagePRatio = parseFloat(
      data.media_width / data.media_height,
    ).toFixed(2);
    const imageLRatio = parseFloat(
      data.media_height / data.media_width,
    ).toFixed(2);
    console.log('image height', data.media_height);
    console.log('image width', data.media_width);
    console.log('isPortrait', isPortrait);
    console.log('image ratio', imagePRatio);

    if (isPortrait) {
      if (data.media_height >= defaultImageHeight) {
        console.log('1');
        return {
          height: defaultImageHeight * imagePRatio,
          width: defaultImageWidth,
        };
      }
      console.log('2');
      return {height: data.media_height, width: data.media_width};
    }
    if (imagePRatio === 1) {
      console.log('5');
      return {height: data.media_height, width: data.media_width};
    }
    if (!isPortrait) {
      if (data.media_width >= defaultImageHeight) {
        console.log('3');
        return {
          height: defaultImageWidth,
          width: defaultImageHeight * imageLRatio,
        };
      }
      console.log('4');
      return {height: data.media_height, width: data.media_width};
    }
  };

  const toggleModal = useCallback(() => {
    navigation.navigate('FeedViewScreen', {
      feedItem: item,
      updateCommentCount,
      onLikePress,
    });
  }, [item, navigation, onLikePress, updateCommentCount]);

  return (
    <View
      style={[
        styles.mainContainer,
        {
          height: getImageDimention().height,
        },
      ]}>
      <View
        style={[
          styles.uploadedImage,
          {
            borderWidth: 1,
            borderColor: colors.lightgrayColor,
            height: getImageDimention().height,
          },
        ]}>
        <FastImage
          style={styles.imageStyle}
          source={images.imageLoadingGIF}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          if (uploadImageURL) {
            toggleModal();
          }
        }}>
        <FastImage
          style={{
            ...styles.uploadedImage,
            height: getImageDimention().height,
            position: 'absolute',
          }}
          source={{uri: uploadImageURL}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
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
  mainContainer: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    elevation: 2,
    height: wp('91%'),
    width: wp('91%'),
    marginVertical: '1%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    // aspectRatio: 7 / 5,
  },
  uploadedImage: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: wp('96%'),
    width: wp('96%'),
  },
});

export default memo(SingleImage);
