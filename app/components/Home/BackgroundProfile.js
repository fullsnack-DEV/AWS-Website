import React, {memo, useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';

const BackgroundProfile = ({
  currentUserData,
  onAction,
  loggedInEntity,
  onConnectionButtonPress,
  imageSize = 60,
}) => {
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

      console.log('CurrentUserData:=>',currentUserData);
      console.log('ETDATA:=>',etData);
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
          <View style={styles.userViewStyle}>
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
              <Text style={styles.cityTextStyle}>{`${entityData?.city}`}</Text>
              {(currentUserData.entity_type === 'team' ||
                (currentUserData.entity_type === 'club' &&
                  currentUserData.sports_string)) && (
                    <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                      <View
                    style={{
                      backgroundColor: colors.lightBlackColor,
                      marginHorizontal: 5,
                      borderRadius: 2,
                      height: 4,
                      width: 4,
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
          </View>
          {currentUserData.entity_type === 'club' && (
            <View style={styles.statusViewStyle}>
              <TouchableOpacity
                onPress={() => onConnectionButtonPress('following')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingLengthText}>
                  {entityData?.teamCount}
                </Text>
                <Text style={styles.followingTextStyle}>
                  {strings.teamstitle}
                </Text>
              </TouchableOpacity>

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
          )}
          {currentUserData.entity_type !== 'club' && (
            <View style={styles.statusViewStyle}>
              {currentUserData.following_count !== undefined ? (
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
              ) : (
                <TouchableOpacity
                  onPress={() => onConnectionButtonPress('members')}
                  style={styles.statusInnerViewStyle}>
                  <Text style={styles.followingLengthText}>
                    {entityData?.memberCount}
                    <Text style={styles.followingTextStyle}>
                      {'   '}
                      {strings.membersTitle}
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => onConnectionButtonPress('followers')}
                style={styles.statusInnerViewStyle}>
                <Text style={styles.followingLengthText}>
                  {entityData?.followersCounter}
                  <Text style={styles.followingTextStyle}>
                    {'   '}
                    {strings.followersRadio}
                  </Text>
                </Text>
              </TouchableOpacity>

              {loggedInEntity.role === 'team' &&
                loggedInEntity.uid !== currentUserData.group_id && (
                  <TouchableOpacity
                    onPress={() => onAction('message')}
                    style={styles.statusInnerViewStyle}>
                    <Image
                      style={styles.messageImage}
                      source={images.messageIcon}
                    />

                    <Text style={styles.followingTextStyle}>
                      {strings.message}
                    </Text>
                  </TouchableOpacity>
                )}

              {loggedInEntity.role !== 'team' && (
                <TouchableOpacity
                  onPress={() => onAction('message')}
                  style={styles.statusInnerViewStyle}>
                  <Image
                    style={styles.messageImage}
                    source={images.messageIcon}
                  />
                  <Text style={styles.followingTextStyle}>
                    {strings.message}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -35,
    alignSelf: 'center',
    borderRadius: 41,
  },
  messageImage: {
    height: 13,
    width: 13,
    resizeMode: 'contain',
    marginRight: 10,
  },
  statusViewStyle: {
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  statusInnerViewStyle: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  followingTextStyle: {
    fontSize: 15,
    marginLeft: 5,
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

  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});

export default memo(BackgroundProfile);
