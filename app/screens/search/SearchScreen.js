import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import TCSearchBox from '../../components/TCSearchBox';
import AllInOneGallery from '../home/AllInOneGallery';

const SearchScreen = ({navigation, route}) => {
  console.log('route value --->');
  console.log(route.params);

  const {isAdmin, galleryRef, entityType, entityID} = route?.params;

  const onPressSearchScreen = () => {
    navigation.navigate('EntitySearchScreen', {});
  };

  return (
    // <View>
    //   <TouchableOpacity onPress={onPressSearchScreen}>
    //     <View>
    //       <TCSearchBox
    //         alignSelf={'center'}
    //         marginTop={13}
    //         marginBottom={15}
    //         editable={false}
    //       />
    //     </View>
    //   </TouchableOpacity>
    <ScrollView style={styles.mainContainer}>
      <TouchableOpacity onPress={onPressSearchScreen}>
        <View>
          <TCSearchBox
            alignSelf={'center'}
            marginTop={13}
            marginBottom={15}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={
          ['user', 'player'].includes(entityType) ? 'player' : entityType
        }
        entity_id={entityID}
        showSubTabs={false}
      />
    </ScrollView>
    // </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
export default SearchScreen;
