import React from 'react';
import {Pressable} from 'react-native';
import TCZoomableImage from '../../TCZoomableImage';
import {getScreenHeight, getScreenWidth} from '../../../utils';

// const sourceURL = 'https://source.unsplash.com/random?orientation=landscape';

const FeedImageView = ({
  screenInsets,
  setShowParent = () => {},
  sourceData,
  isLandscape,
}) => (
  <Pressable
    style={{
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <TCZoomableImage
      screenInsets={screenInsets}
      onClick={setShowParent}
      source={{uri: sourceData?.url ?? ''}}
      isLandscape={isLandscape}
      thumbnailSource={{uri: sourceData?.thumbnail ?? ''}}
      style={{
        width: getScreenWidth({isLandscape, screenInsets}),
        height: getScreenHeight({isLandscape, screenInsets}),
      }}
    />
  </Pressable>
);
export default FeedImageView;
