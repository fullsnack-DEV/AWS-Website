import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
// import MultipleImageModal from './MultipleImageModal';
import MultiImagePostView from './MultiImagePostView';

function MultiPostVideo({
  data,
  itemNumber,
  totalItemNumber,
  attachedImages,
  // activeIndex,
  item,
  caller_id,
  navigation,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  const [videoLoad, setVideoLoad] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.singleImageDisplayStyle}>
      <View
        style={[
          styles.singleImageDisplayStyle,
          { borderWidth: 1, borderColor: colors.lightgrayColor },
        ]}>
        <FastImage
          style={styles.loadimageStyle}
          source={images.imageLoadingGIF}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0 }}
        backdropOpacity={0}>
        {/* <MultipleImageModal
          activeIndex={activeIndex}
          attachedImages={attachedImages.length > 0 ? attachedImages : []}
          backBtnPress={() => setModalVisible(false)}
        /> */}
        <MultiImagePostView
          attachedImages={attachedImages}
          data={data}
          item={item}
          caller_id={caller_id}
          navigation={navigation}
          backBtnPress={() => setModalVisible(false)}
        />
      </Modal>
      <TouchableWithoutFeedback
        onPress={() => {
          toggleModal();
        }}>
        <Video
          paused={!play}
          muted={!mute}
          source={{ uri: data.url }}
          style={[styles.singleImageDisplayStyle, { position: 'absolute' }]}
          resizeMode={'cover'}
          onLoad={() => {
            setVideoLoad(true);
          }}
        />
      </TouchableWithoutFeedback>
      <View style={styles.lengthViewStyle}>
        <Text style={styles.lengthTextStyle}>
          {itemNumber}
          {'/'}
          {totalItemNumber}
        </Text>
      </View>
      {videoLoad && (
        <>
          <View style={styles.pauseMuteStyle}>
            <TouchableOpacity
              onPress={() => {
                setMute(!mute);
              }}>
              <Image
                style={styles.imageStyle}
                source={mute ? images.unmute : images.mute}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.pauseMuteStyle, { right: wp('13.5%') }]}>
            <TouchableOpacity
              onPress={() => {
                setPlay(!play);
              }}>
              <Image
                style={styles.playPauseImageStyle}
                source={images.playPause}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: wp('5%'),
    tintColor: '#fff',
    width: wp('5%'),
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
  loadimageStyle: {
    height: 50,
    width: 50,
  },
  loadingTextStyle: {
    color: colors.googleColor,
    fontFamily: fonts.RBold,
    fontSize: 14,
    marginTop: 25,
  },
  pauseMuteStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    bottom: wp('2%'),
    height: wp('10%'),
    justifyContent: 'center',
    padding: wp('2%'),
    position: 'absolute',
    right: wp('2%'),
    width: wp('10%'),
  },
  playPauseImageStyle: {
    height: wp('4%'),
    tintColor: '#fff',
    width: wp('4%'),
  },
  singleImageDisplayStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('91%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('91%'),
  },
});

export default MultiPostVideo;
