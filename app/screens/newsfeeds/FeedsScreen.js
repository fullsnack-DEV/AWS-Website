import React, {
  useEffect, useState, useLayoutEffect, useContext,
} from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, Image, Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
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

export default function FeedsScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  const isFocused = useIsFocused();
  const [postData, setPostData] = useState([]);
  const [newsFeedData] = useState([]);
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
    console.log('postData: ', postData);
  }, [postData])
  useEffect(() => {
    if (isFocused) {
      setloading(true);
      const entity = authContext.entity;
      console.log('Entity :-', entity);
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
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = authContext.entity;
      setCurrentUserDetail(entity.obj || entity.auth.user);
    });

    return () => {
      unsubscribe();
    };
  }, [authContext.entity]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('EntitySearchScreen')}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, []);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const cancelRequest = (axiosTokenSource) => {
    setCancelApiRequest({ ...axiosTokenSource });
  }

  const callthis = (data, postDesc, tagsOfEntity) => {
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
  }

  const createPostAfterUpload = (dataParams) => {
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
  }

  const updatePostAfterUpload = (dataParams) => {
    updatePost(dataParams, authContext)
      .then(() => getNewsFeed(authContext))
      .then((response) => {
        setProgressBar(false);
        setPostData([...response.payload.results])
        setDoneUploadCount(0);
        setTotalUploadCount(0);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }
  const editPostDoneCall = (data, postDesc, selectEditItem, tagData) => {
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
  }

  const onCancelImageUpload = () => {
    if (cancelApiRequest) {
      cancelApiRequest.cancel('Cancel Image Uploading');
    }
    setProgressBar(false);
    setDoneUploadCount(0);
    setTotalUploadCount(0);
  }
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <NewsFeedList
        pullRefresh={pullRefresh}
        onDeletePost={(item) => {
          setloading(true);
          const params = {
            activity_id: item.id,

          };
          if (['team', 'club', 'league'].includes(authContext?.entity?.obj?.entity_type)) {
            params.entity_type = authContext?.entity?.obj?.entity_type;
            params.entity_id = authContext?.entity?.uid;
          }
          deletePost(params, authContext)
            .then(() => getNewsFeed(authContext))
            .then((response) => {
              setloading(false);
              setPostData([...response.payload.results]);
            })
            .catch((e) => {
              setloading(false);
              Alert.alert('', e.messages)
            });
        }}
        navigation={navigation}
        newsFeedData={newsFeedData}
        postData={postData}
        onEditPressDone={editPostDoneCall}
        onRefreshPress={() => {
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
        }}
        footerLoading={footerLoading && isNextDataLoading}
        ListHeaderComponent={() => <View>
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
        </View>}
        onLikePress={(item) => {
          const bodyParams = {
            reaction_type: 'clap',
            activity_id: item.id,
          };
          createReaction(bodyParams, authContext)
            .then(() => getNewsFeed(authContext))
            .then((response) => {
              setPostData([...response.payload.results]);
            })
            .catch((e) => {
              Alert.alert('', e.messages)
            });
        }}
        onEndReached={() => {
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
              .catch((error) => {
                setFooterLoading(false)
                console.log('Next Data Error :-', error);
              })
          }
        }}

      />
      {progressBar && <ImageProgress
          numberOfUploaded={doneUploadCount}
          totalUpload={totalUploadCount}
          onCancelPress={() => {
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
          }}
          postDataItem={currentUserDetail}
      />}
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
