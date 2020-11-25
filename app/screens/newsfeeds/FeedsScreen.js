import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, Image, Alert,
} from 'react-native';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import { createPost, getNewsFeed, getNewsFeedNextList } from '../../api/NewsFeeds';
import colors from '../../Constants/Colors'
import uploadImages from '../../utils/imageAction';
import ImageProgress from '../../components/newsFeed/ImageProgress';

export default function FeedsScreen({ navigation }) {
  const [postData, setPostData] = useState([]);
  const [newsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getNewsFeed()
        .then((response) => {
          setloading(false);
          setPostData(response.payload.results)
        })
        .catch((e) => {
          setloading(false);
          Alert.alert('', e.messages)
        });
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
      uploadImages(imageArray, progressStatus).then((responses) => {
        const attachments = responses.map((item) => ({
          type: 'image',
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))
        const dataParams = {
          text: postDesc && postDesc,
          attachments,
        };
        createPost(dataParams)
          .then(() => getNewsFeed())
          .then((response) => {
            setPostData(response.payload.results)
            setProgressBar(false);
          })
          .catch((e) => {
            Alert.alert('', e.messages)
          });
      })
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <WritePost
            navigation={navigation}
            postDataItem={postData ? postData[0] : {}}
            onWritePostPress={() => {
              navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: [] })
              setDoneUploadCount(0);
              setTotalUploadCount(0);
            }}
          />
      {progressBar && <ImageProgress
            numberOfUploaded={doneUploadCount}
            totalUpload={totalUploadCount}
            onCancelPress={() => {
              console.log('Cancel Pressed!');
            }}
            postDataItem={postData ? postData[0] : {}}
          />}
      <NewsFeedList
            navigation={navigation}
            newsFeedData={newsFeedData}
            postData={postData}
            footerLoading={footerLoading && isNextDataLoading}
            onEndReached={() => {
              setIsMoreLoading(true);
              setFooterLoading(true);
              const params = {
                id_lt: postData[postData.length - 1].id,
              };
              if (isMoreLoading && isNextDataLoading) {
                getNewsFeedNextList(params).then((response) => {
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
});
