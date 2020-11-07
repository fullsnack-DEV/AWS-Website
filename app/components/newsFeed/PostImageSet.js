import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import MultipleImageModal from './MultipleImageModal';
import images from '../../Constants/ImagePath';

function PostImageSet({
  data, itemNumber, totalItemNumber, attachedImages, activeIndex,
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
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0 }}
        backdropOpacity={0}>
        <MultipleImageModal
          activeIndex={activeIndex}
          attachedImages={attachedImages.length > 0 ? attachedImages : []}
          backBtnPress={() => setModalVisible(false)}
        />
      </Modal>
      <TouchableWithoutFeedback onPress={() => {
        toggleModal();
      }}>
        <Image
          style={ [styles.uploadedImage, { position: 'absolute' }] }
          source={ {
            uri: uploadImageURL,
          } }
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

export default PostImageSet;
