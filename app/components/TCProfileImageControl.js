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
  showEditButtons = false,
}) {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image style={[styles.bgImageStyle, bgImageStyle]}
        source={ bgImage }
        defaultSource={ bgImagePlaceholder } />
        {showEditButtons && <TouchableOpacity
        style={styles.bgCameraButtonStyle}
        onPress={ onPressBGImage }>
          <Image
            style={[styles.bgImageButtonStyle, bgImageButtonStyle]}
            source={ buttonImage }
            />
        </TouchableOpacity>}
      </View>
      <Image style={[styles.profileImageStyle, profileImageStyle,
        { marginTop: showEditButtons ? -20 : -36 }]}
      source={profileImage || profileImagePlaceholder}
      defaultSource={ profileImagePlaceholder } />
      {showEditButtons && <TouchableOpacity
      style={styles.profileCameraButtonStyle}
        onPress={ onPressProfileImage }>
        <Image
            style={ [styles.profileImageButtonStyle, profileImageButtonStyle]}
            source={ buttonImage }
            />
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  bgImageStyle: {
    flex: 1,
    aspectRatio: 375 / 147,
    backgroundColor: colors.grayBackgroundColor,
    resizeMode: 'cover',
  },
  profileImageStyle: {
    height: 71,
    width: 71,
    marginTop: -36,
    borderRadius: 35.5,
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: colors.whiteColor,
  },
  bgCameraButtonStyle: {
    height: 22,
    width: 22,
    alignSelf: 'flex-end',
    marginEnd: 16,
    marginTop: -37,
  },
  bgImageButtonStyle: {
    height: 22,
    width: 22,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -22,
    marginLeft: 48,
    alignSelf: 'center',
  },
  profileImageButtonStyle: {
    height: 22,
    width: 22,
  },
});

export default TCProfileImageControl;
