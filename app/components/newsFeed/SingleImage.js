import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { loaderImage } from '../../Constants/LoaderImages';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import SingleImageModal from './SingleImageModal';

function SingleImage({ data }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const uploadImageURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;

  const randomImage = Math.floor(Math.random() * loaderImage.length);
  let height = wp('94%');
  height = data.media_height > data.media_width ? height = wp('114%') : height = wp('74%');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0 }}
        backdropOpacity={0}>
        <SingleImageModal
          uploadImageURL={uploadImageURL && uploadImageURL}
          backBtnPress={() => setModalVisible(false)}
        />
      </Modal>
      <TouchableWithoutFeedback onPress={() => {
        if (uploadImageURL) {
          toggleModal();
        }
      }}>
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
