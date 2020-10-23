import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import colors from '../Constants/Colors'
import images from '../Constants/ImagePath'

function TCProfileImageControl({
  onPressBGImage,
  onPressProfileImage,
  bgImagePlaceholder,
  profileImagePlaceholder = images.profilePlaceHolder,
  bgImage,
  profileImage,
  buttonImage = images.certificateUpload,
  bgImageStyle,
  profileImageStyle,
  bgImageButtonStyle,
  profileImageButtonStyle,
}) {
  console.log(bgImage);
  console.log(profileImage);
  console.log(bgImagePlaceholder);
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image style={[styles.bgImageStyle, bgImageStyle]} />
        <TouchableOpacity
        onPress={ onPressBGImage }>
          <Image
            style={[styles.bgCameraButtonStyle, bgImageButtonStyle]}
            source={ buttonImage }
            />
        </TouchableOpacity>
      </View>
      <Image style={[styles.profileImageStyle, profileImageStyle]}
      source={profileImagePlaceholder} />
      <TouchableOpacity
        onPress={ onPressProfileImage }>
        <Image
            style={ [styles.profileCameraButtonStyle, profileImageButtonStyle]}
            source={ buttonImage }
            />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImageStyle: {
    flex: 1,
    aspectRatio: 375 / 173,
    backgroundColor: colors.grayBackgroundColor,
  },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -41,
    marginLeft: 15,
    borderRadius: 41,
  },
  bgCameraButtonStyle: {
    height: 22,
    width: 22,
    alignSelf: 'flex-end',
    marginEnd: 15,
    marginTop: -37,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -22,
    marginLeft: 72,
  },
});

export default TCProfileImageControl;
