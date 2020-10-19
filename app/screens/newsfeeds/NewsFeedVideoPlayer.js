import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  Button,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';

import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
// import VideoPlayer from 'react-native-video-controls';

import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';

const { colors } = constants;

export default function NewsFeedVideoPlayer({ navigation, route }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [mute, setMute] = useState(1.0);
  useEffect(() => {
    Geolocation.getCurrentPosition((info) => console.log(info));
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableWithoutFeedback onPress={ () => alert('This is a button!') }>
              <Image source={ PATH.vertical3Dot } style={ styles.headerRightImg } />
          </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  onSeek = (seek) => {
    this.videoPlayer.seek(seek);
  };
  onPaused = (playerState) => {
    console.log('STATE::', playerState);
    if (paused === true) {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(!paused);
      playerState;
    } else {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(!paused);
      playerState;
    }
  };
  onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    this.videoPlayer.seek(0);
  };

  onProgress = (data) => {
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  onLoadStart = (data) => {
    setIsLoading(true);
  };

  onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
  };

  onError = () => alert('Oh! ', error);

  exitFullScreen = () => {};

  enterFullScreen = () => {};

  onFullScreen = () => {};
  // renderToolbar = () => (
  //   <View style={styles.toolbar}>
  //     <Text>I'm a custom toolbar </Text>
  //   </View>
  // );
  onSeeking = (currentTime) => setCurrentTime(currentTime);

  return (
      <View style={ styles.container }>
          <Video
        source={ { uri: route.params.url } } // Can be a URL or a local file.
        ref={ (videoPlayer) => (this.videoPlayer = videoPlayer) }
        volume={ mute }
        // resizeMode="cover"
        onEnd={ this.onEnd }
        onLoad={ this.onLoad }
        paused={ paused }
        style={ styles.mediaPlayer }
        onProgress={ this.onProgress }
        onLoadStart={ this.onLoadStart }
      />

          <MediaControls
        mainColor="white"
        onSeek={ this.onSeek }
        onReplay={ this.onReplay }
        onPaused={ this.onPaused }
        onSeeking={ this.onSeeking }
        duration={ duration }
        isLoading={ isLoading }
        onFullScreen={ this.onFullScreen }
        progress={ currentTime }
        playerState={ playerState }>
              <MediaControls.Toolbar>
                  <View style={ styles.toolbar }>
                      <Text style={ { color: colors.red } }>I'm a custom toolbar </Text>
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
