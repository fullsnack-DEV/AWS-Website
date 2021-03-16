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

export default function TCGroupNameBadge({
 name = 'Tiger Youths', textStyle, groupType = 'team', ...otherProps
}) {
  let typeImage = images.teamT;
  if (groupType === 'player') typeImage = ''
  else if (groupType === 'club') typeImage = images.clubC
  else if (groupType === 'league') typeImage = images.clubC

  return (
    <View style={{ flexDirection: 'row' }} {...otherProps}>
      <Text style={{ ...styles.nameText, ...textStyle }} numberOfLines={1}>{name}</Text>
      <Image source={typeImage} style={ styles.teamTImage } />
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
