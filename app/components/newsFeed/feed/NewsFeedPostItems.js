import React, {useCallback, memo, useEffect, useState, useContext} from 'react';
import {Alert, View} from 'react-native';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import AuthContext from '../../../auth/context';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import BottomSheet from '../../modals/BottomSheet';
import FeedFooter from './FeedFooter';
import Post from './Post';
import PostForEvent from './PostForEvent';
import {getPostData} from '../../../utils';
import colors from '../../../Constants/Colors';
import {PrivacyKeyEnum} from '../../../Constants/PrivacyOptionsConstant';

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
    openLikeModal = () => {},
    openCommentModal = () => {},
    fromEvent = false,
    routeData = {},
    onUpdatePost = () => {},
  }) => {
    const authContext = useContext(AuthContext);
    const [childIndex, setChildIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [repostCount, setRepostCount] = useState(0);

    const [showShareOptionsModal, setShowShareOptionsModal] = useState(false);
    const [postType, setPostType] = useState('');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [moreOptions, setMoreOptions] = useState([]);
    const [privacyStatusForComment, setPrivacyStatusForComment] =
      useState(true);
    const [privacyStatusForShare, setPrivacyStatusForShare] = useState(true);
    const [privacyStatusForLikeCount, setPrivacyStatusForLikeCount] =
      useState(true);

    useEffect(() => {
      if (item?.id) {
        const postObj = JSON.parse(item.object);
        const privacyObj = {
          likeCount: postObj[PrivacyKeyEnum.LikeCount] ?? 1,
          commenting: postObj[PrivacyKeyEnum.CommentOnPost] ?? 1,
          reposting: postObj[PrivacyKeyEnum.SharePost] ?? 1,
        };
        setPrivacyStatusForComment(privacyObj.commenting);
        setPrivacyStatusForShare(privacyObj.reposting);
        setPrivacyStatusForLikeCount(privacyObj.likeCount);
      }
    }, [item?.id, item?.object]);

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
      const obj = {};
      switch (selectedOption) {
        case strings.edit:
          navigation.navigate('NewsFeedStack', {
            screen: 'EditPostScreen',
            params: {
              postData: item,
              fromEvent,
              routeParams: routeData,
            },
          });
          setShowMoreOptions(false);
          break;

        case strings.delete:
        case strings.deletePost:
          setShowMoreOptions(false);
          Alert.alert(
            strings.alertmessagetitle,
            strings.doYouWantToDeleteThisPost,
            [
              {text: strings.cancel, style: 'cancel'},
              {
                text: strings.delete,
                style: 'destructive',
                onPress: () => onDeletePost(),
              },
            ],
          );

          break;

        case strings.hideLikeCount:
          obj[PrivacyKeyEnum.LikeCount] = 0;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.unhideLikeCount:
          obj[PrivacyKeyEnum.LikeCount] = 1;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.turnOffCommenting:
          obj[PrivacyKeyEnum.CommentOnPost] = 0;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.turnOnCommenting:
          obj[PrivacyKeyEnum.CommentOnPost] = 1;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.turnOffResposting:
          obj[PrivacyKeyEnum.SharePost] = 0;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.turnOnReposting:
          obj[PrivacyKeyEnum.SharePost] = 1;
          onUpdatePost(obj, item);
          setShowMoreOptions(false);
          break;

        case strings.report:
        case strings.blockUser:
        case strings.blockAccount:
        case strings.removeMyTagFromPost:
        case strings.hideDeleteFromPosts:
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
          navigation.navigate('NewsFeedStack', {
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
      openCommentModal(item);
    }, [item, openCommentModal]);

    return (
      <View
        style={{
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
                const postObj = JSON.parse(item.object);

                const privacyObj = {
                  likeCount: postObj[PrivacyKeyEnum.LikeCount] ?? 1,
                  commenting: postObj[PrivacyKeyEnum.CommentOnPost] ?? 1,
                  reposting: postObj[PrivacyKeyEnum.SharePost] ?? 1,
                };

                if (privacyObj.commenting) {
                  option.push(strings.turnOffCommenting);
                } else {
                  option.push(strings.turnOnCommenting);
                }

                if (privacyObj.likeCount) {
                  option.push(strings.hideLikeCount);
                } else {
                  option.push(strings.unhideLikeCount);
                }

                if (privacyObj.reposting) {
                  option.push(strings.turnOffResposting);
                } else {
                  option.push(strings.turnOnReposting);
                }
                option.push(strings.deletePost);
              } else {
                option = [strings.report, strings.blockAccount];
              }
              setMoreOptions(option);
              setShowMoreOptions(true);
            }}
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
                option = [strings.edit];
                const postObj = JSON.parse(item.object);

                const privacyObj = {
                  likeCount: postObj[PrivacyKeyEnum.LikeCount] ?? 1,
                  commenting: postObj[PrivacyKeyEnum.CommentOnPost] ?? 1,
                  reposting: postObj[PrivacyKeyEnum.SharePost] ?? 1,
                };

                if (privacyObj.likeCount) {
                  option.push(strings.hideLikeCount);
                } else {
                  option.push(strings.unhideLikeCount);
                }

                if (privacyObj.commenting) {
                  option.push(strings.turnOffCommenting);
                } else {
                  option.push(strings.turnOnCommenting);
                }

                if (privacyObj.reposting) {
                  option.push(strings.turnOffResposting);
                } else {
                  option.push(strings.turnOnReposting);
                }
                option.push(strings.delete);
              } else if (tagUser?.id) {
                option = [
                  strings.removeMyTagFromPost,
                  strings.hideDeleteFromPosts,
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
        <View style={{paddingHorizontal: 5}}>
          <FeedFooter
            like={like}
            likeCount={likeCount}
            repostCount={repostCount}
            commentCount={commentCount}
            setShowLikeModal={() => {
              openLikeModal(item);
            }}
            setShowShareOptionsModal={() => {
              setShowShareOptionsModal(true);
            }}
            onWriteCommentPress={onWriteCommentPress}
            onNewsFeedLikePress={onNewsFeedLikePress}
            privacyStatusForComment={privacyStatusForComment}
            privacyStatusForShare={privacyStatusForShare}
            privacyStatusForLikeCount={privacyStatusForLikeCount}
          />
        </View>
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
