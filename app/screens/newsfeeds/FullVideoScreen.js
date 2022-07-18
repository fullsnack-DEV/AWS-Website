import React from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';

export default function FullVideoScreen({
  route: {
    params: {url},
  },
}) {
  return (
    <View style={styles.mainContainerStyle}>
      <Video
        source={{uri: url}}
        style={styles.singleImageDisplayStyle}
        resizeMode={'cover'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  singleImageDisplayStyle: {},
});
