import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';

import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

import styles from './style';

function ClubCreatedScreen({ navigation, route }) {
  return (
      <View style={ styles.mainContainer }>
          <Image style={ styles.background } source={ PATH.orangeLayer } />
          <Image style={ styles.background } source={ PATH.bgImage } />
          <TouchableOpacity onPress={ () => navigation.navigate('AccountScreen') }>
              <Image
          source={ PATH.backArrow }
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
              <Image source={ PATH.group_ph } style={ styles.groupsImg } />

              <Text style={ styles.LocationText }>
                  <Text style={ styles.foundText }>
                      {route.params.groupName} has been created.
                  </Text>
              </Text>
              <TouchableOpacity style={ styles.goToProfileButton }>
                  <Text style={ styles.goToProfileTitle }>{strings.goToClubText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ styles.inviteUserButton }>
                  <Text style={ styles.goToProfileTitle }>{strings.inviteUserText}</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
}

export default ClubCreatedScreen;
