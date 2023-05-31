// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';

const GroupProfileComponent = ({
  groupDetails = {},
  onPressBGImage = () => {},
  onPressProfileImage = () => {},
  bgImageContainerStyle = {},
  profileImageContainerStyle = {},
}) => {
  const defaultPlaceHolder =
    groupDetails.entity_type === Verbs.entityTypeClub
      ? images.clubPlaceholderSmall
      : images.teamPlaceholderSmall;
  const renderContent = () => (
    <>
      <Pressable style={styles.cameraIcon} onPress={onPressBGImage}>
        <Image source={images.uploadCameraIcon} style={styles.image} />
      </Pressable>
      <View
        style={[
          styles.profileContainer,
          profileImageContainerStyle,
          groupDetails.thumbnail ? {} : {paddingTop: 5},
        ]}>
        <Image
          source={
            groupDetails.thumbnail
              ? {uri: groupDetails.thumbnail}
              : defaultPlaceHolder
          }
          style={[styles.image, {borderRadius: 40}]}
        />
        <Pressable style={styles.floatingIcon} onPress={onPressProfileImage}>
          <Image source={images.uploadCameraIcon} style={styles.image} />
        </Pressable>
      </View>
    </>
  );
  if (groupDetails.background_thumbnail) {
    return (
      <ImageBackground
        style={[styles.coverContainer, bgImageContainerStyle]}
        source={{uri: groupDetails.background_thumbnail}}
        imageStyle={[styles.image, {borderRadius: 5, resizeMode: 'cover'}]}>
        {renderContent()}
      </ImageBackground>
    );
  }
  return (
    <View style={[styles.coverContainer, bgImageContainerStyle]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    backgroundColor: colors.grayBackgroundColor,
    height: 135,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profileContainer: {
    backgroundColor: colors.whiteColor,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 4,
    bottom: -35,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderlinecolor,
  },
  floatingIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -1,
    bottom: -1,
  },
});
export default GroupProfileComponent;
