import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import WritePost from '../../../newsFeed/WritePost';
import colors from '../../../../Constants/Colors';
import NewsFeedList from '../../../../screens/newsfeeds/NewsFeedList';
import uploadImages from '../../../../utils/imageAction';
import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';

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
  const onPressDone = (data, postDesc) => {
    if (postDesc.trim().length > 0 && data?.length === 0) {
      const dataParams = {
        text: postDesc,
        game_id: gameData?.game_id,
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
        };
        createPostAfterUpload(dataParams);
      })
    }
  }

  return (
    <View style={{ backgroundColor: colors.whiteColor }}>
      <WritePost
            navigation={navigation}
            postDataItem={currentUserData}
            onWritePostPress={() => {
              navigation.navigate('WritePostScreen', { postData: currentUserData, onPressDone, selectedImageList: [] })
            }}
        />
      <View style={styles.sepratorView} />
      <NewsFeedList
                navigation={navigation}
                postData={gameFeedData}
                scrollEnabled={false}
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
