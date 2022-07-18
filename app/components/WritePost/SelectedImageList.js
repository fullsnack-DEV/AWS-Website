import React, {useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Video from 'react-native-video';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

function SelectedImageList({
  data,
  onItemPress,
  itemNumber,
  totalItemNumber,
  isClose = true,
  isCounter = true,
}) {
  const [showExtraButtons, setShowExtraButtons] = useState(false);
  const videoPlayerRef = useRef();
  return (
    <View style={styles.uploadedImage}>
      {(data?.type?.split('/')[0] || data?.mime?.split('/')[0]) === 'image' && (
        <FastImage
          onLoadEnd={() => setShowExtraButtons(true)}
          style={styles.uploadedImage}
          source={{uri: data.path || data.thumbnail}}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      {(data?.type?.split('/')[0] || data?.mime?.split('/')[0]) === 'video' && (
        <View>
          <View
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
            }}
          >
            <FastImage
              source={images.videoPlayBtn}
              tintColor={'white'}
              resizeMode={'contain'}
              style={{
                height: 30,
                width: 30,
                zIndex: 1,
              }}
            />
          </View>
          <Video
            ref={videoPlayerRef}
            paused={true}
            muted={true}
            source={{uri: data.path || data.thumbnail}}
            style={styles.uploadedImage}
            resizeMode={'cover'}
            onLoad={() => {
              setShowExtraButtons(true);
              videoPlayerRef.current.seek(0);
            }}
          />
        </View>
      )}
      {isClose && showExtraButtons && (
        <TouchableOpacity style={styles.cancelBtnView} onPress={onItemPress}>
          <Image source={images.cancelImage} style={styles.cancelImageStyle} />
        </TouchableOpacity>
      )}
      {isCounter && showExtraButtons && (
        <View style={styles.lengthViewStyle}>
          <Text style={styles.lengthTextStyle}>
            {itemNumber}
            {'/'}
            {totalItemNumber}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cancelBtnView: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // alignSelf: 'flex-end',
    top: wp('1%'),
    left: wp('1%'),
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelImageStyle: {
    height: 12,
    tintColor: colors.whiteColor,
    width: 12,
  },
  lengthTextStyle: {
    color: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 12,
    paddingHorizontal: wp('1.5%'),
  },
  lengthViewStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    padding: wp('0.5%'),
    paddingVertical: wp('1%'),
    position: 'absolute',
    right: wp('1.5%'),
    top: wp('1.5%'),
  },
  uploadedImage: {
    borderRadius: wp('4%'),
    height: wp('30%'),
    marginVertical: '1%',
    width: wp('30%'),
  },
});

export default SelectedImageList;
