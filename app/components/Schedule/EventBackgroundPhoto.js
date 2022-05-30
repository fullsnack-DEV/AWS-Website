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

function EventBackgroundPhoto({
  imageURL,
  isEdit= false,
}) {
  return (
    <View style={styles.containerStyle}>
      <ImageBackground source={{uri: imageURL}} style={{resizeMode:'contain'}}>
        <View>
          {!isEdit && <View style={{ marginBottom: 15,}}>
            <Text style={styles.featuredImageStyle}>FEATURED PHOTO</Text>
            <Text style={styles.imageStyleText}>At least 1284x2778 pixels</Text>
          </View>}
          <TouchableOpacity style={styles.uploadPhoto}>
            <FastImage
              source={images.choosePic}
              resizeMode={'cover'}
              style={{height: 15, width: 15}}
            />
            <Text style={styles.uploadPhotoStyles}>{isEdit ? 'Edit photo' : 'Upload photo'}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  containerStyle: {
    height: 200,
    width: '100%',
    backgroundColor: colors.textFieldBackground,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default EventBackgroundPhoto;
