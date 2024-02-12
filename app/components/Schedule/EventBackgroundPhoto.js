import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';

function EventBackgroundPhoto({
  imageURL,
  isEdit = false,
  onPress,
  isPreview = false,
  isImage = true,
  containerStyle = {},
}) {
  return (
    <ImageBackground
      source={imageURL}
      imageStyle={styles.imageBorder}
      resizeMode="cover"
      style={[styles.bgStyle, {height: isImage ? 168 : 150}, containerStyle]}>
      {!isPreview && (
        <View>
          {!isEdit && (
            <View style={{marginBottom: 15}}>
              <Text style={styles.featuredImageStyle}>
                {strings.eventFeaturePhoto}
              </Text>
              <Text style={styles.imageStyleText}>
                {strings.eventPhotoRatio}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.uploadPhoto} onPress={onPress}>
            <FastImage
              source={images.choosePic}
              resizeMode={'cover'}
              style={{height: 15, width: 15}}
            />
            <Text style={styles.uploadPhotoStyles}>
              {isEdit ? strings.eventPhotoEdit : strings.eventPhotoUpdate}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  featuredImageStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  uploadPhoto: {
    height: 25,
    width: 130,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },

  imageStyleText: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
  },
  uploadPhotoStyles: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  bgStyle: {
    height: 165,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',

    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
  },
  imageBorder: {},
});

export default EventBackgroundPhoto;
