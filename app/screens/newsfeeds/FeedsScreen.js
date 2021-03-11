import React, {
  useEffect, memo, useState, useLayoutEffect, useContext, useCallback, useMemo,
} from 'react';
import {
  StyleSheet, View, Image, Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
import ImageProgress from '../../components/newsFeed/ImageProgress';
import AuthContext from '../../auth/context'
import NewsFeedShimmer from '../../components/shimmer/newsFeed/NewsFeedShimmer';
import { ImageUploadContext } from '../../context/GetContexts';

const FeedsScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext)
  const imageUploadContext = useContext(ImageUploadContext)
  const [postData, setPostData] = useState([]);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loading, setloading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [pullRefresh, setPullRefresh] = useState(false);
  useEffect(() => {
    setFirstTimeLoading(true);
      const entity = authContext.entity;
      setCurrentUserDetail(entity.obj || entity.auth.user);
      getNewsFeed(authContext)
        .then((response) => {
          setFirstTimeLoading(false);
          setPostData([...response.payload.results])
        })
        .catch((e) => {
          setFirstTimeLoading(false);
          setTimeout(() => Alert.alert('', e.message), 100)
        });
  }, [authContext, authContext.entity]);

  const onThreeDotPress = useCallback(() => {
    setTimeout(() => navigation.navigate('EntitySearchScreen'), 0);
  }, [navigation]);

  const topRightButton = useMemo(() => (
    <TouchableOpacity onPress={onThreeDotPress}>
      <Image source={images.vertical3Dot} style={styles.headerRightImg} />
    </TouchableOpacity>
  ), [onThreeDotPress])

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => topRightButton });
  }, [navigation, topRightButton]);

  const createPostAfterUpload = useCallback((dataParams) => {
    createPost(dataParams, authContext)
        .then((response) => {
          setPostData((pData) => [response.payload, ...pData])
        })
        .catch((e) => {
          Alert.alert('', e.messages)
        });
  }, [authContext])

  const onPressDone = useCallback((data, postDesc, tagsOfEntity) => {
    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        taggedData: tagsOfEntity ?? [],
      };
      createPostAfterUpload(dataParams);
    } else if (data) {
      const imageArray = data.map((dataItem) => (dataItem))
      const dataParams = {
        text: postDesc && postDesc,
        attachments: [],
        taggedData: tagsOfEntity ?? [],
      };
      imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
      )
    }
  }, [authContext, createPostAfterUpload, imageUploadContext])

  const updatePostAfterUpload = useCallback((dataParams) => {
    updatePost(dataParams, authContext)
      .then((response) => {
        const pData = [...postData];
        const pDataIndex = postData?.findIndex((item) => item?.id === dataParams?.activity_id)
        pData[pDataIndex] = response?.payload;
        setPostData([...pData]);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }, [authContext, postData])

  const editPostDoneCall = useCallback((data, postDesc, selectEditItem, tagData) => {
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
      const dataParams = {
        activity_id: selectEditItem.id,
        text: postDesc,
        taggedData: tagData ?? [],
        attachments: [...alreadyUrlDone],
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

  const feedScreenHeader = useMemo(() => (
    <View>
      <WritePost
              navigation={navigation}
              postDataItem={currentUserDetail}
              onWritePostPress={() => {
                navigation.navigate('WritePostScreen', {
                  postData: currentUserDetail,
                  onPressDone,
                  selectedImageList: [],
                })
              }}
          />
      <View style={styles.sepratorView} />
    </View>
    ), [currentUserDetail, navigation, onPressDone])

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
  }, [authContext, isMoreLoading, isNextDataLoading, postData])

  const renderImageProgress = useMemo(() => <ImageProgress/>, [])

  const renderNewsFeedList = useMemo(() => (
    <NewsFeedList
          pullRefresh={pullRefresh}
          onDeletePost={onDeletePost}
          navigation={navigation}
          postData={postData}
          onEditPressDone={editPostDoneCall}
          onRefreshPress={onRefreshPress}
          footerLoading={footerLoading && isNextDataLoading}
          onLikePress={onLikePress}
          onEndReached={onEndReached}
      />
  ), [
      editPostDoneCall, footerLoading, isNextDataLoading, navigation,
      onDeletePost, onEndReached, onLikePress, onRefreshPress, postData, pullRefresh])

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {feedScreenHeader}
      {firstTimeLoading
          ? (<NewsFeedShimmer/>)
          : (renderNewsFeedList)
      }
      {renderImageProgress}
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
