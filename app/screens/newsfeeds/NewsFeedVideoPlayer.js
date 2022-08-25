import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';

export default function NewsFeedVideoPlayer({navigation, route}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [mute] = useState(1.0);
  useEffect(() => {
    Geolocation.getCurrentPosition((info) => console.log(info));
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => alert('This is a button!')}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const onSeek = (seek) => {
    this.videoPlayer.seek(seek);
  };

  const onPaused = () => {
    console.log('STATE::', playerState);
    if (paused === true) {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(!paused);
    } else {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(!paused);
    }
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    this.videoPlayer.seek(0);
  };

  const onProgress = (data) => {
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
  };

  // const onError = () => alert('Oh! ', error);

  // const exitFullScreen = () => {};

  // const enterFullScreen = () => {};

  const onFullScreen = () => {};
  // renderToolbar = () => (
  //   <View style={styles.toolbar}>
  //     <Text>I'm a custom toolbar </Text>
  //   </View>
  // );
  const onSeeking = (curntTime) => setCurrentTime(curntTime);

  const onRefs = (videoPlayer) => {
    this.videoPlayer = videoPlayer;
  };

  return (
    <View style={styles.container}>
      <Video
        source={{uri: route.params.url}} // Can be a URL or a local file.
        ref={onRefs}
        volume={mute}
        // resizeMode="cover"
        onEnd={onEnd}
        onLoad={onLoad}
        paused={paused}
        style={styles.mediaPlayer}
        onProgress={onProgress}
        onLoadStart={onLoadStart}
      />

      <MediaControls
        mainColor="white"
        onSeek={onSeek}
        onReplay={onReplay}
        onPaused={onPaused}
        onSeeking={onSeeking}
        duration={duration}
        isLoading={isLoading}
        onFullScreen={onFullScreen}
        progress={currentTime}
        playerState={playerState}>
        <MediaControls.Toolbar>
          <View style={styles.toolbar}>
            <Text style={{color: colors.red}}>Im a custom toolbar </Text>
          </View>
        </MediaControls.Toolbar>
      </MediaControls>
      {/* <View style={styles.toolbar}>
        <Text style={{color: 'red'}}>I'm a custom toolbar </Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    width: 20,
  },
});
