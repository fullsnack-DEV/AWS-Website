import React, {
 useCallback, useMemo, useRef, useState, Fragment,
} from 'react';
import { Platform, Text, View } from 'react-native';
import Video from 'react-native-video';
// import Slider from '@react-native-community/slider'
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from 'rn-range-slider';
import Orientation from 'react-native-orientation';
import { getHeight, getHitSlop, getWidth } from '../../../utils';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';

const FeedVideoView = ({
 sourceData, isLandscape, isFullScreen, setIsFullScreen,
}) => {
    const videoPlayerRef = useRef();
    const [paused, setPaused] = useState(true);
    const [videoLoader, setVideoLoader] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const onProgress = useCallback((data) => setCurrentTime(data?.currentTime), []);
    const onPaused = useCallback(() => setPaused((val) => !val), []);
    const [isMute, setIsMute] = useState(false);

    const renderPlayPauseButton = useMemo(() => (
      <TouchableOpacity
          onPress={onPaused}
          style={{
              zIndex: 1,
              backgroundColor: 'green',
            position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
          }}>
        <FastImage
                    source={ paused ? images.videoPlayIcon : images.videoPauseIcon}
                    resizeMode={'contain'}
                    style={{ height: 60, width: 60 }}
        />
      </TouchableOpacity>
    ), [onPaused, paused])

    const renderRail = useCallback(() => (
      <View
        style={{
            flex: 1,
            height: 4,
            borderRadius: 5,
            backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />
    ), []);

    const renderRailSelected = useCallback(() => (
      <View
            style={{
                flex: 1,
                height: 4,
                borderRadius: 5,
                backgroundColor: colors.whiteColor,
            }}
        />
    ), []);

    const renderThumb = useCallback(() => (
      <FastImage
            source={images.videoThumb}
            resizeMode={'contain'}
            style={{ height: 25, width: 25 }}/>
    ), []);

    const secondsToHms = (date) => {
        let hDisplay = '';
        let mDisplay = '00';
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

    const onFullScreen = useCallback(() => {
        setIsFullScreen(!isFullScreen);
        if (sourceData?.media_height < sourceData?.media_width) {
            if (isFullScreen) Orientation.lockToPortrait();
            else Orientation.lockToLandscape();
            Orientation.unlockAllOrientations();
        }
    }, [isFullScreen, setIsFullScreen, sourceData?.media_height, sourceData?.media_width])

    const renderSeekBar = useMemo(() => (
      <View style={{
          paddingHorizontal: 10,
          height: 50,
          width: getWidth(isLandscape, 100),
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          zIndex: 10,
          bottom: getHeight(
              isLandscape,
              15,
              Platform?.OS === 'ios' ? 15 : 22,
          ),
      }}>
        <Text style={{
            textAlign: 'center',
            fontSize: 12,
            width: 50,
            color: colors.whiteColor,
        }}>
          {secondsToHms(currentTime?.toFixed(0))}
        </Text>
        <Slider
              disableRange
              low={currentTime}
              min={0}
              max={(sourceData?.duration / 1000)}
              step={1}
              style={{ flex: 1 }}
              renderThumb={renderThumb}
              renderRail={renderRail}
              renderRailSelected={renderRailSelected}
              onValueChanged={(value) => {
                  setCurrentTime(value);
                  if (videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(value);
              }}
          />
        <Text style={{
            fontSize: 12,
            width: 50,
            color: colors.whiteColor,
            textAlign: 'center',

        }}>
          {secondsToHms((sourceData.duration / 1000))}
          {/* {secondsToHms(((sourceData.duration / 1000) - currentTime).toFixed(0))} */}
        </Text>

        {/*  Mute Unmute Button */}
        <TouchableOpacity hitSlop={getHitSlop(10)} onPress={() => setIsMute((val) => !val)}>
          <FastImage
              source={isMute ? images.videoMuteSound : images.videoUnMuteSound}
              resizeMode={'contain'}
              style={{
                  marginHorizontal: 10,
                  height: 15,
                  width: 15,
                  tintColor: colors.whiteColor,
              }}
          />
        </TouchableOpacity>

        {/*  Full Screen Button */}
        <TouchableOpacity hitSlop={getHitSlop(10)} onPress={onFullScreen}>
          <FastImage
              source={isFullScreen ? images.videoNormalScreen : images.videoFullScreen }
              resizeMode={'contain'}
              style={{
                  marginHorizontal: 5,
                  height: 15,
                  width: 15,
                  tintColor: colors.whiteColor,
              }}
          />
        </TouchableOpacity>
      </View>
    ), [currentTime, isFullScreen, isLandscape, isMute, onFullScreen, renderRail, renderRailSelected, renderThumb, sourceData.duration])

    const renderVideo = useMemo(() => (
      <Fragment>
        <View style={{
              height: getHeight(isLandscape, 100),
              width: getWidth(isLandscape, 100),
        }}>
          {videoLoader && <View style={{ position: 'absolute', zIndex: -1 }}>
            <FastImage
                        style={{ height: 50, width: 50 }}
                        source={images.imageLoadingGIF}
                        resizeMode={FastImage.resizeMode.contain}
                    />
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>}
          <Video
                  muted={isMute}
                  paused={paused}
                  onProgress={onProgress}
                  ref={videoPlayerRef}
                  focusable={true}
                  source={{ uri: sourceData?.url ?? '' }}
                  style={{ height: getHeight(isLandscape, 100), width: getWidth(isLandscape, 100) }}
                  onLoad={() => {
                      setVideoLoader(false);
                      videoPlayerRef.current.seek(0);
                  }}
                  resizeMode={'contain'}
                  fullscreenAutorotate={true}
              />
        </View>
      </Fragment>
        ), [isLandscape, isMute, onProgress, paused, sourceData?.url, videoLoader])

    return (
      <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: getWidth(isLandscape, 100),
          height: getHeight(isLandscape, 100),
      }}>
        {renderPlayPauseButton}
        {renderSeekBar}
        {renderVideo}
      </View>
    )
}

export default FeedVideoView;
