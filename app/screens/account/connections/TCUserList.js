import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {displayLocation} from '../../../utils';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import images from '../../../Constants/ImagePath';

const TCUserList = ({
  user = {},
  isFollowing = false,
  onClickProfile = () => {},
  handleFollowUnfollow = () => {},
  showFollowUnfollowButton = false,
}) => (
  <>
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          onClickProfile();
        }}>
        <GroupIcon
          imageUrl={user.thumbnail}
          groupName={user?.group_name}
          entityType={user.entity_type}
          containerStyle={styles.profileIcon}
        />
        <View style={{flex:1}}>
          <Text style={styles.userName}
          numberOfLines={1}>
            {user.full_name ?? user.group_name}
          </Text>
          <Text style={styles.location}>{displayLocation(user)}</Text>
        </View>
      </TouchableOpacity>
      {showFollowUnfollowButton ? (
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            isFollowing ? {} : {paddingHorizontal: 20},
          ]}
          onPress={handleFollowUnfollow}>
          <Text
            style={[
              styles.buttonText,
              {
                color: isFollowing ? colors.lightBlackColor : colors.themeColor,
              },
            ]}>
            {isFollowing ? strings.following : strings.follow}
          </Text>
          {isFollowing && (
            <View style={styles.iconContainer}>
              <Image source={images.tickImage} style={styles.icon} />
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
    <View style={styles.separator} />
  </>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  location: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  buttonContainer: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.RBold,
  },
  iconContainer: {
    width: 8,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default TCUserList;
