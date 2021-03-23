import React, {
 useRef, memo, useState, useCallback,
} from 'react';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback, TouchableHighlight,
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
import SinglePostVideoView from './SinglePostVideoView';

function VideoPost({
  item,
  data,
  caller_id,
  navigation,
  onImageProfilePress,
  onLikePress,
  updateCommentCount,
}) {
  const videoPlayerRef = useRef();
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

  const toggleModal = useCallback(() => {
    setModalVisible((isVisible) => !isVisible);
  }, []);

  const onVideoLoad = useCallback(() => {
      videoPlayerRef.current.seek(0)
      setVideoLoad(true);
  }, [])

  const onPressPlayPause = useCallback(() => {
    setPlay((val) => !val)
  }, [])

  const onPressMuteUnmute = useCallback(() => {
    setMute((val) => !val);
  }, [])

  const onModalClose = useCallback(() => setModalVisible(false), [])
  const onModalOpen = useCallback((commentData) => {
    updateCommentCount(commentData)
    setModalVisible(true)
  }, [updateCommentCount])

  const onImageProfileClick = useCallback(() => {
    setModalVisible(false)
    onImageProfilePress()
  }, [onImageProfilePress])

  return (
    <View style={{ ...styles.singleImageDisplayStyle, height }}>
      <View
        style={{
 ...styles.singleImageDisplayStyle, borderWidth: 1, borderColor: colors.lightgrayColor, height,
        }}>
        <FastImage
          style={styles.loadimageStyle}
          source={images.imageLoadingGIF}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      {isModalVisible && <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0 }}
        supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        backdropOpacity={0}>
        <SinglePostVideoView
          openPostModal={onModalOpen}
          item={item}
          data={data}
          caller_id={caller_id}
          navigation={navigation}
          backBtnPress={onModalClose}
          uploadVideoURL={uploadVideoURL && uploadVideoURL}
          onImageProfilePress={onImageProfileClick}
          onLikePress={onLikePress}
        />
      </Modal>}

      <TouchableWithoutFeedback onPress={toggleModal}>
        <Video
            ref={videoPlayerRef}
            paused={!play}
            muted={!mute}
            source={{ uri: data.url }}
            style={{ ...styles.singleImageDisplayStyle, height, position: 'absolute' }}
            resizeMode={'cover'}
            onLoad={onVideoLoad}
        />
      </TouchableWithoutFeedback>
      {videoLoad && (
        <>
          <TouchableHighlight
                style={styles.pauseMuteStyle}
              onPress={onPressMuteUnmute}>
            <FastImage
                resizeMode={'contain'}
                tintColor={'white'}
                style={styles.imageStyle}
                source={mute ? images.unmute : images.mute}
              />
          </TouchableHighlight>
          <TouchableHighlight
                style={[styles.pauseMuteStyle, { right: wp('13.5%') }]}
                onPress={onPressPlayPause}>
            <FastImage
                resizeMode={'contain'}
                tintColor={'white'}
                style={styles.playPauseImageStyle}
                source={play ? images.videoPauseButton : images.videoPlayButton}
              />
          </TouchableHighlight>
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

export default memo(VideoPost);
