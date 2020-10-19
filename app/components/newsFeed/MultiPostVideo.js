import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import { loaderImage } from '../../Constants/LoaderImages';

const { fonts, colors } = constants;

function MultiPostVideo({ data, itemNumber, totalItemNumber }) {
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  const [videoLoad, setVideoLoad] = useState(false);

  const randomImage = Math.floor(Math.random() * loaderImage.length);

  return (
      <View style={ styles.singleImageDisplayStyle }>
          <View style={ [styles.singleImageDisplayStyle, { borderWidth: 1, borderColor: colors.lightgrayColor }] }>
              <FastImage
          style={ styles.loadimageStyle }
          source={ loaderImage[randomImage].image }
          resizeMode={ FastImage.resizeMode.contain }
        />
              <Text style={ styles.loadingTextStyle }>Loading...</Text>
          </View>
          <Video
        paused={ !play }
        muted={ !!mute }
        source={ { uri: data.url } }
        style={ [styles.singleImageDisplayStyle, { position: 'absolute' }] }
        resizeMode={ 'cover' }
        onVideoLoad={ () => {
          setVideoLoad(true);
        } }
      />
          <View style={ styles.lengthViewStyle }>
              <Text style={ styles.lengthTextStyle }>
                  {itemNumber}
                  {'/'}
                  {totalItemNumber}
              </Text>
          </View>
          {videoLoad && <>
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
          </>}
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
  lengthViewStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    padding: wp('1.5%'),
    position: 'absolute',
    right: wp('3%'),
    top: wp('5%'),
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
  playPauseImageStyle: {
    height: wp('4%'),
    tintColor: '#fff',
    width: wp('4%'),
  },
  singleImageDisplayStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('4%'),
    height: wp('91%'),
    justifyContent: 'center',
    marginVertical: wp('1%'),
    width: wp('91%'),
  },
});

export default MultiPostVideo;
