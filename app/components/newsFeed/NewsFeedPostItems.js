/* eslint-disable no-useless-escape */
import React, {
  useCallback,
  memo,
  useEffect,
  useRef,
  useState,
  useMemo,
  useContext,
} from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Text} from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import Share from 'react-native-share';
// import Clipboard from '@react-native-community/clipboard';
import Carousel from 'react-native-snap-carousel';
import Clipboard from '@react-native-community/clipboard';
import images from '../../Constants/ImagePath';
import SingleImage from './SingleImage';
import VideoPost from './VideoPost';
import PostImageSet from './PostImageSet';
import MultiPostVideo from './MultiPostVideo';
import NewsFeedDescription from './NewsFeedDescription';
import {commentPostTimeCalculate} from '../../Constants/LoaderImages';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import CommentModal from './CommentModal';
import LikersModal from '../modals/LikersModal';
import CustomURLPreview from '../account/CustomURLPreview';
import {getHitSlop} from '../../utils';
import {createRePost} from '../../api/NewsFeeds';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';

const NewsFeedPostItems = memo(
  ({
    currentParentIndex,
    parentIndex,
    navigation,
    item,
    onLikePress,
    caller_id,
    onDeletePost,
    onImageProfilePress,
    onEditPressDone,
    updateCommentCount,
    isNewsFeedScreen,
    openProfilId,
  }) => {
    const likersModalRef = useRef(null);
    const commentModalRef = useRef(null);
    const authContext = useContext(AuthContext);
    const [childIndex, setChildIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [showThreeDot, setShowThreeDot] = useState(false);
    const [myItem, setMyItem] = useState();
    const [attachedImages, setAttachedImages] = useState([]);
    const [descriptions, setDescriptions] = useState('');

    useEffect(() => {
      let filterLike = [];
      if (item?.reaction_counts?.clap !== undefined) {
        setLikeCount(item?.reaction_counts?.clap);
      }
      if (item?.reaction_counts?.comment !== undefined) {
        setCommentCount(item?.reaction_counts?.comment ?? 0);
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
      setShowThreeDot(
        item?.ownerId === caller_id || item?.foreign_id === caller_id,
      );
      let dummyItem = {};
      if (typeof item?.object === 'string') {
        if (JSON.parse(item.object)?.activity) {
          const temp = JSON.parse(item.object)?.activity;
          dummyItem = {...JSON.parse(temp.object), ...JSON.parse(item.object)};
        } else {
          dummyItem = JSON.parse(item.object);
        }
      } else {
        dummyItem = item.object;
      }
      setMyItem({...dummyItem});

      if (dummyItem) {
        if (
          dummyItem?.attachments !== undefined &&
          dummyItem?.attachments?.length > 0
        ) {
          setAttachedImages([...dummyItem?.attachments]);
        }
        setDescriptions(dummyItem?.text);
      }
    }, [caller_id, item]);

    // useEffect(() => {
    //   renderURLPreview()
    // }, [descriptions])

    const actionSheet = useRef();
    const shareActionSheet = useRef();

    const RenderSinglePostItems = useCallback(
      (attachItem) => {
        if (attachItem?.type === 'image') {
          return (
            <SingleImage
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
        if (attachItem?.type === 'video') {
          return (
            <VideoPost
              currentParentIndex={currentParentIndex}
              parentIndex={parentIndex}
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
      },
      [
        caller_id,
        currentParentIndex,
        item,
        myItem,
        navigation,
        onImageProfilePress,
        onLikePress,
        parentIndex,
        updateCommentCount,
      ],
    );

    const renderMultiplePostItems = useCallback(
      ({item: multiAttachItem, index}) => {
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
              parentIndex={parentIndex}
              currentParentIndex={currentParentIndex}
              childIndex={childIndex}
              currentChildIndex={index}
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
      },
      [
        attachedImages,
        caller_id,
        childIndex,
        currentParentIndex,
        item,
        navigation,
        onImageProfilePress,
        onLikePress,
        parentIndex,
        updateCommentCount,
      ],
    );

    const onNewsFeedLikePress = useCallback(() => {
      if (like) setLikeCount((likeCnt) => likeCnt - 1);
      else setLikeCount((likeCnt) => likeCnt + 1);
      setLike((isLIKE) => !isLIKE);
      onLikePress();
    }, [like, onLikePress]);

    const rePostCall = useCallback(() => {
      const temp = {
        ...JSON.parse(item.object),
      };

      const body = {
        ...temp,
        activity_id: item.id,
      };
      createRePost(body, authContext)
        .then((response) => {
          console.log('reposted post', response);
          console.log('repost object', JSON.parse(response.payload.object));
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }, [authContext, item.id, item.object]);

    const onActionSheetItemPress = useCallback(
      (index) => {
        if (index === 0) {
          navigation.navigate('EditPostScreen', {
            data: item,
            onPressDone: onEditPressDone,
          });
        } else if (index === 1) {
          onDeletePost();
        }
      },
      [item, navigation, onDeletePost, onEditPressDone],
    );

    const onShareActionSheetItemPress = useCallback(
      (index) => {
        if (index === 1) {
          authContext.showAlert({visible: true});
          Clipboard.setString(descriptions);
        } else if (index === 2) {
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
        }
        if (index === 0) {
          rePostCall();
        }
      },
      [authContext, descriptions, rePostCall],
    );

    const renderProfileInfo = useMemo(
      () => (
        <View style={styles.mainContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onImageProfilePress}
            style={styles.imageMainContainer}>
            <Image
              style={styles.background}
              source={
                !item?.actor?.data?.full_image
                  ? images.profilePlaceHolder
                  : {uri: item?.actor?.data?.full_image}
              }
              resizeMode={'cover'}
            />
          </TouchableOpacity>
          <View style={styles.userNameView}>
            <Text
              numberOfLines={1}
              style={styles.userNameTxt}
              onPress={onImageProfilePress}>
              {item?.actor?.data?.full_name}
            </Text>
            <Text style={styles.activeTimeAgoTxt}>
              {commentPostTimeCalculate(item?.time, true)}
            </Text>
          </View>

          {showThreeDot && (
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.dotImageTouchStyle}
              onPress={() => {
                actionSheet.current.show();
              }}>
              <Image
                style={styles.dotImageStyle}
                source={images.threeDotIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
      [
        item?.actor?.data?.full_image,
        item?.actor?.data?.full_name,
        item?.time,
        onImageProfilePress,
        showThreeDot,
      ],
    );

    const renderURLPreview = useMemo(() => {
      const obj =
        typeof item?.object === 'string'
          ? JSON.parse(item?.object)
          : item?.object;
      return <CustomURLPreview text={obj?.text} />;
    }, [item?.object]);

    const renderDescription = useMemo(
      () => (
        <NewsFeedDescription
          descriptions={descriptions}
          // character={attachedImages?.length > 0 ? 140 : 480}
          numberOfLineDisplay={attachedImages?.length > 0 ? 3 : 14}
          tagData={myItem?.format_tagged_data ?? []}
          navigation={navigation}
          isNewsFeedScreen={isNewsFeedScreen}
          openProfilId={openProfilId}
        />
      ),
      [
        attachedImages?.length,
        descriptions,
        isNewsFeedScreen,
        myItem?.format_tagged_data,
        navigation,
        openProfilId,
      ],
    );

    const renderRepost = useMemo(
      () => (
        <View style={{flexDirection: 'row'}}>
          {myItem?.post_type === 'repost' && (
            <>
              <View style={{flex: 1}}>
                {renderProfileInfo}
                <NewsFeedDescription
                  descriptions={descriptions}
                  numberOfLineDisplay={attachedImages?.length > 0 ? 3 : 14}
                  tagData={myItem?.format_tagged_data ?? []}
                  navigation={navigation}
                  isNewsFeedScreen={isNewsFeedScreen}
                  openProfilId={openProfilId}
                />
              </View>
            </>
          )}
        </View>
      ),
      [
        attachedImages?.length,
        descriptions,
        isNewsFeedScreen,
        myItem?.format_tagged_data,
        myItem?.post_type,
        navigation,
        openProfilId,
        renderProfileInfo,
      ],
    );
    const onWriteCommentPress = useCallback(() => {
      commentModalRef.current.open();
    }, []);

    const renderPost = useMemo(() => {
      const myData = myItem?.post_type === 'repost' ? myItem?.activity : item;
      return (
        <View>
          <View style={{flexDirection: 'row', flex: 1}}>
            {myItem?.post_type === 'repost' && (
              <View
                style={{
                  width: 2,
                  marginLeft: 15,
                  marginRight: 5,
                  backgroundColor: colors.grayBackgroundColor,
                }}
              />
            )}
            <View style={{flex: 1}}>
              <View
                style={
                  myItem?.post_type === 'repost'
                    ? styles.mainRepostContainer
                    : styles.mainContainer
                }>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={onImageProfilePress}
                  style={styles.imageMainContainer}>
                  <Image
                    style={styles.background}
                    source={
                      !myData?.actor?.data?.full_image
                        ? images.profilePlaceHolder
                        : {uri: myData?.actor?.data?.full_image}
                    }
                    resizeMode={'cover'}
                  />
                </TouchableOpacity>
                <View style={styles.userNameView}>
                  <Text
                    numberOfLines={1}
                    style={styles.userNameTxt}
                    onPress={onImageProfilePress}>
                    {myData?.actor?.data?.full_name}
                  </Text>
                  <Text style={styles.activeTimeAgoTxt}>
                    {commentPostTimeCalculate(myData?.time, true)}
                  </Text>
                </View>

                {showThreeDot && myItem?.post_type !== 'repost' && (
                  <TouchableOpacity
                    hitSlop={getHitSlop(15)}
                    style={styles.dotImageTouchStyle}
                    onPress={() => {
                      actionSheet.current.show();
                    }}>
                    <Image
                      style={styles.dotImageStyle}
                      source={images.threeDotIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{flex: 1}}>
                {attachedImages && attachedImages?.length === 1 ? (
                  <>{RenderSinglePostItems(attachedImages?.[0])}</>
                ) : (
                  <Carousel
                    onSnapToItem={setChildIndex}
                    data={attachedImages}
                    renderItem={renderMultiplePostItems}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    sliderWidth={wp(100)}
                    itemWidth={wp(94)}
                  />
                )}
                {renderURLPreview}
                {renderDescription}
              </View>
              <View style={{marginTop: 10, marginLeft: 10}} />
            </View>
          </View>
          <View style={styles.commentShareLikeView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                flex: 1,
              }}>
              <TouchableOpacity
                onPress={onWriteCommentPress}
                style={{
                  flexDirection: 'row',
                  marginRight: 25,
                  flex: 0.5,
                }}>
                <View style={styles.imageTouchStyle}>
                  <Image
                    style={styles.commentImage}
                    source={images.commentImage}
                    resizeMode={'contain'}
                  />
                </View>
                <Text style={styles.commentlengthStyle}>
                  {commentCount > 0 ? commentCount : ''}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 0.5,
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
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginLeft: 20,
              }}>
              <TouchableOpacity
                style={{marginRight: 5}}
                onPress={() => {
                  console.log('Like obj:=>', item);
                  likersModalRef.current.open();
                }}>
                <Text
                  style={[
                    styles.commentlengthStyle,
                    {
                      color:
                        like === true ? '#FF8A01' : colors.reactionCountColor,
                    },
                  ]}>
                  {likeCount <= 0 ? '' : likeCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onNewsFeedLikePress}
                style={styles.imageTouchStyle}>
                <Image
                  style={styles.commentImage}
                  source={like ? images.likeImage : images.unlikeImage}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }, [
      RenderSinglePostItems,
      attachedImages,
      commentCount,
      item,
      like,
      likeCount,
      myItem?.activity,
      myItem?.post_type,
      onImageProfilePress,
      onNewsFeedLikePress,
      onWriteCommentPress,
      renderDescription,
      renderMultiplePostItems,
      renderURLPreview,
      showThreeDot,
    ]);

    console.log('ittttttm', myItem);
    return (
      <View style={{flex: 1, marginBottom: 15}}>
        {renderRepost}
        {renderPost}
        <LikersModal
          likersModalRef={likersModalRef}
          navigation={navigation}
          data={item}
        />
        <CommentModal
          navigation={navigation}
          commentModalRef={commentModalRef}
          item={item}
          updateCommentCount={(updatedCommentData) => {
            updateCommentCount(updatedCommentData);
            setCommentCount(updatedCommentData?.count);
          }}
        />
        <ActionSheet
          ref={actionSheet}
          title={'News Feed Post'}
          options={['Edit Post', 'Delete Post', strings.cancel]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={onActionSheetItemPress}
        />

        <ActionSheet
          ref={shareActionSheet}
          title={'News Feed Post'}
          options={['Repost', 'Copy Link', 'More', strings.cancel]} // ['Repost', 'Copy Link', 'More', strings.cancel]
          cancelButtonIndex={3}
          onPress={onShareActionSheetItemPress}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    top: 2,
  },
  background: {
    borderRadius: 50,
    height: 36,
    width: 36,
  },
  commentImage: {
    height: 20,
    width: 20,
    alignSelf: 'flex-end',
  },
  commentShareLikeView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  commentlengthStyle: {
    marginLeft: 5,
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  dotImageStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.googleColor,
  },
  dotImageTouchStyle: {
    paddingLeft: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  mainRepostContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 15,
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flex: 1,
    // width: '70%',
  },
  imageMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    height: 40,
    width: 40,
    backgroundColor: colors.whiteColor,
    borderRadius: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default NewsFeedPostItems;
