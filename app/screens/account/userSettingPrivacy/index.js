import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import styles from './style';

import images from '../../../Constants/ImagePath';

export default function UserSettingPrivacyScreen({ navigation }) {
  const userSettingMenu = [
    { key: 'Personal Information', id: 1 },
    { key: 'Change Password', id: 2 },
    // {key: 'Privacy Setting',id:3}
  ];
  const handleOpetions = async (opetions) => {
    if (opetions === 'Personal Information') {
      navigation.navigate('PersonalInformationScreen');
    } else if (opetions === 'Change Password') {
      navigation.navigate('ChangePasswordScreen');
    } else if (opetions === 'Privacy Setting') {
      groupOpetionActionSheet.show();
    }
  };
  const renderMenu = ({ item }) => (

    <TouchableWithoutFeedback
        style={ styles.listContainer }
        onPress={ () => {
          handleOpetions(item.key);
        } }>
      <View style={ { flexDirection: 'row' } }>
        <Text style={ styles.listItems }>{item.key}</Text>
        <Image source={ images.nextArrow } style={ styles.nextArrow } />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <ScrollView style={ styles.mainContainer }>
      <FlatList
            data={ userSettingMenu }
            keyExtractor={ (item) => item.id }
            renderItem={ renderMenu }

            ItemSeparatorComponent={ () => (
              <View style={ styles.separatorLine }></View>
            ) }
          />
      <View style={ styles.separatorLine }></View>
    </ScrollView>
  );
}
