import React, {memo} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
// import images from '../../Constants/ImagePath';

function PostImageSet({
  data,
  itemNumber,
  totalItemNumber,
  item,
  navigation,
  updateCommentCount,
  onLikePress,
}) {
  const uploadImageURL =
    data &&
    typeof data.thumbnail === 'string' &&
    (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1])
      ? null
      : data.thumbnail;

  const toggleModal = () => {
    // setModalVisible(!isModalVisible);
    navigation.navigate('NewsFeedStack', {
      screen: 'FeedViewScreen',
      params: {
        feedItem: item,
        currentPage: itemNumber,
        updateCommentCount,
        onLikePress,
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* <View
        style={[
          styles.uploadedImage,
          {borderWidth: 1, borderColor: colors.lightgrayColor},
        ]}>
        <FastImage
          style={styles.imageStyle}
          source={images.imageLoadingGIF}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View> */}
      <TouchableWithoutFeedback onPress={toggleModal}>
        <FastImage
          style={[styles.uploadedImage, {position: 'absolute'}]}
          source={{uri: uploadImageURL}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
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
  // imageStyle: {
  //   height: 50,
  //   width: 50,
  // },
  lengthTextStyle: {
    color: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 15,
    paddingHorizontal: wp('1.5%'),
  },
  lengthViewStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    padding: wp('1.5%'),
    position: 'absolute',
    right: 10,
    top: 18,
  },
  // loadingTextStyle: {
  //   color: colors.googleColor,
  //   fontFamily: fonts.RBold,
  //   fontSize: 14,
  //   marginTop: 25,
  // },
  mainContainer: {
    backgroundColor: colors.whiteColor,
    borderRadius: wp('4%'),
    shadowColor: colors.whiteColor,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    elevation: 2,
    height: wp('91%'),
    width: wp('100%'),
    marginVertical: '1%',
  },
  uploadedImage: {
    alignItems: 'center',
    alignSelf: 'center',
    // borderRadius: 8,
    justifyContent: 'center',
    height: wp('91%'),
    width: wp('100%'),
  },
});

export default memo(PostImageSet);
