import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';
import TCUserRoleBadge from '../TCUserRoleBadge';
import TCProfileButton from '../TCProfileButton';
import TCMessageButton from '../TCMessageButton';

export default function UserRoleView() {
  return (
    <>
      <View style={styles.roleViewContainer}>
        <View style={{
          width: 0,
          flexGrow: 1,
          flex: 1,
        }}>
          <View style={styles.topViewContainer}>
            <View style={styles.profileView}>
              <Image source={ images.profilePlaceHolder } style={ styles.profileImage } />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={styles.nameText} numberOfLines={1}>Neymar JR</Text>
              <View style={{ flexDirection: 'row' }}>
                <TCUserRoleBadge/>
                <TCUserRoleBadge title='Coach' titleColor={colors.greeColor}/>
                <TCUserRoleBadge title='Player' titleColor={colors.playerBadgeColor}/>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.bottomViewContainer}>
              <Text style={styles.skillText} numberOfLines={2}>Forward, Midfielder, Goal Keeper</Text>
              <Text style={styles.awayStatusText} numberOfLines={1}>Injured, Long-term Away</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TCMessageButton title = 'Message' color={colors.greeColor}/>
          <View style={{ marginBottom: 5, marginTop: 5 }}></View>
          <TCProfileButton/>
        </View>
      </View>
      <TCThinDivider/>
    </>
  );
}

const styles = StyleSheet.create({

  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topViewContainer: {
    flexDirection: 'row',
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
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  bottomViewContainer: {
    marginLeft: 55,
    marginTop: 5,

  },
  skillText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flexShrink: 1,
  },
  awayStatusText: {
    fontSize: 12,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
