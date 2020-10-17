import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import constants from '../config/constants';
import PATH from "../Constants/ImagePath"
import strings from "../Constants/String"
const { colors, fonts, urls} = constants;

function GoogleButton({onPress}) {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={[styles.imgWithText, styles.allButton]}
        onPress={onPress}>
        <Image source={PATH.signUpGoogle} style={styles.googleImg} />
        <Text style={styles.googleText}>{strings.googleText}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allButton: {
    backgroundColor: colors.whiteColor,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    borderRadius: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,

    //elevation: 5,
  },
  googleText: {
    fontSize: 17,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,
    height: 50,
    padding: 12,
  },
  googleImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
});

export default GoogleButton;
