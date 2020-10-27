import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Header from './Header';

function BackgroundProfile({
  onPressBGImage,
  onPressProfileImage,
  profileImagePlaceholder = images.profilePlaceHolder,
  buttonImage = images.certificateUpload,
  bgImageStyle,
  profileImageStyle,
  bgImageButtonStyle,
  profileImageButtonStyle,
  currentUserData,
}) {
  let bgImage = '';
  if (currentUserData && currentUserData.background_full_image) {
    bgImage = currentUserData.background_full_image;
  }
  let profileImage = '';
  if (currentUserData && currentUserData.full_image) {
    profileImage = currentUserData.full_image;
  }
  let followingsCounter = '';
  if (currentUserData && currentUserData.following_count) {
    followingsCounter = currentUserData.following_count;
  }
  let followersCounter = '';
  if (currentUserData && currentUserData.follower_count) {
    followersCounter = currentUserData.follower_count;
  }
  let fullName = '';
  if (currentUserData && currentUserData.full_name) {
    fullName = currentUserData.full_name;
  }
  let city = '';
  let country = '';
  if (currentUserData) {
    if (currentUserData.city) {
      city = currentUserData.city;
    }
    if (currentUserData.country) {
      country = currentUserData.country;
    }
  }

  return (
    <View>
      <View>
        <Image source={{ uri: bgImage }} style={[styles.bgImageStyle, bgImageStyle]} />
        <TouchableOpacity
        onPress={ onPressBGImage }>
          <Image
            style={[styles.bgCameraButtonStyle, bgImageButtonStyle]}
            source={ buttonImage }
            />
        </TouchableOpacity>
      </View>
      <Header
        safeAreaStyle={{ position: 'absolute' }}
        leftComponent={
          <TouchableOpacity>
            <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <Image source={images.menu} style={{ height: 22, width: 22, tintColor: colors.whiteColor }} />
          </TouchableOpacity>
        }
      />
      <View style={{ width: '100%' }}>
        <View style={styles.followingMainViewStyle}>
          <View style={styles.followingViewStyle}>
            <Text style={styles.followingTextStyle}>Following</Text>
            <Text style={styles.followingLengthText}>{followingsCounter}</Text>
          </View>
          <View style={styles.followingSepratorView} />
          <View style={styles.followingViewStyle}>
            <Text style={styles.followingTextStyle}>Followers</Text>
            <Text style={styles.followingLengthText}>{followersCounter}</Text>
          </View>
        </View>
      </View>
      <Image style={[styles.profileImageStyle, profileImageStyle]}
        source={profileImage ? { uri: profileImage } : profileImagePlaceholder} />
      <TouchableOpacity
        onPress={ onPressProfileImage }>
        <Image
            style={ [styles.profileCameraButtonStyle, profileImageButtonStyle]}
            source={ buttonImage }
            />
      </TouchableOpacity>
      <View style={styles.userViewStyle}>
        <Text style={styles.userTextStyle}>{fullName}</Text>
        <Text style={styles.cityTextStyle}>{`${city}, ${country}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImageStyle: {
    aspectRatio: 375 / 173,
    backgroundColor: colors.grayBackgroundColor,
  },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -80,
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
  followingMainViewStyle: {
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '72%',
    alignSelf: 'flex-end',
  },
  followingViewStyle: {
    width: '36%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followingSepratorView: {
    height: 22,
    width: 1,
    backgroundColor: colors.graySeparater,
    marginVertical: 4,
    alignSelf: 'center',
  },
  followingTextStyle: {
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: fonts.RRegular,
  },
  followingLengthText: {
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
  userViewStyle: {
    padding: wp('4%'),
  },
  userTextStyle: {
    fontSize: 22,
    fontFamily: fonts.RBold,
  },
  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.grayEventColor,
  },
});

export default BackgroundProfile;
