import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import strings from '../Constants/String';

function AppleButton({onPress}) {
  return (
    <SafeAreaView>
      <TouchableOpacity style={styles.allButton} onPress={onPress}>
        <Image source={images.appleLogo} style={styles.googleImg} />
        <Text style={styles.googleText}>{strings.appleText}</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
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

export default AppleButton;
