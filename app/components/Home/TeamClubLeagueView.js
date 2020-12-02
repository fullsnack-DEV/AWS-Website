import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function TeamClubLeagueView({
  teamImage,
  teamIcon,
  teamTitle,
  teamCityName,
}) {
  return (

    <View style={styles.topViewContainer}>
      <View style={styles.profileView}>
        <Image source={teamImage} style={ styles.profileImage } />
      </View>
      <View style={styles.topTextContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.teamTitleTextStyle}>{teamTitle}</Text>
          <Image source={teamIcon} style={styles.teamIconStyle} resizeMode={'contain'} />
        </View>
        <Text style={styles.userNameTextStyle}>{teamCityName}</Text>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
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
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
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
    color: colors.lightBlackColor,
  },
  topTextContainer: {
    marginLeft: 20,
    alignSelf: 'center',
  },
  userNameTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  teamIconStyle: {
    height: 25,
    width: 25,
    left: 2,
  },
});
