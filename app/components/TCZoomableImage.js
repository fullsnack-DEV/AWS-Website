import PhotoView from 'react-native-photo-view-ex';
import React, { useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import images from '../Constants/ImagePath';
import { getHeight, getWidth } from '../utils';

const TCZoomableImage = ({
  source,
  style,
  onClick = () => {},
  thumbnailSource,
  isLandscape = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded
        && <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: getHeight(isLandscape, 100),
          width: getWidth(isLandscape, 100),
        }}>
          <FastImage
              style={style}
              source={thumbnailSource}
              resizeMode={FastImage.resizeMode.contain}
           />

          <BlurView
              style={{ ...style, position: 'absolute' }}
              blurType="dark"
              blurAmount={0.5}
           />
          <FastImage
              style={{
                height: 50,
                width: 50,
                position: 'absolute',
              }}
              source={images.imageLoadingGIF}
              resizeMode={FastImage.resizeMode.contain}
            />
        </View>
        }

      <PhotoView
            onTap={() => onClick()}
            onViewTap={() => onClick()}
            onLoad={() => setIsLoaded(true)}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            source={source}
            androidScaleType="contain"
            fadeDuration={0.5}
            resizeMode={'contain'}
            style={style}
        />
    </>
  )
}

export default TCZoomableImage;
