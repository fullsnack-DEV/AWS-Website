import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import constants from '../config/constants';
import PATH from "../Constants/ImagePath"
import strings from "../Constants/String"
const { colors, fonts, urls, } = constants;

function FacebookButton() {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={[styles.imgWithText, styles.allButton]}
        onPress={() => alert('fb signup..')}>
        <Image source={PATH.signUpFb} style={styles.fbImg} />
        <Text style={styles.fbText}>{strings.fbText}</Text>
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
  fbText: {
    fontSize: 17,
    // fontFamily: fonts.RRegular,
    color: colors.fbTextColor,
    height: 50,
    padding: 12,
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
  fbImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
export default FacebookButton;
