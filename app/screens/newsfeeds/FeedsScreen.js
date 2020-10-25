import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, Image, Alert,
} from 'react-native';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import { createPost, getNewsFeed } from '../../api/NewsFeedapi';
import colors from '../../Constants/Colors'
import uploadImages from '../../utils/imageAction';
import ImageProgress from '../../components/newsFeed/ImageProgress';

export default function FeedsScreen({ navigation, route }) {
  const [postData, setPostData] = useState([]);
  const [newsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  useEffect(() => {
    const imageUploadFile = navigation.addListener('focus', async () => {
      if (route.params && route.params.data) {
        setTotalUploadCount(route.params.data.length || 1);
        setProgressBar(true);
        const imageArray = route.params.data.map((data) => (data))
        uploadImages(imageArray, progressStatus).then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }))
          const data = {
            text: route.params.postDescriptions ? route.params.postDescriptions : '',
            attachments,
          };
          createPost(data)
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
    });

    return () => {
      imageUploadFile();
    };
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getNewsFeed()
        .then((response) => {
          setPostData(response.payload.results)
        })
        .catch((e) => Alert.alert('', e.messages));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('AccountScreen')}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getNewsFeed()
      .then((response) => {
        setPostData(response.payload.results);
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
        setloading(false);
      });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <WritePost
            navigation={navigation}
            postDataItem={postData ? postData[0] : {}}
            onWritePostPress={() => {
              navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {} })
              navigation.setParams({ data: null, postDescriptions: '' })
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
