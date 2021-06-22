import React, {
 memo, useEffect, useState, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCGradientButton from '../TCGradientButton';
import TCProfileButton from '../TCProfileButton';
import TCThinDivider from '../TCThinDivider';
import AuthContext from '../../auth/context';

const UserHomeHeader = ({
  currentUserData,
  onConnectionButtonPress,
  onAction,
  isAdmin,
  loggedInEntity,
}) => {
  const authContext = useContext(AuthContext);
console.log('Home currentUserData', currentUserData);
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
      setEntityData({ ...etData });
    }
  }, [currentUserData]);

  // check member status
  let isMember = false;
  console.log(isMember);

  if (loggedInEntity.role === 'club' && currentUserData.clubIds) {
    const result = currentUserData.clubIds.filter(
      (clubID) => clubID === loggedInEntity.uid,
    );
    if (result.length > 0) {
      isMember = true;
    }
  } else if (loggedInEntity.role === 'team' && currentUserData.teamIds) {
    const result = currentUserData.teamIds.filter(
      (teamId) => teamId === loggedInEntity.uid,
    );

    if (result.length > 0) {
      isMember = true;
    }
  }

  return (
    <SafeAreaView>
      <View style={{ width: wp('100%'), margin: 0 }}>
        <View style={{ backgroundColor: colors.whiteColor }}>
          <View style={{ width: '100%', marginBottom: 20 }}>
            <View style={styles.userViewStyle}>
              {/* <Text style={styles.userTextStyle}>{entityData?.fullName}</Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.profileImageContainer}>
                  <Image
                    style={styles.profileImageStyle}
                    source={
                      entityData?.profileImage
                        ? { uri: entityData?.profileImage }
                        : images.profilePlaceHolder
                    }
                  />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {isAdmin && (
                    <TCProfileButton
                    title={strings.editprofiletitle}
                    style={styles.editButtonStyle}
                    textStyle={styles.buttonTextStyle}
                    onPressProfile={() => onAction('edit')}
                    showArrow={false}
                  />
                )}

                  {!isAdmin && authContext?.entity?.role === 'user' && currentUserData && currentUserData.is_following && (
                    <TCProfileButton
                    title={strings.following}
                    style={styles.firstButtonStyle}
                    rightImage={images.check}
                    imageStyle={styles.checkMarkStyle}
                    textStyle={styles.buttonTextStyle}
                    onPressProfile={() => {
                      onAction('unfollow');
                    }}
                  />
                )}

                  {!isAdmin && authContext?.entity?.role === 'user' && currentUserData && !currentUserData.is_following && (
                    <TCGradientButton
                    outerContainerStyle={styles.firstButtonOuterStyle}
                    style={styles.firstButtonStyle}
                    textStyle={styles.buttonTextStyle}
                    title={strings.follow}
                    onPress={() => {
                      onAction('follow');
                    }}
                  />
                )}
                  {!isAdmin && (
                    <View style={{ marginTop: 10 }}>
                      {loggedInEntity.role !== 'user' && (
                        <View style={styles.messageButtonStyle}>
                          {isMember && (
                            <TCProfileButton
                            title={strings.member}
                            style={styles.firstButtonStyle}
                            rightImage={images.check}
                            imageStyle={styles.checkMarkStyle}
                            textStyle={styles.buttonTextStyle}
                          />
                        )}

                          {!isMember && (
                            <TCGradientButton
                            outerContainerStyle={styles.firstButtonOuterStyle}
                            style={styles.firstButtonStyle}
                            textStyle={styles.buttonTextStyle}
                            startGradientColor={colors.greenGradientStart}
                            endGradientColor={colors.greenGradientEnd}
                            title={strings.invite}
                            onPress={() => {
                              onAction('invite');
                            }}

                          />
                        )}
                        </View>
                    )}
                    </View>
                )}
                </View>

              </View>

              <Text
                style={
                  styles.cityTextStyle
                }>{`${entityData?.city}, ${entityData?.country}`}</Text>
              {currentUserData.description?.length > 0 && (
                <Text style={styles.sloganTextStyle}>
                  {currentUserData.description}
                </Text>
              )}
            </View>

            {(currentUserData.entity_type === 'user'
              || currentUserData.entity_type === 'player') && (
                <View style={styles.statusViewStyle}>
                  {currentUserData.following_count !== undefined ? (
                    <TouchableOpacity
                    onPress={() => onConnectionButtonPress('following')}
                    style={styles.statusInnerViewStyle}>
                      <Text style={styles.followingLengthText}>
                        {entityData?.followingsCounter}
                      </Text>
                      <Text style={styles.followingTextStyle}>
                        {strings.following}
                      </Text>
                    </TouchableOpacity>
                ) : (
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
                )}
                  <View style={styles.followingSepratorView} />
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

                  <View style={styles.followingSepratorView} />
                  {!isAdmin && (
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
      <TCThinDivider width={'100%'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // bgImageStyle: {
  //   backgroundColor: colors.grayBackgroundColor,
  //   opacity: 0,
  // },
  profileImageContainer: {
    height: 54,
    width: 54,
    borderRadius: 108,
    backgroundColor: colors.whiteColor,
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  profileImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 41,
  },
  statusViewStyle: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 5,
  },
  statusInnerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingSepratorView: {
    height: 20,
    width: 1,

    marginHorizontal: 10,
    backgroundColor: colors.whiteColor,
    alignSelf: 'center',
  },
  followingTextStyle: {
    fontSize: 15,
    fontFamily: fonts.RRegular,
  },
  followingLengthText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginRight: 10,
  },
  userViewStyle: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 0,
  },
  sloganTextStyle: {
    textAlign: 'left',
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
    // fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 5,
  },

  cityTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  firstButtonStyle: {
    margin: 0,
    height: 28,
    width: 90,
    borderRadius: 5,
  },
  buttonTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  messageImage: {
    height: 13,
    width: 13,
    resizeMode: 'contain',
    marginRight: 10,
  },
});

export default memo(UserHomeHeader);
