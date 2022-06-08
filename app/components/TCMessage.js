import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ProgressBar from 'react-native-progress/Bar';
import Image from 'react-native-image-progress';

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from '../utils';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {QBgetFileURL} from '../utils/QuickBlox';
import images from '../Constants/ImagePath';
import MessageChatAssetModal from './message/MessageChatAssetModal';

const TCMessage = ({
  body,
  fullName,
  type = 'sender',
  messageStyle,
  attachments = [],
}) => {
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [fileUrls, setFileUrls] = useState([]);
  const [play, setPlay] = useState(false);
  const videoPlayerRef = useRef();
  const GradiantContainer = ({
    style,
    startGradiantColor,
    endGradiantColor,
    ...props
  }) => (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={style}
      colors={[startGradiantColor, endGradiantColor]}>
      {props.children}
    </LinearGradient>
  );

  console.log(
    'message chat data',
    body,
    fullName,
    type,
    messageStyle,
    attachments,
  );
  useEffect(() => {
    attachments.map((item) =>
      QBgetFileURL(item.id).then((fileUrl) => {
        console.log('fileUrlfileUrl', fileUrl);
        setFileUrls((urls) => [...urls, fileUrl]);
      }),
    );
  }, [attachments]);

  return (
    <Fragment>
      <GradiantContainer
        startGradiantColor={
          type === 'receiver' ? colors.whiteColor : colors.messageSenderColor
        }
        endGradiantColor={
          type === 'receiver' ? colors.whiteColor : colors.messageSenderColor
        }
        style={{
          ...styles.messageContaienr,
          shadowColor: type === 'sender' ? colors.googleColor : '',
          shadowOffset: type === 'sender' ? {width: 0, height: -2} : {},
          shadowOpacity: type === 'sender' ? 0.5 : 0,
          shadowRadius: type === 'sender' ? 4 : 0,
          elevation: type === 'sender' ? 10 : 0,
          borderTopLeftRadius: type === 'receiver' ? 0 : wp(2),
          borderBottomRightRadius: type === 'sender' ? 0 : wp(2),
          ...messageStyle,
        }}>
        {body === '[attachment]' || (
          <View style={{alignSelf: 'flex-start', padding: wp(2)}}>
            <Text
              style={{
                ...styles.messageText,
                color:
                  type === 'sender'
                    ? colors.lightBlackColor // lightBlackColor
                    : colors.lightBlackColor,
              }}>
              {body}
            </Text>
          </View>
        )}
      </GradiantContainer>
      {/*  Attachments */}
      {fileUrls.length > 0 && (
        <View
          style={{
            ...messageStyle,
            marginTop: 0,
          }}>
          {fileUrls.map((item, index) => {
            if (attachments[index]?.type === 'file') {
              return (
                <TouchableOpacity onPress={() => setShowAssetsModal(true)}>
                  <Video
                    repeat={true}
                    ref={videoPlayerRef}
                    paused={true}
                    muted={true}
                    source={{uri: item}}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      marginTop: hp(1),
                      overflow: 'hidden',
                      borderBottomRightRadius:
                        type === 'receiver' ? wp(3) : wp(0),
                      borderBottomLeftRadius: wp(3),
                      borderTopRightRadius: wp(3),
                      borderTopLeftRadius: type === 'receiver' ? wp(0) : wp(3),
                      height: wp(50),
                      width: wp(50),
                    }}
                    resizeMode={'cover'}
                    onLoad={() => {
                      videoPlayerRef.current.seek(0);
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableHighlight
                      style={styles.pauseMuteStyle}
                      activeOpacity={0.5}
                      onPress={() => {
                        setPlay(!play);
                      }}>
                      <FastImage
                        tintColor={'white'}
                        resizeMode={'contain'}
                        style={styles.playPauseImageStyle}
                        source={
                          play
                            ? images.videoPauseButton
                            : images.videoPlayButton
                        }
                      />
                    </TouchableHighlight>
                  </View>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setShowAssetsModal(true)}>
                <Image
                  source={{uri: item}}
                  key={item}
                  indicator={ProgressBar}
                  resizeMode={'cover'}
                  indicatorProps={{
                    size: 80,
                    borderWidth: 0,
                    color: 'rgba(150, 150, 150, 1)',
                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
                  }}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    marginTop: hp(1),
                    overflow: 'hidden',
                    borderBottomRightRadius:
                      type === 'receiver' ? wp(3) : wp(0),
                    borderBottomLeftRadius: wp(3),
                    borderTopRightRadius: wp(3),
                    borderTopLeftRadius: type === 'receiver' ? wp(0) : wp(3),
                    height: wp(50),
                    width: wp(50),
                  }}
                  onProgress={(e) =>
                    console.log(
                      'sasasas---',
                      e.nativeEvent.loaded / e.nativeEvent.total,
                  )
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <Modal
        isVisible={showAssetsModal}
        backdropColor="black"
        style={{margin: 0}}
        onBackdropPress={() => setShowAssetsModal(false)}
        onRequestClose={() => setShowAssetsModal(false)}
        backdropOpacity={0}>
        <MessageChatAssetModal
          title={fullName}
          assetType={attachments[0]?.type === 'file' ? 'video' : 'image'}
          assetURI={fileUrls?.[0] ?? ''}
          backBtnPress={() => setShowAssetsModal(false)}
        />
      </Modal>
    </Fragment>
  );
};


const styles = StyleSheet.create({
  pauseMuteStyle: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: wp('10%'),
    bottom: wp('2%'),
    height: wp('15%'),
    justifyContent: 'center',
    padding: wp('2%'),
    width: wp('15%'),
  },
  playPauseImageStyle: {
    height: wp('5%'),
    tintColor: '#fff',
    width: wp('5%'),
  },
  messageContaienr: {
    // marginVertical: wp(2),
    flex: 1,
    borderRadius: wp(2),
  },
  messageText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    flex: 1,
    maxWidth: wp(60),
    textAlign: 'left',
    color: colors.lightBlackColor,
  },
});

export default TCMessage;
