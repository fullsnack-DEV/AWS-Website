import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import Header from '../Home/Header';
import fonts from '../../Constants/Fonts';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
import PostDescSection from './PostDescSection';
import TagView from './TagView';

export default function MultiImagePostView({
  backBtnPress,
  attachedImages,
  item,
  caller_id,
  navigation,
}) {
  const [topDesc, setTopDesc] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [dimention, setDimention] = useState({ width: wp('100%'), height: '100%' });
  const [isLandScape, setIsLandScape] = useState(false);
  const [mute] = useState(true);
  const [play] = useState(false);
  const [like, setLike] = useState(() => {
    let filterLike = [];
    if (item.own_reactions && item.own_reactions.clap) {
      filterLike = item.own_reactions.clap.filter((clapItem) => clapItem.user_id === caller_id);
      if (filterLike.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  });
  const [likeCount, setLikeCount] = useState(() => {
    if (item.reaction_counts && item.reaction_counts.clap !== undefined) {
      return item.reaction_counts.clap;
    }
    return 0;
  });

  useEffect(() => {
    if (item.reaction_counts && item.reaction_counts.clap !== undefined) {
      setLikeCount(item.reaction_counts.clap);
    }
  }, [item]);

  let userImage = '';
  if (item.actor && item.actor.data) {
    userImage = item.actor.data.full_image;
  }

  let descriptions = 'This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description.';
  if (item.object) {
    descriptions = JSON.parse(item.object).text;
  }

  useEffect(() => {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(orientationChange);
    return () => {
      Orientation.removeOrientationListener(orientationChange);
    };
  }, []);

  const orientationChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      setDimention({ width: hp('100%'), height: wp('100%') });
      setIsLandScape(true);
    } else {
      setDimention({ width: wp('100%'), height: hp('100%') });
      setIsLandScape(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <View style={{ flex: 1 }}>
        <Carousel
            data={attachedImages}
            renderItem={({ item: multiAttachItem }) => {
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
                  landscapeImgWidth = hp('28%');
                  landscapeImgHeight = wp('100%');
                } else if (multiAttachItem.media_height < multiAttachItem.media_width) {
                  landscapeImgWidth = hp('72%');
                  landscapeImgHeight = wp('100%');
                } else {
                  landscapeImgWidth = hp('50%');
                  landscapeImgHeight = wp('100%');
                }
              }
              if (multiAttachItem.type === 'image') {
                return (
                  <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={isLandScape ? landscapeImgWidth : portraitImgWidth}
                    imageHeight={isLandScape ? landscapeImgHeight : portraitImgHeight}
                    onMove={({ scale }) => {
                      if (scale === 1) {
                        setScroll(true);
                      } else {
                        setScroll(false);
                      }
                    }}
                  >
                    <FastImage
                        style={[styles.uploadedImage, {
                          width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                          height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                        }]}
                        source={{ uri: multiAttachItem.thumbnail }}
                        resizeMode={ FastImage.resizeMode.cover }
                    />
                    <Image
                        style={{
                          position: 'absolute',
                          height: hp('10%'),
                          width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        }}
                        source={isLandScape ? images.landscapeTopImage : images.portraitTopImage}
                        resizeMode={'stretch'}
                    />
                    <Image
                        style={{
                          position: 'absolute',
                          height: hp('10%'),
                          width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                          bottom: 0,
                        }}
                        source={isLandScape ? images.landscapeBottomImage : images.portraitBottomImage}
                        resizeMode={'stretch'}
                    />
                  </ImageZoom>
                );
              }
              if (multiAttachItem.type === 'video') {
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Image
                      source={isLandScape ? images.landscapeVideoImage : images.portraitVideoImage}
                      resizeMode={'cover'}
                      style={{
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                      }}
                    />
                    <Video
                      paused={!play}
                      muted={!mute}
                      source={{ uri: multiAttachItem.url }}
                      style={[styles.singleImageDisplayStyle, {
                        height: isLandScape ? landscapeImgHeight : portraitImgHeight,
                        width: isLandScape ? landscapeImgWidth : portraitImgWidth,
                        position: 'absolute',
                      }]}
                      resizeMode={'cover'}
                      controls={true}
                      onRestoreUserInterfaceForPictureInPictureStop={() => {
                        console.log('Load Start');
                      }}
                    />
                  </View>
                );
              }
              return <View />;
            }}
            contentContainerCustomStyle={{ alignSelf: 'center' }}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            scrollEnabled={scroll}
            sliderWidth={isLandScape ? hp(100) : wp(100)}
            itemWidth={isLandScape ? hp(100) : wp(100)}
        />
        <View style={{ position: 'absolute' }}>
          <Header
            mainContainerStyle={{ paddingVertical: 5, width: dimention.width }}
            leftComponent={
              <TouchableOpacity onPress={backBtnPress}>
                <Image
                    source={images.backArrow}
                    resizeMode={'contain'}
                    style={{ height: 22, width: 16, tintColor: colors.whiteColor }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                    source={images.vertical3Dot}
                    resizeMode={'contain'}
                    style={{ height: 22, width: 22, tintColor: colors.whiteColor }} />
              </TouchableOpacity>
            }
          />
          <View style={styles.mainContainer}>
            <Image
                style={styles.background}
                source={!userImage ? images.profilePlaceHolder : { uri: userImage }}
                resizeMode={'cover'}
            />
            <View style={styles.userNameView}>
              <Text style={styles.userNameTxt}>{item.actor.data.full_name}</Text>
              <Text style={styles.activeTimeAgoTxt}>
                {commentPostTimeCalculate(item.time)}
              </Text>
            </View>
          </View>
          {topDesc && <View style={{ marginTop: 5 }}>
            <PostDescSection
                descriptions={descriptions}
                containerStyle={{ marginHorizontal: 15 }}
                descriptionTxt={{ color: colors.whiteColor }}
                onReadMorePress={() => setTopDesc(false)}
            />
            <TagView
              source={images.tagGreenImage}
              tagText={'matches were tagged'}
            />
          </View>}
        </View>

        <SafeAreaView style={{ position: 'absolute', bottom: 0 }}>
          {!topDesc && <View>
            <PostDescSection
                descriptions={descriptions}
                character={50}
                containerStyle={{ marginHorizontal: 12 }}
                descriptionTxt={{ color: colors.whiteColor }}
                onReadMorePress={() => {
                  if (descriptions.length > 50) {
                    setTopDesc(true);
                  } else {
                    setTopDesc(false);
                  }
                }}
            />
            <TagView
              source={images.tagGreenImage}
              tagText={'matches were tagged'}
            />
          </View>}
          <View style={styles.commentShareLikeView}>
            <View
                style={{
                  flexDirection: 'row',
                  width: isLandScape ? hp('60%') : wp('60%'),
                }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                    onPress={() => {
                      backBtnPress()
                      navigation.navigate('WriteCommentScreen', {
                        data: item,
                      });
                    }}
                    style={styles.imageTouchStyle}>
                  <Image
                    style={[styles.commentImage, { top: 2 }]}
                    source={images.commentImage}
                    resizeMode={'cover'}
                    />
                </TouchableOpacity>
                {item.reaction_counts
                    && item.reaction_counts.comment !== undefined && (
                      <Text style={styles.commentlengthStyle}>
                        {item.reaction_counts.comment > 0
                          ? item.reaction_counts.comment
                          : ''}
                      </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}>
                <TouchableOpacity
                    onPress={() => {}}
                    style={styles.imageTouchStyle}>
                  <Image
                    style={styles.commentImage}
                    source={images.shareImage}
                    resizeMode={'contain'}
                    />
                </TouchableOpacity>
                <Text style={styles.commentlengthStyle}>99,999</Text>
              </View>
            </View>

            <View
                style={{
                  flexDirection: 'row',
                  width: isLandScape ? hp('32%') : wp('32%'),
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
              {item.reaction_counts && item.reaction_counts.clap !== undefined && (
                <Text
                    style={[
                      styles.commentlengthStyle,
                      {
                        color: like === true ? '#FF8A01' : colors.whiteColor,
                      },
                    ]}>
                  {likeCount === 0 ? '' : likeCount}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  setLike(!like);
                  if (like) {
                    setLikeCount(likeCount - 1);
                  } else {
                    setLikeCount(likeCount + 1);
                  }
                  // onLikePress()
                }}
                style={styles.imageTouchStyle}>
                {like === true ? (
                  <Image
                    style={styles.commentImage}
                    source={images.likeImage}
                    resizeMode={'contain'}
                    />
                ) : (
                  <Image
                    style={styles.commentImage}
                    source={images.unlikeImage}
                    resizeMode={'contain'}
                    />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    height: hp('65%'),
    justifyContent: 'center',
    width: wp('100%'),
  },
  mainContainer: {
    flexDirection: 'row',
    padding: wp('3%'),
  },
  userNameTxt: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    width: wp('70%'),
  },
  activeTimeAgoTxt: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    top: 2,
  },
  background: {
    borderRadius: hp('2.5%'),
    height: hp('5%'),
    width: hp('5%'),
  },
  commentImage: {
    height: 32,
    width: 32,
    alignSelf: 'flex-end',
  },
  commentShareLikeView: {
    flexDirection: 'row',
    margin: '3%',
    marginVertical: '2%',
    alignSelf: 'center',
  },
  commentlengthStyle: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginHorizontal: 5,
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
