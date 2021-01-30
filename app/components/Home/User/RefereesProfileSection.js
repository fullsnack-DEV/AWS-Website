import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image, TouchableOpacity,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function RefereesProfileSection({
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
          <Image source={profileImage} style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <Text style={styles.userNameTextStyle}>{userName}</Text>
          <Text style={styles.locationTextStyle}>{location}</Text>
        </View>
      </View>
      {bookRefereeButtonVisible && (
        <TouchableOpacity onPress={onBookRefereePress}>
          <Text style={styles.editTextStyle}>{'BOOK REFEREE'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    backgroundColor: colors.lightgrayBG,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
    borderRadius: 20,
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
    color: colors.redDelColor,
  },
});
