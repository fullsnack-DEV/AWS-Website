import React, {useCallback, memo, useEffect, useState, useContext} from 'react';
import {Alert, View} from 'react-native';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import CommentModal from '../CommentModal';
import LikersModal from '../../modals/LikersModal';
import AuthContext from '../../../auth/context';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import BottomSheet from '../../modals/BottomSheet';
import FeedFooter from './FeedFooter';
import Post from './Post';
import PostForEvent from './PostForEvent';
import {getPostData} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';
import colors from '../../../Constants/Colors';

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
    updateCommentCount,
    isNewsFeedScreen,
    openProfilId,
    entityDetails = {},
    fetchFeeds = () => {},
  }) => {
    const authContext = useContext(AuthContext);
    const [childIndex, setChildIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [repostCount, setRepostCount] = useState(0);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showLikeModal, setShowLikeModal] = useState(false);
    const [showShareOptionsModal, setShowShareOptionsModal] = useState(false);
    const [postType, setPostType] = useState('');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [moreOptions, setMoreOptions] = useState([]);

    useEffect(() => {
      let filterLike = [];
      if (item.reaction_counts?.clap) {
        setLikeCount(item.reaction_counts.clap ?? 0);
      }
      if (item.reaction_counts?.comment) {
        setCommentCount(item.reaction_counts.comment ?? 0);
      }

      setRepostCount(item?.repost_count);

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

      if (typeof item.object === 'string') {
        const obj = JSON.parse(item.object);
        if (obj) {
          setPostType(obj.post_type);
        }
      }
    }, [caller_id, item]);

    const onNewsFeedLikePress = useCallback(() => {
      if (like) setLikeCount((likeCnt) => likeCnt - 1);
      else setLikeCount((likeCnt) => likeCnt + 1);
      setLike((isLIKE) => !isLIKE);
      onLikePress();
    }, [like, onLikePress]);

    const onActionSheetItemPress = (selectedOption) => {
      switch (selectedOption) {
        case strings.edit:
          navigation.navigate('EditPostScreen', {
            postData: item,
          });
          setShowMoreOptions(false);
          break;

        case strings.delete:
        case strings.deleteFromPost:
          onDeletePost();
          break;

        case strings.report:
        case strings.blockUser:
        case strings.blockAccount:
        case strings.removeMyTagFromPost:
          break;

        default:
          break;
      }
    };

    const onShareActionSheetItemPress = (option) => {
      const options = {
        message: getPostData(item).text,
      };

      setShowShareOptionsModal(false);

      switch (option) {
        case strings.repost:
          navigation.navigate('WritePostScreen', {
            postData: entityDetails,
            selectedImageList: [],
            isRepost: true,
            repostData: {...item},
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
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 17,
          paddingBottom: 20,
        }}>
        {postType === Verbs.eventVerb ? (
          <PostForEvent
            postData={item}
            onImageProfilePress={onImageProfilePress}
            onThreeDotPress={() => {
              let option = [];
              if (item.actor.id === authContext.entity.uid) {
                option = [strings.deleteFromPost];
              } else {
                option = [strings.report, strings.blockAccount];
              }
              setMoreOptions(option);
              setShowMoreOptions(true);
            }}
            // showMoreOptions={
            //   authContext.entity.role === Verbs.entityTypePlayer ||
            //   authContext.entity.role === Verbs.entityTypeUser
            // }
            showMoreOptions
          />
        ) : (
          <Post
            item={item}
            onImageProfilePress={onImageProfilePress}
            onThreeDotPress={() => {
              const tagUser = item.tagged.find(
                (ele) => ele.id === authContext.entity.uid,
              );

              let option = [];
              if (item.actor.id === authContext.entity.uid) {
                option = [strings.edit, strings.delete];
              } else if (tagUser?.id) {
                option = [
                  strings.removeMyTagFromPost,
                  strings.report,
                  strings.blockUser,
                ];
              } else {
                option = [strings.report, strings.blockUser];
              }
              setMoreOptions(option);
              setShowMoreOptions(true);
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
            showMoreOptions
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
          postId={item.id}
          showCommentModal={showCommentModal}
          updateCommentCount={(updatedCommentData) => {
            updateCommentCount(updatedCommentData);
            setCommentCount(updatedCommentData?.count);
          }}
          closeModal={() => setShowCommentModal(false)}
          onProfilePress={(data = {}) => {
            setShowCommentModal(false);
            navigation.navigate('HomeScreen', {
              uid: data.userId,
              role: data.entityType,
            });
          }}
          postOwnerId={item.actor?.id}
        />
        <BottomSheet
          type="ios"
          isVisible={showMoreOptions}
          closeModal={() => setShowMoreOptions(false)}
          optionList={moreOptions}
          onSelect={(value) => onActionSheetItemPress(value)}
        />

        <BottomSheet
          type="ios"
          isVisible={showShareOptionsModal}
          closeModal={() => setShowShareOptionsModal(false)}
          optionList={[strings.repost, strings.copyLink, strings.more]}
          onSelect={onShareActionSheetItemPress}
          separatorLineStyle={{backgroundColor: colors.startGrayGrdient}}
          cancelButtonContainerStyle={{marginBottom: 20}}
        />
      </View>
    );
  },
);

export default NewsFeedPostItems;
