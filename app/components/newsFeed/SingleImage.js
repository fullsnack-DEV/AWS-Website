/* eslint-disable consistent-return */
import React, {memo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
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
  const imageRatio = data.media_height / data.media_width;
  console.log('imageRatio', imageRatio);
  const defaultLandscapRatio = 0.71;
  const defaultPortraitRatio = 1.29;
  const defaultScreenWidth = Dimensions.get('window').width - 30;
  const defaultLandscapHeight = 250;
  const defaultPortraitHeight = 450;

  const uploadImageURL =
    data &&
    typeof data.thumbnail === 'string' &&
    (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1])
      ? null
      : data.thumbnail;

  const getImageDimention = () => {
    if (imageRatio < defaultLandscapRatio) {
      return {
        height: defaultLandscapHeight,
        width: defaultScreenWidth,
      };
    }
    if (
      imageRatio >= defaultLandscapRatio &&
      imageRatio <= defaultPortraitRatio
    ) {
      return {
        height: imageRatio * defaultScreenWidth,
        width: defaultScreenWidth,
      };
    }
    if (imageRatio >= defaultPortraitRatio) {
      return {
        height: defaultPortraitHeight,
        width: defaultScreenWidth,
      };
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
    shadowColor: colors.whiteColor,
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
