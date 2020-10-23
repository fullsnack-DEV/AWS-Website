import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,

} from 'react-native';

import images from '../../Constants/ImagePath'
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import TCInfoField from '../TCInfoField';
import TCThinDivider from '../TCThinDivider';
import TCUserRoleBadge from '../TCUserRoleBadge';
import TCGroupNameBadge from '../TCGroupNameBadge';

export default function GroupMembership() {
  return (
    <>

      <View style={styles.topViewContainer}>
        <View style={styles.profileView}>
          <Image source={ images.profilePlaceHolder } style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <TCGroupNameBadge/>
          <View style={{ flexDirection: 'row' }}>
            <TCUserRoleBadge/>
            <TCUserRoleBadge title='Coach' titleColor={colors.greeColor}/>
            <TCUserRoleBadge title='Player' titleColor={colors.playerBadgeColor}/>
          </View>
        </View>
      </View>
      <TCInfoField title={'Position'} value={'Forward'} marginLeft={25} marginTop={30}/>
      <TCInfoField title={'Jersey Number'} value={'11'} marginLeft={25} />
      <TCInfoField title={'Appearance'} value={'21 games'} marginLeft={25} />
      <TCInfoField title={'Status'} value={'Injured Long-term Away'} marginLeft={25} color={colors.themeColor}/>
      <Text style={styles.groupDescriptionText}>Association football, more commonly known
        as foot ball or soccer team, is a team sports
        played between two teams of eleven player
      </Text>
      <TCThinDivider marginTop={20} width={'100%'}/>
    </>
  );
}
const styles = StyleSheet.create({
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  undatedTimeText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flexShrink: 1,
  },
  basicInfoTitle: {
    marginTop: 10,
    marginLeft: 15,
    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  familyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  ///
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },

  topViewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
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
  groupDescriptionText: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
