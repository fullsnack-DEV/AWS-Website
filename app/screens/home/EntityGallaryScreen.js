import React, {useContext, useState, useCallback, useRef} from 'react';
import {SafeAreaView, Alert} from 'react-native';

import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';

import AllInOneGallery from './AllInOneGallery';
import {createPost} from '../../api/NewsFeeds';
import strings from '../../Constants/String';
import {ImageUploadContext} from '../../context/ImageUploadContext';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityGallaryScreen({navigation, route}) {
  const galleryRef = useRef();
  const imageUploadContext = useContext(ImageUploadContext);

  const {currentUserData, isAdmin} = route?.params;
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      createPost({...dataParams, is_gallery: true}, authContext)
        .then(() => {
          if (galleryRef?.current?.refreshGallery) {
            galleryRef.current.refreshGallery();
          }
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext],
  );

  const callthis = useCallback(
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
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
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={
          ['user', 'player'].includes(
            route?.params?.role ?? authContext.entity?.role,
          )
            ? 'player'
            : route?.params?.role ?? authContext.entity?.role
        }
        entity_id={route?.params?.uid ?? authContext.entity?.uid}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('WritePostScreen', {
            postData: currentUserData,
            onPressDone: callthis,
            selectedImageList: pickImages,
          });
        }}
      />
    </SafeAreaView>
  );
}
