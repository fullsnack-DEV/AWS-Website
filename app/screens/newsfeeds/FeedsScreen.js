import React, {
  useEffect, memo, useState, useLayoutEffect, useContext, useCallback, useMemo,
} from 'react';
import {
  StyleSheet, View, Image, Alert, TouchableOpacity,
} from 'react-native';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {
  createPost, createReaction, deletePost,
  getNewsFeed,
  getNewsFeedNextList,
  updatePost,
} from '../../api/NewsFeeds';
import colors from '../../Constants/Colors'
import uploadImages from '../../utils/imageAction';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import AuthContext from '../../auth/context'

const FeedsScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext)
  const [postData, setPostData] = useState([]);
  const [loading, setloading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [pullRefresh, setPullRefresh] = useState(false);
  useEffect(() => {
    setloading(true);
      const entity = authContext.entity;
      setCurrentUserDetail(entity.obj || entity.auth.user);
      getNewsFeed(authContext)
        .then((response) => {
          setloading(false);
          setPostData([...response.payload.results])
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => Alert.alert('', e.message), 100)
        });
  }, [authContext, authContext.entity]);

  const onThreeDotPress = () => {
    setTimeout(() => navigation.navigate('EntitySearchScreen'), 0);
  }

  const topRightButton = () => (
    <TouchableOpacity onPress={onThreeDotPress}>
      <Image source={images.vertical3Dot} style={styles.headerRightImg} />
    </TouchableOpacity>
      )
  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: topRightButton });
  }, []);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const cancelRequest = (axiosTokenSource) => {
    setCancelApiRequest({ ...axiosTokenSource });
  }

  const createPostAfterUpload = useCallback((dataParams) => {
    createPost(dataParams, authContext)
        .then(() => getNewsFeed(authContext))
        .then((response) => {
          setPostData([...response.payload.results])
          setProgressBar(false);
          setDoneUploadCount(0);
          setTotalUploadCount(0);
        })
        .catch((e) => {
          Alert.alert('', e.messages)
        });
  }, [authContext])

  const callthis = useCallback((data, postDesc, tagsOfEntity) => {
    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        taggedData: tagsOfEntity ?? [],
      };
      createPostAfterUpload(dataParams);
    } else if (data) {
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = data.map((dataItem) => (dataItem))
      uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }))
        const dataParams = {
          text: postDesc && postDesc,
          attachments,
          taggedData: tagsOfEntity ?? [],
        };
        createPostAfterUpload(dataParams)
      })
    }
  }, [authContext, createPostAfterUpload])

  const updatePostAfterUpload = useCallback((dataParams) => {
    updatePost(dataParams, authContext)
      .then((response) => {
        const pData = [...postData];
        const pDataIndex = postData?.findIndex((item) => item?.id === dataParams?.activity_id)
        pData[pDataIndex] = response?.payload;
        setPostData([...pData]);
        setProgressBar(false);
        setDoneUploadCount(0);
        setTotalUploadCount(0);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }, [authContext, postData])
  const editPostDoneCall = useCallback((data, postDesc, selectEditItem, tagData) => {
    let attachmentsData = [];
    const alreadyUrlDone = [];
    const createUrlData = [];

    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        activity_id: selectEditItem.id,
        text: postDesc,
        taggedData: tagData ?? [],
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
      if (createUrlData?.length > 0) {
        setTotalUploadCount(createUrlData.length || 1);
        setProgressBar(true);
      }

      const imageArray = createUrlData.map((dataItem) => (dataItem))
      uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }))
        attachmentsData = [...alreadyUrlDone, ...attachments];
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          attachments: attachmentsData,
          taggedData: tagData ?? [],
        };
        updatePostAfterUpload(dataParams)
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [authContext, updatePostAfterUpload])

  const onCancelImageUpload = useCallback(() => {
    if (cancelApiRequest) {
      cancelApiRequest.cancel('Cancel Image Uploading');
    }
    setProgressBar(false);
    setDoneUploadCount(0);
    setTotalUploadCount(0);
  }, [cancelApiRequest])

  const onDeletePost = useCallback((item) => {
    setloading(true);
    const params = {
      activity_id: item.id,
    };
    if (['team', 'club', 'league'].includes(authContext?.entity?.obj?.entity_type)) {
      params.entity_type = authContext?.entity?.obj?.entity_type;
      params.entity_id = authContext?.entity?.uid;
    }
    deletePost(params, authContext)
        .then((response) => {
          if (response.status) {
            const pData = postData.filter((postItem) => postItem?.id !== params?.activity_id)
            setPostData([...pData]);
          }
          setloading(false);
        })
        .catch(() => {
          setloading(false);
        });
  }, [authContext, postData])

  const onRefreshPress = useCallback(() => {
    setIsMoreLoading(false);
    setIsNextDataLoading(true);
    setFooterLoading(false)
    setPullRefresh(true);
    getNewsFeed(authContext)
        .then((response) => {
          setPostData([...response.payload.results]);
          setPullRefresh(false);
        })
        .catch((e) => {
          Alert.alert('', e.messages)
          setPullRefresh(false);
        });
  }, [authContext])

  const feedScreenHeader = useCallback(() => (
    <View>
      <WritePost
              navigation={navigation}
              postDataItem={currentUserDetail}
              onWritePostPress={() => {
                navigation.navigate('WritePostScreen', {
                  postData: currentUserDetail,
                  onPressDone: callthis,
                  selectedImageList: [],
                })
              }}
          />
      <View style={styles.sepratorView} />
    </View>
    ), [callthis, currentUserDetail])

  const onLikePress = useCallback((item) => {
    const bodyParams = {
      reaction_type: 'clap',
      activity_id: item.id,
    };
    createReaction(bodyParams, authContext)
        .catch((e) => {
          Alert.alert('', e.messages)
        });
  }, [authContext]);

  const onEndReached = useCallback(() => {
    setIsMoreLoading(true);
    setFooterLoading(true);
    const id_lt = postData?.[postData.length - 1]?.id;
    if (id_lt && isMoreLoading && isNextDataLoading) {
      getNewsFeedNextList(id_lt, authContext).then((response) => {
        if (response) {
          if (response.payload.next === '') {
            setIsNextDataLoading(false);
          }
          setIsMoreLoading(false);
          setFooterLoading(false)
          setPostData([...postData, ...response.payload.results]);
        }
      })
          .catch(() => {
            setFooterLoading(false)
          })
    }
  }, [isMoreLoading, isNextDataLoading, postData])

  const onImageProgressCancelPress = useCallback(() => {
    Alert.alert(
        'Cancel Upload?',
        'If you cancel your upload now, your post will not be saved.',
        [{
          text: 'Go back',
        },
          {
            text: 'Cancel upload',
            onPress: onCancelImageUpload,
          },
        ],
    );
  }, [onCancelImageUpload])

  const renderImageProgress = useMemo(() => (
    <ImageProgress
              numberOfUploaded={doneUploadCount}
              totalUpload={totalUploadCount}
              onCancelPress={onImageProgressCancelPress}
              postDataItem={currentUserDetail}
          />
    ), [doneUploadCount, totalUploadCount, onImageProgressCancelPress, currentUserDetail])
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <NewsFeedList
        pullRefresh={pullRefresh}
        onDeletePost={onDeletePost}
        navigation={navigation}
        postData={postData}
        onEditPressDone={editPostDoneCall}
        onRefreshPress={onRefreshPress}
        footerLoading={footerLoading && isNextDataLoading}
        ListHeaderComponent={feedScreenHeader}
        onLikePress={onLikePress}
        onEndReached={onEndReached}
       />
      {progressBar && renderImageProgress}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sepratorView: {
    height: 8,
    backgroundColor: colors.whiteGradientColor,
  },
});

export default memo(FeedsScreen);
