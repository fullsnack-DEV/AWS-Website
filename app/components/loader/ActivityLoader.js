import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

function ActivityLoader({visible = false}) {
  if (!visible) return null;
  return (
    <View style={styles.containerStyle}>
      <ActivityIndicator size={'large'} color={'#fff'} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 1,
  },
});

export default ActivityLoader;
