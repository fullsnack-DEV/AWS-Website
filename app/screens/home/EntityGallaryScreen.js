import React, {useContext, useState, useRef, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert, SafeAreaView} from 'react-native';
import AuthContext from '../../auth/context';
import AllInOneGallery from './AllInOneGallery';
import Verbs from '../../Constants/Verbs';
import {createPost} from '../../api/NewsFeeds';
import {ImageUploadContext} from '../../context/ImageUploadContext';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';

export default function EntityGallaryScreen({navigation, route}) {
  const galleryRef = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);

  const [currentUserData] = useState(route?.params?.currentUserData);
  const [loading, setLoading] = useState(false);

  const createPostAfterUpload = (dataParams) => {
    let body = dataParams;
    setLoading(true);

    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      body = {
        ...dataParams,
        group_id: authContext.entity.uid,
        showPreviewForUrl: true,
      };
    }

    createPost(body, authContext)
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isFocused && route.params?.isCreatePost) {
      const {dataParams, imageArray} = route.params;
      if (imageArray.length > 0) {
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      } else {
        createPostAfterUpload(dataParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.isCreatePost]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <ImageProgress />
      <AllInOneGallery
        isAdmin={authContext.entity.uid === currentUserData.group_id}
        ref={galleryRef}
        entity_type={currentUserData?.entity_type ?? authContext.entity?.role}
        entity_id={route?.params?.uid ?? authContext.entity?.uid}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('WritePostScreen', {
            comeFrom: 'EntityGallaryScreen',
            postData: currentUserData,
            selectedImageList: pickImages,
            routeParams: {
              uid: currentUserData.group_id,
              role: currentUserData.entity_type,
              ...route.params,
            },
          });
        }}
        navigation={navigation}
        handleBackPress={() => {
          navigation.navigate('Account', {
            screen: 'HomeScreen',
            params: {
              uid: route.params.uid,
              role: route.params.role,
            },
          });
        }}
        isCreatePost={(route.params?.isCreatePost ?? false) && !loading}
      />
    </SafeAreaView>
  );
}
