import PhotoView from 'react-native-photo-view-ex';
import React, { useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';
// import { getScreenHeight, getScreenWidth } from '../utils';

const TCZoomableImage = ({
  source,
  // screenInsets,
  style,
  onClick = () => {},
  thumbnailSource,
  // isLandscape = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded
        && <View style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          // height: getScreenHeight({ isLandscape, screenInsets }),
          // width: getScreenWidth({ isLandscape, screenInsets }),
        }}>
          <FastImage
              style={style}
              source={thumbnailSource}
              resizeMode={FastImage.resizeMode.contain}
           />

          <View style={{ ...style, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.4)' }} />
          <FastImage
              style={{
                height: 50,
                width: 50,
                position: 'absolute',
              }}
              source={images.videoLoading}
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
