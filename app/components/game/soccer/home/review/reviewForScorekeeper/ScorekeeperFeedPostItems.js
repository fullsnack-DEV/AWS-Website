import React, {
  useCallback,
  memo,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  Keyboard,
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
import ActivityLoader from '../../../../../loader/ActivityLoader';
import AuthContext from '../../../../../../auth/context';
import images from '../../../../../../Constants/ImagePath';
import { commentPostTimeCalculate } from '../../../../../../Constants/LoaderImages';

import { createReaction, getReactions } from '../../../../../../api/NewsFeeds';
import colors from '../../../../../../Constants/Colors';
import fonts from '../../../../../../Constants/Fonts';
import SingleImage from '../../../../../newsFeed/SingleImage';
import VideoPost from '../../../../../newsFeed/VideoPost';
import PostImageSet from '../../../../../newsFeed/PostImageSet';
import MultiPostVideo from '../../../../../newsFeed/MultiPostVideo';
import NewsFeedDescription from '../../../../../newsFeed/NewsFeedDescription';
import WriteReviewComment from '../../../../../newsFeed/WriteReviewComment';

function ScorekeeperFeedPostItems({
  navigation,
  item,
  onLikePress,
  caller_id,
  onDeletePost,
  onImageProfilePress,
  onEditPressDone,
  profileObject,
}) {
  const authContext = useContext(AuthContext);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setloading] = useState(false);
  const [viewAllComment, setViewAllComment] = useState(false);

  const [commentData, setCommentData] = useState([]);
  const [commentTxt, setCommentText] = useState('');
  useEffect(() => {
    console.log('entity data::=>', profileObject);
    const params = {
      activity_id: item.id,
      reaction_type: 'comment',
    };
    getReactions(params, authContext)
      .then((response) => {
        setCommentData(response?.payload?.reverse());
        // setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        // setloading(false);
      });
  }, []);

  useEffect(() => {
    console.log('ITEM::=>', item);
    let filterLike = [];
    if (item?.reaction_counts?.clap !== undefined) {
      setLikeCount(item?.reaction_counts?.clap);
    }
    if (item?.own_reactions?.clap !== undefined) {
      filterLike = item?.own_reactions?.clap?.filter(
        (clapItem) => clapItem?.user_id === caller_id,
      );
      if (filterLike?.length > 0) {
        setLike(true);
      } else {
        setLike(false);
      }
    } else {
      setLike(false);
    }
  }, [item]);
  const actionSheet = useRef();
  const shareActionSheet = useRef();

  let userImage = '';
  if (item?.actor && item?.actor?.data) {
    userImage = item?.actor?.data?.full_image;
  }

  let attachedImages = [];
  let descriptions = '';
  if (item?.object) {
    if (
      JSON.parse(item?.object)?.scorekeeperReview?.attachments !== undefined
      && JSON.parse(item?.object)?.scorekeeperReview?.attachments?.length > 0
    ) {
      attachedImages = JSON.parse(item?.object)?.scorekeeperReview?.attachments;
    }
    descriptions = JSON.parse(item?.object)?.scorekeeperReview?.comment;
  }
  let threeDotBtnDisplay = false;
  if (item?.foreign_id === caller_id) {
    threeDotBtnDisplay = true;
  } else {
    threeDotBtnDisplay = false;
  }

  const renderSinglePostItems = useCallback(
    ({ item: attachItem }) => {
      if (attachItem?.type === 'image') {
        return (
          <SingleImage
            item={item}
            data={attachItem}
            caller_id={caller_id}
            navigation={navigation}
            onImageProfilePress={onImageProfilePress}
            onLikePress={onLikePress}
          />
        );
      }
      if (attachItem?.type === 'video') {
        return (
          <VideoPost
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
    },
    [item],
  );

  const listSpace = () => <View style={{ width: wp('2%') }} />;

  const renderMultiplePostItems = useCallback(
    ({ item: multiAttachItem, index }) => {
      if (multiAttachItem?.type === 'image') {
        return (
          <PostImageSet
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
    },
    [item],
  );

  const newsFeedItemsKeyExtractor = (keyItem, index) => `innerFeed${index?.id?.toString()}`;

  const onNewsFeedLikePress = () => {
    setLike(!like);
    if (like) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    onLikePress();
  };

  const onActionSheetItemPress = (index) => {
    if (index === 0) {
      navigation.navigate('EditPostScreen', {
        data: item,
        onPressDone: onEditPressDone,
      });
    } else if (index === 1) {
      onDeletePost();
    }
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

  const handleSend = () => {
    if (commentTxt.length > 0) {
      setloading(true);
      const bodyParams = {
        reaction_type: 'comment',
        activity_id: item.id,
        data: {
          text: commentTxt,
        },
      };
      createReaction(bodyParams, authContext)
        .then((response) => {
          setloading(false);
          const dataOfComment = [...commentData];
          dataOfComment.push(response.payload);
          setCommentData(dataOfComment?.reverse());
          setCommentText('');
        })
        .catch((e) => {
          setloading(false);
          Alert.alert('', e.messages);
        });
    }

    console.log('data Send');
    Keyboard.dismiss();
  };

  return (
    <View>

      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <TouchableWithoutFeedback onPress={onImageProfilePress}>
          <Image
              style={styles.background}
              source={!userImage ? images.profilePlaceHolder : { uri: userImage }}
              resizeMode={'cover'}
            />
        </TouchableWithoutFeedback>
        <View style={styles.userNameView}>
          <Text style={styles.userNameTxt} onPress={onImageProfilePress}>
            {item?.actor?.data?.full_name}
          </Text>
          <Text style={styles.activeTimeAgoTxt}>
            {commentPostTimeCalculate(item?.time)}
          </Text>
        </View>
        {threeDotBtnDisplay && (
          <TouchableOpacity
              style={styles.dotImageTouchStyle}
              onPress={() => {
                actionSheet.current.show();
              }}>
            <Image
                style={styles.dotImageStyle}
                source={images.threeDotIcon}
                resizeMode={'contain'}
              />
          </TouchableOpacity>
          )}
      </View>
      <View>
        <NewsFeedDescription
            descriptions={descriptions}
            character={attachedImages?.length > 0 ? 140 : 480}
            tagData={JSON.parse(item?.object)?.scorekeeperReview?.tagged ?? []}
            navigation={navigation}
          />
        <View style={{ marginTop: 10, marginLeft: 10 }}></View>
        {attachedImages && attachedImages?.length === 1 ? (
          <FlatList
              initialNumToRender={1}
              maxToRenderPerBatch={5}
              data={attachedImages}
              horizontal={true}
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
          )}
        {(descriptions?.toLowerCase()?.indexOf('http://') === 0
            || descriptions?.toLowerCase()?.indexOf('https://') === 0) && (
              <RNUrlPreview
              text={descriptions}
              containerStyle={styles.urlPreviewContainerStyle}
              imageProps={{ resizeMode: 'cover' }}
              imageStyle={styles.previewImageStyle}
            />
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
                  onPress={() => {
                    console.log('Comment Item:=>', item);
                    //  navigation.navigate('WriteCommentScreen', {
                    //    data: item,
                    //  });
                  }}
                  style={styles.imageTouchStyle}>
                <Image
                    style={[styles.commentImage, { top: 2 }]}
                    source={images.commentImage}
                    resizeMode={'cover'}
                  />
              </TouchableOpacity>
              {item?.reaction_counts?.comment !== undefined && (
                <Text style={styles.commentlengthStyle}>
                  {commentData.length ?? 0}
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
              <Text style={styles.commentlengthStyle}>{0}</Text>
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
                      color:
                        like === true ? '#FF8A01' : colors.reactionCountColor,
                    },
                  ]}>
                {likeCount === 0 ? '' : likeCount}
              </Text>
              )}
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
            title={'Reviews Feed Post'}
            options={['Share', 'Copy Link', 'More Options', 'Cancel']}
            cancelButtonIndex={3}
            // destructiveButtonIndex={1}
            onPress={onShareActionSheetItemPress}
          />
      </View>
      {commentData?.length > 2 && !viewAllComment && (
        <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.grayColor,
              marginLeft: 20,
              marginBottom: 5,
            }} onPress={() => {
              setViewAllComment(!viewAllComment)
            }}>{`View ${commentData?.length - 2} more comments`}</Text>
        )}
      {commentData?.length > 2 && viewAllComment && (
        <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.grayColor,
              marginLeft: 20,
              marginBottom: 5,
            }} onPress={() => {
              setViewAllComment(!viewAllComment)
            }}>{'Show only 2 comments'}</Text>
        )}

      {commentData && commentData?.length > 2 ? (
        <FlatList
            data={viewAllComment ? commentData : commentData.slice(0, 2)}
            renderItem={({ item: commentItem }) => (
              <WriteReviewComment data={commentItem} />
            )}
            keyExtractor={(index) => index.toString()}
          />
        ) : (
          <FlatList
            data={commentData}
            renderItem={({ item: commentItem }) => (
              <WriteReviewComment data={commentItem} />
            )}
            keyExtractor={(index) => index.toString()}
          />
        )}

      {profileObject?.user_id === authContext?.entity?.uid && <View style={{ marginLeft: 15, marginRight: 15, flexDirection: 'row' }}>
        <Image
            style={styles.background}
            source={
              !authContext?.entity?.obj?.thumbnail
                ? images.profilePlaceHolder
                : { uri: authContext?.entity?.obj?.thumbnail }
            }
            resizeMode={'cover'}
          />
        {/* <TCTextField placeholder={'add a comment'}/> */}
        <View style={styles.textContainer}>
          <TextInput
              style={styles.textInput}
              placeholder={'add a comment'}
              placeholderTextColor={colors.userPostTimeColor}
              autoCapitalize={'none'}
              keyboardType={'default'}
              multiline={false}
              returnKeyType={'send'}
              onChangeText={(text) => setCommentText(text)}
              value={commentTxt}
              onSubmitEditing={handleSend}
              // textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
      </View>}

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
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    // marginHorizontal: 15,
    height: 45,
    marginLeft: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
    flex: 1,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
});

export default memo(ScorekeeperFeedPostItems);
