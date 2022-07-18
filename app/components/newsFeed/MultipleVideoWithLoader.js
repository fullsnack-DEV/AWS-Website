import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function MultipleVideoWithLoader({data}) {
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  const [videoLoad, setVideoLoad] = useState(false);

  return (
    <View style={styles.singleImageDisplayStyle}>
      <View style={styles.singleImageDisplayStyle}>
        <Image style={styles.loadimageStyle} source={images.imageLoadingGIF} />
        <Text style={styles.loadingTextStyle}>Loading...</Text>
      </View>
      <Video
        paused={!play}
        muted={!mute}
        source={{uri: data.url}}
        style={[styles.singleImageDisplayStyle, {position: 'absolute'}]}
        resizeMode={'contain'}
        onLoad={() => {
          setVideoLoad(true);
        }}
      />
      {videoLoad && (
        <>
          <View style={styles.pauseMuteStyle}>
            <TouchableOpacity
              onPress={() => {
                setMute(!mute);
              }}
            >
              <FastImage
                resizeMode={'contain'}
                tintColor={'white'}
                style={styles.imageStyle}
                source={mute ? images.unmute : images.mute}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.pauseMuteStyle, {right: wp('13.5%')}]}>
            <TouchableOpacity
              onPress={() => {
                setPlay(!play);
              }}
            >
              <FastImage
                tintColor={'white'}
                resizeMode={'contain'}
                style={styles.playPauseImageStyle}
                source={play ? images.videoPauseButton : images.videoPlayButton}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: wp('5%'),
    tintColor: '#fff',
    width: wp('5%'),
  },
  loadimageStyle: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  loadingTextStyle: {
    color: colors.googleColor,
    fontFamily: fonts.RBold,
    fontSize: 14,
    marginTop: 25,
  },
  pauseMuteStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: wp('5%'),
    bottom: wp('2%'),
    height: wp('10%'),
    justifyContent: 'center',
    padding: wp('2%'),
    position: 'absolute',
    right: wp('2%'),
    width: wp('10%'),
  },
  playPauseImageStyle: {
    height: wp('4%'),
    tintColor: '#fff',
    width: wp('4%'),
  },
  singleImageDisplayStyle: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('98%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default MultipleVideoWithLoader;
