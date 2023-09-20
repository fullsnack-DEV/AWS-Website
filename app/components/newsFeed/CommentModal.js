import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import {format} from 'react-string-format';
import ParsedText from 'react-native-parsed-text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import {
  createReaction,
  getReactions,
  deleteReactions,
  createCommentReaction,
  getNextReactions,
} from '../../api/NewsFeeds';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import WriteCommentItems from './WriteCommentItems';
import SwipeableRow from '../gameRecordList/SwipeableRow';
import ReportCommentModal from './ReportCommentModal';
import Verbs from '../../Constants/Verbs';
import CustomModalWrapper from '../CustomModalWrapper';
import {strings} from '../../../Localization/translation';
import GroupIcon from '../GroupIcon';
import ActivityLoader from '../loader/ActivityLoader';
import LikersModal from '../modals/LikersModal';
import {ModalTypes, tagRegex} from '../../Constants/GeneralConstants';

const SwipeOptions = [
  {
    key: Verbs.reply,
    fillColor: [colors.greenGradientEnd, colors.greenGradientStart],
    image: images.replyIcon,
  },
  {
    key: Verbs.report,
    fillColor: [colors.userPostTimeColor, colors.veryLightBlack],
    image: images.reportIcon,
  },
  {
    key: Verbs.delete,
    fillColor: [colors.themeColor, colors.darkThemeColor],
    image: images.deleteIcon,
  },
];

