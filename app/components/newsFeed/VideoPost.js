import React, {useRef, memo, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {toggleView} from '../../utils';

const VideoPost = memo(
  ({
    currentParentIndex,
    parentIndex,
    item,
    data,
    navigation,
    updateCommentCount,
    onLikePress,
  }) => {
    const isFocused = useIsFocused();
    const videoPlayerRef = useRef();
    const [mute, setMute] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoLoad, setVideoLoad] = useState(false);
    // const [height, setHeight] = useState(wp(68));
    const [videoDuration, setVideoDuration] = useState(0);
    const setVideoHeight = useCallback((orientation) => {
      if (orientation === 'portrait')
        toggleView(() => getImageDimention().height, 300);
    }, []);

    const imageRatio = data.media_height / data.media_width;
    const defaultLandscapRatio = 0.71;
    const defaultPortraitRatio = 1.29;
    const defaultScreenWidth = Dimensions.get('window').width - 30;
    const defaultLandscapHeight = 250;
    const defaultPortraitHeight = 450;
    // eslint-disable-next-line consistent-return
    const getImageDimention = () => {
      if (imageRatio < defaultLandscapRatio) {
        return {
          height: defaultLandscapHeight,
          width: defaultScreenWidth,
        };
      }
      if (
        imageRatio >= defaultLandscapRatio &&
        imageRatio <= defaultPortraitRatio
      ) {
        return {
          height: imageRatio * defaultScreenWidth,
          width: defaultScreenWidth,
        };
      }
      if (imageRatio >= defaultPortraitRatio) {
        return {
          height: defaultPortraitHeight,
          width: defaultScreenWidth,
        };
      }
    };
    const toggleModal = useCallback(() => {
      navigation.navigate('LoneStack', {
        screen: 'FeedViewScreen',
        params: {
          feedItem: item,
          updateCommentCount,
          onLikePress,
        },
      });
    }, [item, navigation, onLikePress, updateCommentCount]);

    const onVideoLoad = useCallback(
      (videoMetaData) => {
        setVideoHeight(videoMetaData?.naturalSize?.orientation);
        videoPlayerRef.current.seek(0);
        setVideoDuration(videoMetaData?.duration);
        setVideoLoad(true);
      },
      [setVideoHeight],
    );

    const onPressMuteUnmute = useCallback(() => {
      setMute((val) => !val);
    }, []);

    const secondsToHms = (date) => {
      let hDisplay = '';
      let mDisplay = '0';
      let sDisplay = '00';

      const d = Number(date);

      const h = Math.floor(d / 3600);
      // eslint-disable-next-line no-mixed-operators
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);

      // Hour
      if (h > 0 && h?.toString()?.length === 1) hDisplay = `0${h}`;
      if (h > 0 && h?.toString()?.length > 1) hDisplay = `${h}`;

      // Minuites
      if (m > 0 && m?.toString()?.length === 1) mDisplay = `0${m}`;
      if (m > 0 && m?.toString()?.length > 1) mDisplay = `${m}`;

      // Seconds
      if (s > 0 && s?.toString()?.length === 1) sDisplay = `0${s}`;
      if (s > 0 && s?.toString()?.length > 1) sDisplay = `${s}`;

      return `${hDisplay}${hDisplay ? ':' : ''}${mDisplay}:${sDisplay}`;
    };

    const onProgress = useCallback(
      (curTimeData) => setCurrentTime(curTimeData?.currentTime),
      [],
    );
    return (
      <View
        style={{...styles.mainContainer, height: getImageDimention().height}}>
        <View
          style={{
            ...styles.singleImageDisplayStyle,
            borderWidth: 1,
            borderColor: colors.lightgrayColor,
            height: getImageDimention().height,
          }}>
          <FastImage
            style={styles.loadimageStyle}
            source={images.imageLoadingGIF}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={styles.loadingTextStyle}>Loading...</Text>
        </View>

        <TouchableWithoutFeedback onPress={toggleModal}>
          <Video
            repeat={true}
            ref={videoPlayerRef}
            paused={!(isFocused && currentParentIndex === parentIndex)}
            muted={mute}
            onProgress={onProgress}
            source={{uri: data.url}}
            style={{
              ...styles.singleImageDisplayStyle,
              height: getImageDimention().height,
              position: 'absolute',
            }}
            resizeMode={'cover'}
            onLoad={onVideoLoad}
          />
        </TouchableWithoutFeedback>
        {videoLoad && (
          <>
            <Text style={styles.currentTime}>
              {secondsToHms(videoDuration?.toFixed(0) - currentTime)}
            </Text>
            <TouchableHighlight
              style={styles.pauseMuteStyle}
              onPress={onPressMuteUnmute}>
              <FastImage
                resizeMode={'contain'}
                tintColor={'white'}
                style={styles.imageStyle}
                source={mute ? images.mute : images.unmute}
              />
            </TouchableHighlight>
          </>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  imageStyle: {
    height: 14,
    tintColor: '#fff',
    width: 14,
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
    borderRadius: 8,
    justifyContent: 'center',
    padding: wp('2%'),
    position: 'absolute',
    bottom: 15,
    right: 10,
    height: 25,
    width: 25,
  },
  playPauseImageStyle: {
    height: 14,
    tintColor: '#fff',
    width: 14,
  },
  mainContainer: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.whiteColor,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    elevation: 2,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    height: wp('96%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('96%'),
  },
  singleImageDisplayStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    height: wp('96%'),
    justifyContent: 'center',
    width: wp('96%'),
  },
  currentTime: {
    fontSize: 15,
    color: colors.whiteColor,
    position: 'absolute',
    top: 18,
    left: 10,
    fontFamily: fonts.RRegular,
    textShadowColor: colors.googleColor,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
  },
});

export default VideoPost;
