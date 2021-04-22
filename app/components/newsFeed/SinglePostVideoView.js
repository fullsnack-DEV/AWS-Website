import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Orientation from 'react-native-orientation';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import ActionSheet from 'react-native-actionsheet';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import Header from '../Home/Header';
import fonts from '../../Constants/Fonts';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
import PostDescSection from './PostDescSection';
import TagView from './TagView';
import CustomVideoPlayer from '../CustomVideoPlayer';
import CommentModal from './CommentModal';

export default function SinglePostVideoView({
  backBtnPress,
  data,
  item,
  caller_id,

  onImageProfilePress,
  onLikePress,

}) {
  const [topDesc, setTopDesc] = useState(false);
  const [dimention, setDimention] = useState({ width: wp('100%'), height: '100%' });
  const [portraitImgDimention, setPortraitImgDimention] = useState(() => {
    let height = hp('50%');
    if (data.media_height > data.media_width) {
      height = hp('72%')
    } else if (data.media_height < data.media_width) {
      height = hp('28%')
    } else {
      height = hp('50%')
    }
    return { width: wp('100%'), height }
  });
  const [showParentView, setShowParentView] = useState(true);
  const [landscapeImgDimention, setLandscapeImgDimention] = useState({ width: hp('72%'), height: wp('100%') });
  const [isLandScape, setIsLandScape] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [ShowComment, setShowModelComment] = useState(false);

  useEffect(() => {
    let filterLike = [];
    if (item.reaction_counts && item.reaction_counts.clap !== undefined) {
      setLikeCount(item.reaction_counts.clap);
    }
    if (item.own_reactions && item.own_reactions.clap !== undefined) {
      filterLike = item.own_reactions.clap.filter((clapItem) => clapItem.user_id === caller_id);
      if (filterLike.length > 0) {
        setLike(true);
      } else {
        setLike(false);
      }
    } else {
      setLike(false);
    }
  }, [item]);

    const onClose = () => {
      setShowModelComment(false)
    }

  let userImage = '';
  if (item.actor && item.actor.data) {
    userImage = item.actor.data.full_image;
  }

  let descriptions = '';
  if (item.object) {
    descriptions = JSON.parse(item.object).text;
  }
  const toggleParentView = () => setShowParentView((val) => !val)

  useEffect(() => {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(orientationChange);
    return () => {
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    };
  }, []);

  const orientationChange = (orientation) => {
    if (['LANDSCAPE', 'PORTRAITUPSIDEDOWN']?.includes(orientation)) {
      setDimention({ width: hp('100%'), height: wp('100%') });
      setIsLandScape(true);
      if (data.media_height > data.media_width) {
        setLandscapeImgDimention({ width: hp('28%'), height: wp('100%') })
      } else if (data.media_height < data.media_width) {
        setLandscapeImgDimention({ width: hp('72%'), height: wp('100%') })
      } else {
        setLandscapeImgDimention({ width: hp('50%'), height: wp('100%') })
      }
    } else {
      setDimention({ width: wp('100%'), height: hp('100%') });
      setIsLandScape(false);
      if (data.media_height > data.media_width) {
        setPortraitImgDimention({ width: wp('100%'), height: hp('72%') })
      } else if (data.media_height < data.media_width) {
        setPortraitImgDimention({ width: wp('100%'), height: hp('28%') })
      } else {
        setPortraitImgDimention({ width: wp('100%'), height: hp('50%') })
      }
    }
  };

  const shareActionSheet = useRef();

  return (
    <KeyboardAvoidingView
        onStartShouldSetResponderCapture={toggleParentView}
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Image
            source={isLandScape ? images.landscapeVideoImage : images.portraitVideoImage}
            resizeMode={'cover'}
            style={{
              height: isLandScape ? landscapeImgDimention.height : portraitImgDimention.height,
              width: isLandScape ? landscapeImgDimention.width : portraitImgDimention.width,
            }}
          />
          <View
            style={[
              styles.singleImageDisplayStyle,
              {
                width: isLandScape ? landscapeImgDimention.width : portraitImgDimention.width,
                height: isLandScape ? landscapeImgDimention.height : portraitImgDimention.height,
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
              isLandscape={isLandScape}
              sourceURL={data.url}
              containerStyle={{
                ...styles.singleImageDisplayStyle,
                position: 'absolute',
                height: isLandScape ? landscapeImgDimention.height : portraitImgDimention.height,
                width: isLandScape ? landscapeImgDimention.width : portraitImgDimention.width,
              }}
              videoStyle={{
                height: isLandScape ? landscapeImgDimention.height : portraitImgDimention.height,
                width: isLandScape ? landscapeImgDimention.width : portraitImgDimention.width,
              }}
          />
        </View>
        <View style={{ position: 'absolute', opacity: showParentView ? 1 : 0 }}>
          <Header
            mainContainerStyle={{ paddingVertical: 5, width: dimention.width }}
            leftComponent={
              <TouchableOpacity onPress={() => {
                Orientation.lockToPortrait();
                backBtnPress()
              }}>
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
                  style={{ height: 22, width: 22, tintColor: colors.whiteColor }}
                />
              </TouchableOpacity>
            }
          />
          <View style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={onImageProfilePress}>
              <Image
                style={styles.background}
                source={!userImage ? images.profilePlaceHolder : { uri: userImage }}
                resizeMode={'cover'}
              />
            </TouchableWithoutFeedback>
            <View style={styles.userNameView}>
              <Text style={styles.userNameTxt} onPress={onImageProfilePress}>{item?.actor?.data?.full_name}</Text>
              <Text style={styles.activeTimeAgoTxt}>
                {commentPostTimeCalculate(item.time, true)}
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

        <SafeAreaView style={{ position: 'absolute', bottom: 0, opacity: showParentView ? 1 : 0 }}>
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
                      setShowModelComment(true)
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
                    onPress={() => {
                      shareActionSheet.current.show();
                    }}
                    style={styles.imageTouchStyle}>
                  <Image
                    style={styles.commentImage}
                    source={images.shareImage}
                    resizeMode={'contain'}
                    />
                </TouchableOpacity>
                <Text style={styles.commentlengthStyle}>{''}</Text>
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
                  onLikePress()
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
        <ActionSheet
          ref={shareActionSheet}
          title={'News Feed Post'}
          options={['Share', 'Copy Link', 'More Options', 'Cancel']}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              const options = {
                message: descriptions,
              }
              Share.open(options)
                .then((res) => {
                  console.log('res :-', res);
                })
                .catch((err) => {
                  console.log('err :-', err);
                });
            } else if (index === 1) {
              Clipboard.setString(descriptions);
            }
          }}
        />
        <CommentModal item={item} showCommentModal={ShowComment} onClose={onClose} />

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
