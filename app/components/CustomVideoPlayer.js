import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {View, StyleSheet} from 'react-native';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from '../utils';
import colors from '../Constants/Colors';

const CustomVideoPlayer = ({
  sourceURL,
  videoStyle,
  resizeMode = 'contain',
  containerStyle,
  isLandscape = false,
  onPlayerStatusChanged = () => {},
  onClick = () => {},
}) => {
  const videoPlayerRef = useRef();
  // const [videoMetaData, setVideoMetaData] = useState(null);
  const [duration, setDuration] = useState(0);
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(true);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [currentTime, setCurrentTime] = useState(0);
  const [shouldVideoScroll, setShouldVideoScroll] = useState(true);

  useEffect(() => {
    if ([PLAYER_STATES.PAUSED, PLAYER_STATES.ENDED]?.includes(playerState))
      setShouldVideoScroll(true);
    else setShouldVideoScroll(false);
  }, [playerState]);

  useEffect(
    () => onPlayerStatusChanged(shouldVideoScroll),
    [shouldVideoScroll],
  );
  const onSeek = (seek) => {
    if (!shouldVideoScroll) setShouldVideoScroll(true);
    videoPlayerRef.current.seek(seek);
  };

  const onPaused = (pState) => {
    onClick(!paused);
    setPaused(!paused);
    setPlayerState(pState);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayerRef.current.seek(0);
  };

  const onProgress = (data) => {
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    // setVideoMetaData({ ...data });
    videoPlayerRef.current.seek(0);
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  // const onFullScreen = () => {
  //   setIsFullScreen(isFullScreen);
  //   videoPlayerRef.current.presentFullscreenPlayer();
  // };

  const onSeeking = (currTime) => {
    if (shouldVideoScroll) setShouldVideoScroll(false);
    setCurrentTime(currTime);
  };

  return (
    <View style={{...containerStyle}}>
      <Video
        focusable={true}
        source={{uri: sourceURL, type: 'mp4'}}
        ref={videoPlayerRef}
        style={{
          ...styles.mediaPlayer,
          backgroundColor: 'black',
          ...videoStyle,
        }}
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        resizeMode={resizeMode}
        // onFullScreen={isFullScreen}
        // fullscreen={isFullScreen}
        fullscreenAutorotate={true}
      />
      <MediaControls
        containerStyle={{backgroundColor: 'rgba(0,0,0,0)', zIndex: 100}}
        sliderStyle={{
          containerStyle: {
            zIndex: 100,
            paddingBottom: isLandscape ? wp(16) : hp(5),
          },
        }}
        // isFullScreen={false}
        // onFullScreen={onFullScreen}
        duration={duration}
        isLoading={isLoading}
        mainColor={'rgba(0,0,0,0.5)'}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mediaPlayer: {
    backgroundColor: colors.blackColor,
    justifyContent: 'center',
  },
});
export default CustomVideoPlayer;
