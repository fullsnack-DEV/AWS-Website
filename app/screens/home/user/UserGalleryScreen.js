/* eslint-disable no-unsafe-optional-chaining */
import React,{useState,useContext} from 'react';

import {
  ScrollView,
  StyleSheet,

} from 'react-native';

import AllInOneGallery from '../AllInOneGallery';
import AuthContext from '../../../auth/context';

export default function UserGalleryScreen({ navigation, route }) {
 

  const authContext = useContext(AuthContext);
 const [galleryRef] = useState(route?.params?.galleryRef);
 const [entityType] = useState(route?.params?.entityType);
 const [entityID] = useState(route?.params?.entityID);
 const [currentUserData] = useState(route?.params?.currentUserData);

 const [callFunction] = useState(route?.params?.callFunction);

console.log('callFunctioncallFunction',callFunction);
  return (

    <ScrollView style={styles.mainContainer}>

      <AllInOneGallery
            isAdmin={authContext.entity.uid === currentUserData.group_id}
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
                comeFrom:'HomeScreen',
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
