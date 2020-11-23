import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import UserCategoryView from './UserCategoryView';

export default function ProfileViewSection({
  profileImage,
  userName,
}) {
  return (

    <View style={styles.topViewContainer}>
      <View style={styles.profileView}>
        <Image source={profileImage} style={ styles.profileImage } />
      </View>
      <View style={styles.topTextContainer}>
        <Text style={styles.userNameTextStyle}>{userName}</Text>
        <View style={{ flexDirection: 'row' }}>
          <UserCategoryView title='Player' titleColor={colors.blueColor}/>
          <UserCategoryView title='Coach' titleColor={colors.greeColor}/>
          <UserCategoryView title='Tainer' titleColor={colors.yellowColor}/>
          <UserCategoryView title='scorekeeper' titleColor={colors.playerBadgeColor}/>
        </View>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightgrayPlayInColor,
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
    color: colors.themeColor,
  },
});
