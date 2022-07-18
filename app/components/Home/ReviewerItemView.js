/* eslint-disable consistent-return */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  TextInput,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import {createReaction, getReactions} from '../../api/NewsFeeds';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import PostDescription from './PostDescription';
import TCThinDivider from '../TCThinDivider';
import WriteCommentItems from '../newsFeed/WriteCommentItems';
import AuthContext from '../../auth/context';

function ReviewerItemView({
  item,
  onImageProfilePress,
  indexNumber,
  feedIndex,
  gameData,
  totalData,
  onReadMorePress,
  onFeedPress,
}) {
  console.log('ITEM:------:=>', item);
  const authContext = useContext(AuthContext);
  const videoPlayerRef = useRef();
  const [reviewObj, setReviewObj] = useState();
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [ShowComment, setShowModelComment] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [commentTxt, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(
    item?.reaction_counts?.comment ?? 0,
  );
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.reaction_counts?.clap ?? 0);

  const actionSheet = useRef();
  let attachedImages = [];
  if (reviewObj?.attachments) {
    attachedImages = reviewObj.attachments;
  }

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow,
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  useEffect(() => {
    const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
    const params = {
      activity_id: item?.id,
      reaction_type: 'comment',
    };
    getReactions(params, authContext)
      .then((response) => {
        setCommentData(response?.payload?.reverse());
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  }, [authContext, item?.id]);

  useEffect(() => {
    console.log('review ooo::=>', JSON.parse(item?.object)?.playerReview);
    setReviewObj(
      JSON.parse(item?.object)?.refereeReview ||
        JSON.parse(item?.object)?.scorekeeperReview ||
        JSON.parse(item?.object)?.playerReview ||
        JSON.parse(item?.object)?.gameReview,
    );
  }, [item]);

  const likeSettings = useCallback(
    (claps, ownReactions) => {
      let filterLike = [];
      if (claps !== 0) {
        setLikeCount(claps);
      }
      if (claps !== 0) {
        filterLike = (ownReactions?.clap || []).filter(
          (clapItem) => clapItem.user_id === authContext?.entity?.uid,
        );
        if (filterLike.length > 0) {
          setLike(true);
        } else {
          setLike(false);
        }
      } else {
        setLike(false);
      }
    },
    [authContext?.entity?.uid],
  );

  useEffect(() => {
    likeSettings(likeCount, item?.own_reactions);
  }, [item?.own_reactions, likeCount, likeSettings]);

  const onLikePress = useCallback(
    (obj) => {
      const bodyParams = {
        reaction_type: 'clap',
        activity_id: obj.id,
      };
      createReaction(bodyParams, authContext).catch((e) => {
        Alert.alert('', e.messages);
      });
    },
    [authContext],
  );

  const isAdmin = () => {
    console.log('gameData:=>', gameData);
    console.log('Home:', gameData?.home_team?.id);
    console.log('Away:', gameData?.away_team?.id);
    console.log(
      'Curruent :',
      currentUserDetail?.group_id ?? currentUserDetail?.user_id,
    );
    if (
      gameData?.home_team?.id ===
      (currentUserDetail?.group_id ?? currentUserDetail?.user_id)
    ) {
      return true;
    }
    if (
      gameData?.away_team?.id ===
      (currentUserDetail?.group_id ?? currentUserDetail?.user_id)
    ) {
      return true;
    }
    return false;
  };
  const getTeamData = () => {
    const obj = {};
    if (reviewObj?.member === 'home') {
      obj.name = item?.home_team?.data?.full_name;
      obj.image = item?.home_team?.data?.full_image ?? null;
      return obj;
    }
    if (reviewObj?.member === 'away') {
      obj.name = item?.away_team?.data?.full_name;
      obj.image = item?.away_team?.data?.full_image ?? null;
      return obj;
    }
    if (reviewObj?.member === 'referee') {
      obj.name = 'Referee';
      obj.image = images.referePH;
      return obj;
    }
    if (reviewObj?.member === 'scorekeeper') {
      obj.name = 'Scorekeeper';
      obj.image = images.scorekeeperPH;
      return obj;
    }
    if (reviewObj?.member === 'opponent') {
      obj.name = 'Opponent';
      obj.image = images.scorekeeperPH;
      return obj;
    }
    if (reviewObj?.member === 'both') {
      obj.home_image = item?.home_team?.data?.full_image ?? null;
      obj.away_image = item?.away_team?.data?.full_image ?? null;
      return obj;
    }
  };

  const renderComments = useCallback(
    ({item: comments}) => <WriteCommentItems data={comments} />,
    [],
  );
  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Comments Yet</Text>
    </View>
  );
  return (
    // <TouchableOpacity
    //   onPress={() => onFeedPress(item, feedIndex, gameData, indexNumber, false)
    //   }>
    <View>
      <View style={styles.containerStyle}>
        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onImageProfilePress}>
            <Image
              style={styles.background}
              source={
                item?.actor?.data?.full_image
                  ? {uri: item?.actor?.data?.full_image}
                  : images.profilePlaceHolder
              }
              resizeMode={'cover'}
            />
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text style={styles.userNameTxt} onPress={onImageProfilePress}>
              {item?.actor?.data?.full_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}
            >
              <Text style={styles.activeTimeAgoTxt}>
                {moment(new Date(reviewObj?.created_at * 1000)).format(
                  'MMM DD',
                )}
              </Text>

              {reviewObj?.member !== 'both' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.eventImageViewStyle}>
                    <Image
                      source={
                        (reviewObj?.member === 'home' &&
                          (getTeamData()?.image
                            ? {uri: getTeamData()?.image}
                            : images.teamPlaceholder)) ||
                        (reviewObj?.member === 'away' &&
                          (getTeamData()?.image
                            ? {uri: getTeamData()?.image}
                            : images.teamPlaceholder)) ||
                        (reviewObj?.member === 'referee' &&
                          getTeamData()?.image) ||
                        (reviewObj?.member === 'scorekeeper' &&
                          getTeamData()?.image) ||
                        (reviewObj?.member === 'opponent' &&
                          getTeamData()?.image)
                      }
                      style={styles.imageStyle}
                      resizeMode={'contain'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.activeTimeAgoTxt,
                      {fontSize: 12, fontFamily: fonts.RMedium},
                    ]}
                  >
                    {getTeamData()?.name}
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.eventImageViewStyle}>
                    <Image
                      source={
                        getTeamData()?.home_image
                          ? {uri: getTeamData()?.home_image}
                          : images.teamPlaceholder
                      }
                      style={styles.imageStyle}
                      resizeMode={'contain'}
                    />
                  </View>
                  <View style={styles.eventImageViewStyle}>
                    <Image
                      source={
                        getTeamData()?.away_image
                          ? {uri: getTeamData()?.away_image}
                          : images.teamPlaceholder
                      }
                      style={styles.imageStyle}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.dotImageTouchStyle}
            onPress={() => {
              actionSheet.current.show();
            }}
          >
            <Image
              style={styles.dotImageStyle}
              source={images.dotImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View>
          <PostDescription
            descriptions={reviewObj?.comment ?? ''}
            character={125}
            containerStyle={{marginHorizontal: 12}}
            onReadMorePress={onReadMorePress}
          />
          {attachedImages.length > 0 && (
            <View style={styles.mainImageView}>
              {attachedImages.length >= 1 &&
                attachedImages[0]?.type?.split('/')[0] === 'image' && (
                  <Image
                    source={{uri: attachedImages[0].thumbnail}}
                    style={styles.postImageStyle}
                    resizeMode={'cover'}
                  />
                )}
              {attachedImages.length >= 1 &&
                attachedImages[0]?.type?.split('/')[0] === 'video' && (
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
                        }}
                      />
                    </View>
                    <Video
                      ref={videoPlayerRef}
                      paused={false}
                      muted={true}
                      source={{uri: attachedImages[0].url}}
                      style={styles.uploadedImage}
                      resizeMode={'cover'}
                      onLoad={() => {
                        videoPlayerRef.current.seek(0);
                      }}
                    />
                  </View>
                )}
              {attachedImages.length >= 2 &&
                attachedImages[1]?.type?.split('/')[0] === 'image' && (
                  <Image
                    source={{uri: attachedImages[1].thumbnail}}
                    style={styles.postImageStyle}
                    resizeMode={'cover'}
                  />
                )}
              {attachedImages.length >= 2 &&
                attachedImages[1]?.type?.split('/')[0] === 'video' && (
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
                        }}
                      />
                    </View>
                    <Video
                      ref={videoPlayerRef}
                      paused={false}
                      muted={true}
                      source={{uri: attachedImages[1].url}}
                      style={styles.uploadedImage}
                      resizeMode={'cover'}
                      onLoad={() => {
                        videoPlayerRef.current.seek(0);
                      }}
                    />
                  </View>
                )}
              {attachedImages.length >= 3 &&
                attachedImages[2]?.type?.split('/')[0] === 'image' && (
                  <View style={styles.threePlusImageView}>
                    <Image
                      source={{uri: attachedImages[2].thumbnail}}
                      style={styles.postImageStyle}
                      resizeMode={'cover'}
                    />
                    {attachedImages.length > 3 && (
                      <Text style={styles.plusCountTextStyle}>
                        {attachedImages.length > 0
                          ? `+${attachedImages.length - 3}`
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
              {attachedImages.length >= 3 &&
                attachedImages[2]?.type?.split('/')[0] === 'video' && (
                  <View style={styles.threePlusImageView}>
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
                          }}
                        />
                      </View>
                      <Video
                        ref={videoPlayerRef}
                        paused={false}
                        muted={true}
                        source={{uri: attachedImages[2].url}}
                        style={styles.uploadedImage}
                        resizeMode={'cover'}
                        onLoad={() => {
                          videoPlayerRef.current.seek(0);
                        }}
                      />
                    </View>
                    {attachedImages.length > 3 && (
                      <Text style={styles.plusCountTextStyle}>
                        {attachedImages.length > 0
                          ? `+${attachedImages.length - 3}`
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
            </View>
          )}

          <View style={{marginTop: 10, marginLeft: 10}}></View>

          <View style={styles.commentShareLikeView}>
            <View
              style={{
                flexDirection: 'row',
                width: wp('52%'),
              }}
            >
              <TouchableWithoutFeedback
                style={{
                  flexDirection: 'row',
                }}
                onPress={() => {
                  if (isAdmin()) {
                    setShowModelComment(true);
                  }
                }}
              >
                <Image
                  style={styles.commentImage}
                  source={images.commentImage}
                  resizeMode={'contain'}
                />
                <Text style={styles.commentlengthStyle}>
                  {commentCount > 0 ? commentCount : ' '}
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}
                onPress={() => Alert.alert('Share')}
              >
                <Image
                  style={styles.commentImage}
                  source={images.shareImage}
                  resizeMode={'contain'}
                />

                <Text style={styles.commentlengthStyle}>0</Text>
              </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback
              style={{
                flexDirection: 'row',
                width: wp('32%'),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                if (isAdmin()) {
                  if (like) {
                    setLikeCount(likeCount - 1);
                  } else {
                    setLikeCount(likeCount + 1);
                  }
                  setLike(!like);
                  onLikePress(item);
                }
              }}
            >
              {likeCount > 0 && (
                <Text
                  style={[
                    styles.commentlengthStyle,
                    {
                      color:
                        like === true ? colors.themeColor : colors.whiteColor,
                    },
                  ]}
                >
                  {likeCount}
                </Text>
              )}
              <Image
                style={styles.commentImage}
                source={like ? images.likeImage : images.unlikeImage}
                resizeMode={'contain'}
              />
            </TouchableWithoutFeedback>
          </View>
          <ActionSheet
            ref={actionSheet}
            options={['Report', 'Cancel']}
            cancelButtonIndex={1}
            // destructiveButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                Alert.alert('Report pressed');
              } else if (index === 1) {
                // onDeletePost();
              }
            }}
          />
        </View>
      </View>
      {totalData?.length > 2 && indexNumber === 2 && (
        <View style={styles.maxReviewImageView}>
          <Image
            source={images.themeGradientImage}
            style={styles.maxReviewImageStyle}
            resizeMode={'cover'}
          />
        </View>
      )}
      {totalData?.length > 2 && indexNumber === 2 && (
        <TouchableOpacity
          style={styles.maxReviewTouchStyle}
          onPress={() =>
            onFeedPress(item, feedIndex, gameData, indexNumber, true)
          }
        >
          <Text style={styles.maxCountTextStyle}>
            {totalData?.length > 2 && indexNumber === 2
              ? `+${totalData?.length - 2} `
              : ''}
          </Text>
          <Text style={styles.reviewsTextStyle}>reviews</Text>
        </TouchableOpacity>
      )}

      <SwipeUpDownModal
        modalVisible={ShowComment}
        PressToanimate={true}
        OpenModalDirection={'down'}
        PressToanimateDirection={'down'}
        // fade={true}
        ContentModal={
          <View style={{flex: 1}}>
            <TCThinDivider width={'100%'} height={1} />
            <FlatList
              data={commentData}
              renderItem={renderComments}
              keyExtractor={(index) => index.toString()}
              ListEmptyComponent={listEmptyComponent}
              style={{marginBottom: 100}}
            />

            <SafeAreaView
              style={[
                styles.bottomSafeAreaStyle,
                {bottom: keyboardOffset, position: 'absolute'},
              ]}
            >
              {/* <View style={styles.bottomSperateLine} /> */}
              <View style={styles.bottomImgView}>
                <View style={styles.commentReportView}>
                  <Image
                    source={
                      currentUserDetail?.thumbnail
                        ? {uri: currentUserDetail?.thumbnail}
                        : images.profilePlaceHolder
                    }
                    resizeMode={'cover'}
                    style={{width: 40, height: 40, borderRadius: 40 / 2}}
                  />
                </View>
                <View style={styles.onlyMeViewStyle}>
                  <TextInput
                    placeholder={'Write a comment'}
                    placeholderTextColor={colors.userPostTimeColor}
                    multiline={true}
                    textAlignVertical={'top'}
                    value={commentTxt}
                    onChangeText={(text) => setCommentText(text)}
                    style={{
                      textAlignVertical: 'center',
                      fontSize: 14,
                      lineHeight: 14,
                      width: wp('66%'),
                      marginHorizontal: '2%',
                      color: colors.lightBlackColor,
                      fontFamily: fonts.RRegular,
                      paddingVertical: 0,
                      paddingLeft: 8,
                      alignSelf: 'center',
                      maxHeight: hp(20),
                    }}
                  />
                  {commentTxt.trim().length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        const bodyParams = {
                          reaction_type: 'comment',
                          activity_id: item?.id,
                          data: {
                            text: commentTxt,
                          },
                        };
                        createReaction(bodyParams, authContext)
                          .then((response) => {
                            const dataOfComment = [...commentData];
                            dataOfComment.unshift(response.payload);
                            setCommentData(dataOfComment);
                            setCommentCount(dataOfComment.length);
                            setCommentText('');
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }}
                    >
                      <Text style={styles.sendTextStyle}>SEND</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </SafeAreaView>
          </View>
        }
        HeaderStyle={styles.headerContent}
        ContentModalStyle={styles.Modal}
        HeaderContent={
          <View style={styles.containerHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowModelComment(false);
              }}
            >
              <Text>{`Reply from ${
                authContext?.entity?.obj?.full_name ||
                authContext?.entity?.obj?.group_name
              }`}</Text>
            </TouchableOpacity>
          </View>
        }
        onClose={() => {
          setShowModelComment(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.whiteColor,
    marginTop: 2,
    marginHorizontal: 6,
    marginBottom: 6,
    borderRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    shadowColor: colors.lightBlackColor,
    elevation: 10,
  },
  activeTimeAgoTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
  },
  background: {
    borderRadius: hp('2.5%'),
    height: hp('5%'),
    width: hp('5%'),
  },
  commentImage: {
    height: 15,
    width: 15,
  },
  commentShareLikeView: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: '2%',
    marginBottom: 10,
  },
  commentlengthStyle: {
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginHorizontal: 5,
  },
  dotImageStyle: {
    height: 15,
    margin: wp('1.5%'),
    tintColor: colors.googleColor,
    width: 15,
  },
  dotImageTouchStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: 12,
    alignItems: 'center',
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('3%'),
    width: wp('63%'),
  },
  mainImageView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
  },
  plusCountTextStyle: {
    position: 'absolute',
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
  },
  postImageStyle: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(3),
    resizeMode: 'cover',
    marginRight: 5,
    // backgroundColor: 'red',
  },
  threePlusImageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  imageStyle: {
    width: 15,
    height: 15,
    borderRadius: 30,
  },
  maxReviewImageView: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 6,
    elevation: 10,
  },
  maxReviewImageStyle: {
    width: wp(100) - 36,
    borderRadius: 5,
  },
  maxReviewTouchStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100) - 36,
    bottom: 0,
    left: 6,
    top: 0,
    elevation: 10,
  },
  maxCountTextStyle: {
    fontSize: 60,
    fontFamily: fonts.RBold,
    left: 12,
    color: colors.whiteColor,
  },
  reviewsTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  uploadedImage: {
    borderRadius: wp('3%'),
    height: wp('28%'),
    marginVertical: '1%',
    width: wp('28%'),
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '60%',
  },

  containerHeader: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  headerContent: {
    marginTop: 55,
  },
  Modal: {
    backgroundColor: colors.whiteColor,
    marginTop: 110,
  },
  bottomImgView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    width: wp('92%'),
  },
  commentReportView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlyMeViewStyle: {
    alignItems: 'center',
    backgroundColor: colors.grayBackgroundColor,
    borderRadius: 6,
    flexDirection: 'row',
    marginHorizontal: wp('2%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
    width: wp('80%'),
  },
  sendTextStyle: {
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
  },
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: -3,
      width: 0,
    },
    width: '100%',
    elevation: 5,
  },
});

export default ReviewerItemView;
