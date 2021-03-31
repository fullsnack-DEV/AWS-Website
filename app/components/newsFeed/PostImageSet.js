import React, {
 memo, useState,
} from 'react';
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
import CommonModalPostView from '../../CommonModalPostView';

function PostImageSet({
  data,
  itemNumber,
  totalItemNumber,
  attachedImages,
  item,
  caller_id,
  navigation,
  onImageProfilePress,
  onLikePress,
  updateCommentCount,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const uploadImageURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={ styles.uploadedImage }>
      <View style={ [styles.uploadedImage, { borderWidth: 1, borderColor: colors.lightgrayColor }] }>
        <FastImage
          style={ styles.imageStyle }
          source={ images.imageLoadingGIF }
          resizeMode={ FastImage.resizeMode.contain }
        />
        <Text style={ styles.loadingTextStyle }>Loading...</Text>
      </View>
      <CommonModalPostView
          visible={isModalVisible}
          currentPage={itemNumber}
          onLikePress={onLikePress}
          navigation={navigation}
          backBtnPress={() => setModalVisible(false)}
          data={data}
          item={item}
          openPostModal={(commentData) => {
            updateCommentCount(commentData)
            setModalVisible(true)
          }}
          caller_id={caller_id}
          attachedImages={attachedImages}
          onImageProfilePress={() => {
            setModalVisible(false)
            onImageProfilePress()
          }}
      />
      <TouchableWithoutFeedback onPress={toggleModal}>
        <FastImage
          style={ [styles.uploadedImage, { position: 'absolute' }] }
          source={{ uri: uploadImageURL }}
          resizeMode={ FastImage.resizeMode.cover }
        />
      </TouchableWithoutFeedback>
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

export default memo(PostImageSet);
