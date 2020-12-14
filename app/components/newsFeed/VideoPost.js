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
import SingleVideoModal from './SingleVideoModal';

function VideoPost({ data }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  const [videoLoad, setVideoLoad] = useState(false);

  const uploadVideoURL = data && typeof data.thumbnail === 'string'
  && (!data.thumbnail.split('http')[1] || !data.thumbnail.split('https')[1]) ? null : data.thumbnail;
  let height = wp('96%');
  if (data.media_height > data.media_width) {
    height = wp('124%')
  } else if (data.media_height < data.media_width) {
    height = wp('68%')
  } else {
    height = wp('96%')
  }
  // height = data.media_height > data.media_width ? height = wp('124%') : height = wp('68%');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View
      style={[
        styles.singleImageDisplayStyle,
        {
          height,
        },
      ]}>
      <View
        style={[
          styles.singleImageDisplayStyle,
          {
            borderWidth: 1,
            borderColor: colors.lightgrayColor,
            height,
          },
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
        <SingleVideoModal
          data={data}
          uploadVideoURL={uploadVideoURL && uploadVideoURL}
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
          style={[
            styles.singleImageDisplayStyle,
            {
              height,
              position: 'absolute',
            },
          ]}
          resizeMode={'cover'}
          onLoad={() => {
            setVideoLoad(true);
          }}
        />
      </TouchableWithoutFeedback>
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
    height: wp('96%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('96%'),
  },
});

export default VideoPost;
