import React from 'react';
import {
  StyleSheet,
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

function BackgroundProfile({
  profileImagePlaceholder = images.profilePlaceHolder,
  bgImageStyle,
  profileImageStyle,
  currentUserData,
}) {
  console.log('Current User Data ::--', currentUserData);
  let bgImage = '';
  if (currentUserData && currentUserData.background_full_image) {
    bgImage = currentUserData.background_full_image;
  }
  let profileImage = '';
  if (currentUserData && currentUserData.full_image) {
    profileImage = currentUserData.full_image;
  }
  let followingsCounter = 0;
  if (currentUserData && currentUserData.following_count) {
    followingsCounter = currentUserData.following_count;
  }
  let memberCount = 0;
  if (currentUserData && currentUserData.member_count) {
    memberCount = currentUserData.member_count;
  }
  let followersCounter = 0;
  if (currentUserData && currentUserData.follower_count) {
    followersCounter = currentUserData.follower_count;
  }
  let fullName = '';
  if (currentUserData && currentUserData.full_name) {
    fullName = currentUserData.full_name;
  }
  if (currentUserData && currentUserData.full_name === undefined) {
    fullName = currentUserData.group_name;
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
    <View style={{ width: wp('100%') }}>
      <View>
        <Image source={bgImage ? { uri: bgImage } : images.profilePlaceHolder} style={[styles.bgImageStyle, bgImageStyle]} />
      </View>
      <View style={{ backgroundColor: colors.whiteColor }}>
        <View style={{ width: '100%' }}>
          <View style={styles.followingMainViewStyle}>
            {currentUserData.following_count !== undefined ? <View style={styles.followingViewStyle}>
              <Text style={styles.followingTextStyle}>Following</Text>
              <Text style={styles.followingLengthText}>{followingsCounter}</Text>
            </View> : <View style={styles.followingViewStyle}>
              <Text style={styles.followingTextStyle}>Members</Text>
              <Text style={styles.followingLengthText}>{memberCount}</Text>
            </View>}
            <View style={styles.followingSepratorView} />
            <View style={styles.followingViewStyle}>
              <Text style={styles.followingTextStyle}>Followers</Text>
              <Text style={styles.followingLengthText}>{followersCounter}</Text>
            </View>
          </View>
        </View>
        <Image style={[styles.profileImageStyle, profileImageStyle]}
          source={profileImage ? { uri: profileImage } : profileImagePlaceholder}
        />
        <View style={styles.userViewStyle}>
          <Text style={styles.userTextStyle}>{fullName}</Text>
          <Text style={styles.cityTextStyle}>{`${city}, ${country}`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImageStyle: {
    aspectRatio: 375 / 173,
    backgroundColor: colors.grayBackgroundColor,
    opacity: 0,
  },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -80,
    marginLeft: 15,
    borderRadius: 41,
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
