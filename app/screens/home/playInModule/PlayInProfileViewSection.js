import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

export default function PlayInProfileViewSection({
  profileImage,
  userName,
  cityName,
  onSettingPress,
}) {
  return (
    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileView}>
          <Image source={profileImage} style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <Text style={styles.userNameTextStyle}>{_.startCase(userName.toLowerCase())}</Text>
          <Text style={styles.cityName}>{cityName}</Text>
        </View>
        <View style={styles.settingButtonContainer}>
          <TouchableOpacity onPress={onSettingPress}>
            <FastImage
                resizeMode={'contain'}
                source={images.SettingPrivacy}
                style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
      </View>
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
  settingButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
