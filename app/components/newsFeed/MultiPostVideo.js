import React, {
  useRef, memo, useState, useCallback,
} from 'react';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function MultiPostVideo({
  data,
  itemNumber,
  totalItemNumber,
  item,
  navigation,
  updateCommentCount,
  parentIndex,
  currentParentIndex,
  childIndex,
  currentChildIndex,
  onLikePress,
}) {
  const videoPlayerRef = useRef();
  const isFocused = useIsFocused();
  const [mute, setMute] = useState(true);
  const [videoLoad, setVideoLoad] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0)

  const toggleModal = () => {
    // setModalVisible(!isModalVisible);
    navigation.navigate('FeedViewScreen', {
      feedItem: item,
      currentPage: itemNumber,
      updateCommentCount,
      onLikePress,
    })
  };

  const secondsToHms = (date) => {
    let hDisplay = '';
    let mDisplay = '0';
    let sDisplay = '00';

    const d = Number(date);

    const h = Math.floor(d / 3600);
    // eslint-disable-next-line no-mixed-operators
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    // Hour
    if (h > 0 && h?.toString()?.length === 1) hDisplay = `0${h}`
    if (h > 0 && h?.toString()?.length > 1) hDisplay = `${h}`

    // Minuites
    if (m > 0 && m?.toString()?.length === 1) mDisplay = `0${m}`
    if (m > 0 && m?.toString()?.length > 1) mDisplay = `${m}`

    // Seconds
    if (s > 0 && s?.toString()?.length === 1) sDisplay = `0${s}`
    if (s > 0 && s?.toString()?.length > 1) sDisplay = `${s}`

    return `${hDisplay}${hDisplay ? ':' : ''}${mDisplay}:${sDisplay}`;
  }

  const onProgress = useCallback((curTimeData) => setCurrentTime(curTimeData?.currentTime), []);

  return (
    <View style={styles.mainContainer}>
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
      <TouchableWithoutFeedback
        onPress={() => {
          toggleModal();
        }}>
        <Video
          repeat={true}
          ref={videoPlayerRef}
          paused={!((isFocused && parentIndex === currentParentIndex) && (childIndex === currentChildIndex))}
          muted={!mute}
          onProgress={onProgress}
          source={{ uri: data.url }}
          style={[styles.singleImageDisplayStyle, { position: 'absolute' }]}
          resizeMode={'cover'}
          onLoad={(metaData) => {
            setVideoDuration(metaData?.duration)
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
          <Text style={styles.currentTime}>
            {secondsToHms(videoDuration?.toFixed(0) - currentTime)}
          </Text>
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 14,
    tintColor: '#fff',
    width: 14,
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
    right: 10,
    top: 18,
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
    justifyContent: 'center',
    padding: wp('2%'),
    position: 'absolute',
    bottom: 15,
    right: 10,
    height: 25,
    width: 25,
  },
  currentTime: {
    fontSize: 15,
    color: colors.whiteColor,
    position: 'absolute',
    top: 18,
    left: 10,
    fontFamily: fonts.RRegular,
    textShadowColor: colors.googleColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  mainContainer: {
    shadowColor: colors.googleColor,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 1,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('91%'),
    justifyContent: 'center',
    width: wp('91%'),
  },
  singleImageDisplayStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('91%'),
    justifyContent: 'center',
    width: wp('91%'),
  },
});

export default memo(MultiPostVideo);
