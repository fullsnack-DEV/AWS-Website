import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,

} from 'react-native';

import images from '../Constants/ImagePath'
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCGroupNameBadge({ name = 'Tiger Youths', groupType = 'team' }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
      <Image source={ groupType === 'team' ? images.teamT : images.clubC} style={ styles.teamTImage } />
    </View>
  );
}
const styles = StyleSheet.create({

  teamTImage: {
    marginLeft: 5,
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },

});
