/* eslint-disable no-useless-escape */

import React, {memo} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

// eslint-disable-next-line no-irregular-whitespace
const youtubeRegex =
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gim;
const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim;

const addStr = (str, index, stringToAdd) =>
  str.substring(0, index) + stringToAdd + str.substring(index, str.length);

const getYoutubeVideoID = (url) => {
  const youtubeVideoIdRegex =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(youtubeVideoIdRegex);
  return match && match[7].length === 11 ? match[7] : false;
};

const YOUTUBE_OPTION = 1; // 1 OR 2
const CustomURLPreview = memo(({text}) => {
  let desc = text;
  const position = desc?.search(urlRegex);
  if (position !== -1 && desc?.substring(position)?.startsWith('www'))
    desc = addStr(text, position, 'http://');
  const youtubeMatch = desc.match(youtubeRegex);
  if (youtubeMatch?.length > 0) {
    const videoID = getYoutubeVideoID(youtubeMatch?.[0]);
    const videoThumbnail = `https://img.youtube.com/vi/${videoID}/0.jpg`;
    return (
      <TouchableWithoutFeedback
        style={styles.youtubeVideoContainer}
        onPress={() => Linking.openURL(youtubeMatch?.[0])}
      >
        {/*  Youtube Video Image View */}
        {YOUTUBE_OPTION === 1 && (
          <View>
            <FastImage
              source={{uri: videoThumbnail}}
              resizeMode={'cover'}
              style={{height: 190, width: wp(100)}}
            />
            <View
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FastImage
                source={images.youtubePlayButton}
                resizeMode={'contain'}
                style={{
                  height: 75,
                  width: 75,
                  shadowColor: colors.blackColor,
                  shadowOffset: {width: 0, height: 1.5},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              />
            </View>
          </View>
        )}

        {/*  Youtube Video View */}
        {YOUTUBE_OPTION === 2 && (
          <View style={{height: 190, width: '100%'}}>
            <YoutubePlayer
              height={190}
              play={false}
              videoId={videoID}
              initialPlayerParams={{
                showClosedCaptions: false,
                preventFullScreen: true,
                controls: false,
              }}
              webViewStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 50,
              }}
            />
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  }

  return (
    <RNUrlPreview
      text={text}
      containerStyle={styles.urlPreviewContainerStyle}
      imageProps={{resizeMode: 'contain'}}
      titleNumberOfLines={2}
      imageStyle={styles.previewImageStyle}
      textContainerStyle={styles.textContainerStyle}
      titleStyle={styles.urlPreviewTitleText}
      descriptionStyle={styles.urlPreviewDescriptionText}
    />
  );
});

const styles = StyleSheet.create({
  urlPreviewContainerStyle: {
    flexDirection: 'column',
    margin: 5,
    marginHorizontal: 15,
  },
  previewImageStyle: {
    borderWidth: 1.5,
    borderColor: colors.grayBackgroundColor,
    borderRadius: 10,
    padding: 18,
    alignSelf: 'center',
    height: 150,
    width: wp('90%'),
  },
  textContainerStyle: {
    marginVertical: 5,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  urlPreviewTitleText: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  urlPreviewDescriptionText: {
    textAlign: 'left',
    color: colors.userPostTimeColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
  youtubeVideoContainer: {
    // width: '100%',
    backgroundColor: colors.blackColor,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.grayBackgroundColor,
    overflow: 'hidden',
  },
});

export default CustomURLPreview;
