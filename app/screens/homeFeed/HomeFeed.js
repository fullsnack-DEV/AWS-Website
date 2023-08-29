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
  createReaction,
  deletePost,
  getTimeline,
  getUserPosts,
} from '../../api/NewsFeeds';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import WritePost from '../../components/newsFeed/WritePost';
import Verbs from '../../Constants/Verbs';

let onEndReachedCalledDuringMomentum = true;

const HomeFeed = ({
  onFeedScroll,
  refs,
  userID,
  navigation,
  currentUserData,
  isAdmin,
  homeFeedHeaderComponent,
  currentTab,
}) => {
  const authContext = useContext(AuthContext);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [feedCalled, setFeedCalled] = useState(false);

  const [pullRefresh, setPullRefresh] = useState(false);
  const [postData, setPostData] = useState([]);
  const [totalUserPostCount, setTotalUserPostCount] = useState(0);
  const [isNextDataLoading, setIsNextDataLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);

  const isFocused = useIsFocused();

  const getTimeLine = useCallback(() => {
    let entityType = Verbs.entityTypeUsers;
    if (
      currentUserData.entity_type === Verbs.entityTypeUser ||
      currentUserData.entity_type === Verbs.entityTypePlayer
    ) {
      entityType = Verbs.entityTypeUsers;
    } else if (
      currentUserData.entity_type === Verbs.entityTypeTeam ||
      currentUserData.entity_type === Verbs.entityTypeClub
    ) {
      entityType = Verbs.entityTypeGroups;
    }

    getTimeline(entityType, userID, '', authContext)
      .then((res) => {
        setFeedCalled(true);
        setTotalUserPostCount(res?.payload?.total_count);
        setPostData([...res?.payload?.results]);
        setPullRefresh(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext, currentUserData.entity_type, userID]);

  useEffect(() => {
    getTimeLine();
  }, [isFocused, getTimeLine]);

  useEffect(() => {
    if (postData?.length > 0 && totalUserPostCount > 0) {
      if (postData?.length === totalUserPostCount && isNextDataLoading)
        setIsNextDataLoading(false);
      else if (!isNextDataLoading && postData?.length <= totalUserPostCount)
        setIsNextDataLoading(true);
    }
  }, [postData, totalUserPostCount, isNextDataLoading]);

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
            setTotalUserPostCount((pCnt) => pCnt - 1);
          }
        })
        .catch((e) => {
          setFullScreenLoading(false);
          Alert.alert('', e.messages);
        });
    },
    [authContext, postData],
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

  const onEndReached = useCallback(() => {
    if (!onEndReachedCalledDuringMomentum) {
      setFooterLoading(true);
      const id_lt = postData?.[postData.length - 1]?.id;
      if (id_lt && isNextDataLoading) {
        getUserPosts({last_activity_id: id_lt}, authContext)
          .then((response) => {
            if (response) {
              setFooterLoading(false);
              setTotalUserPostCount(response?.payload?.total_count);
              setPostData([...postData, ...response.payload.results]);
            }
          })
          .catch(() => {
            setFooterLoading(false);
          });
      }
      onEndReachedCalledDuringMomentum = true;
    }
  }, [authContext, isNextDataLoading, postData]);

  const StickyHeaderComponent = useMemo(
    () =>
      isAdmin && (
        <WritePost
          navigation={navigation}
          postDataItem={currentUserData}
          onWritePostPress={() => {
            navigation.navigate('WritePostScreen', {
              postData: currentUserData,
              selectedImageList: [],
            });
          }}
        />
      ),
    [isAdmin, currentUserData, navigation],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <>
        {homeFeedHeaderComponent()}
        {isAdmin ||
        currentUserData?.entity_type !== Verbs.entityTypeUser ||
        currentUserData?.entity_type !== Verbs.entityTypePlayer
          ? StickyHeaderComponent
          : null}
      </>
    ),
    [
      StickyHeaderComponent,
      currentUserData?.entity_type,
      homeFeedHeaderComponent,
      isAdmin,
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

    getTimeLine();
  }, [getTimeLine]);

  return (
    <View style={{flex: 1}}>
      <ActivityLoader visible={fullScreenLoading} />
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
        postData={currentTab === 0 ? postData : []}
        onLikePress={onLikePress}
        onEndReached={onEndReached}
        fetchFeeds={getTimeLine}
        footerLoading={footerLoading && isNextDataLoading}
        openProfilId={userID}
        entityDetails={currentUserData}
      />
    </View>
  );
};

export default memo(HomeFeed);
