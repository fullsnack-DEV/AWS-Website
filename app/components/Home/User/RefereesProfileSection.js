import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import UserCategoryView from './UserCategoryView';

export default function RefereesProfileSection({
  profileImage,
  userName,
}) {
  return (

    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileView}>
          <Image source={profileImage} style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <View style={styles.userViewStyle}>
            <Text style={styles.userNameTextStyle}>{userName}</Text>
            <Image source={images.settingImage} style={styles.settingImageStyle} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <UserCategoryView title='Player' titleColor={colors.userPostTimeColor}/>
            <UserCategoryView title='Coach' titleColor={colors.userPostTimeColor}/>
            <UserCategoryView title='Tainer' titleColor={colors.userPostTimeColor}/>
            <UserCategoryView title='scorekeeper' titleColor={colors.userPostTimeColor}/>
            <UserCategoryView title='Referees' titleColor={colors.redDelColor} badgeView={{
              borderWidth: 1, borderColor: colors.themeColor, borderBottomWidth: 1, borderBottomColor: colors.themeColor,
            }}/>
          </View>
        </View>
      </View>
      <View style={styles.editViewStyle}>
        <Text>{'$20 CAD'}<Text>{'(per hours)'}</Text></Text>
        <Text>{'EDIT'}</Text>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  topViewContainer: {
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
  userViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '82%',
  },
  settingImageStyle: {
    height: 30,
    width: 30,
  },
  editViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
  },
});
