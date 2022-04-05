/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import _ from 'lodash';
import {
  createPost,
  createReaction,
  deletePost,
  getFeeds,
  getUserPosts,
  updatePost,
} from '../../api/NewsFeeds';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getGallery} from '../../api/Users';
import WritePost from '../../components/newsFeed/WritePost';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import {ImageUploadContext} from '../../context/ImageUploadContext';

let onEndReachedCalledDuringMomentum = true;
const HomeFeed = ({
  onFeedScroll,
  refs,
  userID,
  setGalleryData,
  navigation,
  currentUserData,
  isAdmin,
  homeFeedHeaderComponent,
  currentTab,
}) => {
  console.log('userIDuserIDuserID', currentUserData);
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [feedCalled, setFeedCalled] = useState(false);

  const [postData, setPostData] = useState();
  const [totalUserPostCount, setTotalUserPostCount] = useState(0);
  const [isNextDataLoading, setIsNextDataLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);

  useEffect(() => {
    getFeeds(currentUserData?.entity_type,userID, '', authContext)
      .then((res) => {
        setFeedCalled(true);
        setTotalUserPostCount(res?.payload?.total_count);
        setPostData([...res?.payload?.results]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext, currentUserData?.entity_type, userID]);

  useEffect(() => {
    if (postData?.length > 0 && totalUserPostCount > 0) {
      if (postData?.length === totalUserPostCount && isNextDataLoading)
        setIsNextDataLoading(false);
      else if (!isNextDataLoading && postData?.length <= totalUserPostCount)
        setIsNextDataLoading(true);
    }
  }, [postData, totalUserPostCount]);

  const updatePostAfterUpload = useCallback(
    (dataParams) => {
      updatePost(dataParams, authContext)
        .then((response) => {
          const pData = [...postData];
          const pDataIndex = postData?.findIndex(
            (item) => item?.id === dataParams?.activity_id,
          );
          pData[pDataIndex] = response?.payload;
          setPostData([...pData]);
          getGallery(userID, authContext).then((res) => {
            setGalleryData(res.payload);
          });
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext, postData, setGalleryData, userID],
  );

  const editPostDoneCall = useCallback(
    (data, postDesc, selectEditItem, tagData, format_tagged_data = []) => {
      const alreadyUrlDone = [];
      const createUrlData = [];

      if (postDesc.trim().length > 0 && data?.length === 0) {
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          tagged: tagData ?? [],
          format_tagged_data,
        };
        updatePostAfterUpload(dataParams);
      } else if (data) {
        if (data.length > 0) {
          data.map((dataItem) => {
            if (dataItem.thumbnail) {
              alreadyUrlDone.push(dataItem);
            } else {
              createUrlData.push(dataItem);
            }
            return null;
          });
        }
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          tagged: tagData ?? [],
          attachments: [...alreadyUrlDone],
          format_tagged_data,
        };
        if (createUrlData?.length > 0) {
          const imageArray = createUrlData.map((dataItem) => dataItem);
          imageUploadContext.uploadData(
            authContext,
            dataParams,
            imageArray,
            updatePostAfterUpload,
          );
        } else {
          updatePostAfterUpload(dataParams);
        }
      }
    },
    [authContext, imageUploadContext, updatePostAfterUpload],
  );

  const onDeletePost = useCallback(
    (item) => {
      setFullScreenLoading(true);
      const params = {
        activity_id: item.id,
      };
      if (
        ['team', 'club', 'league'].includes(
          authContext?.entity?.obj?.entity_type,
        )
      ) {
        params.entity_type = authContext?.entity?.obj?.entity_type;
        params.entity_id = authContext?.entity?.uid;
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
        reaction_type: 'clap',
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

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      console.log('create post -> homeFeed');
      createPost(dataParams, authContext)
        .then((response) => {
          setTotalUserPostCount((cnt) => cnt + 1);
          setPostData((pData) => [response.payload, ...pData]);
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext],
  );

  const onPressDone = useCallback(
    (data, postDesc, tagsOfEntity) => {
        let dataParams = {}
        const entityID = currentUserData?.group_id  ?? currentUserData?.user_id;
        if (entityID !== authContext.entity.uid) {
          if (
            currentUserData?.entity_type === 'team' ||
            currentUserData?.entity_type === 'club'
          ) {
            dataParams.group_id = currentUserData?.group_id;
            dataParams.feed_type = currentUserData?.entity_type;
          }
          if (
            currentUserData?.entity_type === 'user' ||
            currentUserData?.entity_type === 'player'
          ) {
            dataParams.user_id = currentUserData?.user_id;
          }
        }
      if (postDesc.trim().length > 0 && data?.length === 0) {
         dataParams = {
            ...dataParams,
          text: postDesc,
          tagged: tagsOfEntity ?? [],
        };
       
        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
         dataParams = {
             ...dataParams,
          text: postDesc && postDesc,
          attachments: [],
          tagged: tagsOfEntity ?? [],
        };
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [
      authContext,
      createPostAfterUpload,
      currentUserData?.entity_type,
      currentUserData?.group_id,
      imageUploadContext,
    ],
  );

  const onEndReached = () => {
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
  };

  const StickyHeaderComponent = useMemo(
    () => (
      <View>
        <WritePost
          navigation={navigation}
          postDataItem={currentUserData}
          onWritePostPress={() => {
            navigation.navigate('WritePostScreen', {
              postData: currentUserData,
              onPressDone,
              selectedImageList: [],
            });
          }}
        />
        <View style={styles.sepratorView} />
      </View>
    ),
    [currentUserData, navigation, onPressDone],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <>
        {homeFeedHeaderComponent()}
        {/* {(isAdmin && currentTab === 0) ? StickyHeaderComponent : null} */}
        {StickyHeaderComponent}
      </>
    ),
    [StickyHeaderComponent, homeFeedHeaderComponent],
  );

  const updateCommentCount = (updatedComment) => {
    const pData = _.cloneDeep(postData);
    const pIndex = pData?.findIndex((item) => item?.id === updatedComment?.id);
    if (pIndex !== -1) {
      pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
      pData[pIndex].reaction_counts.comment = updatedComment?.count;
      setPostData([...pData]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.sepratorView} />
      <ActivityLoader visible={fullScreenLoading} />
      <NewsFeedList
        showEnptyDataText={currentTab === 0}
        updateCommentCount={updateCommentCount}
        onFeedScroll={onFeedScroll}
        feedAPI={feedCalled}
        refs={refs}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={true}
        onDeletePost={onDeletePost}
        navigation={navigation}
        postData={currentTab === 0 ? postData : []}
        onEditPressDone={editPostDoneCall}
        onLikePress={onLikePress}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        footerLoading={footerLoading && isNextDataLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sepratorView: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
});
export default memo(HomeFeed);
