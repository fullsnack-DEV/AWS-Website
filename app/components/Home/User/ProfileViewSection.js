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
  feesCount,
}) {
  return (
    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileView}>
          <Image source={profileImage} style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <Text style={styles.userNameTextStyle}>{userName}</Text>
          <View style={{ flexDirection: 'row' }}>
            <UserCategoryView title='Player' titleColor={colors.blueColor}/>
          </View>
        </View>
      </View>
      <View style={styles.editViewStyle}>
        <Text style={styles.editTextStyle}>{'Game Fees'}</Text>
        <Text style={styles.editTextStyle}>{`$${feesCount} CAD`}
          <Text style={styles.perHourTextStyle}>{' (per hours)'}</Text>
        </Text>
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
  editViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: colors.whiteColor,
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 5,
      width: 1,
    },
    elevation: 10,
    shadowColor: colors.orangeColor,
  },
  editTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.redDelColor,
  },
  perHourTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.redDelColor,
  },
});
