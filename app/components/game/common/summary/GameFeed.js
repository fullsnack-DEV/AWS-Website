import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import _ from 'lodash';
import WritePost from '../../../newsFeed/WritePost';
import colors from '../../../../Constants/Colors';
import NewsFeedList from '../../../../screens/newsfeeds/NewsFeedList';
import AuthContext from '../../../../auth/context';
import {strings} from '../../../../../Localization/translation';
import {
  createReaction,
  deletePost,
  updatePost,
} from '../../../../api/NewsFeeds';
import ActivityLoader from '../../../loader/ActivityLoader';
import {ImageUploadContext} from '../../../../context/ImageUploadContext';
import Verbs from '../../../../Constants/Verbs';

const GameFeed = (
  {
    gameData,
    navigation,
    currentUserData,
    getGameFeedData,
    createGamePostData,
    getGameNextFeedData,
  },
  gameFeedRefs,
) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);
  const [gameFeedData, setGameFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);

  useEffect(() => {
    if (gameData) {
      getGameFeedData().then((res) => {
        setGameFeedData([...res?.payload?.results]);
        if (res.payload.next === '') {
          setIsNextDataLoading(false);
        }
      });
    }
  }, [gameData]);

  useImperativeHandle(gameFeedRefs, () => ({
    onEndReached() {
      onEndFeedReached();
    },
  }));

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      let body = dataParams;

      if (
        authContext.entity.role === Verbs.entityTypeClub ||
        authContext.entity.role === Verbs.entityTypeTeam
      ) {
        body = {
          ...dataParams,
          group_id: authContext.entity.uid,
        };
      }
      createGamePostData({...body, game_id: gameData?.game_id})
        .then((response) => {
          setGameFeedData((gfData) => [response.payload, ...gfData]);
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [createGamePostData, gameData?.game_id],
  );

  const onPressDone = useCallback(
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
      let dataParams = {};
      const entityID = currentUserData?.group_id ?? currentUserData?.user_id;
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
          format_tagged_data,
        };

        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
        dataParams = {
          ...dataParams,
          text: postDesc && postDesc,
          attachments: [],
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  const onEndFeedReached = useCallback(() => {
    setFooterLoading(true);
    const id_lt = gameFeedData?.[gameFeedData.length - 1]?.id;
    if (id_lt && isNextDataLoading) {
      getGameNextFeedData(id_lt)
        .then((response) => {
          if (response) {
            if (response.payload.next === '') {
              setIsNextDataLoading(false);
            }
            setFooterLoading(false);
            setGameFeedData([...gameFeedData, ...response.payload.results]);
          }
        })
        .catch(() => {
          setFooterLoading(false);
        });
    }
  }, [gameFeedData, isNextDataLoading, getGameNextFeedData]);

  const updatePostAfterUpload = useCallback(
    (dataParams) => {
      updatePost(dataParams, authContext)
        .then((response) => {
          const pData = [...gameFeedData];
          const pDataIndex = gameFeedData?.findIndex(
            (item) => item?.id === dataParams?.activity_id,
          );
          pData[pDataIndex] = response?.payload;
          setGameFeedData([...pData]);
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext, gameFeedData],
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
          attachments: [...alreadyUrlDone],
          tagged: tagData ?? [],
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
      setLoading(true);
      const params = {
        activity_id: item.id,
      };

      if (item?.game_id) params.entity_type = 'game';
      if (
        ['team', 'club', 'league'].includes(
          authContext?.entity?.obj?.entity_type,
        )
      ) {
        params.entity_id = authContext?.entity?.uid;
      }

      deletePost(params, authContext)
        .then((response) => {
          if (response.status) {
            const gData = gameFeedData.filter(
              (postItem) => postItem?.id !== params?.activity_id,
            );
            setGameFeedData([...gData]);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [authContext, gameFeedData],
  );

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: 'clap',
        activity_id: item.id,
      };
      createReaction(bodyParams, authContext)
        .then((res) => {
          const pData = _.cloneDeep(gameFeedData);
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
          setGameFeedData([...pData]);
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext, gameFeedData],
  );

  const renderWritePostView = useMemo(
    () => (
      <WritePost
        onWritePostPress={() => {
          navigation.navigate('NewsFeedStack', {
            screen: 'WritePostScreen',
            params: {
              postData: currentUserData,
              onPressDone,
              selectedImageList: [],
              sendCallBack: true,
            },
          });
        }}
      />
    ),
    [currentUserData, navigation, onPressDone],
  );

  const updateCommentCount = (updatedComment) => {
    const pData = _.cloneDeep(gameFeedData);
    const pIndex = pData?.findIndex((item) => item?.id === updatedComment?.id);
    if (pIndex !== -1) {
      pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
      pData[pIndex].reaction_counts.comment = updatedComment?.count;
      setGameFeedData([...pData]);
    }
  };

  return (
    <View style={{backgroundColor: colors.whiteColor}}>
      <ActivityLoader visible={loading} />
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
        entityDetails={currentUserData}
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

export default forwardRef(GameFeed);
