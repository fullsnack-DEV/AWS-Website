import React, { Fragment } from 'react';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';

const TCInnerLoader = ({
  visible,
  size = 40,
  loaderStyle = {},
  allowMargin = true,
}) => (
  <Fragment>
    {visible && (
      <FastImage
        source={images.imageUploadingGIF}
        style={{
          height: size,
          width: size,
          alignSelf: 'center',
          ...loaderStyle,
          marginVertical: allowMargin ? 20 : 0,
        }}
      />
    )}
  </Fragment>
)
export default TCInnerLoader;
