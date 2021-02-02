import PhotoView from 'react-native-photo-view-ex';
import React from 'react';
import images from '../Constants/ImagePath';

const TCZoomableImage = ({
  source,
  style,
}) => (
  <PhotoView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          source={source}
          loadingIndicatorSource={images.imageLoadingGIF}
          androidScaleType="contain"
          resizeMode={'contain'}
          style={style}
      />
)

export default TCZoomableImage;
