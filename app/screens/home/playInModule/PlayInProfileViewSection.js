import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function PlayInProfileViewSection({
  isPatch = false,
  patchType,
  profileImage,
  userName,
  cityName,
  onSettingPress = () => {},
  onMessageButtonPress = () => {},
  isAdmin,
}) {
  return (
    <View style={styles.topViewContainer}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.profileView}>
          <Image source={profileImage} style={styles.profileImage} />
        </View>
        <View style={styles.topTextContainer}>
          <Text style={styles.userNameTextStyle}>
            {_.startCase(userName.toLowerCase())}
          </Text>
          <Text style={styles.cityName}>{cityName}</Text>
          {isPatch && (
            <LinearGradient
              colors={[colors.themeColor, colors.darkThemeColor]}
              style={styles.patchStyle}>
              <Text style={styles.patchText}>
                {patchType === Verbs.entityTypeClub
                  ? strings.lookingForClubText
                  : strings.lookingForTeamText}
              </Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.settingButtonContainer}>
          {isAdmin ? (
            <TouchableOpacity onPress={onSettingPress}>
              <FastImage
                resizeMode={'contain'}
                source={images.SettingPrivacy}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.messageBtnStyle}
              onPress={onMessageButtonPress}>
              <Text
                style={[
                  styles.detailBtnTextStyle,
                  {color: colors.lightBlackColor},
                ]}>
                {strings.message}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    // backgroundColor: colors.searchGrayColor,
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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    flex: 1,
    marginLeft: 10,
    alignSelf: 'center',
  },
  userNameTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cityName: {
    color: colors.lightBlackColor,
    fontSize: 14,
    marginTop: 2,
    fontFamily: fonts.RLight,
  },
  patchText: {
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RMedium,
  },
  settingButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBtnTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  messageBtnStyle: {
    height: 25,
    paddingHorizontal: 15,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    justifyContent: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 10,
  },
  patchStyle: {
    height: 16,
    width: 110,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
