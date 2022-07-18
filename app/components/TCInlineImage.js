import React from 'react';
import FastImage from 'react-native-fast-image';

const TCInlineImage = (props) => {
  const style = props.style;
  return <FastImage {...props} style={style} />;
};

export default TCInlineImage;
