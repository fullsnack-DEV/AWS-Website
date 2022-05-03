import React, { memo, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';

function SingleImage({
  data,
  item,
  navigation,
  updateCommentCount,
 onLikePress,
}) {
  const uploadImageURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;
  let height = wp('96%');
  if (data.media_height > data.media_width) {
    height = wp('124%')
  } else if (data.media_height < data.media_width) {
    height = wp('68%')
  } else {
    height = wp('96%')
  }

  const toggleModal = useCallback(() => {
    navigation.navigate('FeedViewScreen', {
      feedItem: item,
      updateCommentCount,
      onLikePress,
    })
  }, [item, navigation, onLikePress, updateCommentCount]);

  return (
    <View
      style={ [
        styles.mainContainer,
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
          source={ images.imageLoadingGIF }
          resizeMode={ FastImage.resizeMode.contain }
        />
        <Text style={ styles.loadingTextStyle }>Loading...</Text>
      </View>
      <TouchableWithoutFeedback onPress={() => {
        if (uploadImageURL) {
          toggleModal();
        }
      }}>
        <FastImage
          style={{ ...styles.uploadedImage, height, position: 'absolute' }}
          source={{ uri: uploadImageURL }}
          resizeMode={ FastImage.resizeMode.cover }
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
    borderRadius:10,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 2,
    height: wp('91%'),
    width: wp('91%'),
    marginVertical: '1%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
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
