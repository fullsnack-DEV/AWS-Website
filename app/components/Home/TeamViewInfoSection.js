import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image, TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function TeamViewInfoSection({
  teamImage,
  teamIcon,
  teamTitle,
  teamCityName,
  onProfilePress,
}) {
  return (

    <TouchableOpacity onPress={onProfilePress} style={styles.topViewContainer}>
      <View style={styles.profileView}>
        <Image source={teamImage} style={styles.profileImage} resizeMode={'cover'} />
      </View>
      <View style={styles.topTextContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.teamTitleTextStyle}>{teamTitle}</Text>
          <Image source={teamIcon} style={styles.teamIconStyle} resizeMode={'contain'} />
        </View>
        <Text style={styles.userNameTextStyle}>{teamCityName}</Text>
      </View>
    </TouchableOpacity>

  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  profileImage: {
    height: 40,
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
  teamTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  userNameTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.whiteColor,
  },
  teamIconStyle: {
    height: 22,
    width: 22,
    left: 2,
  },
});
