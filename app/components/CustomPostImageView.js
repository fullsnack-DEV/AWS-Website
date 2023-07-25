import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ImageZoom} from '@likashefqet/react-native-image-zoom';

const CustomPostImageView = ({imageData, onLoad}) => (
  <Pressable style={styles.imageContainer}>
    <ImageZoom
      uri={imageData}
      minScale={2}
      maxScale={5}
      onLoad={onLoad}
      containerStyle={{
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  imageContainer: {
    height: '100%',
    width: '100%',
    zIndex: 1000,
  },
});

export default CustomPostImageView;
