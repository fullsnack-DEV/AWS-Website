import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function TouchableIcon({
  source, onItemPress, imageStyle,
}) {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onItemPress}>
      <Image source={source} resizeMode={'contain'} style={[styles.imageStyle, imageStyle]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 5,
  },
  imageStyle: {
    height: 16,
    width: 16,
  },
});
