import React, {useState, useContext, useEffect, useCallback} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import AllInOneGallery from '../AllInOneGallery';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';
import {ImageUploadContext} from '../../../context/ImageUploadContext';
import {createPost} from '../../../api/NewsFeeds';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import usePrivacySettings from '../../../hooks/usePrivacySettings';
import {
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
} from '../../../Constants/PrivacyOptionsConstant';

export default function UserGalleryScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const imageUploadContext = useContext(ImageUploadContext);

  const [galleryRef] = useState(route?.params?.galleryRef);
  const [entityType] = useState(route?.params?.entityType);
  const [entityID] = useState(route?.params?.entityID);
  const [currentUserData] = useState(route?.params?.currentUserData);
  const [loading, setLoading] = useState(false);
  const [viewPrivacyStatus, setViewPrivacyStatus] = useState(true);
  const {getPrivacyStatus} = usePrivacySettings();

  useEffect(() => {
    if (isFocused && currentUserData?.user_id) {
      const key = PrivacyKeyEnum.Gallery;
      const privacyVal = PersonalUserPrivacyEnum[currentUserData[key]];
      const status = getPrivacyStatus(privacyVal, currentUserData);
      setViewPrivacyStatus(status);
    }
  }, [isFocused, currentUserData]);

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
  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params?.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ImageProgress />
      <AllInOneGallery
        isAdmin={
          authContext.entity.uid === currentUserData.user_id ??
          currentUserData.group_id
        }
        ref={galleryRef}
        entity_type={
          [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(entityType)
            ? Verbs.entityTypePlayer
            : entityType
        }
        entity_id={entityID}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('NewsFeedStack', {
            screen: 'WritePostScreen',
            params: {
              comeFrom: 'UserGalleryScreen',
              postData: currentUserData,
              selectedImageList: pickImages,
              routeParams: {
                uid: route.params.entityID,
                role: route.params.entityType,
                ...route.params,
              },
            },
          });
        }}
        navigation={navigation}
        handleBackPress={() => {
          navigation.navigate('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: route.params.uid,
              role: route.params.role,
            },
          });
        }}
        isCreatePost={(route.params?.isCreatePost ?? false) && !loading}
        viewPrivacyStatus={viewPrivacyStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
