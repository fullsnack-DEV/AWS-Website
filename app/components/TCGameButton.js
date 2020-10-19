import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,

  Image,
} from 'react-native';
import constants from '../config/constants';

const {
  colors,
} = constants;

export default function TCGameButton({
  title,
  buttonColor,
  onPress,
  imageName,
  buttonTitle,
  extraImageStyle,
  textColor = { color: colors.themeColor },
  imageSize,
}) {
  return (
      <TouchableOpacity onPress={ onPress }>
          <View style={ [styles.gameRecordButton, { backgroundColor: buttonColor }] }>
              {imageName && (
              <Image
            source={ imageName }
            style={ [
              styles.gameRecordImg,
              extraImageStyle,
              { height: imageSize, width: imageSize },
            ] }
          />
              )}
              {buttonTitle && (
              <Text style={ [styles.gameRecordButtonTitle, { color: textColor }] }>
                  {buttonTitle}
              </Text>
              )}
          </View>

          <Text style={ [styles.gameRecordTitle, { color: textColor }] }>{title}</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gameRecordButton: {
    height: 50,
    width: 50,
    borderRadius: 26,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18,
    // margin: 18,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  gameRecordButtonTitle: {
    textAlign: 'center',
  },
  gameRecordImg: {
    resizeMode: 'contain',
  },
  gameRecordTitle: {
    textAlign: 'center',
    marginTop: 5,

    // fontFamily: fonts.RRegular,
    fontSize: 11,
  },
});
