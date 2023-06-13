import React, {
  useCallback,
  memo,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import {Alert, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import CommentModal from '../CommentModal';
import LikersModal from '../../modals/LikersModal';
// import {createRePost} from '../../../api/NewsFeeds';
import AuthContext from '../../../auth/context';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import BottomSheet from '../../modals/BottomSheet';
import FeedFooter from './FeedFooter';
import Post from './Post';
import PostForEvent from './PostForEvent';
import {getPostData} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';

const NewsFeedPostItems = memo(
  ({
    currentParentIndex,
    parentIndex,
    navigation,
    item = {},
    onLikePress,
    caller_id,
    onDeletePost,
    onImageProfilePress,
    onEditPressDone,
    updateCommentCount,
    isNewsFeedScreen,
    openProfilId,
    entityDetails = {},
    fetchFeeds = () => {},
  }) => {
    const commentModalRef = useRef(null);
    const authContext = useContext(AuthContext);
    const [childIndex, setChildIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [repostCount] = useState(0);
    const [showThreeDot, setShowThreeDot] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showLikeModal, setShowLikeModal] = useState(false);
    const [showShareOptionsModal, setShowShareOptionsModal] = useState(false);
    const [postType, setPostType] = useState('');

    useEffect(() => {
      let filterLike = [];
      if (item.reaction_counts?.clap) {
        setLikeCount(item.reaction_counts.clap ?? 0);
      }
      if (item.reaction_counts?.comment) {
        setCommentCount(item.reaction_counts.comment ?? 0);
      }
      if (item.own_reactions?.clap) {
        filterLike = (item.own_reactions.clap ?? []).filter(
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

      if (typeof item.object === 'string') {
        const obj = JSON.parse(item.object);
        if (obj) {
          setPostType(obj.post_type);
        }
      }
    }, [caller_id, item]);

    const actionSheet = useRef();

    const onNewsFeedLikePress = useCallback(() => {
      if (like) setLikeCount((likeCnt) => likeCnt - 1);
      else setLikeCount((likeCnt) => likeCnt + 1);
      setLike((isLIKE) => !isLIKE);
      onLikePress();
    }, [like, onLikePress]);

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

    const onShareActionSheetItemPress = (option) => {
      const options = {
        message: getPostData(item).text,
      };

      setShowShareOptionsModal(false);

      switch (option) {
        case strings.repost:
          navigation.navigate('LoneStack', {
            screen: 'WritePostScreen',
            params: {
              postData: entityDetails,
              selectedImageList: [],
              isRepost: true,
              repostData: {...item},
            },
          });
          break;

        case strings.copyLink:
          authContext.showAlert({visible: true});
          Clipboard.setString(getPostData(item).text);
          break;

        case strings.more:
          Share.open(options)
            .then((res) => {
              console.log('res :-', res);
            })
            .catch((err) => {
              console.log('err :-', err);
            });
          break;

        default:
          break;
      }
    };

    const onWriteCommentPress = useCallback(() => {
      setShowCommentModal(true);
    }, []);

    const handleFollowUnfollow = (
      userId,
      isFollowing = false,
      entityType = Verbs.entityTypePlayer,
    ) => {
      const params = {
        entity_type: entityType,
      };
      if (!isFollowing) {
        followUser(params, userId, authContext)
          .then(() => {
            fetchFeeds();
          })
          .catch((error) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error.message);
            }, 10);
          });
      } else {
        unfollowUser(params, userId, authContext)
          .then(() => {
            fetchFeeds();
          })
          .catch((error) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error.message);
            }, 10);
          });
      }
    };

    return (
      <View style={{paddingHorizontal: 15, paddingTop: 17, paddingBottom: 20}}>
        {postType === Verbs.eventVerb ? (
          <PostForEvent
            postData={item}
            onImageProfilePress={onImageProfilePress}
            showThreeDot={showThreeDot}
            onThreeDotPress={() => {
              actionSheet.current.show();
            }}
          />
        ) : (
          <Post
            item={item}
            onImageProfilePress={onImageProfilePress}
            showThreeDot={showThreeDot}
            onThreeDotPress={() => {
              actionSheet.current.show();
            }}
            updateCommentCount={updateCommentCount}
            caller_id={caller_id}
            navigation={navigation}
            onLikePress={onLikePress}
            currentParentIndex={currentParentIndex}
            parentIndex={parentIndex}
            childIndex={childIndex}
            setChildIndex={setChildIndex}
            isNewsFeedScreen={isNewsFeedScreen}
            openProfilId={openProfilId}
            isRepost={postType === Verbs.repostVerb}
          />
        )}

        <FeedFooter
          like={like}
          likeCount={likeCount}
          repostCount={repostCount}
          commentCount={commentCount}
          setShowLikeModal={() => {
            setShowLikeModal(true);
          }}
          setShowShareOptionsModal={() => {
            setShowShareOptionsModal(true);
          }}
          onWriteCommentPress={onWriteCommentPress}
          onNewsFeedLikePress={onNewsFeedLikePress}
        />

        <LikersModal
          data={item}
          showLikeModal={showLikeModal}
          closeModal={() => setShowLikeModal(false)}
          onClickProfile={(obj = {}) => {
            navigation.push('HomeScreen', {
              uid: obj?.user_id,
              role: obj.user.data.entity_type,
            });
          }}
          handleFollowUnfollow={handleFollowUnfollow}
        />
        <CommentModal
          navigation={navigation}
          commentModalRef={commentModalRef}
          showCommentModal={showCommentModal}
          item={item}
          updateCommentCount={(updatedCommentData) => {
            updateCommentCount(updatedCommentData);
            setCommentCount(updatedCommentData?.count);
          }}
          onBackdropPress={() => setShowCommentModal(false)}
        />
        <ActionSheet
          ref={actionSheet}
          title={'News Feed Post'}
          options={['Edit Post', 'Delete Post', strings.cancel]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={onActionSheetItemPress}
        />

        <BottomSheet
          type="ios"
          isVisible={showShareOptionsModal}
          closeModal={() => setShowShareOptionsModal(false)}
          optionList={[strings.repost, strings.copyLink, strings.more]}
          onSelect={onShareActionSheetItemPress}
        />
      </View>
    );
  },
);

export default NewsFeedPostItems;
