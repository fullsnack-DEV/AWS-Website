import React, {
    useCallback, useMemo, useState, Fragment, useEffect,
} from 'react';
import {
    Platform,
    View,
} from 'react-native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { getScreenHeight, getScreenWidth } from '../../../utils';
import images from '../../../Constants/ImagePath';

const FeedVideoView = ({
  screenInsets,
  sourceData,
   isLandscape,
   isFullScreen,
   showParent,
   setShowParent,
   isMute,
   currentTime = 0,
   setCurrentTime,
   videoPlayerRef,
    paused,
    setVideoMetaData,
    setPaused,

}) => {
    const [videoLoader, setVideoLoader] = useState(true);
    const onProgress = useCallback((data) => setCurrentTime(data?.currentTime), []);

    const onPaused = useCallback(() => {
        if (currentTime === 0) videoPlayerRef.current.seek(0)
        setPaused((val) => !val)
    }, [currentTime, setPaused, videoPlayerRef]);

    useEffect(() => {
        if (isFullScreen) {
            setShowParent(false);
            setPaused(false);
        } else {
            setShowParent(true);
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

    const onEndVideo = useCallback(() => {
        setCurrentTime(0);
        setShowParent(true);
        setPaused(true);
        if (Platform?.OS === 'android' && videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(0);
    }, [setCurrentTime, setPaused, setShowParent, videoPlayerRef])

    const renderVideo = useMemo(() => (
      <Fragment>
        <View style={{
              height: getScreenHeight({ isLandscape, screenInsets }),
              width: getScreenWidth({ isLandscape, screenInsets }),
        }}>
          <Video
              disableFocus={true}
                  ref={videoPlayerRef}
                  onEnd={onEndVideo}
                  muted={isMute}
                  paused={paused}
                  fullscreenOrientation={'all'}
                  onProgress={onProgress}
                  source={{ uri: sourceData?.url ?? '', cache: true }}
                  // source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', cache: true }} // Landscape Video
                  style={{
                      height: getScreenHeight({ isLandscape, screenInsets }),
                      width: getScreenWidth({ isLandscape, screenInsets }),
                  }}
                  onLoad={(videoMetaData) => {
                      setVideoMetaData(videoMetaData)
                      videoPlayerRef.current.seek(0)
                  }}
                  resizeMode={'contain'}
                  onBuffer={(bufferData) => setVideoLoader(bufferData?.isBuffering)}
              />
        </View>
      </Fragment>
        ), [isLandscape, isMute, onEndVideo, onProgress, paused, screenInsets, sourceData?.url, videoPlayerRef])

    return (
      <TouchableWithoutFeedback onPress={setShowParent} style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: getScreenWidth({ isLandscape, screenInsets }),
          height: getScreenHeight({ isLandscape, screenInsets }),
      }}>
        {renderVideoLoader}
        {renderPlayPauseButton}
        {renderVideo}
      </TouchableWithoutFeedback>
    )
}

export default FeedVideoView;
