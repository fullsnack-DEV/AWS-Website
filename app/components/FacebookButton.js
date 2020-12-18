import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts'
import images from '../Constants/ImagePath'
import strings from '../Constants/String'

function FacebookButton({ onPress }) {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={ [styles.imgWithText, styles.allButton] }
        onPress={ onPress }>
        <Image source={ images.signUpFb } style={ styles.fbImg } />
        <Text style={ styles.fbText }>{strings.fbText}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allButton: {
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  fbImg: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  fbText: {
    color: colors.fbTextColor,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    marginLeft: 10,
  },
  imgWithText: {
    flexDirection: 'row',
  },
});
export default FacebookButton;
