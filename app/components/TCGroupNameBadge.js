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
 name = 'Tiger Youths', textStyle, groupType = 'team',isShowBadge = true ,...otherProps
}) {
  let typeImage = '';
  if (groupType === 'player') typeImage = ''
  else if (groupType === 'club') typeImage = images.clubC
  else if (groupType === 'team') typeImage = images.teamT
  else if (groupType === 'league') typeImage = images.clubC

  return (
    <View style={{ flexDirection: 'row', flex: 1 }} {...otherProps}>
      <Text style={{ ...styles.nameText, ...textStyle }} numberOfLines={5}>{name}</Text>
      {isShowBadge && <Image source={typeImage} style={ styles.teamTImage } />}
    </View>
  );
}
const styles = StyleSheet.create({

  teamTImage: {
    marginHorizontal: 5,
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
