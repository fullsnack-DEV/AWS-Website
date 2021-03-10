import React, {
 useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Alert, FlatList, View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AddPhotoItem from '../../../Home/AddPhotoItem';
import SingleImageRender from '../../../Home/SingleImageRender';
import MultipleImageRender from '../../../Home/MultipleImageRender';
import SingleVideoRender from '../../../Home/SingleVideoRender';
import MultipleVideoRender from '../../../Home/MultipleVideoRender';
import { createPost } from '../../../../api/NewsFeeds';
import ActivityLoader from '../../../loader/ActivityLoader';
import AuthContext from '../../../../auth/context';
import { ImageUploadContext } from '../../../../context/ImageUploadContext';

const Gallery = ({
  navigation,
  gameData,
  getGalleryData,
}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext)
  const [allData, setAllData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGalleryData(gameData?.game_id).then((res) => {
      setAllData([...res.payload]);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const createPostAfterUpload = useCallback((dataParams) => {
    createPost(dataParams, authContext)
        .then((response) => {
          const pData = [...postData]
          pData.unshift(response?.payload);
          setPostData([...pData])
          getGalleryData(gameData?.game_id).then((res) => {
            setAllData([...res?.payload]);
          });
        })
        .catch((error) => {
          setLoading(false)
          Alert.alert(error)
        })
  }, [authContext, gameData?.game_id, getGalleryData, postData])

  const callthis = useCallback((data, postDesc) => {
    if (data) {
      const dataParams = {
        entity_type: 'game',
        game_id: gameData?.game_id,
        text: postDesc && postDesc,
        attachments: [],
      };
      const imageArray = data.map((dataItem) => (dataItem))
      imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
      )
    }
  }, [authContext, createPostAfterUpload, gameData?.game_id, imageUploadContext])

  const onAddPhotoPress = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      maxFiles: 10,
    }).then((pickImages) => {
      navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: pickImages })
    });
  }, [callthis, navigation, postData])

  const allGalleryRenderItem = useCallback(({ item, index }) => {
    if (index === 0) {
      return (
        <AddPhotoItem onAddPhotoPress={onAddPhotoPress} />
      );
    }
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
  }, [onAddPhotoPress])

  const galleryKeyExtractor = useCallback((item, index) => index, [])
  return (
    <View style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />
      <FlatList
          data={['0', ...allData]}
          bounces={false}
          renderItem={allGalleryRenderItem}
          numColumns={3}
          style={{ marginHorizont: 1.5 }}
          keyExtractor={galleryKeyExtractor}
      />
    </View>
  )
}

export default Gallery;
