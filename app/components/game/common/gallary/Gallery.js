import React, {useCallback, useContext} from 'react';
import {Alert, View} from 'react-native';
import {createPost} from '../../../../api/NewsFeeds';
import AuthContext from '../../../../auth/context';
import {ImageUploadContext} from '../../../../context/ImageUploadContext';
import AllInOneGallery from '../../../../screens/home/AllInOneGallery';

const Gallery = ({navigation, gameData, isAdmin, galleryRef}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);
  const createPostAfterUpload = useCallback(
    (dataParams) => {
      createPost({...dataParams, is_gallery: true}, authContext)
        .then(() => {
          if (galleryRef?.current?.refreshGallery)
            galleryRef.current.refreshGallery();
        })
        .catch((error) => {
          Alert.alert(error);
        });
    },
    [authContext],
  );

  const callthis = useCallback(
    (data, postDesc, taggedData, format_tagged_data) => {
      console.log('datadatadata',data);
      console.log('datadatadata postDesc',postDesc);

      console.log('datadatadata taggedData',taggedData);
      console.log('datadatadata format_tagged_data',format_tagged_data);

      if (data) {
        const dataParams = {
          entity_type: 'game',
          game_id: gameData?.game_id,
          text: postDesc && postDesc,
          attachments: [],
          tagged: taggedData,
          format_tagged_data,
        };
        const imageArray = data.map((dataItem) => dataItem);
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
        
      }
      
    },
    [authContext, createPostAfterUpload, gameData?.game_id, imageUploadContext],
  );

  return (
    <View style={{flex: 1}}>
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={'game'}
        entity_id={gameData?.game_id}
        onAddPhotoPress={(pickImages) => {
          console.log('onAddPhotoPress');
          navigation.navigate('WritePostScreen',{
            postData: authContext?.entity?.obj ?? {},
            onPressDone: callthis(),
            selectedImageList: pickImages,
          });
        }}
      />
    </View>
  );
};

export default Gallery;
