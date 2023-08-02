import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';
import CustomPostImageView from './CustomPostImageView';

const TCZoomableImage = ({
  source,

  style,

  thumbnailSource,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <View style={styles.container}>
          <FastImage
            style={(style, {flex: 1})}
            source={thumbnailSource}
            resizeMode={FastImage.resizeMode.contain}
          />

          <View
            style={{
              ...style,
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
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
      )}
      <CustomPostImageView
        imageData={source.uri}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
};

export default TCZoomableImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//     {/* <Image
//       source={{uri: source}}
//       style={{
//         height: '100%',
//         width: '100%',
//       }}
//     /> */}

//     {/* <PhotoView
//       onTap={() => onClick()}
//       onViewTap={() => onClick()}
//       onLoad={() => setIsLoaded(true)}
//       showsHorizontalScrollIndicator={false}
//       showsVerticalScrollIndicator={false}
//       pagingEnabled={true}
//       source={source}
//       androidScaleType="contain"
//       fadeDuration={0.5}
//       resizeMode={'contain'}
//       style={style}
//     /> */}
