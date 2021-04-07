import React from 'react';
import { View } from 'react-native';
import TCZoomableImage from '../../TCZoomableImage';
import { getHeight, getWidth } from '../../../utils';

const FeedImageView = ({ sourceData, isLandscape }) => (
  <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: getWidth(isLandscape, 100),
        height: getHeight(isLandscape, 100),
  }}>
    <TCZoomableImage
            source={{ uri: sourceData?.url ?? '' }}
            style={{
                width: getWidth(isLandscape, 100),
                height: getHeight(isLandscape, 100),
            }}
        />
  </View>
)
export default FeedImageView;
