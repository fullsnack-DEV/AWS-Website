import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import Header from '../Home/Header';
import fonts from '../../Constants/Fonts';
import CustomVideoPlayer from '../CustomVideoPlayer';

export default function MessageChatAssetModal({
  backBtnPress,
  title = '',
  assetType,
  assetURI,
}) {
  const portraitImgDimention = {width: wp(100), height: hp(100)};
  return (
    <View style={{flex: 1, backgroundColor: colors.blackColor}}>
      <View style={{flex: 1}}>
        {assetType === 'video' ? (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Image
              source={images.portraitVideoImage}
              resizeMode={'cover'}
              style={{
                height: portraitImgDimention.height,
                width: portraitImgDimention.width,
              }}
            />
            <View
              style={[
                styles.singleImageDisplayStyle,
                {
                  width: portraitImgDimention.width,
                  height: portraitImgDimention.height,
                  position: 'absolute',
                },
              ]}>
              <FastImage
                style={styles.loadimageStyle}
                source={images.imageLoadingGIF}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={styles.loadingTextStyle}>Loading...</Text>
            </View>
            <CustomVideoPlayer
              isLandscape={false}
              sourceURL={assetURI}
              containerStyle={{
                ...styles.singleImageDisplayStyle,
                position: 'absolute',
                height: portraitImgDimention.height,
                width: portraitImgDimention.width,
              }}
              videoStyle={{
                height: portraitImgDimention.height,
                width: portraitImgDimention.width,
              }}
            />
          </View>
        ) : (
          <ImageZoom
            doubleClickInterval={250}
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={portraitImgDimention.width}
            imageHeight={portraitImgDimention.height}>
            <View
              style={[
                styles.singleImageDisplayStyle,
                {
                  width: portraitImgDimention.width,
                  height: portraitImgDimention.height,
                  position: 'absolute',
                },
              ]}>
              <FastImage
                style={styles.loadimageStyle}
                source={images.imageLoadingGIF}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={styles.loadingTextStyle}>Loading...</Text>
            </View>
            <FastImage
              style={[
                styles.uploadedImage,
                {
                  height: portraitImgDimention.height,
                  width: portraitImgDimention.width,
                },
              ]}
              source={{uri: assetURI}}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Image
              style={{
                position: 'absolute',
                height: hp('10%'),
                width: portraitImgDimention.width,
              }}
              source={images.landscapeTopImage}
              resizeMode={'stretch'}
            />
            <Image
              style={{
                position: 'absolute',
                height: hp('10%'),
                width: portraitImgDimention.width,
                bottom: 0,
              }}
              source={images.landscapeBottomImage}
              resizeMode={'stretch'}
            />
          </ImageZoom>
        )}
        <View style={{position: 'absolute'}}>
          <Header
            isHeaderBlack={true}
            mainContainerStyle={{
              paddingVertical: 5,
              width: wp(100),
            }}
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  Orientation.lockToPortrait();
                  backBtnPress();
                }}>
                <Image
                  source={images.backArrow}
                  resizeMode={'contain'}
                  style={{height: 22, width: 16, tintColor: colors.whiteColor}}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <Text
                style={{
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  color: colors.whiteColor,
                  textAlign: 'center',
                }}>
                {title}
              </Text>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleImageDisplayStyle: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('98%'),
    alignSelf: 'center',
    alignItems: 'center',
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
});
