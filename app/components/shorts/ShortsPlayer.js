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
          style={{
            position: 'absolute',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}>
          <TCInnerLoader visible={isLoading} />
        </View>
        <Video
          ref={videoPlayerRef}
          paused={playPause}
          hideShutterView={true}
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
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mediaPlayer: {
    backgroundColor: colors.blackColor,
    justifyContent: 'center',
  },

});
export default ShortsPlayer;
