import React, {memo, useCallback, useContext, useMemo, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getHitSlop} from '../../utils';
import {ImageUploadContext} from '../../context/GetContexts';

const heightOfProgressView = 60;

const SingleImageProgressBar = memo(
  ({totalUpload, numberOfUploaded, imageData, onCancelPress}) => {
    const videoPlayerRef = useRef();
    const renderImageVideo = useMemo(
      () =>
        (imageData?.[numberOfUploaded - 1]?.type?.split('/')[0] ||
          imageData?.[numberOfUploaded - 1]?.mime?.split('/')[0]) ===
        'image' ? (
          <FastImage
            resizeMode={'cover'}
            style={styles.profileImg}
            source={
              imageData
                ? {uri: imageData?.[numberOfUploaded - 1]?.path}
                : images.profilePlaceHolder
            }
          />
        ) : (
          <View style={styles.profileImg}>
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
              }}>
              <FastImage
                source={images.videoPlayBtn}
                tintColor={'white'}
                resizeMode={'contain'}
                style={{
                  height: 10,
                  width: 10,
                  zIndex: 1,
                }}
              />
            </View>
            <Video
              ref={videoPlayerRef}
              paused={true}
              muted={true}
              source={{uri: imageData?.[numberOfUploaded - 1]?.path}}
              style={styles.profileImg}
              resizeMode={'cover'}
              onLoad={() => {
                videoPlayerRef.current.seek(0);
              }}
            />
          </View>
        ),
      [imageData, numberOfUploaded],
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.viewStyle}>
          <View style={styles.profileImageViewStyle}>{renderImageVideo}</View>
          {useMemo(
            () => (
              <View style={styles.textViewStyle}>
                <Text style={styles.writePostText}>Uploading...</Text>
                <Text style={styles.attachmentCounter}>
                  {' '}
                  {`${numberOfUploaded}/${totalUpload}`}
                </Text>
              </View>
            ),
            [numberOfUploaded, totalUpload],
          )}

          {useMemo(
            () => (
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.cancelTouchStyle}
                onPress={onCancelPress}>
                <Image
                  style={styles.cancelImagestyle}
                  source={images.cancelImage}
                />
              </TouchableOpacity>
            ),
            [onCancelPress],
          )}
        </View>
        <Progress.Bar
          progress={(1 * numberOfUploaded) / totalUpload}
          width={wp('100%')}
          borderRadius={0}
          borderWidth={0}
          unfilledColor={colors.offGrayColor}
          color={colors.themeColor}
        />
      </View>
    );
  },
);

const ImageProgress = () => {
  const imageUploadContext = useContext(ImageUploadContext);
  const flatListRef = useRef();

  // useEffect(() => {
  //   console.log('IMAGE CONT', imageUploadContext)
  // }, [imageUploadContext?.state?.uploadingData?.length])

  const onCancelImageUpload = useCallback(
    (item) => {
      imageUploadContext.removeUploadingData(item?.id);
      if (item?.cancelRequest?.cancel) item.cancelRequest.cancel('Mistake');
    },
    [imageUploadContext],
  );

  const onCancelPress = useCallback(
    (item) => {
      Alert.alert(
        'Cancel Upload?',
        'If you cancel your upload now, your post will not be saved.',
        [
          {
            text: 'Go back',
          },
          {
            text: 'Cancel upload',
            onPress: () => onCancelImageUpload(item),
          },
        ],
      );
    },
    [onCancelImageUpload],
  );

  const renderSingleUploadData = useCallback(
    ({item}) => (
      <SingleImageProgressBar
        numberOfUploaded={item?.doneUploadCount ?? 0}
        totalUpload={item?.totalUploadCount ?? 0}
        imageData={item?.dataArray}
        onCancelPress={() => onCancelPress(item)}
      />
    ),
    [onCancelPress],
  );

  const flatListKeyRef = useCallback((item) => item?.id?.toString(), []);
  const onContentSizeChange = useCallback(
    () => flatListRef.current.scrollToEnd(),
    [],
  );
  return (
    <View
      style={{
        ...styles.mainViewContainer,
        maxHeight:
          heightOfProgressView *
          imageUploadContext?.state?.uploadingData?.length,
        height:
          heightOfProgressView *
          imageUploadContext?.state?.uploadingData?.length,
      }}>
      {/* Arrow
      {imageUploadContext?.state?.uploadingData?.length > 1 && (
        <TouchableOpacity
          style={styles.upArrowDesign}
          onPress={toggleProgressBar}>
          <FastImage
            source={images.dropDownArrow}
            style={{
              height: 15,
              width: 15,
              transform: [
                {rotate: isOpenToggleProgressView ? '360deg' : '180deg'},
              ],
            }}
            resizeMode={'contain'}
            tintColor={colors.uploadTextColor}
          />
        </TouchableOpacity>
      )} */}
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        onContentSizeChange={onContentSizeChange}
        bounces={false}
        keyExtractor={flatListKeyRef}
        data={imageUploadContext?.state?.uploadingData ?? []}
        // data={['', '']}
        renderItem={renderSingleUploadData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
    backgroundColor: colors.uploadBGColor,
    elevation: 5,
    shadowOpacity: 1,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  mainContainer: {
    height: heightOfProgressView,
    justifyContent: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    height: '90%',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
  },
  profileImageViewStyle: {
    width: wp('12%'),
  },
  profileImg: {
    height: hp('4.5%'),
    width: hp('4.5%'),
    borderRadius: 5,
  },
  textViewStyle: {
    width: wp('72%'),
    marginHorizontal: wp('1%'),
    flexDirection: 'row',
  },
  writePostText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
  attachmentCounter: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
  cancelImagestyle: {
    alignSelf: 'center',
    height: hp('1.6%'),
    resizeMode: 'cover',
    width: hp('1.6%'),
    tintColor: colors.lightBlackColor,
  },
  cancelTouchStyle: {
    alignSelf: 'center',
    height: hp('2.5%'),
    resizeMode: 'cover',
    width: hp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ImageProgress);
