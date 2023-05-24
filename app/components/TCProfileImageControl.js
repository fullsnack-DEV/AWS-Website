import React from 'react';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';

import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import TCImage from './TCImage';

function TCProfileImageControl({
  onPressBGImage,
  onPressProfileImage,
  bgImagePlaceholder,
  profileImagePlaceholder = images.profilePlaceHolder,
  bgImage,
  profileImage,
  buttonImage = images.uploadCameraIcon,
  bgImageStyle,
  profileImageStyle,
  profileImageContainerStyle,
  bgImageButtonStyle,
  profileImageButtonStyle,
  showEditButtons = false,
  bgImageContainerStyle,
  profileCameraButtonStyle,
}) {
  return (
    <View style={{flex: 1}}>
      <View
        style={{margin: 10, borderRadius: 10, overflow: 'hidden', height: 135}}>
        <TCImage
          containerStyle={[styles.bgContainerStyle]}
          imageStyle={[styles.bgImageStyle, bgImageStyle]}
          source={bgImage}
          defaultSource={bgImagePlaceholder}
          resizeMode={'cover'}
        />

        {showEditButtons && (
          <TouchableOpacity
            style={[styles.bgCameraButtonStyle, bgImageContainerStyle]}
            onPress={onPressBGImage}>
            <Image
              style={[styles.bgImageButtonStyle, bgImageButtonStyle]}
              source={buttonImage}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.profileImageContainerStyle,
          {marginTop: showEditButtons ? -40 : -36},
          profileImageContainerStyle,
        ]}>
        <TCImage
          imageStyle={[
            styles.profileImageStyle,
            profileImageStyle,
            {marginTop: showEditButtons ? 0 : -36},
          ]}
          source={profileImage || profileImagePlaceholder}
          defaultSource={profileImagePlaceholder}
          resizeMode={'cover'}
        />
      </View>
      {showEditButtons && (
        <TouchableOpacity
          style={[styles.profileCameraButtonStyle, profileCameraButtonStyle]}
          onPress={onPressProfileImage}>
          <Image
            style={[styles.profileImageButtonStyle, profileImageButtonStyle]}
            source={buttonImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainerStyle: {
    flex: 1,
    width: '100%',
    height: 135,
  },
  bgImageStyle: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
    resizeMode: 'cover',
  },
  profileImageStyle: {
    height: 60,
    width: 60,
    marginTop: -36,
    borderRadius: 35.5,
    alignSelf: 'center',
  },
  profileImageContainerStyle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
  },
  bgCameraButtonStyle: {
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
    marginEnd: 16,
    marginTop: -37,
  },
  bgImageButtonStyle: {
    height: 30,
    width: 30,
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
