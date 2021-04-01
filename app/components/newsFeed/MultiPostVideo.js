import React, { useRef, memo, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
// import MultipleImageModal from './MultipleImageModal';
import CommonModalPostView from '../../CommonModalPostView';

function MultiPostVideo({
  data,
  itemNumber,
  totalItemNumber,
  attachedImages,
  // activeIndex,
  item,
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  console.log('attachedImages:=>', attachedImages);
  console.log('item:=>', item);
  console.log('data:=>', data);

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
      <TouchableWithoutFeedback
        onPress={() => {
          toggleModal();
        }}>
        <Video
          ref={videoPlayerRef}
          paused={!play}
          muted={!mute}
          source={{ uri: data.url }}
          style={[styles.singleImageDisplayStyle, { position: 'absolute' }]}
          resizeMode={'cover'}
          onLoad={() => {
            setVideoLoad(true);
            videoPlayerRef.current.seek(0);
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
          <TouchableHighlight
              style={styles.pauseMuteStyle}
              onPress={() => {
                setMute(!mute);
              }}>
            <FastImage
                resizeMode={'contain'}
                tintColor={'white'}
                style={styles.imageStyle}
                source={mute ? images.unmute : images.mute}
            />
          </TouchableHighlight>
          <TouchableHighlight
              style={[styles.pauseMuteStyle, { right: wp('13.5%') }]}
              onPress={() => {
                setPlay(!play);
              }}>
            <FastImage
                tintColor={'white'}
                resizeMode={'contain'}
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

export default memo(MultiPostVideo);
