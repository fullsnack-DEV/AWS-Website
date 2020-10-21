import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';

import images from '../../../../../Constants/ImagePath';

import styles from './style';

function TeamCreatedScreen({ navigation, route }) {
  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />
      <TouchableOpacity onPress={ () => navigation.navigate('AccountScreen') }>
        <Image
          source={ images.backArrow }
          style={ {
            marginTop: 45,
            marginLeft: 20,
            height: 20,
            width: 20,
            resizeMode: 'contain',
          } }
        />
      </TouchableOpacity>
      <View style={ styles.sectionStyle }>
        <Image source={ images.group_ph } style={ styles.groupsImg } />

        <Text style={ styles.LocationText }>
          <Text style={ styles.foundText }>
            New Team {route.params.groupName} has been created.
          </Text>
        </Text>
        <TouchableOpacity style={ styles.goToProfileButton }>
          <Text style={ styles.goToProfileTitle }>Switch to Team Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TeamCreatedScreen;
