/* eslint-disable no-unused-vars */
import React, {useCallback, useContext} from 'react';
import {Alert, View} from 'react-native';
import {createPost} from '../../../../api/NewsFeeds';
import AuthContext from '../../../../auth/context';
import Verbs from '../../../../Constants/Verbs';
import {ImageUploadContext} from '../../../../context/ImageUploadContext';
import AllInOneGallery from '../../../../screens/home/AllInOneGallery';

const Gallery = ({navigation, gameData, isAdmin, galleryRef}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);
  const createPostAfterUpload = useCallback(
    (dataParams) => {
      const body = dataParams;

      if (
        authContext.entity.role === Verbs.entityTypeClub ||
        authContext.entity.role === Verbs.entityTypeTeam
      ) {
        body.group_id = authContext.entity.uid;
      }

      createPost({...body, is_gallery: true}, authContext)
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
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
      console.log('dataParamsdataParamsdataParams', gameData);
      if (postDesc.trim().length > 0 && data?.length === 0) {
        const dataParams = {
          text: postDesc,
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
        const dataParams = {
          text: postDesc && postDesc,
          game_id: gameData?.game_id,
          attachments: [],
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };

        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  return (
    <View style={{flex: 1}}>
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={'game'}
        entity_id={gameData?.game_id}
        onAddPhotoPress={(pickImages) => {
          console.log('onAddPhotoPress:::', pickImages);
          navigation.navigate('WritePostScreen', {
            postData: authContext?.entity?.obj ?? {},
            onPressDone: callthis,
            selectedImageList: pickImages,
          });
        }}
      />
    </View>
  );
};

export default Gallery;
