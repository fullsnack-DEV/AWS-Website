/* eslint-disable no-useless-escape */
import React, {
  useCallback, memo, useEffect, useRef, useState, useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import RNUrlPreview from 'react-native-url-preview';
import Carousel from 'react-native-snap-carousel';
import images from '../../Constants/ImagePath';
import SingleImage from './SingleImage';
import VideoPost from './VideoPost';
import PostImageSet from './PostImageSet';
import MultiPostVideo from './MultiPostVideo';
import NewsFeedDescription from './NewsFeedDescription';
import {
  commentPostTimeCalculate,
} from '../../Constants/LoaderImages';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi
const NewsFeedPostItems = ({
  navigation,
  item,
  onLikePress,
  caller_id,
  onDeletePost,
  onImageProfilePress,
  onEditPressDone,
  updateCommentCount,
}) => {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showThreeDot, setShowThreeDot] = useState(false);
  const [myItem, setMyItem] = useState();
  const [attachedImages, setAttachedImages] = useState([]);
  const [descriptions, setDescriptions] = useState('');
  useEffect(() => {
    let filterLike = [];
    if (item?.reaction_counts?.clap !== undefined) {
      setLikeCount(item?.reaction_counts?.clap);
    }
    if (item?.own_reactions?.clap !== undefined) {
      filterLike = item?.own_reactions?.clap?.filter((clapItem) => clapItem?.user_id === caller_id);
      if (filterLike?.length > 0) {
        setLike(true);
      } else {
        setLike(false);
      }
    } else {
      setLike(false);
    }
    setShowThreeDot(item?.ownerId === caller_id || item?.foreign_id === caller_id);
    const dummyItem = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object;
    setMyItem({ ...dummyItem });
    if (dummyItem) {
      if (dummyItem?.attachments !== undefined && dummyItem?.attachments?.length > 0) {
        setAttachedImages([...dummyItem?.attachments]);
      }
      setDescriptions(dummyItem?.text)
    }
  }, [caller_id, item]);
  const actionSheet = useRef();
  const shareActionSheet = useRef();

  const renderSinglePostItems = useCallback(({ item: attachItem }) => {
    if (attachItem?.type === 'image') {
      return <SingleImage
          updateCommentCount={updateCommentCount}
          item={item}
          data={attachItem}
          caller_id={caller_id}
          navigation={navigation}
          onImageProfilePress={onImageProfilePress}
          onLikePress={onLikePress}
      />;
    }
    if (attachItem?.type === 'video') {
      return (
        <VideoPost
            updateCommentCount={updateCommentCount}
            item={item}
              data={attachItem}
              caller_id={caller_id}
              navigation={navigation}
              onImageProfilePress={onImageProfilePress}
              onLikePress={onLikePress}
          />
      );
    }
    return <View />;
  }, [caller_id, item, navigation, onImageProfilePress, onLikePress, updateCommentCount])

  const listSpace = useMemo(() => <View style={{ width: wp('2%') }} />, [])

  const renderMultiplePostItems = useCallback(({ item: multiAttachItem, index }) => {
    if (multiAttachItem?.type === 'image') {
      return (
        <PostImageSet
              updateCommentCount={updateCommentCount}
              activeIndex={index}
              data={multiAttachItem}
              itemNumber={index + 1}
              attachedImages={attachedImages}
              totalItemNumber={attachedImages?.length}
              item={item}
              caller_id={caller_id}
              navigation={navigation}
              onImageProfilePress={onImageProfilePress}
              onLikePress={onLikePress}
          />
      );
    }
    if (multiAttachItem?.type === 'video') {
      return (
        <MultiPostVideo
            updateCommentCount={updateCommentCount}
            activeIndex={index}
              data={multiAttachItem}
              itemNumber={index + 1}
              attachedImages={attachedImages}
              totalItemNumber={attachedImages.length}
              item={item}
              caller_id={caller_id}
              navigation={navigation}
              onImageProfilePress={onImageProfilePress}
              onLikePress={onLikePress}
          />
      );
    }
    return <View />;
  }, [attachedImages, caller_id, item, navigation, onImageProfilePress, onLikePress, updateCommentCount])

  const newsFeedItemsKeyExtractor = useCallback((keyItem, index) => `innerFeed${ index?.id?.toString()}`, [])

  const onNewsFeedLikePress = useCallback(() => {
    if (like) setLikeCount((likeCnt) => likeCnt - 1);
    else setLikeCount((likeCnt) => likeCnt + 1);
    setLike((isLIKE) => !isLIKE);
    onLikePress()
  }, [like, onLikePress]);

  const onActionSheetItemPress = useCallback((index) => {
    if (index === 0) {
      navigation.navigate('EditPostScreen', {
        data: item,
        onPressDone: onEditPressDone,
      });
    } else if (index === 1) {
      onDeletePost();
    }
  }, [item, navigation, onDeletePost, onEditPressDone])

  const onShareActionSheetItemPress = useCallback((index) => {
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
  }, [descriptions])

  const renderProfileInfo = useMemo(() => (
    <View style={styles.mainContainer}>
      <TouchableWithoutFeedback onPress={onImageProfilePress}>
        <Image
              style={styles.background}
              source={!item?.actor?.data?.full_image ? images.profilePlaceHolder : { uri: item?.actor?.data?.full_image }}
              resizeMode={'cover'}
          />
      </TouchableWithoutFeedback>
      <View style={styles.userNameView}>
        <Text style={styles.userNameTxt} onPress={onImageProfilePress}>{item?.actor?.data?.full_name}</Text>
        <Text style={styles.activeTimeAgoTxt}>
          {commentPostTimeCalculate(item?.time, true)}
        </Text>
      </View>

      {showThreeDot && <TouchableOpacity
            style={styles.dotImageTouchStyle}
            onPress={() => {
              actionSheet.current.show();
            }}>
        <Image
              style={styles.dotImageStyle}
              source={images.threeDotIcon}
              resizeMode={'contain'}
          />
      </TouchableOpacity>}
    </View>
  ), [item?.actor?.data?.full_image, item?.actor?.data?.full_name, item?.time, onImageProfilePress, showThreeDot])

  const addStr = (str, index, stringToAdd) => str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  const renderURLPreview = useMemo(() => {
    const obj = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object
    let desc = obj?.text.toLowerCase()
    const position = desc.search(urlRegex)
    if (position !== -1 && desc.substring(position)?.startsWith('www')) desc = addStr(desc, position, 'http://')
    return (<RNUrlPreview
            text={desc}
            containerStyle={styles.urlPreviewContainerStyle}
            imageProps={{ resizeMode: 'cover' }}
            imageStyle={styles.previewImageStyle}
        />
    );
  }, [item?.object])

  const renderDescription = useMemo(() => (
    <NewsFeedDescription
          descriptions={descriptions}
          character={attachedImages?.length > 0 ? 140 : 480}
          tagData={myItem?.taggedData ?? []}
          navigation={navigation}
      />
  ), [attachedImages?.length, descriptions, myItem?.taggedData, navigation]);

  const onWriteCommentPress = useCallback(() => {
    navigation.navigate('WriteCommentScreen', {
      data: item,
      onSuccessSent: updateCommentCount,
    });
  }, [item, navigation, updateCommentCount]);

  return (
    <View style={{ flex: 1 }}>
      {renderProfileInfo}
      <View>
        {
          attachedImages && attachedImages?.length === 1 ? (
            <FlatList
                initialNumToRender={1}
                maxToRenderPerBatch={5}
              data={attachedImages}
              horizontal={true}
              legacyImplementation={true}
              windowSize={5}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={listSpace}
              ListFooterComponent={listSpace}
              ItemSeparatorComponent={listSpace}
              renderItem={renderSinglePostItems}
              keyExtractor={newsFeedItemsKeyExtractor}
            />
          ) : (
            <Carousel
              data={attachedImages}
              renderItem={renderMultiplePostItems}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              sliderWidth={wp(100)}
              itemWidth={wp(94)}
            />
          )
        }
        {renderURLPreview}
        {renderDescription}

        <View style={{ marginTop: 10, marginLeft: 10 }}/>
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
                onPress={onWriteCommentPress}
                style={styles.imageTouchStyle}>
                <Image
                  style={[styles.commentImage, { top: 2 }]}
                  source={images.commentImage}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
              {item?.reaction_counts?.comment !== undefined && (
                <Text style={styles.commentlengthStyle}>
                  {item?.reaction_counts?.comment > 0
                    ? item?.reaction_counts?.comment
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
                onPress={() => shareActionSheet.current.show()}
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

            <Text
              style={[
                styles.commentlengthStyle,
                {
                  color: like === true ? '#FF8A01' : colors.reactionCountColor,
                },
              ]}>
              {likeCount <= 0 ? '' : likeCount}
            </Text>
            <TouchableOpacity
              onPress={onNewsFeedLikePress}
              style={styles.imageTouchStyle}>
              <Image
                style={styles.commentImage}
                source={like ? images.likeImage : images.unlikeImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ActionSheet
          ref={actionSheet}
          title={'News Feed Post'}
          options={['Edit Post', 'Delete Post', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={onActionSheetItemPress}
        />

        <ActionSheet
          ref={shareActionSheet}
          title={'News Feed Post'}
          options={['Share', 'Copy Link', 'More Options', 'Cancel']}
          cancelButtonIndex={3}
          onPress={onShareActionSheetItemPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
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
    marginHorizontal: '4%',
    marginVertical: '2%',
  },
  commentlengthStyle: {
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginHorizontal: 5,
  },
  dotImageStyle: {
    height: hp('2%'),
    margin: wp('1.5%'),
    tintColor: colors.googleColor,
    width: hp('2%'),
  },
  dotImageTouchStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: wp('4%'),
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    width: wp('70%'),
  },
  urlPreviewContainerStyle: {
    flexDirection: 'column',
    margin: 5,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    padding: 8,
    borderRadius: 10,
  },
  previewImageStyle: {
    alignSelf: 'center',
    height: 100,
    width: wp('90%'),
  },
});

export default memo(NewsFeedPostItems);
