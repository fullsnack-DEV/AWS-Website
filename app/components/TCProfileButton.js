import React from 'react';
import {
  StyleSheet, Text, TouchableWithoutFeedback, View, Image,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCProfileButton({
  title = 'Profile', showArrow = true, onPress, style,
}) {
  return (

    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.buttonView, style]}>
        <Text style={styles.roleTitle}>{title}</Text>
        {showArrow && <Image source={ images.arrowGraterthan } style={ styles.arrowImage } />}
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({

  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    width: 75,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  roleTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  arrowImage: {
    alignSelf: 'center',
    height: 10,
    resizeMode: 'contain',
    width: 5,
    marginLeft: 8,
  },
});
