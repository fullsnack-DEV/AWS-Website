/* eslint-disable no-unsafe-optional-chaining */
import React, {useState, useContext} from 'react';

import {ScrollView, StyleSheet} from 'react-native';

import AllInOneGallery from '../AllInOneGallery';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';

export default function UserGalleryScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [galleryRef] = useState(route?.params?.galleryRef);
  const [entityType] = useState(route?.params?.entityType);
  const [entityID] = useState(route?.params?.entityID);
  const [currentUserData] = useState(route?.params?.currentUserData);

  return (
    <ScrollView style={styles.mainContainer}>
      <AllInOneGallery
        isAdmin={authContext.entity.uid === currentUserData.group_id}
        ref={galleryRef}
        entity_type={
          [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(entityType)
            ? Verbs.entityTypePlayer
            : entityType
        }
        entity_id={entityID}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('News Feed', {
            screen: 'WritePostScreen',
            params: {
              comeFrom: 'HomeScreen',
              postData: currentUserData,
              selectedImageList: pickImages,
            },
          });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
