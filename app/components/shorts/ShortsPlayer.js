import React, {
  useRef, useState,
 } from 'react';
import Video from 'react-native-video';
import {
  View,
  StyleSheet,

  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../Constants/Colors';
import TCInnerLoader from '../TCInnerLoader';

const ShortsPlayer = ({
  sourceURL,
  videoStyle,
  resizeMode = 'contain',
  containerStyle,
  payPausedPressed,
  playPause,
  curruentIndex,
          curruentViewableIndex,
}) => {
  const videoPlayerRef = useRef();
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onLoad = () => {
        videoPlayerRef.current.seek(0);
        setIsLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={payPausedPressed}>
      <View style={{ ...containerStyle }}>
        <View
          style={styles.loadingContainer}>
          <TCInnerLoader visible={isLoading} />
        </View>
        {curruentIndex === curruentViewableIndex && <Video
          ref={videoPlayerRef}
          paused={playPause }
          // muted={!mute}
          repeat={true}
          source={{ uri: sourceURL }}
          style={{
            ...styles.mediaPlayer,
            backgroundColor: 'black',
            ...videoStyle,
          }}
           resizeMode={resizeMode}
          onLoad={onLoad}
        />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mediaPlayer: {
    backgroundColor: colors.blackColor,
    justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },

});
export default ShortsPlayer;
