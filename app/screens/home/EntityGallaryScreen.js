import React, {useContext, useState, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import AuthContext from '../../auth/context';
import AllInOneGallery from './AllInOneGallery';

export default function EntityGallaryScreen({navigation, route}) {
  const galleryRef = useRef();

  const [currentUserData] = useState(route?.params?.currentUserData);

  const authContext = useContext(AuthContext);

  return (
    <SafeAreaView style={{flex: 1}}>
      <AllInOneGallery
        isAdmin={authContext.entity.uid === currentUserData.group_id}
        ref={galleryRef}
        entity_type={currentUserData?.entity_type ?? authContext.entity?.role}
        entity_id={route?.params?.uid ?? authContext.entity?.uid}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('LoneStack', {
            screen: 'WritePostScreen',
            params: {
              comeFrom: 'HomeScreen',
              postData: currentUserData,
              selectedImageList: pickImages,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
