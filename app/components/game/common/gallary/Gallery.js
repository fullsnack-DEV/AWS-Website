import React, {
  useCallback, useContext,
} from 'react';
import { Alert, View } from 'react-native';
import { createPost } from '../../../../api/NewsFeeds';
import AuthContext from '../../../../auth/context';
import { ImageUploadContext } from '../../../../context/ImageUploadContext';
import AllInOneGallery from '../../../../screens/home/AllInOneGallery';

const Gallery = ({
  navigation,
  gameData,
  isAdmin,
  galleryRef,
}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext)
  const createPostAfterUpload = useCallback((dataParams) => {
    createPost(dataParams, authContext)
        .then(() => {
          if (galleryRef?.current?.refreshGallery) galleryRef.current.refreshGallery();
        })
        .catch((error) => {
          Alert.alert(error)
        })
  }, [authContext])

  const callthis = useCallback((data, postDesc, taggedData) => {
    if (data) {
      const dataParams = {
        entity_type: 'game',
        game_id: gameData?.game_id,
        text: postDesc && postDesc,
        attachments: [],
        tagged: taggedData,
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

  return (
    <View style={{ flex: 1 }}>
      <AllInOneGallery
          isAdmin={isAdmin}
          ref={galleryRef}
          entity_type={'game'}
          entity_id={gameData?.game_id}
          onAddPhotoPress={(pickImages) => {
            navigation.navigate('WritePostScreen', { postData: authContext?.entity?.obj ?? {}, onPressDone: callthis, selectedImageList: pickImages })
          }}
      />
    </View>
  )
}

export default Gallery;
