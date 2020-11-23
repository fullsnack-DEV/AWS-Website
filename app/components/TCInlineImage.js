import React from 'react';
import {
  StyleSheet,
  Platform,
  PixelRatio,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const TCInlineImage = (props) => {
  let style = props.style;
  if (style && Platform.OS !== 'ios') {
    style = { ...StyleSheet.flatten(props.style) };
    ['width', 'height'].forEach((propName) => {
      if (style[propName]) {
        style[propName] *= PixelRatio.get();
      }
    });
  }

  return (
    <FastImage
            {...props}
            style={style}
        />
  );
};

export default TCInlineImage;
