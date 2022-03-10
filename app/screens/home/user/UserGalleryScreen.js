/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';

import {
  ScrollView,
  StyleSheet,

} from 'react-native';

import AllInOneGallery from '../AllInOneGallery';

export default function UserGalleryScreen({ navigation, route }) {
    const {
 isAdmin, galleryRef, entityType, entityID, currentUserData, callFunction,
 } = route?.params ?? {};

  return (

    <ScrollView style={styles.mainContainer}>

      <AllInOneGallery
            isAdmin={isAdmin}
            ref={galleryRef}
            entity_type={
              ['user', 'player'].includes(
                entityType,
              )
                ? 'player'
                : entityType
            }
            entity_id={entityID}
            onAddPhotoPress={(pickImages) => {
              navigation.navigate('WritePostScreen', {
                postData: currentUserData,
                onPressDone: callFunction,
                selectedImageList: pickImages,
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