const CommentModal = ({
  postId,
  postOwnerId,
  showCommentModal = false,
  closeModal = () => {},
  onProfilePress = () => {},
  updateCommentCount = () => {},
  handleFollowUnfollow = () => {},
}) => {
  const reportCommentModalRef = useRef(null);
  const authContext = useContext(AuthContext);
  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [selectedCommentData, setSelectedCommentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [replyParams, setReplyParams] = useState({});
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState({});
  const [showAllRepliesOfReply, setShowAllRepliesOfReply] = useState(false);

  const inputRef = useRef();

  const fetchReactions = useCallback(() => {
    setIsMoreLoading(true);
    const params = {
      activity_id: postId,
      reaction_type: Verbs.comment,
    };

    getReactions(params, authContext)
      .then((response) => {
        setCommentData(response.payload);
        if (response.payload.length === 0 || response.payload.length < 5) {
          setIsMoreLoading(false);
        }
      })
      .catch((e) => {
        setIsMoreLoading(false);
        Alert.alert('', e.messages);
      });
  }, [authContext, postId]);

  useEffect(() => {
    if (showCommentModal) {
      setShowAllReplies(false);
      fetchReactions();
    }
  }, [showCommentModal, fetchReactions]);

  useEffect(() => {
    if (replyParams.reaction_id) {
      let obj = {};
      commentData.forEach((e) => {
        if (e.id === replyParams.reaction_id) {
          obj = e;
        } else if (e.latest_children?.reply?.length > 0) {
          obj = e.latest_children?.reply.find(
            (item) => item.id === replyParams.reaction_id,
          );
        }
      });

      if (!obj) {
        setReplyParams({});
        const data = commentTxt.split(' ');
        const text = data
          .filter((item) => item.trim() !== replyingTo.formatted_tag.trim())
          .join(' ');
        setReplyingTo({});
        setCommentText(text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyParams.reaction_id, commentData, replyingTo.formatted_tag]);

  const onLikePress = ({data}) => {
    const bodyParams = {
      reaction_type: Verbs.like,
      activity_id: data?.activity_id,
      reaction_id: data?.id,
    };
    setLoading(true);
    setCommentText('');
    createCommentReaction(bodyParams, authContext)
      .then(() => {
        const params = {
          activity_id: postId,
          reaction_type: Verbs.comment,
        };
        getReactions(params, authContext)
          .then((response) => {
            setLoading(false);
            setCommentData(response.payload.reverse());
          })
          .catch((e) => {
            Alert.alert('', e.messages);
            setLoading(false);
          });
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setLoading(false);
      });
  };

  const handleReply = (data = {}) => {
    const bodyParams = {
      reaction_type: Verbs.reply,
      activity_id: data.activity_id,
      reaction_id: data.id,
    };
    const tag = `@${data.user.data.full_name.replace(/ /g, '')} `;
    setReplyParams(bodyParams);
    setCommentText(tag);
    const obj = {
      formatted_tag: tag,
      entity_name: data.user.data.full_name,
    };
    setReplyingTo(obj);
    inputRef.current.focus();
  };

  const deleteComment = (data = {}) => {
    setLoading(true);
    deleteReactions(data.id, authContext)
      .then(() => {
        const filtered = commentData.filter((e) => e.id !== data.id);
        setCommentData(filtered);
        updateCommentCount({
          id: postId,
          count: filtered?.length,
          data: filtered,
        });
        fetchReactions();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert('', e.messages);
      });
  };

  const onCommentOptionsPress = (key, data) => {
    switch (key) {
      case Verbs.reply:
        handleReply(data);
        break;

      case Verbs.report:
        reportCommentModalRef.current.open();
        break;

      case Verbs.delete:
        deleteComment(data);
        break;

      default:
        break;
    }
  };

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{strings.noCommentsYetText}</Text>
    </View>
  );

  const handleComment = () => {
    const bodyParams = {
      reaction_type: Verbs.comment,
      activity_id: postId,
      data: {
        text: commentTxt,
      },
    };
    setLoading(true);
    setCommentText('');
    createReaction(bodyParams, authContext)
      .then((response) => {
        const dataOfComment = [...commentData];
        dataOfComment.unshift(response.payload);
        setCommentData([...dataOfComment]);
        updateCommentCount({
          id: postId,
          count: dataOfComment?.length,
          data: response?.payload,
        });
        setLoading(false);
        if (commentData.length > 5) {
          setIsMoreLoading(true);
          onEndReached();
        } else {
          fetchReactions();
        }
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setLoading(false);
      });
  };

  const handleCommentReply = () => {
    const body = {
      ...replyParams,
      data: {
        text: commentTxt,
      },
    };

    setLoading(true);
    setCommentText('');
    createCommentReaction(body, authContext)
      .then(() => {
        setReplyParams({});
        setLoading(false);
        if (commentData.length > 5) {
          setIsMoreLoading(true);
          onEndReached();
        } else {
          fetchReactions();
        }
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setReplyParams({});
        setLoading(false);
      });
  };

  const renderTagText = useCallback(
    (matchingString) => (
      <Text style={styles.tagText}>{`${matchingString}`}</Text>
    ),
    [],
  );

  const getOptions = (data = {}, isReplyOfReply = false) => {
    const options = [...SwipeOptions];

    let optionList = [];
    if (data.user_id === authContext.entity.uid) {
      optionList = options.filter((option) => option.key !== Verbs.report);
    } else if (postOwnerId !== authContext.entity.uid) {
      optionList = options.filter((option) => option.key !== Verbs.delete);
    } else {
      optionList = [...options];
    }

    let finalList = [...optionList];
    if (isReplyOfReply) {
      finalList = optionList.filter((option) => option.key !== Verbs.reply);
    }

    return finalList.reverse();
  };

  const renderRepliesOfReply = (list = []) => {
    let repliesList = [];
    if (showAllRepliesOfReply) {
      repliesList = [...list];
    } else if (list.length > 0) {
      repliesList.push(list[0]);
    }
    return (
      <View style={{marginTop: 10}}>
        <View
          style={[
            styles.repliesContainer,
            list.length > 1 ? {marginBottom: 10} : {},
          ]}>
          {repliesList.map((reply, index) => (
            <SwipeableRow
              key={index}
              scaleEnabled={false}
              showLabel={false}
              buttons={getOptions(reply, true)}
              onPress={(key) => onCommentOptionsPress(key, reply)}>
              <WriteCommentItems
                data={reply}
                containerStyle={[
                  {paddingLeft: 10},
                  index === repliesList.length - 1 ? {marginBottom: 0} : {},
                ]}
                onProfilePress={onProfilePress}
                onLikePress={() => onLikePress({data: reply})}
                showLikesModal={() => {
                  setSelectedCommentData(reply);
                  setShowLikeModal(true);
                }}
                showReplyButton={false}
              />
            </SwipeableRow>
          ))}
        </View>
        {list.length > 1 && !showAllRepliesOfReply && (
          <View style={styles.replyBottomView}>
            <View style={styles.hrBar} />
            <TouchableOpacity
              onPress={() => {
                setShowAllRepliesOfReply(true);
              }}>
              <Text style={styles.viewMoreText}>
                {format(strings.viewMoreReplies, list.length - 1)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderReplies = (list = []) => {
    let repliesList = [];
    if (showAllReplies) {
      repliesList = [...list];
    } else if (list.length > 0) {
      repliesList.push(list[0]);
    }

    return (
      <>
        <View
          style={[
            styles.repliesContainer,
            list.length > 1 ? {marginBottom: 10} : {},
          ]}>
          {repliesList.map((reply, index) => (
            <View key={index}>
              <SwipeableRow
                scaleEnabled={false}
                showLabel={false}
                buttons={getOptions(reply)}
                onPress={(key) => onCommentOptionsPress(key, reply)}>
                <WriteCommentItems
                  data={reply}
                  containerStyle={[
                    {paddingLeft: 10},
                    index === repliesList.length - 1 ? {marginBottom: 0} : {},
                  ]}
                  onProfilePress={onProfilePress}
                  onLikePress={() => onLikePress({data: reply})}
                  onReply={() => {
                    handleReply(reply);
                  }}
                  showLikesModal={() => {
                    setSelectedCommentData(reply);
                    setShowLikeModal(true);
                  }}
                />
              </SwipeableRow>
              {reply.latest_children?.reply?.length > 0
                ? renderRepliesOfReply(reply.latest_children.reply)
                : null}
            </View>
          ))}
        </View>
        {list.length > 1 && !showAllReplies && (
          <View style={styles.replyBottomView}>
            <View style={styles.hrBar} />
            <TouchableOpacity
              onPress={() => {
                setShowAllReplies(true);
              }}>
              <Text style={styles.viewMoreText}>
                {format(strings.viewMoreReplies, list.length - 1)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderComments = ({item: data}) => (
    <View>
      <SwipeableRow
        scaleEnabled={false}
        showLabel={false}
        buttons={getOptions(data)}
        onPress={(key) => onCommentOptionsPress(key, data)}>
        <WriteCommentItems
          data={data}
          onProfilePress={onProfilePress}
          onLikePress={() => onLikePress({data})}
          onReply={() => {
            handleReply(data);
          }}
          showLikesModal={() => {
            setSelectedCommentData(data);
            setShowLikeModal(true);
          }}
        />
      </SwipeableRow>
      {data.latest_children?.reply?.length > 0
        ? renderReplies(data.latest_children.reply)
        : null}
    </View>
  );

  const onEndReached = () => {
    if (!isMoreLoading) {
      setIsMoreLoading(false);
      return;
    }
    const params = {
      activity_id: postId,
      reaction_type: Verbs.comment,
    };

    const id_lt = commentData[commentData.length - 1]?.id;

    getNextReactions(params, id_lt, authContext)
      .then((response) => {
        if (response.payload.length === 0) {
          setIsMoreLoading(false);
        } else {
          setCommentData([...commentData, ...response.payload]);
        }
      })
      .catch((e) => {
        setIsMoreLoading(false);
        Alert.alert('', e.messages);
      });
  };

  return (
    <CustomModalWrapper
      isVisible={showCommentModal}
      modalType={ModalTypes.style2}
      closeModal={closeModal}
      containerStyle={{padding: 0, height: '97%'}}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerTitle}>{strings.comments}</Text>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        nestedScrollEnabled
        keyboardVerticalOffset={0}
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}>
        <ActivityLoader visible={loading} />
        <View style={{flex: 1}}>
          <FlatList
            data={commentData}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled
            renderItem={renderComments}
            ListEmptyComponent={listEmptyComponent}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            legacyImplementation={true}
            maxToRenderPerBatch={10}
            initialNumToRender={5}
            onEndReachedThreshold={0.3}
            onEndReached={onEndReached}
            ListFooterComponent={() =>
              isMoreLoading ? (
                <View>
                  <ActivityIndicator size={'small'} />
                </View>
              ) : null
            }
          />
        </View>

        <View style={styles.bottomContainer}>
          {replyParams?.activity_id ? (
            <View
              style={[
                styles.row,
                {justifyContent: 'space-between', marginBottom: 11},
              ]}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.replyingToText} numberOfLines={1}>
                  Replying to {replyingTo.entity_name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.crossIcon}
                onPress={() => {
                  setReplyParams({});
                  const tags = commentTxt?.match(tagRegex);
                  const words = commentTxt.split(' ');
                  const finalWords = words.filter((item) => item !== tags[0]);
                  setCommentText(finalWords.join(' '));
                }}>
                <Image
                  source={images.crossImage}
                  style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.row}>
            <GroupIcon
              imageUrl={authContext.entity.obj.thumbnail}
              groupName={authContext.entity.obj.group_name}
              entityType={authContext.entity.obj.entity_type}
              containerStyle={styles.profileIcon}
            />
            <View style={styles.inputContainer}>
              <TextInput
                textAlignVertical="center"
                placeholder={strings.leaveComment}
                placeholderTextColor={colors.userPostTimeColor}
                ref={inputRef}
                onChangeText={(text) => {
                  setCommentText(text);
                  if (!text) {
                    setReplyParams({});
                  }
                }}
                style={styles.writeCommectStyle}>
                <ParsedText
                  parse={[{pattern: tagRegex, renderText: renderTagText}]}
                  childrenProps={{allowFontScaling: false}}>
                  {commentTxt}
                </ParsedText>
              </TextInput>
              {commentTxt.trim().length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    if (replyParams.activity_id) {
                      handleCommentReply();
                    } else {
                      handleComment();
                    }
                  }}
                  style={{paddingLeft: 7}}>
                  <Text style={styles.sendTextStyle}>
                    {strings.send.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ReportCommentModal
        commentData={selectedCommentData}
        reportCommentModalRef={reportCommentModalRef}
      />
      <LikersModal
        data={selectedCommentData}
        showLikeModal={showLikeModal}
        closeModal={() => setShowLikeModal(false)}
        onClickProfile={(obj = {}) => {
          onProfilePress({
            userId: obj.user_id,
            entityType: obj.user.data.entity_type,
          });
        }}
        handleFollowUnfollow={handleFollowUnfollow}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  sendTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.themeColor,
    fontFamily: fonts.RMedium,
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
    marginTop: '20%',
  },
  headerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  writeCommectStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
  },
  bottomContainer: {
    padding: 15,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    borderTopColor: colors.grayBackgroundColor,
    borderTopWidth: 0.5,
    marginVertical: Platform.OS === 'android' ? 0 : 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.tagColor,
    fontFamily: fonts.RRegular,
  },
  repliesContainer: {
    marginLeft: 30,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.grayBackgroundColor,
  },
  viewMoreText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
  hrBar: {
    width: 25,
    height: 1,
    marginHorizontal: 10,
    backgroundColor: colors.userPostTimeColor,
  },
  replyBottomView: {
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  replyingToText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crossIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommentModal;
