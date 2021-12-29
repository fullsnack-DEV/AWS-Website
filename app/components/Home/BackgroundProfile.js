import React, {memo, useEffect, useState,useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';

const BackgroundProfile = ({
  currentUserData,
  onConnectionButtonPress,
  imageSize = 82,
}) => {
  const authContext = useContext(AuthContext);
  const [entityData, setEntityData] = useState(null);
  useEffect(() => {
    if (currentUserData) {
      const etData = {};
      etData.fullName = currentUserData?.first_name
        ? `${currentUserData?.first_name} ${currentUserData?.last_name}`
        : currentUserData?.group_name;
      etData.profileImage = currentUserData?.full_image ?? null;
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
        <View style={{width: '100%', marginBottom: 20}}>
          <Animated.Image
            style={{
              ...styles.profileImageStyle,
              height: imageSize,
              width: imageSize,
            }}
            source={
              entityData?.profileImage
                ? {uri: entityData?.profileImage}
                : images.profilePlaceHolder
            }
          />
          <View style={styles.userViewStyle}>
            <Text style={styles.userTextStyle}>{entityData?.fullName}</Text>
            {currentUserData.description?.length > 0 && (
              <Text style={styles.sloganTextStyle}>
                {currentUserData.description}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {(currentUserData.entity_type === 'team' ||
                (currentUserData.entity_type === 'club' && currentUserData.sports_string)) && (
                  <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {/*  */}
                    <Text style={styles.cityTextStyle}>
                      {currentUserData.sports_string
                      ? currentUserData.sports_string
                      : Utility.getSportName(currentUserData,authContext) ?? ''}
                    </Text>
                    <View
                    style={{
                      backgroundColor: colors.lightBlackColor,
                      marginHorizontal: 5,
                      borderRadius: 2,
                      height: 4,
                      width: 4,
                    }}
                  />
                  </View>
              )}
              <Text
                style={
                  styles.cityTextStyle
                }>{`${entityData?.city}, ${entityData?.country}`}</Text>
            </View>
          </View>
          {currentUserData.entity_type === 'club' && (
            <View style={styles.statusViewStyle}>
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('following')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingTextStyle}>
                  {strings.teamstitle}
                </Text>
                <Text style={styles.followingLengthText}>
                  {entityData?.teamCount}
                </Text>
              </TouchableOpacity>
              <View style={styles.followingSepratorView} />
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('members')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingTextStyle}>
                  {strings.membersTitle}
                </Text>
                <Text style={styles.followingLengthText}>
                  {entityData?.memberCount}
                </Text>
              </TouchableOpacity>
              <View style={styles.followingSepratorView} />
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('followers')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingTextStyle}>
                  {strings.followersRadio}
                </Text>
                <Text style={styles.followingLengthText}>
                  {entityData?.followersCounter}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {currentUserData.entity_type !== 'club' && (
            <View style={styles.statusViewStyle}>
              {currentUserData.following_count !== undefined ? (
                <TouchableOpacity
                  onPress={() => onConnectionButtonPress('following')}
                  style={[styles.statusInnerViewStyle, {width: '47%'}]}>
                  <Text style={styles.followingTextStyle}>
                    {strings.following}
                  </Text>
                  <Text style={styles.followingLengthText}>
                    {entityData?.followingsCounter}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onConnectionButtonPress('members')}
                  style={[styles.statusInnerViewStyle, {width: '47%'}]}>
                  <Text style={styles.followingTextStyle}>
                    {strings.membersTitle}
                  </Text>
                  <Text style={styles.followingLengthText}>
                    {entityData?.memberCount}
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.followingSepratorView} />
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('followers')}
                style={[styles.statusInnerViewStyle, {width: '47%'}]}>
                <Text style={styles.followingTextStyle}>
                  {strings.followersRadio}
                </Text>
                <Text style={styles.followingLengthText}>
                  {entityData?.followersCounter}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

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
    padding: 8,
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
    textAlign: 'center',
  },
  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});

export default memo(BackgroundProfile);
