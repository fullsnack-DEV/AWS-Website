/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Orientation from 'react-native-orientation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import TCZoomableImage from '../TCZoomableImage';
import CustomVideoPlayer from '../CustomVideoPlayer';

let height = wp('96%');
export default function SingleImageModal({ backBtnPress, data }) {
  const [isLandScape, setIsLandScape] = useState(false);

  if (data.media_height > data.media_width) {
    height = wp('124%')
  } else if (data.media_height < data.media_width) {
    height = wp('68%')
  } else {
    height = wp('96%')
  }

  useEffect(() => {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(orientationChange);
    return () => {
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    };
  }, []);

  const orientationChange = (orientation) => {
    if (['LANDSCAPE', 'PORTRAITUPSIDEDOWN']?.includes(orientation)) {
      setIsLandScape(true);
    } else {
      setIsLandScape(false);
    }
  };

  const renderSingleImagePostView = (multiAttachItem) => {
    let portraitImgWidth = wp('100%');
    let portraitImgHeight = hp('50%');
    let landscapeImgWidth = hp('50%');
    let landscapeImgHeight = wp('100%');
    if (!isLandScape) {
        if (multiAttachItem.media_height > multiAttachItem.media_width) {
            portraitImgWidth = wp('100%');
            portraitImgHeight = hp('72%');
        } else if (multiAttachItem.media_height < multiAttachItem.media_width) {
            portraitImgWidth = wp('100%');
            portraitImgHeight = hp('28%');
        } else {
            portraitImgWidth = wp('100%');
            portraitImgHeight = hp('50%');
        }
    }
    if (isLandScape) {
        if (multiAttachItem.media_height > multiAttachItem.media_width) {
            landscapeImgWidth = hp('100%');
            landscapeImgHeight = wp('100%');
        } else if (multiAttachItem.media_height < multiAttachItem.media_width) {
            landscapeImgWidth = hp('100%');
            landscapeImgHeight = wp('100%');
        } else {
            landscapeImgWidth = hp('100%');
            landscapeImgHeight = wp('100%');
        }
    }
    if (multiAttachItem.type === 'image') {
        return (
          <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: isLandScape ? wp(100) : hp(100),
                zIndex: 100,
          }}>
            <TCZoomableImage
                    source={{ uri: multiAttachItem.url }}
                    style={[styles.uploadedImage, {
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        height: isLandScape ? wp(100) : hp(100),
                    }]}
                />
          </View>
        );
    }
    if (multiAttachItem.type === 'video') {
        return (
          <View style={{
                height: isLandScape ? wp(100) : hp(100),
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
          }}>
            <Image
                    source={isLandScape ? images.landscapeVideoImage : images.portraitVideoImage}
                    resizeMode={'cover'}
                    style={{
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                    }}
                />
            <CustomVideoPlayer
                    isLandscape={isLandScape}
                    // onPlayerStatusChanged={(shouldVideoScroll) => {
                    //     setScroll(shouldVideoScroll);
                    // }}
                    sourceURL={multiAttachItem?.url}
                    containerStyle={{
                        ...styles.singleImageDisplayStyle,
                        height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        position: 'absolute',
                    }}
                    videoStyle={{
                        ...styles.singleImageDisplayStyle,
                        height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                    }}
                />
          </View>
        );
    }
    return <View />;
}

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <View style={{ flex: 1 }}>
        {renderSingleImagePostView(data.attachments[0])}

      </View>
      <View style={ { position: 'absolute', right: 15, top: 45 } }>
        <TouchableOpacity onPress={backBtnPress}>
          <Image source={ images.cancelImage } style={ styles.backImage } />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  backImage: {
    height: hp('2%'),
    tintColor: colors.whiteColor,
    width: hp('2%'),
    marginRight: wp('3%'),
  },

  uploadedImage: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('100%'),
  },

  singleImageDisplayStyle: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('98%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
});
