import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert, View} from 'react-native';

import _ from 'lodash';
import {
  createPost,
  createReaction,
  deletePost,
  getTaggedTimeline,
  getTaggedTimelineNextData,
  getTimeline,
  getTimelineNextData,
} from '../../api/NewsFeeds';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import WritePost from '../../components/newsFeed/WritePost';
import Verbs from '../../Constants/Verbs';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import {ImageUploadContext} from '../../context/ImageUploadContext';
import LikersModal from '../../components/modals/LikersModal';
import {followUser, unfollowUser} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import CommentModal from '../../components/newsFeed/CommentModal';
import TimeLineTabView from '../home/components/TimeLineTabView';
import {hideEvent} from '../../api/Schedule';

const HomeFeed = ({
  onFeedScroll,
  refs,
  userID,
  navigation,
  currentUserData,
  isAdmin,
  homeFeedHeaderComponent,
  currentTab,
  pulltoRefresh,
  routeParams = {},
  forEvent = false,
  postsPrivacyStatus = true,
  writePostPrivacyStatus = true,
}) => {
  const authContext = useContext(AuthContext);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [feedCalled, setFeedCalled] = useState(false);

  const [pullRefresh, setPullRefresh] = useState(false);
  const [postData, setPostData] = useState([]);
  const [isNextDataLoading, setIsNextDataLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostTab, setSelectedPostTab] = useState(Verbs.post);
  const [taggedPostData, setTaggedPostData] = useState([]);
  const [postsList, setPostsList] = useState([]);

  const isFocused = useIsFocused();
  const imageUploadContext = useContext(ImageUploadContext);

  useEffect(() => {
    if (isFocused) {
      if (selectedPostTab === Verbs.post) {
        setPostsList(postData);
      } else if (selectedPostTab === Verbs.taggedPost) {
        setPostsList(taggedPostData);
      } else {
        setPostsList([]);
      }
    }
  }, [isFocused, selectedPostTab, postData, taggedPostData]);

  const fetchUserTimeLine = useCallback(() => {
    // let entityType = Verbs.entityTypeUsers;
    // if (
    //   currentUserData.entity_type === Verbs.entityTypeTeam ||
    //   currentUserData.entity_type === Verbs.entityTypeClub
    // ) {
    //   entityType = Verbs.entityTypeGroups;
    // }

    // console.log({entityType});
    getTimeline('entityType', userID, authContext)
      .then((res) => {
        setFeedCalled(true);
        setPostData([...res.payload.results]);
        if (res.payload?.next) {
          setIsNextDataLoading(true);
        } else {
          setIsNextDataLoading(false);
        }
        setPullRefresh(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext, userID]);

  const fetchTaggedTimeLine = useCallback(() => {
    // let entityType = Verbs.entityTypeUsers;
    // if (
    //   currentUserData.entity_type === Verbs.entityTypeTeam ||
    //   currentUserData.entity_type === Verbs.entityTypeClub
    // ) {
    //   entityType = Verbs.entityTypeGroups;
    // }

    // console.log({entityType});
    getTaggedTimeline('entityType', userID, authContext)
      .then((res) => {
        setFeedCalled(true);
        setTaggedPostData([...res.payload.results]);
        if (res.payload?.next) {
          setIsNextDataLoading(true);
        } else {
          setIsNextDataLoading(false);
        }
        setPullRefresh(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext, userID]);

  useEffect(() => {
    if (isFocused) {
      fetchUserTimeLine();
      fetchTaggedTimeLine();
    }
  }, [isFocused, fetchUserTimeLine, fetchTaggedTimeLine]);

  const onDeletePost = useCallback(
    (item) => {
      setFullScreenLoading(true);
      const params = {
        activity_id: item.id,
      };
      const entityType = authContext.entity.obj.entity_type;
      if (
        entityType === Verbs.entityTypeTeam ||
        entityType === Verbs.entityTypeClub ||
        entityType === Verbs.entityTypeLeague
      ) {
        params.entity_type = authContext.entity.obj.entity_type;
        params.entity_id = authContext.entity.uid;
      }
      deletePost(params, authContext)
        .then((response) => {
          setFullScreenLoading(false);
          if (response.status) {
            const pData = postData.filter(
              (postItem) => postItem?.id !== params?.activity_id,
            );
            setPostData([...pData]);
          }
        })
        .catch((e) => {
          setFullScreenLoading(false);
          Alert.alert('', e.messages);
        });
    },
    [authContext, postData],
  );

  const onHideEvent = useCallback(
    (item) => {
      setFullScreenLoading(true);
      const eventdata = JSON.parse(item.object);
      const data = {
        hide_event: !eventdata.event_data?.event_hide_groups?.includes(
          authContext.entity.uid,
        ),
      };

      hideEvent(eventdata.event_data.cal_id, data, authContext)
        .then(() => {
          // refresh the screen
          fetchUserTimeLine();
          setFullScreenLoading(false);
        })
        .catch((e) => {
          //  setloading(false);
          setFullScreenLoading(false);
          Alert.alert('', e.messages);
        });
    },
    [authContext],
  );

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: Verbs.clap,
        activity_id: item.id,
      };
      createReaction(bodyParams, authContext)
        .then((res) => {
          const pData = _.cloneDeep(postData);
          const pIndex = pData.findIndex((pItem) => pItem?.id === item?.id);
          const likeIndex =
            pData[pIndex].own_reactions?.clap?.findIndex(
              (likeItem) => likeItem?.user_id === authContext?.entity?.uid,
            ) ?? -1;
          if (likeIndex === -1) {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap.push(res?.payload);
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap + 1 ?? 0;
          } else {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap = pData?.[
              pIndex
            ]?.own_reactions?.clap?.filter(
              (likeItem) => likeItem?.user_id !== authContext?.entity?.uid,
            );
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap - 1 ?? 0;
          }
          setPostData([...pData]);
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    [authContext, postData],
  );

  const onEndReached = () => {
    if (isNextDataLoading) {
      const id_lt =
        selectedPostTab === Verbs.post
          ? postData?.[postData.length - 1]?.id
          : taggedPostData?.[taggedPostData.length - 1]?.id;

      if (id_lt) {
        setFooterLoading(true);
        if (selectedPostTab === Verbs.post) {
          getTimelineNextData('entityType', userID, id_lt, authContext)
            .then((response) => {
              if (response.payload.results) {
                setPostData((prevProps) => [
                  ...prevProps,
                  ...response.payload.results,
                ]);
                if (response.payload?.next) {
                  setIsNextDataLoading(true);
                } else {
                  setIsNextDataLoading(false);
                }
              }
              setFooterLoading(false);
            })
            .catch(() => {
              setFooterLoading(false);
            });
        } else if (selectedPostTab === Verbs.taggedPost) {
          getTaggedTimelineNextData('entityType', userID, id_lt, authContext)
            .then((response) => {
              if (response.payload.results) {
                setTaggedPostData((prevProps) => [
                  ...prevProps,
                  ...response.payload.results,
                ]);
                if (response.payload?.next) {
                  setIsNextDataLoading(true);
                } else {
                  setIsNextDataLoading(false);
                }
              }
              setFooterLoading(false);
            })
            .catch(() => {
              setFooterLoading(false);
            });
        }
      }
    }
  };

  const StickyHeaderComponent = useMemo(
    () =>
      isAdmin &&
      writePostPrivacyStatus && (
        <WritePost
          navigation={navigation}
          postDataItem={currentUserData}
          onWritePostPress={() => {
            navigation.navigate('NewsFeedStack', {
              screen: 'WritePostScreen',
              params: {
                postData: currentUserData,
                selectedImageList: [],
                comeFrom: 'HomeScreen',
                routeParams: {
                  uid: routeParams.uid,
                  role: routeParams.role,
                },
              },
            });
          }}
        />
      ),
    [isAdmin, currentUserData, navigation, routeParams, writePostPrivacyStatus],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <>
        {homeFeedHeaderComponent()}
        <TimeLineTabView
          selectedOption={selectedPostTab}
          onSelect={(value) => {
            setSelectedPostTab(value);
          }}
          postCount={postData.length}
          taggedPostCount={taggedPostData.length}
        />

        {isAdmin ||
        currentUserData?.entity_type !== Verbs.entityTypeUser ||
        currentUserData?.entity_type !== Verbs.entityTypePlayer ||
        forEvent
          ? StickyHeaderComponent
          : null}
      </>
    ),
    [
      StickyHeaderComponent,
      currentUserData?.entity_type,
      homeFeedHeaderComponent,
      isAdmin,
      forEvent,
      selectedPostTab,
      postData,
      taggedPostData,
    ],
  );

  const updateCommentCount = useCallback(
    (updatedComment) => {
      const pData = _.cloneDeep(postData);
      const pIndex = pData?.findIndex(
        (item) => item?.id === updatedComment?.id,
      );
      if (pIndex !== -1) {
        pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
        pData[pIndex].reaction_counts.comment = updatedComment?.count;
        setPostData([...pData]);
      }
    },
    [postData],
  );

  const onRefreshPress = useCallback(() => {
    setPullRefresh(true);
    if (selectedPostTab === Verbs.post) {
      fetchUserTimeLine();
    } else if (selectedPostTab === Verbs.taggedPost) {
      fetchTaggedTimeLine();
    }
    pulltoRefresh();
  }, [fetchUserTimeLine, pulltoRefresh, fetchTaggedTimeLine, selectedPostTab]);

  const createPostAfterUpload = (dataParams) => {
    let body = dataParams;
    setFullScreenLoading(true);

    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      body = {
        ...dataParams,
        group_id: authContext.entity.uid,
        showPreviewForUrl: true,
      };
    }

    createPost(body, authContext)
      .then(() => {
        if (selectedPostTab === Verbs.post) {
          fetchUserTimeLine();
        } else if (selectedPostTab === Verbs.taggedPost) {
          fetchTaggedTimeLine();
        }
        navigation.setParams({isCreatePost: undefined});
        setFullScreenLoading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setFullScreenLoading(false);
      });
  };

  useEffect(() => {
    if (isFocused && routeParams?.isCreatePost) {
      const {dataParams, imageArray} = routeParams;
      if (imageArray.length > 0) {
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      } else {
        createPostAfterUpload(dataParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeParams?.isCreatePost]);

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
          if (selectedPostTab === Verbs.post) {
            fetchUserTimeLine();
          } else if (selectedPostTab === Verbs.taggedPost) {
            fetchTaggedTimeLine();
          }
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    } else {
      unfollowUser(params, userId, authContext)
        .then(() => {
          if (selectedPostTab === Verbs.post) {
            fetchUserTimeLine();
          } else if (selectedPostTab === Verbs.taggedPost) {
            fetchTaggedTimeLine();
          }
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    }
  };

  return (
    <View style={{flex: 1}}>
      <ActivityLoader visible={fullScreenLoading} />
      <ImageProgress />
      <NewsFeedList
        navigation={navigation}
        updateCommentCount={updateCommentCount}
        pullRefresh={pullRefresh}
        showEnptyDataText={currentTab === 0}
        onFeedScroll={onFeedScroll}
        onRefreshPress={onRefreshPress}
        feedAPI={feedCalled}
        refs={refs}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={true}
        onDeletePost={onDeletePost}
        onHideEvent={onHideEvent}
        postData={currentTab === 0 && postsPrivacyStatus ? postsList : []}
        onLikePress={onLikePress}
        onEndReached={onEndReached}
        footerLoading={footerLoading && isNextDataLoading}
        openProfilId={userID}
        entityDetails={currentUserData}
        openLikeModal={(postItem = {}) => {
          setSelectedPost(postItem);
          setShowCommentModal(false);
          setShowLikeModal(true);
        }}
        openCommentModal={(postItem = {}) => {
          setSelectedPost(postItem);
          setShowLikeModal(false);
          setShowCommentModal(true);
        }}
        viewPostPrivacyStatus={postsPrivacyStatus}
      />
      <LikersModal
        data={selectedPost}
        showLikeModal={showLikeModal}
        closeModal={() => setShowLikeModal(false)}
        onClickProfile={(obj = {}) => {
          navigation.push('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: obj?.user_id,
              role: obj.user.data.entity_type,
            },
          });
        }}
        handleFollowUnfollow={handleFollowUnfollow}
      />

      <CommentModal
        postId={selectedPost.id}
        showCommentModal={showCommentModal}
        updateCommentCount={(updatedCommentData) => {
          updateCommentCount(updatedCommentData);
          // setCommentCount(updatedCommentData?.count);
        }}
        closeModal={() => setShowCommentModal(false)}
        onProfilePress={(data = {}) => {
          setShowCommentModal(false);
          navigation.navigate('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: data.userId,
              role: data.entityType,
            },
          });
        }}
        postOwnerId={selectedPost.actor?.id}
      />
    </View>
  );
};

export default memo(HomeFeed);
