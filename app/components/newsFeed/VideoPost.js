import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
const {fonts} = constants;

function VideoPost({data, itemNumber, totalItemNumber}) {
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(false);
  return (
    <View
      style={[
        styles.singleImageDisplayStyle,
        {
          height:
            data.media_height > data.media_width
              ? wp('114%')
              : data.media_height < data.media_width
              ? wp('74%')
              : wp('94%'),
        },
      ]}>
      <Video
        paused={play ? false : true}
        muted={mute ? true : false}
        source={{uri: data.url}}
        style={[
          styles.singleImageDisplayStyle,
          {
            height:
              data.media_height > data.media_width
                ? wp('114%')
                : data.media_height < data.media_width
                ? wp('74%')
                : wp('94%'),
          },
        ]}
        resizeMode={'cover'}
      />
      <View style={styles.lengthViewStyle}>
        <Text style={styles.lengthTextStyle}>
          {itemNumber}
          {'/'}
          {totalItemNumber}
        </Text>
      </View>
      <View style={styles.pauseMuteStyle}>
        <TouchableOpacity
          onPress={() => {
            setMute(!mute);
          }}>
          <Image
            style={styles.imageStyle}
            source={mute ? PATH.mute : PATH.unmute}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.pauseMuteStyle, {right: wp('13.5%')}]}>
        <TouchableOpacity
          onPress={() => {
            setPlay(!play);
          }}>
          <Image style={styles.playPauseImageStyle} source={PATH.playPause} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleImageDisplayStyle: {
    height: wp('94%'),
    width: wp('94%'),
    marginVertical: wp('1%'),
    borderRadius: wp('4%'),
  },
  pauseMuteStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: wp('10%'),
    height: wp('10%'),
    bottom: wp('2%'),
    right: wp('2%'),
    padding: wp('2%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lengthTextStyle: {
    fontSize: 15,
    color: '#fff',
    paddingHorizontal: wp('1.5%'),
    fontFamily: fonts.RRegular,
  },
  imageStyle: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#fff',
  },
  playPauseImageStyle: {
    width: wp('4%'),
    height: wp('4%'),
    tintColor: '#fff',
  },
  lengthViewStyle: {
    position: 'absolute',
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    top: wp('5%'),
    right: wp('3%'),
    padding: wp('1.5%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VideoPost;
