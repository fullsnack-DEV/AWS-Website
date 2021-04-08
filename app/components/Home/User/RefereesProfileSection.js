import React from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import strings from '../../../Constants/String';

export default function RefereesProfileSection({
  isReferee,
  feesCount,
  profileImage,
  userName,
  location,
  onBookRefereePress,
  bookRefereeButtonVisible = true,
}) {
  return (
    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileView}>
          <Image source={profileImage} style={styles.profileImage} />
        </View>
        <View style={styles.topTextContainer}>
          <Text style={styles.userNameTextStyle}>{userName}</Text>
          <Text style={styles.locationTextStyle}>{location}</Text>
        </View>
      </View>
      {bookRefereeButtonVisible && (
        <TouchableOpacity
          onPress={onBookRefereePress}>
          <LinearGradient
            colors={isReferee ? [colors.themeColor, colors.yellowColor] : [colors.blueGradiantStart, colors.blueGradiantEnd]}
            style={isReferee ? styles.refereeButtonStyle : styles.scorekeeperButtonStyle}>
            <Text style={styles.editTextStyle}>
              ${feesCount} CAD (per hours)
            </Text>
            <Text style={styles.editTextStyle}>
              {isReferee ? strings.bookReferee : strings.bookScorekeeper}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    backgroundColor: colors.searchGrayColor,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
    borderRadius: 80,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  userNameTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  editTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  refereeButtonStyle: {
    height: 40,
    width: '98%',
    backgroundColor: colors.themeColor,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.themeColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  scorekeeperButtonStyle: {
    height: 40,
    width: '98%',
    backgroundColor: colors.blueGradiantStart,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.blueGradiantStart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
