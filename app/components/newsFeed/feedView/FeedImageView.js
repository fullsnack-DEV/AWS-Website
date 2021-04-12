import React from 'react';
import { View } from 'react-native';
import TCZoomableImage from '../../TCZoomableImage';
import { getHeight, getWidth } from '../../../utils';

// const sourceURL = 'https://source.unsplash.com/random?orientation=landscape';

const FeedImageView = ({
    setShowParent,
    sourceData,
    isLandscape,
}) => (
  <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        // width: getWidth(isLandscape, 100),
        // height: getHeight(isLandscape, 100),
  }}>
    <TCZoomableImage
            onClick={setShowParent}
            source={{ uri: sourceData?.thumbnail ?? '' }}
            style={{
                width: getWidth(isLandscape, 100),
                height: getHeight(isLandscape, 100),
            }}
        />
  </View>
)
export default FeedImageView;
