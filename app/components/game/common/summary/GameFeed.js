import React, {
  forwardRef,
  useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState,
} from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import WritePost from '../../../newsFeed/WritePost';
import colors from '../../../../Constants/Colors';
import NewsFeedList from '../../../../screens/newsfeeds/NewsFeedList';
import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';
import {
  createReaction, deletePost, updatePost,
} from '../../../../api/NewsFeeds';
import ActivityLoader from '../../../loader/ActivityLoader';
import { ImageUploadContext } from '../../../../context/ImageUploadContext';

const GameFeed = ({
  gameFeedRefs,
  gameData,
  navigation,
  currentUserData,
  getGameFeedData,
  createGamePostData,
  getGameNextFeedData,
}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext)
  const [gameFeedData, setGameFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);

  useEffect(() => {
    if (gameData) {
      getGameFeedData().then((res) => {
        setGameFeedData([...res?.payload?.results])
        if (res.payload.next === '') {
          setIsNextDataLoading(false);
        }
      })
    }
  }, [gameData]);

  useImperativeHandle(gameFeedRefs, () => ({
    onEndReached() {
      onEndFeedReached();
    },
  }))

  const createPostAfterUpload = useCallback((dataParams) => {
    createGamePostData({ ...dataParams, game_id: gameData?.game_id })
      .then((response) => {
        setGameFeedData((gfData) => [response.payload, ...gfData])
      })
      .catch((error) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message)
        }, 10)
      })
  }, [createGamePostData, gameData?.game_id])

  const onPressDone = useCallback((data, postDesc, tagsOfEntity) => {
    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        tagged: tagsOfEntity ?? [],
      };
      createPostAfterUpload(dataParams);
    } else if (data) {
      const imageArray = data.map((dataItem) => (dataItem))
      const dataParams = {
        text: postDesc && postDesc,
        attachments: [],
        tagged: tagsOfEntity ?? [],
      };
      imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
      )
    }
  }, [authContext, createPostAfterUpload, imageUploadContext])

  const onEndFeedReached = useCallback(() => {
    setFooterLoading(true);
    const id_lt = gameFeedData?.[gameFeedData.length - 1]?.id;
    if (id_lt && isNextDataLoading) {
      getGameNextFeedData(id_lt).then((response) => {
        if (response) {
          if (response.payload.next === '') {
            setIsNextDataLoading(false);
          }
          setFooterLoading(false)
          setGameFeedData([...gameFeedData, ...response.payload.results]);
        }
      })
          .catch(() => {
            setFooterLoading(false)
          })
    }
  }, [gameFeedData, isNextDataLoading, getGameNextFeedData])

  const updatePostAfterUpload = useCallback((dataParams) => {
    updatePost(dataParams, authContext)
      .then((response) => {
        const pData = [...gameFeedData];
        const pDataIndex = gameFeedData?.findIndex((item) => item?.id === dataParams?.activity_id)
        pData[pDataIndex] = response?.payload;
        setGameFeedData([...pData]);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }, [authContext, gameFeedData])

  const editPostDoneCall = useCallback((data, postDesc, selectEditItem, tagData) => {
    const alreadyUrlDone = [];
    const createUrlData = [];

    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        activity_id: selectEditItem.id,
        text: postDesc,
        tagged: tagData ?? [],
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
        })
      }
      const dataParams = {
        activity_id: selectEditItem.id,
        text: postDesc,
        attachments: [...alreadyUrlDone],
        tagged: tagData ?? [],
      };
      if (createUrlData?.length > 0) {
        const imageArray = createUrlData.map((dataItem) => (dataItem))
        imageUploadContext.uploadData(
            authContext,
            dataParams,
            imageArray,
            updatePostAfterUpload,
        )
      } else {
        updatePostAfterUpload(dataParams);
      }
    }
  }, [authContext, imageUploadContext, updatePostAfterUpload])

  const onDeletePost = useCallback((item) => {
    setLoading(true);
    const params = {
      activity_id: item.id,
    };

    if (item?.game_id) params.entity_type = 'game';
    if (['team', 'club', 'league'].includes(authContext?.entity?.obj?.entity_type)) {
        params.entity_id = authContext?.entity?.uid;
      }

    deletePost(params, authContext)
        .then((response) => {
          if (response.status) {
            const gData = gameFeedData.filter((postItem) => postItem?.id !== params?.activity_id)
            setGameFeedData([...gData]);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
  }, [authContext, gameFeedData])

  const onLikePress = useCallback((item) => {
    const bodyParams = {
      reaction_type: 'clap',
      activity_id: item.id,
    };
    createReaction(bodyParams, authContext)
        .catch((e) => {
          Alert.alert('', e.messages)
        });
  }, [authContext])

  const renderWritePostView = useMemo(() => (
    <WritePost
          navigation={navigation}
          postDataItem={currentUserData}
          onWritePostPress={() => {
            navigation.navigate('WritePostScreen', { postData: currentUserData, onPressDone, selectedImageList: [] })
          }}
      />
  ), [currentUserData, navigation, onPressDone])

  const updateCommentCount = (updatedComment) => {
    const pData = [...gameFeedData]
    const pIndex = pData?.findIndex((item) => item?.id === updatedComment?.id)
    if (pIndex !== -1) {
      pData[pIndex].reaction_counts.comment = updatedComment?.count
      setGameFeedData([...pData]);
    }
  }

  return (
    <View style={{ backgroundColor: colors.whiteColor }}>
      <ActivityLoader visible={loading}/>
      {renderWritePostView}
      <View style={styles.sepratorView} />
      <NewsFeedList
          updateCommentCount={updateCommentCount}
          refs={gameFeedRefs}
          onDeletePost={onDeletePost}
          navigation={navigation}
          postData={gameFeedData}
          onEditPressDone={editPostDoneCall}
          onLikePress={onLikePress}
          scrollEnabled={false}
          footerLoading={footerLoading && isNextDataLoading}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  sepratorView: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
})

export default forwardRef(GameFeed);
