/* eslint-disable react/jsx-indent */
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';

export default function BackgroundProfile({
  currentUserData,
  onConnectionButtonPress,
  imageSize = 60,
}) {
  const authContext = useContext(AuthContext);
  const [entityData, setEntityData] = useState(null);

  useEffect(() => {
    if (currentUserData) {
      const etData = {};
      etData.entity_type = currentUserData?.entity_type;
      etData.fullName = currentUserData?.first_name
        ? `${currentUserData?.full_name} ${currentUserData?.last_name}`
        : currentUserData?.group_name;
      etData.profileImage = currentUserData?.thumbnail ?? null;
      etData.followingsCounter = currentUserData?.following_count ?? 0;
      etData.memberCount = currentUserData?.member_count ?? 0;
      etData.followersCounter = currentUserData?.follower_count ?? 0;
      etData.city = currentUserData?.city ?? '';
      etData.country = currentUserData?.country ?? '';
      etData.teamCount = currentUserData?.joined_teams?.length ?? 0;
      setEntityData({...etData});
    }
  }, [currentUserData]);

  return (
    <View style={{width: wp('100%'), margin: 0}}>
      <View style={{backgroundColor: colors.whiteColor}}>
        <View style={{width: '100%'}}>
          <Animated.Image
            style={{
              ...styles.profileImageStyle,
              height: imageSize,
              width: imageSize,
            }}
            source={
              entityData?.profileImage
                ? {uri: entityData?.profileImage}
                : (entityData?.entity_type === 'team' &&
                    images.teamPlaceholder) ||
                  (entityData?.entity_type === 'club' &&
                    images.clubPlaceholder) ||
                  (entityData?.entity_type === 'user' &&
                    images.profilePlaceHolder)
            }
          />
          <View style={styles.statusViewStyle}>
            {currentUserData.following_count !== undefined && (
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('following')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingTextStyle}>
                  {strings.following}
                  <Text style={styles.followingLengthText}>
                    {entityData?.followingsCounter}
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onConnectionButtonPress('members')}
              style={styles.statusInnerViewStyle}>
              <Text style={styles.followingLengthText}>
                {entityData?.memberCount}
              </Text>
              <Text style={styles.followingTextStyle}>
                {strings.membersTitle}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onConnectionButtonPress('followers')}
              style={styles.statusInnerViewStyle}>
              <Text style={styles.followingLengthText}>
                {entityData?.followersCounter}
              </Text>
              <Text style={styles.followingTextStyle}>
                {strings.followersRadio}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userViewStyle}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: 10,
              }}>
              <Text
                style={
                  styles.cityTextStyle
                }>{`${entityData?.city}, ${entityData?.country}`}</Text>
              {(currentUserData.entity_type === 'team' ||
                (currentUserData.entity_type === 'club' &&
                  currentUserData.sports_string)) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      backgroundColor: colors.lightBlackColor,
                      marginHorizontal: 5,
                      borderRadius: 1,
                      height: 2,
                      width: 2,
                      alignSelf: 'center',
                    }}
                  />
                  <Text style={styles.cityTextStyle}>
                    {currentUserData.sports_string
                      ? currentUserData.sports_string
                      : Utility.getSportName(currentUserData, authContext) ??
                        ''}
                  </Text>
                </View>
              )}
            </View>
            {currentUserData.hiringPlayers === 'Yes' && (
              <LinearGradient
                colors={[colors.themeColor1, colors.themeColor3]}
                style={styles.recruitingView}>
                <Text style={styles.recruitingMembersText}>
                  {strings.hiringPlayerTitle}
                </Text>
              </LinearGradient>
            )}

            {currentUserData.bio?.length > 0 && (
              <Text style={styles.sloganTextStyle}>{currentUserData.bio}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -35,
    borderRadius: 41,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },

  statusViewStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: wp('70%'),
    left: 87,
    bottom: 20,
  },
  statusInnerViewStyle: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  followingTextStyle: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: fonts.RRegular,
  },
  followingLengthText: {
    fontSize: 15,
    fontFamily: fonts.RBold,
  },
  userViewStyle: {
    marginHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'flex-start',
    marginLeft: 20,
    bottom: 10,
  },
  sloganTextStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'left',
  },
  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  recruitingMembersText: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  recruitingView: {
    height: 20,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 10,
  },
});
