import React from 'react';
import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {strings} from '../../Localization/translation';
import {getHitSlop} from '../utils';

function GoogleButton({onPress}) {
  return (
    <TouchableOpacity
      style={styles.allButton}
      onPress={onPress}
      hitSlop={getHitSlop(15)}>
      <Image source={images.signUpGoogle} style={styles.googleImg} />
      <Text style={styles.googleText}>{strings.googleText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  allButton: {
    marginVertical: 5,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    alignItems: 'center',
    padding: 12,
    shadowColor: colors.googleColor,
  },
  googleImg: {
    flex: 0.2,
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
    position: 'absolute',
    left: 30,
  },
  googleText: {
    flex: 1,
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    textAlign: 'center',
  },
});

export default GoogleButton;
