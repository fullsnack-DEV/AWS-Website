import React, {useContext} from 'react';
import {View} from 'react-native';
import AuthContext from '../../../../auth/context';
import AllInOneGallery from '../../../../screens/home/AllInOneGallery';

const Gallery = ({navigation, gameData, isAdmin, galleryRef}) => {
  const authContext = useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={'game'}
        entity_id={gameData?.game_id}
        onAddPhotoPress={(pickImages) => {
          navigation.navigate('LoneStack', {
            screen: 'WritePostScreen',
            params: {
              postData: authContext.entity.obj ?? {},
              selectedImageList: pickImages,
            },
          });
        }}
      />
    </View>
  );
};

export default Gallery;
