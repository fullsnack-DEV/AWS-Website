/* eslint-disable no-unused-vars */
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text, TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils';

function BackgroundProfile({
  profileImagePlaceholder = images.profilePlaceHolder,
  bgImageStyle,
  profileImageStyle,
  currentUserData,
  onConnectionButtonPress,
}) {
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
  if (currentUserData && currentUserData.first_name) {
    fullName = `${currentUserData.first_name} ${currentUserData.last_name}`;
  }
  if (currentUserData && currentUserData.first_name === undefined) {
    fullName = currentUserData.group_name;
  }
  // let description = '';
  // if (currentUserData && currentUserData.description) {
  //   description = currentUserData.description;
  // }
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

  let teamCount = 0;
  if (currentUserData.joined_teams && currentUserData.joined_teams.length > 0) {
    teamCount = currentUserData.joined_teams.length;
  }
  return (
    <View style={{ width: wp('100%'), margin: 0 }}>
      {/* <View style={[styles.bgImageStyle, bgImageStyle]}> */}
      {/*  <Image */}
      {/*  source={bgImage ? { uri: bgImage } : images.profilePlaceHolder} */}
      {/*  style={[styles.bgImageStyle, bgImageStyle]} */}
      {/*  /> */}
      {/* </View> */}
      <View style={{ backgroundColor: colors.whiteColor }} >
        <View style={{ width: '100%', marginBottom: 20 }}>
          <Image style={[styles.profileImageStyle, profileImageStyle]}
            source={profileImage ? { uri: profileImage } : profileImagePlaceholder}
          />
          <View style={styles.userViewStyle}>
            <Text style={styles.userTextStyle}>{fullName}</Text>
            {currentUserData.description?.length > 0 && <Text style={styles.sloganTextStyle}>{currentUserData.description}</Text>}
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            }}>
              {(currentUserData.entity_type === 'team' && currentUserData.entity_type === 'club') && <View style={{
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              }}>
                <Text style={styles.cityTextStyle}>{currentUserData.sport ? Utility.capitalize(currentUserData.sport) : ''}</Text>
                <View style={{
                  backgroundColor: colors.lightBlackColor, marginHorizontal: 5, borderRadius: 2, height: 4, width: 4,
                }}/>
              </View>}
              <Text style={styles.cityTextStyle}>{`${city}, ${country}`}</Text>
            </View>
          </View>
          {currentUserData.entity_type === 'club' && <View style={styles.statusViewStyle}>
            <TouchableOpacity
                onPress={() => onConnectionButtonPress('following')}
                style={styles.statusInnerViewStyle}>
              <Text style={styles.followingTextStyle}>{strings.teamstitle}</Text>
              <Text style={styles.followingLengthText}>{teamCount}</Text>
            </TouchableOpacity>
            <View style={styles.followingSepratorView} />
            <TouchableOpacity
                onPress={() => onConnectionButtonPress('members')}
                style={styles.statusInnerViewStyle}>
              <Text style={styles.followingTextStyle}>{strings.membersTitle}</Text>
              <Text style={styles.followingLengthText}>{memberCount}</Text>
            </TouchableOpacity>
            <View style={styles.followingSepratorView} />
            <TouchableOpacity
                onPress={() => onConnectionButtonPress('followers')}
                style={styles.statusInnerViewStyle}>
              <Text style={styles.followingTextStyle}>{strings.followersRadio}</Text>
              <Text style={styles.followingLengthText}>{followersCounter}</Text>
            </TouchableOpacity>
          </View>}
          {currentUserData.entity_type !== 'club' && <View style={styles.statusViewStyle}>
            {currentUserData.following_count !== undefined ? (
              <TouchableOpacity
              onPress={() => onConnectionButtonPress('following')}
                  style={[styles.statusInnerViewStyle, { width: '47%' }]}>
                <Text style={styles.followingTextStyle}>{strings.following}</Text>
                <Text style={styles.followingLengthText}>{followingsCounter}</Text>
              </TouchableOpacity>) : <TouchableOpacity onPress={() => onConnectionButtonPress('members')} style={[styles.statusInnerViewStyle, { width: '47%' }]}>
                <Text style={styles.followingTextStyle}>{strings.membersTitle}</Text>
                <Text style={styles.followingLengthText}>{memberCount}</Text>
              </TouchableOpacity>}
            <View style={styles.followingSepratorView} />
            <TouchableOpacity onPress={() => onConnectionButtonPress('followers')} style={[styles.statusInnerViewStyle, { width: '47%' }]}>
              <Text style={styles.followingTextStyle}>{strings.followersRadio}</Text>
              <Text style={styles.followingLengthText}>{followersCounter}</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // bgImageStyle: {
  //   backgroundColor: colors.grayBackgroundColor,
  //   opacity: 0,
  // },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -45,
    alignSelf: 'center',
    borderRadius: 41,
  },
  statusViewStyle: {
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
  },
  statusInnerViewStyle: {
    width: '29%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followingSepratorView: {
    height: 20,
    width: 1,
    paddingVertical: 2,
    marginHorizontal: 3,
    backgroundColor: colors.grayEventColor,
    alignSelf: 'center',
  },
  followingTextStyle: {
    fontSize: 15,
    fontFamily: fonts.RRegular,
  },
  followingLengthText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
  userViewStyle: {
    marginHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
  },
  sloganTextStyle: {
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 5,
  },
  userTextStyle: {
    fontSize: 22,
    fontFamily: fonts.RBold,
  },
  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});

export default BackgroundProfile;
