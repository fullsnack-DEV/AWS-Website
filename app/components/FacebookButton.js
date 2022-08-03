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
import {getHitSlop} from '../utils';

function FacebookButton({onPress}) {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.allButton}
        onPress={onPress}
        hitSlop={getHitSlop(15)}>
        <Image source={images.signUpFb} style={styles.fbImg} />
        <Text style={styles.fbText}>{strings.fbText}</Text>
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
  fbImg: {
    flex: 0.2,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    left: 30,
    width: 20,
  },
  fbText: {
    flex: 1,
    color: colors.eventBlueColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    textAlign: 'center',
  },
});
export default FacebookButton;
