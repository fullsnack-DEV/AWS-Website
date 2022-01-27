import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';
import TCUserRoleBadge from '../TCUserRoleBadge';
import TCProfileButton from '../TCProfileButton';
import TCMessageButton from '../TCMessageButton';

export default function UserRoleView({ data, onPressProfile, onPressMessage }) {
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
              <Image source={ data.thumbnail ? { uri: data.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={styles.nameText} numberOfLines={1}>{data.first_name} {data.last_name}</Text>
              <View style={{ flexDirection: 'row' }}>
                {data?.group_member_detail?.is_admin && <TCUserRoleBadge title='Admin' titleColor={colors.themeColor}/>}
                {data?.group_member_detail?.is_coach && <TCUserRoleBadge title='Coach' titleColor={colors.greeColor}/>}
                {data?.group_member_detail?.is_player && <TCUserRoleBadge title='Player' titleColor={colors.playerBadgeColor}/>}
              </View>
            </View>
          </View>
          <View>
            <View style={styles.bottomViewContainer}>
              {/* <Text style={styles.skillText} numberOfLines={2}>Forward, Midfielder, Goal Keeper</Text> */}
              {data?.group_member_detail?.status && <Text style={styles.awayStatusText} numberOfLines={1}>{data.group_member_detail.status.join(', ')}</Text>}
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {data?.group_member_detail?.connected ? <TCMessageButton title = 'Message' color={colors.greeColor} onPress={onPressMessage}/>
            : <TCMessageButton title = 'Email' color={colors.lightBlackColor} onPress={() => {
              Linking.canOpenURL('mailto:')
                // eslint-disable-next-line consistent-return
                .then((supported) => {
                  if (!supported) {
                    // Linking.openURL(`mailto:${data.email}`)
                    Alert.alert('Towns Cup', 'Please configure email in your device')
                  } else {
                    return Linking.openURL(`mailto:${data.email}`)
                  }
                })
                .catch((err) => {
                  console.error('An error occurred', err)
                })
            }}/>}
          <View style={{ marginBottom: 5, marginTop: 5 }}></View>
          <TCProfileButton onPressProfile={onPressProfile} showArrow={true} />
        </View>
      </View>
      <TCThinDivider marginTop={20}/>
    </>
  );
}

const styles = StyleSheet.create({

  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,

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
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginRight: 10,
  },
  bottomViewContainer: {
    marginLeft: 55,
    marginTop: 5,

  },
  // skillText: {
  //   fontSize: 14,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RRegular,
  //   flexShrink: 1,
  // },
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
