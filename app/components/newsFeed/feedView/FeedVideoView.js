import React, {
    useCallback, useMemo, useRef, useState, Fragment, useEffect,
} from 'react';
import {
 Platform, Text, View,
} from 'react-native';
import Video from 'react-native-video';
import IosSlider from '@react-native-community/slider'
import AndroidSlider from 'rn-range-slider';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import { getHeight, getWidth } from '../../../utils';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';

const FeedVideoView = ({
  sourceData,
   isLandscape,
   isFullScreen,
   showParent,
   setShowParent,
   isMute,
}) => {
    const videoPlayerRef = useRef();
    const [paused, setPaused] = useState(true);
    const [videoLoader, setVideoLoader] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const onProgress = useCallback((data) => setCurrentTime(data?.currentTime), []);

    const onPaused = useCallback(() => {
        if (currentTime === 0) videoPlayerRef.current.seek(0)
        setPaused((val) => !val)
    }, [currentTime]);

    useEffect(() => {
        if (isFullScreen) {
            setShowParent(false);
            setPaused(false);
            console.log(sourceData);
            if (sourceData?.media_height < sourceData?.media_width) Orientation.lockToLandscape();
            else Orientation.lockToPortrait();
        } else {
            setShowParent(true);
            Orientation.unlockAllOrientations();
        }
    }, [isFullScreen])

    const renderPlayPauseButton = useMemo(() => {
        const shadeColor = 'rgba(0,0,0,0.4)';
        const gradientColors = [shadeColor, shadeColor, 'transparent', shadeColor, shadeColor]
        return (
          <LinearGradient
                pointerEvents={showParent ? 'auto' : 'none'}
                colors={gradientColors}
                style={{
                    opacity: showParent ? 1 : 0,
                    zIndex: 1,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
            {!videoLoader && <TouchableOpacity onPress={onPaused}>
              <FastImage
                        source={ paused ? images.videoPlayIcon : images.videoPauseIcon}
                        resizeMode={'contain'}
                        style={{
                            height: 60,
                            width: 60,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: 50,
                        }}
                    />
            </TouchableOpacity>}
          </LinearGradient>
        )
    }, [onPaused, paused, showParent, videoLoader])

    const renderVideoLoader = useMemo(() => videoLoader && (
      <View
            style={{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
        {renderVideoLoader}

        <FastImage
              source={images.videoLoading}
              resizeMode={'contain'}
              style={{
                  height: 40,
                  width: 40,
                  alignSelf: 'center',
              }}
          />
      </View>
    ), [videoLoader])

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
            style={{ height: 30, width: 30 }}/>
    ), []);

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

    const renderSeekBar = useMemo(() => (
      <View
          pointerEvents={showParent ? 'auto' : 'none'}
          style={{
          opacity: showParent ? 1 : 0,
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
              5,
              // eslint-disable-next-line no-nested-ternary
              Platform?.OS === 'ios' ? 10 : (isFullScreen ? 10 : 20),
          ),
          }}>
        <Text style={{
            textAlign: 'center',
            fontSize: 12,
            width: 50,
            color: colors.whiteColor,
        }}>
          {secondsToHms(Math.ceil(currentTime?.toFixed(0)))}
        </Text>
        {Platform?.OS === 'ios' ? (
          <IosSlider
                  tapToSeek={true}
                  value={currentTime}
                  style={{ flex: 1 }}
                  onValueChange={(value) => setCurrentTime(value)}
                  onSlidingStart={() => !paused && setPaused(true)}
                  onSlidingComplete={(value) => {
                      if (videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(value)
                      setPaused(false);
                  }}
                  step={1}
                  minimumValue={0}
                  maximumValue={(sourceData?.duration / 1000)}
                  minimumTrackTintColor={colors.whiteColor}
                  maximumTrackTintColor={'rgba(255,255,255,0.5)'}
              />
          ) : (
            <AndroidSlider
                disableRange
                min={0}
                low={currentTime}
                max={(sourceData?.duration / 1000)}
                step={1}
                style={{ flex: 1 }}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                onValueChanged={(lowValue, highValue, fromUser) => {
                    setCurrentTime(lowValue);
                    if (fromUser && videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(lowValue);
                }}
            />
          )}
        <Text style={{
            fontSize: 12,
            width: 50,
            color: colors.whiteColor,
            textAlign: 'center',

        }}>
          {secondsToHms((sourceData.duration / 1000))}
          {/* {secondsToHms(((sourceData.duration / 1000) - currentTime).toFixed(0))} */}
        </Text>

      </View>
    ), [currentTime, isFullScreen, isLandscape, paused, renderRail, renderRailSelected, renderThumb, showParent, sourceData.duration])

    const renderVideo = useMemo(() => (
      <Fragment>
        <View style={{
              height: getHeight(isLandscape, 100),
              width: getWidth(isLandscape, 100),
        }}>
          <Video
              disableFocus={true}
                  ref={videoPlayerRef}
                  onEnd={() => {
                      // if (videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(0);
                      setCurrentTime(0);
                      setShowParent(true);
                      setPaused(true);
                  }}
                  muted={isMute}
                  paused={paused}
                  fullscreenOrientation={'all'}
                  onProgress={onProgress}
                  // focusable={true}
                  source={{ uri: sourceData?.url ?? '', cache: true }}
                  // source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', cache: true }} // Landscape Video
                  style={{ height: getHeight(isLandscape, 100), width: getWidth(isLandscape, 100) }}
                  fullscreen={Platform.OS === 'android' ? isFullScreen : false}
                  onLoad={() => videoPlayerRef.current.seek(0)}
                  resizeMode={'contain'}
                  // fullscreenAutorotate={true}
                  onBuffer={(bufferData) => setVideoLoader(bufferData?.isBuffering)}
              />
        </View>
      </Fragment>
        ), [isFullScreen, isLandscape, isMute, onProgress, paused, setShowParent, sourceData?.url])

    return (
      <TouchableWithoutFeedback onPress={setShowParent} style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: getWidth(isLandscape, 100),
          height: getHeight(isLandscape, 100),
      }}>
        {renderVideoLoader}
        {renderPlayPauseButton}
        {renderSeekBar}
        {renderVideo}
      </TouchableWithoutFeedback>
    )
}

export default FeedVideoView;
