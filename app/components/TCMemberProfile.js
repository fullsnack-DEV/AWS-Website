import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,

} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCMemberProfile({
  image,
  name,
  location,
  type = 'large',
  color = colors.lightBlackColor, ...Props
}) {
  return (

    <View style={[styles.topViewContainer, Props]}>
      <Image source={image} style={ styles.profileImage } />
      <View style={styles.topTextContainer}>
        {type === 'large' && name && <Text style={[styles.nameText, { color }]} numberOfLines={1}>{name}</Text>}
        {location !== '' && <Text style={[styles.locationText, { color }]} numberOfLines={1}>{location}</Text>}
      </View>
    </View>

  );
}
const styles = StyleSheet.create({

  profileImage: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 80,
  },

  topViewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },

  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
marginRight: 25,
  },

  locationText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
  },

});
