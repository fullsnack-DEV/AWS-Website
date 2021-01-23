import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,

  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts';

export default function TCGameButton({
  title,
  gradientColor = [colors.offwhite, colors.offwhite],
  onPress,
  imageName,
  buttonTitle,
  buttonTextColor,
  extraImageStyle,
  textColor = { color: colors.themeColor },
  imageSize,
}) {
  return (
    <TouchableOpacity onPress={ onPress }>

      <View style={ styles.gameRecordButton }>
        <LinearGradient
          colors={ gradientColor }
          style={ styles.gameRecordButton }>
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
            <Text style={ [styles.gameRecordButtonTitle, { color: buttonTextColor }] }>
              {buttonTitle}
            </Text>
          )}
        </LinearGradient>
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
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
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
    fontFamily: fonts.RBold,
    fontSize: 11,
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
