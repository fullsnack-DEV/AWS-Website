import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import WritePost from '../../../newsFeed/WritePost';
import colors from '../../../../Constants/Colors';
import NewsFeedList from '../../../../screens/newsfeeds/NewsFeedList';
import uploadImages from '../../../../utils/imageAction';
import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';
import {
  createReaction, deletePost, updatePost,
} from '../../../../api/NewsFeeds';
import ActivityLoader from '../../../loader/ActivityLoader';

const GameFeed = ({
  gameData,
  navigation,
  currentUserData,
  getGameFeedData,
  createGamePostData,
  setUploadImageProgressData,
}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [gameFeedData, setGameFeedData] = useState([]);
  const [progressBar, setProgressBar] = useState(false);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isFocused && gameData) {
      const params = { uid: gameData?.game_id }
      getGameFeedData(params).then((res) => {
        setGameFeedData([...res?.payload?.results])
      })
    }
  }, [isFocused, gameData]);

  useEffect(() => {
    if (progressBar) {
      setUploadImageProgressData({
        doneUploadCount,
        postData: gameFeedData,
        totalUploadCount,
        cancelRequest: cancelApiRequest,
      })
    } else {
      setUploadImageProgressData(null);
    }
  }, [progressBar, doneUploadCount, totalUploadCount, gameFeedData, cancelApiRequest])
  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }
  const cancelRequest = (cancelAxiosToken) => {
    setCancelApiRequest(cancelAxiosToken);
  }

  const createPostAfterUpload = (dataParams) => {
    const params = { uid: gameData?.game_id }
    createGamePostData(dataParams)
      .then(() => getGameFeedData(params))
      .then((response) => {
        setGameFeedData([...response?.payload?.results])
        setProgressBar(false);
        setDoneUploadCount(0);
        setTotalUploadCount(0);
      })
      .catch((error) => {
        setProgressBar(false);
        setDoneUploadCount(0);
        setTotalUploadCount(0);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message)
        }, 0.3)
      })
  }
  const onPressDone = (data, postDesc, tagsOfEntity) => {
    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        game_id: gameData?.game_id,
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
          game_id: gameData?.game_id,
          text: postDesc && postDesc,
          attachments,
          taggedData: tagsOfEntity ?? [],
        };
        createPostAfterUpload(dataParams)
      })
    }
  }

  const updatePostAfterUpload = (dataParams) => {
    const params = { uid: gameData?.game_id }
    updatePost(dataParams, authContext)
      .then(() => getGameFeedData(params))
      .then((response) => {
        setGameFeedData([...response.payload.results])
        setProgressBar(false);
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
        game_id: gameData?.game_id,
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
          game_id: gameData?.game_id,
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

  return (
    <View style={{ backgroundColor: colors.whiteColor }}>
      <ActivityLoader visible={loading}/>
      <WritePost
            navigation={navigation}
            postDataItem={currentUserData}
            onWritePostPress={() => {
              navigation.navigate('WritePostScreen', { postData: currentUserData, onPressDone, selectedImageList: [] })
            }}
        />
      <View style={styles.sepratorView} />
      <NewsFeedList
          onDeletePost={(item) => {
            setLoading(true);
            const params = {
              activity_id: item.id,
            };
            if (['team', 'club', 'league'].includes(authContext?.entity?.obj?.entity_type)) {
              params.entity_type = authContext?.entity?.obj?.entity_type;
              params.entity_id = authContext?.entity?.uid;
            }
            const feedParams = { uid: gameData?.game_id }
            deletePost(params, authContext)
              .then(() => getGameFeedData(feedParams))
              .then((response) => {
                setLoading(false);
                setGameFeedData([...response.payload.results]);
              })
              .catch((e) => {
                setLoading(false);
                Alert.alert('', e.messages)
              });
          }}
          navigation={navigation}
          postData={gameFeedData}
          onEditPressDone={editPostDoneCall}
          onLikePress={(item) => {
            const bodyParams = {
              reaction_type: 'clap',
              activity_id: item.id,
            };
            const params = { uid: gameData?.game_id }
            createReaction(bodyParams, authContext)
              .then(() => getGameFeedData(params))
              .then((response) => {
                setGameFeedData([...response.payload.results]);
              })
              .catch((e) => {
                console.log(e);
                Alert.alert('', e.messages)
              });
          }}
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

export default GameFeed;
