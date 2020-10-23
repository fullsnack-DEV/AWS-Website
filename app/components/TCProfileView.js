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

export default function TCProfileView({
  image = images.profilePlaceHolder, name = 'Neymar JR', location = 'Vancouver, BC', type = 'large', ...Props
}) {
  return (

    <View style={[styles.topViewContainer, Props]}>
      <View style={styles.profileView}>
        <Image source={ image } style={ styles.profileImage } />
      </View>
      <View style={styles.topTextContainer}>
        {type === 'medium' && <Text style={styles.mediumNameText} numberOfLines={1}>{name}</Text>}
        {type === 'large' && <Text style={styles.nameText} numberOfLines={1}>{name}</Text>}

        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({

  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },

  topViewContainer: {
    flexDirection: 'row',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },

});
