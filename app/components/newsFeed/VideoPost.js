import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import { loaderImage } from '../../Constants/LoaderImages';

const { fonts, colors } = constants;

function VideoPost({ data, onVideoItemPress }) {
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  const [videoLoad, setVideoLoad] = useState(false);

  const randomImage = Math.floor(Math.random() * loaderImage.length);

  return (
      <View
      style={ [
        styles.singleImageDisplayStyle,
        {
          height:
            data.media_height > data.media_width
              ? wp('114%')
              : data.media_height < data.media_width
                ? wp('74%')
                : wp('94%'),
        },
      ] }>
          <View style={ [styles.singleImageDisplayStyle, {
            borderWidth: 1,
            borderColor: colors.lightgrayColor,
            height:
            data.media_height > data.media_width
              ? wp('114%')
              : data.media_height < data.media_width
                ? wp('74%')
                : wp('94%'),
          }] }>
              <FastImage
          style={ styles.loadimageStyle }
          source={ loaderImage[randomImage].image }
          resizeMode={ FastImage.resizeMode.contain }
        />
              <Text style={ styles.loadingTextStyle }>Loading...</Text>
          </View>
          <TouchableWithoutFeedback onPress={ onVideoItemPress }>
              <Video
        paused={ !play }
        muted={ !!mute }
        source={ { uri: data.url } }
        style={ [
          styles.singleImageDisplayStyle,
          {
            height:
              data.media_height > data.media_width
                ? wp('114%')
                : data.media_height < data.media_width
                  ? wp('74%')
                  : wp('94%'),
            position: 'absolute',
          },
        ] }
        resizeMode={ 'cover' }
        onVideoLoad={ () => {
          setVideoLoad(true);
        } }
      />
          </TouchableWithoutFeedback>
          {videoLoad
          && <>
              <View style={ styles.pauseMuteStyle }>
                  <TouchableOpacity
            onPress={ () => {
              setMute(!mute);
            } }>
                      <Image
              style={ styles.imageStyle }
              source={ mute ? PATH.mute : PATH.unmute }
            />
                  </TouchableOpacity>
              </View>
              <View style={ [styles.pauseMuteStyle, { right: wp('13.5%') }] }>
                  <TouchableOpacity
            onPress={ () => {
              setPlay(!play);
            } }>
                      <Image style={ styles.playPauseImageStyle } source={ PATH.playPause } />
                  </TouchableOpacity>
              </View>
          </>
      }
      </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: wp('5%'),
    tintColor: '#fff',
    width: wp('5%'),
  },
  lengthTextStyle: {
    color: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 15,
    paddingHorizontal: wp('1.5%'),
  },
  loadimageStyle: {
    height: 50,
    width: 50,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    bottom: wp('2%'),
    height: wp('10%'),
    justifyContent: 'center',
    padding: wp('2%'),
    position: 'absolute',
    right: wp('2%'),
    width: wp('10%'),
  },
  pauseMuteStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('94%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('94%'),
  },
  singleImageDisplayStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('94%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('94%'),
  },
});

export default VideoPost;
