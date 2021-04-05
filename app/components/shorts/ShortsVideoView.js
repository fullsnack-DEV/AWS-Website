/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Text,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TextInput,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
// import ImageZoom from 'react-native-image-pan-zoom';

import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { createReaction, getReactions } from '../../api/NewsFeeds';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';

import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
import PostDescSection from '../newsFeed/PostDescSection';
import TagView from '../newsFeed/TagView';
import ShortsPlayer from './ShortsPlayer';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';
import WriteCommentItems from '../newsFeed/WriteCommentItems';

import ActivityLoader from '../loader/ActivityLoader';

function ShortsVideoView({
  multiAttachItem,
  index,
  navigation,
  caller_id,
  curruentViewIndex,
}) {
  const shareActionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [topDesc, setTopDesc] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [hideButton, setHideButton] = useState(true);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(
    multiAttachItem?.reaction_counts?.clap ?? 0,
  );

  const [commentCount, setCommentCount] = useState(
    multiAttachItem?.reaction_counts?.comment ?? 0,
  );
  const [ShowComment, setShowModelComment] = useState(false);
  const [animateModal, setanimateModal] = useState(false);

  // comment
  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);

  const videoItem = JSON.parse(multiAttachItem?.object)?.attachments[0];
  const profileItem = multiAttachItem?.actor?.data;
  const descriptionItem = JSON.parse(multiAttachItem?.object)?.text;
  const taggedItem = JSON.parse(multiAttachItem?.object)?.taggedData || [];

  const [bottomViewHeight, setBottomViewHeight] = useState();

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) => setKeyboardOffset(event.endCoordinates.height);
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

  console.log('videoItem:=>', multiAttachItem);

  useEffect(() => {
    likeSettings(likeCount, multiAttachItem?.own_reactions);
  }, []);

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

  const likeSettings = useCallback(
    (claps, ownReactions) => {
      let filterLike = [];
      if (claps !== 0) {
        setLikeCount(claps);
      }
      if (claps !== 0) {
        filterLike = (ownReactions?.clap || []).filter(
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
    },
    [caller_id],
  );

  const onShareActionSheetItemPress = ({ index: shareIndex }) => {
    if (shareIndex === 0) {
      Alert.alert('report video');
    } else if (shareIndex === 1) {
      Alert.alert('something went wrong video');
    }
  };

  const onProfilePress = useCallback(
    (obj) => {
      if (obj?.actor?.id) {
        if (obj?.actor?.id !== authContext?.entity?.uid) {
          navigation.navigate('HomeScreen', {
            uid: obj.actor.id,
            backButtonVisible: true,
            role:
              obj?.actor?.data?.entity_type === 'player'
                ? 'user'
                : obj?.actor?.data?.entity_type,
          });
        }
      }
    },
    [authContext?.entity?.uid, navigation],
  );

  useEffect(() => {
    const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
    const params = {
      activity_id: multiAttachItem?.id,
      reaction_type: 'comment',
    };
    getReactions(params, authContext)
      .then((response) => {
        setCommentData(response?.payload?.reverse());
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setloading(false);
      });
  }, []);

  let userImage = '';
  if (currentUserDetail && currentUserDetail.thumbnail) {
    userImage = currentUserDetail.thumbnail;
  }

  const renderComments = useCallback(
    ({ item }) => <WriteCommentItems data={item} />,
    [],
  );
  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Comments Yet</Text>
    </View>
  );

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setBottomViewHeight(height);
  };

  return (
    <View style={{ backgroundColor: colors.blackColor, flex: 1 }}>
      <View
        style={styles.mainViewContainer}>
        {!hideButton && (
          <View
            style={styles.playPauseContainer}>
            <Image
              source={!isPlay ? images.gamePause : images.gameStart}
              resizeMode={'contain'}
              style={{ height: 20, wodth: 12.5 }}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
          }}>
          <Image source={images.portraitVideoImage} resizeMode={'cover'} />
          <ShortsPlayer
            curruentIndex={index}
            curruentViewableIndex={curruentViewIndex}
            payPausedPressed={() => {
              setHideButton(false);
              setTimeout(() => setHideButton(true), 1000);
              setIsPlay(!isPlay);
            }}
            playPause={isPlay}
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

        <LinearGradient
          colors={[colors.blackLightOpacityColor, colors.blackOpacityColor]}
          style={[styles.overlayStyle, { height: bottomViewHeight + 120 }]}>
          <View style={{ flex: 1 }}>
            <ScrollView
            scrollEventThrottle={100}
              nestedScrollEnabled={true}
              style={
                topDesc
                  ? {
                      position: 'absolute',
                      height:
                        bottomViewHeight > Dimensions.get('window').height - 130
                          ? Dimensions.get('window').height - 130
                          : bottomViewHeight,
                      bottom: 0,
                    }
                  : {
                      position: 'absolute',
                      bottom: 0,
                      flex: 1,
              }
              }>
              <View onLayout={onLayout}>
                <View style={styles.mainContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => onProfilePress(multiAttachItem)}>
                    <View style={styles.backgroundProfileView}>
                      <Image
                        style={styles.background}
                        source={
                          !profileItem?.thumbnail
                            ? images.profilePlaceHolder
                            : { uri: profileItem?.thumbnail }
                        }
                        resizeMode={'cover'}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.userNameView}>
                    <Text
                      style={styles.userNameTxt}
                      onPress={() => onProfilePress(multiAttachItem)}>
                      {profileItem?.full_name}
                    </Text>
                    <Text style={styles.activeTimeAgoTxt}>
                      {commentPostTimeCalculate(multiAttachItem?.time, true)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      shareActionSheet.current.show();
                    }}>
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
                      descriptions={descriptionItem ?? ''}
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
                      descriptions={descriptionItem ?? ''}
                      character={50}
                      containerStyle={{ marginHorizontal: 12 }}
                      descriptionTxt={{ color: colors.whiteColor }}
                      onReadMorePress={() => {
                        if (descriptionItem.length > 50) {
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
              </View>
            </ScrollView>
          </View>
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
                  onPress={() => setShowModelComment(true)}
                  style={styles.imageTouchStyle}>
                  <Image
                    style={[styles.commentImage, { top: 2 }]}
                    source={images.commentImage}
                    resizeMode={'cover'}
                  />
                </TouchableOpacity>
                {commentCount > 0 && (
                  <Text style={styles.commentlengthStyle}>{commentCount}</Text>
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
                width: wp('32%'),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              {likeCount > 0 && (
                <Text
                  style={[
                    styles.commentlengthStyle,
                    {
                      color: like === true ? '#FF8A01' : colors.whiteColor,
                    },
                  ]}>
                  {likeCount}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (like) {
                    setLikeCount(likeCount - 1);
                  } else {
                    setLikeCount(likeCount + 1);
                  }
                  setLike(!like);
                  onLikePress(multiAttachItem);
                }}
                style={styles.imageTouchStyle}>
                <Image
                  style={styles.commentImage}
                  source={like ? images.likeImage : images.unlikeImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ActionSheet
          ref={shareActionSheet}
          // title={'News Feed Post'}
          options={['Report Video', 'Something went wrong', 'Cancel']}
          cancelButtonIndex={2}
          onPress={onShareActionSheetItemPress}
        />
        <SwipeUpDownModal
          modalVisible={ShowComment}
          PressToanimate={true}
          OpenModalDirection={'down'}
          PressToanimateDirection={'down'}
          // fade={true}
          ContentModal={
            <View style={{ flex: 1 }}>
              <TCThinDivider width={'100%'} height={1} />
              <FlatList
                data={commentData}
                renderItem={renderComments}
                keyExtractor={(item) => index.toString()}
                ListEmptyComponent={listEmptyComponent}
                style={{ marginBottom: 100 }}
              />

              <SafeAreaView
                style={[
                  styles.bottomSafeAreaStyle,
                  { bottom: keyboardOffset, position: 'absolute' },
                ]}>
                {/* <View style={styles.bottomSperateLine} /> */}
                <View style={styles.bottomImgView}>
                  <View style={styles.commentReportView}>
                    <Image
                      source={
                        userImage ? { uri: userImage } : images.profilePlaceHolder
                      }
                      resizeMode={'cover'}
                      style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
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
                            activity_id: multiAttachItem?.id,
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
                        }}>
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
                  setanimateModal(false);
                }}>
                <Text>Comments</Text>
              </TouchableOpacity>
            </View>
          }
          onClose={() => {
            setShowModelComment(false);
            setanimateModal(false);
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginLeft: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  userNameTxt: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: 15,
    width: wp('70%'),
  },
  activeTimeAgoTxt: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    top: 2,
  },
  background: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  backgroundProfileView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 88,
    height: 44,
    width: 44,
    backgroundColor: colors.whiteColor,
  },
  commentImage: {
    height: 32,
    width: 32,
    alignSelf: 'flex-end',
  },
  commentShareLikeView: {
    flexDirection: 'row',
    margin: 15,
    marginVertical: '2%',
    alignSelf: 'center',
    marginBottom: 40,
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
  overlayStyle: {
    paddingTop: 15,
    position: 'absolute',
    bottom: 0,
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
    shadowOffset: { width: 0, height: 1 },
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
  playPauseContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.blackOpacityColor,
    zIndex: 100,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainViewContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default ShortsVideoView;
