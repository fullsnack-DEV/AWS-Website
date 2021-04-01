/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  // Dimensions,
  StatusBar,
  Text,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import ImageZoom from 'react-native-image-pan-zoom';
import Orientation from 'react-native-orientation';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';

import fonts from '../../../Constants/Fonts';
import { commentPostTimeCalculate } from '../../../Constants/LoaderImages';
import PostDescSection from '../../../components/newsFeed/PostDescSection';
import TagView from '../../../components/newsFeed/TagView';
import ShortsPlayer from '../../../components/shorts/ShortsPlayer';

function ShortsPlayScreen({ route }) {
  const {
    backBtnPress,
    item,
    caller_id,
    navigation,
    onImageProfilePress,
    onLikePress,
    openPostModal,
    currentPage,
    shorts,
  } = route?.params;
  const carouselRef = useRef(0);
  const [topDesc, setTopDesc] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
const [hideButton, setHideButton] = useState(true)
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(
    item?.reaction_counts?.comment ?? 0,
  );
  const [, setCurrentAssetIndex] = useState(0);
  const isFocused = useIsFocused();
  useEffect(() => {
    setTimeout(() => {
      if (carouselRef && currentPage > 1) {
        carouselRef.current.scrollToIndex({
          animated: false,
          index: currentPage - 1,
        });
      }
    }, 1000);
  }, [currentPage, carouselRef]);
  useEffect(() => {
    let filterLike = [];
    if (item?.reaction_counts?.clap !== undefined) {
      setLikeCount(item?.reaction_counts?.clap);
    }
    if (item?.own_reactions?.clap !== undefined) {
      filterLike = item?.own_reactions.clap.filter(
        (clapItem) => clapItem.user_id === caller_id,
      );
      if (filterLike.length > 0) {
        setLike(true);
      } else {
        setLike(false);
      }
    } else {
      setLike(false);
    }
  }, [caller_id, item]);

  let descriptions = '';
  if (item?.object) {
    descriptions = JSON.parse(item?.object)?.text;
  }

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [isFocused]);

  const shareActionSheet = useRef();

  const renderMultipleImagePostView = ({ item: multiAttachItem, index }) => {
    const videoItem = JSON.parse(multiAttachItem?.object)?.attachments[0];
    const profileItem = multiAttachItem?.actor?.data;
    console.log('videoItem:=>', videoItem);

    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        {!hideButton && <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: colors.blackColor,
            opacity: 0.5,
            zIndex: 100,
            position: 'absolute',
            alignSelf: 'center',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>

          <Image
              source={ !isPlay ? images.gamePause : images.gameStart}
              resizeMode={'contain'}
              style={
                { height: 20, wodth: 12.5 }
              }
            />

        </View>}
        <View style={{ flex: 1 }}>
          <Image source={images.portraitVideoImage} resizeMode={'cover'} />
          <ShortsPlayer
            payPausedPressed={() => {
                setTimeout(() => setHideButton(!hideButton), 800);
                setIsPlay(!isPlay)
            }}
            playPause = {isPlay}

            isLandscape={false}

            sourceURL={videoItem?.thumbnail}
            containerStyle={{
              ...styles.singleImageDisplayStyle,
              position: 'absolute',
            }}
            videoStyle={{
              ...styles.singleImageDisplayStyle,
            }}
          />
        </View>

        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onImageProfilePress}>
            <Image
              style={styles.background}
              source={
                !profileItem?.thumbnail
                  ? images.profilePlaceHolder
                  : { uri: profileItem?.thumbnail }
              }
              resizeMode={'cover'}
            />
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text style={styles.userNameTxt} onPress={onImageProfilePress}>
              {profileItem?.full_name}
            </Text>
            <Text style={styles.activeTimeAgoTxt}>
              {commentPostTimeCalculate(multiAttachItem?.time, true)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={images.vertical3Dot}
              resizeMode={'contain'}
              style={{
                height: 22,
                width: 22,
                tintColor: colors.whiteColor,
              }}
            />
          </TouchableOpacity>
        </View>
        {topDesc && (
          <View>
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
          </View>
        )}

        {!topDesc && (
          <View>
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
          </View>
        )}
        <View style={styles.commentShareLikeView}>
          <View
            style={{
              flexDirection: 'row',
              width: wp('60%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={onBackPress}
                style={styles.imageTouchStyle}>
                <Image
                  style={[styles.commentImage, { top: 2 }]}
                  source={images.commentImage}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
              <Text style={styles.commentlengthStyle}>
                {commentCount > 0 ? commentCount : ''}
              </Text>
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
              width: wp('32%'),
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {item?.reaction_counts?.clap !== undefined && (
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
                onLikePress();
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
      </View>
    );
  };

  const updateCommentCount = (dataID, commentCnt) => {
    setCommentCount(commentCnt);
  };
  const onBackPress = () => {
    Orientation.lockToPortrait();
    backBtnPress();
    navigation.navigate('WriteCommentScreen', {
      data: item,
      onDonePress: openPostModal,
      onSuccessSent: updateCommentCount,
    });
  };

  const onShareActionSheetItemPress = (index) => {
    if (index === 0) {
      const options = {
        message: descriptions,
      };
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
  };
  const [showParentView, setShowParentView] = useState(true);
  const toggleParentView = (checkVal) => {
    if (checkVal !== undefined) setShowParentView(checkVal);
    else setShowParentView((val) => !val);
  };
  return (
    <View style={{ backgroundColor: colors.blackColor, flex: 1 }}>
      {/* <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack()
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
          /> */}
      {/* <Carousel
               onSnapToItem={setCurrentAssetIndex}
               firstItem={0}
               nestedScrollEnabled={false}
               ref={carouselRef}
               data={shorts} // (shorts || []).map((e) => JSON.parse(e.object).attachments[0])
               renderItem={renderMultipleImagePostView}
               contentContainerCustomStyle={{ alignSelf: 'center' }}
               inactiveSlideScale={1}
               inactiveSlideOpacity={1}
               scrollEnabled={scroll}
               sliderWidth={wp(100)}
               itemWidth={wp(100)}
             /> */}
      <FlatList
        nestedScrollEnabled={false}
        ref={carouselRef}
        data={shorts} // (shorts || []).map((e) => JSON.parse(e.object).attachments[0])
        renderItem={renderMultipleImagePostView}
        pagingEnabled={true}
        onSnapToItem={setCurrentAssetIndex}
        decelerationRate="fast"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    margin: 15,

    alignItems: 'center',
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
    // marginBottom: 50,
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
    height: hp('100%'),
    justifyContent: 'center',
    width: wp('100%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default ShortsPlayScreen;
