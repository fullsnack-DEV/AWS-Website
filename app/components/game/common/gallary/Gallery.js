import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, FlatList, View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AddPhotoItem from '../../../Home/AddPhotoItem';
import SingleImageRender from '../../../Home/SingleImageRender';
import MultipleImageRender from '../../../Home/MultipleImageRender';
import SingleVideoRender from '../../../Home/SingleVideoRender';
import MultipleVideoRender from '../../../Home/MultipleVideoRender';
import uploadImages from '../../../../utils/imageAction';
import { createPost, getNewsFeed } from '../../../../api/NewsFeeds';
import ActivityLoader from '../../../loader/ActivityLoader';
import AuthContext from '../../../../auth/context';

const Gallery = ({
  setUploadImageProgressData,
  navigation,
  gameData,
  getGalleryData,
}) => {
  const authContext = useContext(AuthContext);
  const [allData, setAllData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGalleryData(gameData?.game_id).then((res) => {
      setAllData(res.payload);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }
  useEffect(() => {
    if (progressBar) {
      setUploadImageProgressData({
        doneUploadCount,
        postData,
        totalUploadCount,
      })
    } else {
      setUploadImageProgressData(null);
    }
  }, [progressBar, doneUploadCount, totalUploadCount, postData])
  const callthis = (data, postDesc) => {
    if (data) {
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = data.map((dataItem) => (dataItem))
      uploadImages(imageArray, authContext, progressStatus).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))
        const dataParams = {
          entity_type: 'game',
          game_id: gameData?.game_id,
          text: postDesc && postDesc,
          attachments,
        };
        createPost(dataParams, authContext)
          .then(() => getNewsFeed(authContext))
          .then((response) => {
            setPostData(response?.payload?.results ?? [])
            setProgressBar(false);
            getGalleryData(gameData?.game_id).then((res) => {
              setAllData(res?.payload ?? []);
            });
          })
          .catch((error) => {
            setLoading(false)
            Alert.alert(error)
          })
      })
    }
  }

  const allGalleryRenderItem = (item, index) => {
    if (index === 0) {
      return (
        <AddPhotoItem
            onAddPhotoPress={() => {
              ImagePicker.openPicker({
                width: 300,
                height: 400,
                multiple: true,
                maxFiles: 10,
              }).then((pickImages) => {
                navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: pickImages })
              });
            }}
        />
      );
    }
    console.log(item);
    if (item.attachments.length > 0) {
      if (item.attachments[0].type === 'image') {
        return item.attachments.length === 1
          ? <SingleImageRender data={item} />
          : <MultipleImageRender data={item} />
      }

      if (item.attachments[0].type === 'video') {
        return item.attachments.length === 1
          ? <SingleVideoRender data={item} />
          : <MultipleVideoRender data={item}/>
      }
    }
    return <View />
  }
  return (
    <View style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />
      <FlatList
          data={['0', ...allData]}
          bounces={false}
          renderItem={({ item, index }) => allGalleryRenderItem(item, index)}
          numColumns={3}
          style={{ marginHorizont: 1.5 }}
          keyExtractor={(item, index) => index}
      />
    </View>
  )
}

export default Gallery;
