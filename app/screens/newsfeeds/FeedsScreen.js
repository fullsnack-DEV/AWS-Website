import React, {
  useEffect, useState, useLayoutEffect, useContext,
} from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, Image, Alert,
} from 'react-native';
import { Observable } from 'rxjs';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {
  createPost,
  getNewsFeed,
  getNewsFeedNextList,
  updatePost,
} from '../../api/NewsFeeds';
import colors from '../../Constants/Colors'
import uploadImages from '../../utils/imageAction';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import AuthContext from '../../auth/context'

export default function FeedsScreen({ navigation }) {
  let subscribeUploadImage = null;
  const authContext = useContext(AuthContext)
  const [postData, setPostData] = useState([]);
  const [newsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  let cancelPressed = false;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = authContext.entity;
      console.log('Entity :-', entity);
      setCurrentUserDetail(entity.obj || entity.auth.user);
      getNewsFeed(authContext)
        .then((response) => {
          setloading(false);
          setPostData(response.payload.results)
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => Alert.alert('', e.message), 100)
        });
    });

    return () => {
      unsubscribe();
      if (subscribeUploadImage) subscribeUploadImage.unsubscribe();
    };
  }, [navigation]);

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
  }, [navigation]);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const callthis = (data, postDesc) => {
    if (data) {
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = data.map((dataItem) => (dataItem))
      const observable$ = Observable.create((observer) => {
        uploadImages(imageArray, authContext, progressStatus)
          .then((response) => {
            observer.next(response);
            observer.complete();
          })
      });

      subscribeUploadImage = observable$.subscribe({
        next: (response) => {
          const attachments = response.map((item) => ({
            type: item.type,
            url: item.fullImage,
            thumbnail: item.thumbnail,
            media_height: item.height,
            media_width: item.width,
          }))
          const dataParams = {
            text: postDesc && postDesc,
            attachments,
          };
          if (!cancelPressed) {
            createPostAfterUpload(dataParams);
          }
        },
      });
    }
  }

  const createPostAfterUpload = (dataParams) => {
    createPost(dataParams, authContext)
      .then(() => getNewsFeed(authContext))
      .then((response) => {
        setPostData(response.payload.results)
        setProgressBar(false);
        setDoneUploadCount(0);
        setTotalUploadCount(0);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }

  const editPostDoneCall = (data, postDesc, selectEditItem) => {
    let attachmentsData = [];
    const alreadyUrlDone = [];
    const createUrlData = [];
    if (data) {
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
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = createUrlData.map((dataItem) => (dataItem))
      uploadImages(imageArray, authContext, progressStatus).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }))
        attachmentsData = [...alreadyUrlDone, ...attachments];
        const params = {
          activity_id: selectEditItem.id,
          text: postDesc,
          attachments: attachmentsData,
        };
        updatePost(params, authContext)
          .then(() => getNewsFeed(authContext))
          .then((response) => {
            setPostData(response.payload.results)
            setProgressBar(false);
            setDoneUploadCount(0);
            setTotalUploadCount(0);
          })
          .catch((e) => {
            Alert.alert('', e.messages)
          });
      })
    }
  }

  const onCancelImageUpload = () => {
    cancelPressed = true;
    if (subscribeUploadImage) {
      subscribeUploadImage.unsubscribe();
    }
    setProgressBar(false);
    setDoneUploadCount(0);
    setTotalUploadCount(0);
  }
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {progressBar && <ImageProgress
        numberOfUploaded={doneUploadCount}
        totalUpload={totalUploadCount}
        onCancelPress={() => {
          console.log('Cancel Pressed!');
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
      <NewsFeedList
        navigation={navigation}
        newsFeedData={newsFeedData}
        postData={postData}
        onPressDone={editPostDoneCall}
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
        onEndReached={() => {
          setIsMoreLoading(true);
          setFooterLoading(true);
          const params = {
            id_lt: postData[postData.length - 1].id,
          };
          if (isMoreLoading && isNextDataLoading) {
            getNewsFeedNextList(params, authContext).then((response) => {
              if (response) {
                if (response.payload.next === '') {
                  setIsNextDataLoading(false);
                }
                setIsMoreLoading(false);
                setFooterLoading(false)
                const data = [...postData, ...response.payload.results]
                setPostData(data);
              }
            })
              .catch((error) => {
                setFooterLoading(false)
                console.log('Next Data Error :-', error);
              })
          }
        }}
      />
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
