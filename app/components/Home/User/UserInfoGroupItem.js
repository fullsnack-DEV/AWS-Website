import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCImage from '../../TCImage';

export default function UserInfoGroupItem({
  title,
  imageData,
  entityType = 'club',
  onGroupPress,
}) {
  let logoImage = images.clubC
  let placeholder = images.clubPlaceholderSmall
  switch (entityType) {
    case 'team':
      placeholder = images.teamPlaceholderSmall
      logoImage = images.teamT
      break;
    case 'league':
      placeholder = images.teamPlaceholderSmall
      logoImage = images.clubC
      break;
    default:
  }

  return (
    <TouchableOpacity onPress={ onGroupPress } style={{ width: 55, height: 'auto', marginLeft: 26 }}>
      <View style={styles.imageContainerStyle}>
        <Image style={styles.placeHolderImage}
        source={placeholder}>
        </Image>
        <View style={styles.placeholderTextContainer}>
          <Text style={styles.placeholderText}>{title.charAt(0).toUpperCase()}</Text>
        </View>
        <TCImage
        containerStyle={styles.mainImageStyle}
        resizeMode={'contain'}
        imageStyle={styles.mainImageStyle}
        source={imageData}/>
        <View style={styles.logoContainerStyle}>
          <Image
        style={styles.logoImageStyle} source={logoImage}/>
        </View>
      </View>
      <Text style={styles.titleStyle} ellipsizeMode={'middle'} numberOfLines={ 2 }>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainerStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.26,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  placeHolderImage: {
    position: 'absolute',
    width: 46,
    height: 46,
    resizeMode: 'contain',
    marginTop: 5,
    marginLeft: 2,
  },
  placeholderTextContainer: {
    width: 50,
    height: 48,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: 21,
  },
  mainImageStyle: {
    position: 'absolute',
    width: 49,
    height: 49,
    marginTop: 0.5,
    marginLeft: 0.5,
    borderRadius: 25,
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
  },
  logoContainerStyle: {
    marginLeft: 35,
    marginTop: 35,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: '#ffffff',
    zIndex: 100,
    position: 'absolute',
  },
  logoImageStyle: {
    width: 14,
    height: 14,
    marginTop: 0.5,
    marginLeft: 0.5,
    borderRadius: 7.5,
  },
  titleStyle: {
    marginTop: 5,
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
})
