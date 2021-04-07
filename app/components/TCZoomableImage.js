import PhotoView from 'react-native-photo-view-ex';
import React, { useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';

const TCZoomableImage = ({
  source,
  style,
  onClick = () => {},
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
        }}>
          <FastImage
              style={{
                height: 50,
                width: 50,
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
            resizeMode={'contain'}
            style={style}
        />
    </>
  )
}

export default TCZoomableImage;
