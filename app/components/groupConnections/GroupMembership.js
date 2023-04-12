/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCInfoField from '../TCInfoField';
import TCUserRoleBadge from '../TCUserRoleBadge';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

const GroupMembership = ({
  groupData,
  switchID,
  edit = false,
  onEditPressed,
  onlybadge = false,
}) => {
  let typeImage = '';
  const authContext = useContext(AuthContext);

  if (groupData.group?.entity_type === 'team') {
    const a = {
      ...groupData.group,
      positions: groupData.positions,
      jersey_number: groupData.jersey_number,
      appearance: groupData.appearance,
      status: groupData.status,
      is_admin: groupData.is_admin,
      is_member: groupData.is_member,
      is_coach: groupData.is_coach,
      is_player: groupData.is_player,
      note: groupData.note,
      user_id: groupData.user_id,
    };
    groupData = a;
  }

  if (groupData.entity_type === 'player') typeImage = '';
  else if (groupData.entity_type === 'club') typeImage = images.clubC;
  else if (groupData.entity_type === 'team') typeImage = images.teamT;
  else if (groupData.entity_type === 'league') typeImage = images.clubC;

  return (
    <>
      <View style={styles.topViewContainer}>
        <View style={{flexDirection: 'row'}}>
          {!onlybadge && (
            <Image
              source={
                groupData.thumbnail
                  ? {uri: groupData.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}
            />
          )}

          <View style={styles.topTextContainer}>
            {!onlybadge && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.nameText} numberOfLines={5}>
                  {groupData.group_name}
                </Text>
                <Image source={typeImage} style={styles.teamTImage} />
              </View>
            )}
            <View style={{flexDirection: 'row'}}>
              {groupData.is_admin && (
                <TCUserRoleBadge
                  title={strings.admin}
                  titleColor={colors.themeColor}
                  gradientColor={colors.lightGrayBackground}
                  gradientColor1={colors.lightGrayBackground}
                  style={{
                    marginLeft: 5,
                  }}
                />
              )}
              {groupData.is_coach && (
                <TCUserRoleBadge
                  title={strings.coach}
                  titleColor={colors.greeColor}
                  gradientColor={colors.lightGrayBackground}
                  gradientColor1={colors.lightGrayBackground}
                  style={{
                    marginLeft: 5,
                  }}
                />
              )}
              {groupData.is_player && (
                <TCUserRoleBadge
                  title={strings.player}
                  titleColor={colors.playerBadgeColor}
                  gradientColor={colors.lightGrayBackground}
                  gradientColor1={colors.lightGrayBackground}
                  style={{
                    marginLeft: 5,
                  }}
                />
              )}
              {groupData.is_parent && (
                <TCUserRoleBadge
                  title={strings.parentBadgeText}
                  titleColor={colors.yellowColor}
                  gradientColor={colors.lightGrayBackground}
                  gradientColor1={colors.lightGrayBackground}
                  style={{
                    marginLeft: 5,
                  }}
                />
              )}
              {groupData.is_others && (
                <TCUserRoleBadge
                  title={strings.other}
                  titleColor={colors.veryLightBlack}
                  gradientColor={colors.lightGrayBackground}
                  gradientColor1={colors.lightGrayBackground}
                  style={{
                    marginLeft: 5,
                  }}
                />
              )}
            </View>
          </View>
        </View>
        {(edit || groupData.group_id === switchID) &&
        authContext.entity.role === Verbs.entityTypeTeam ? (
          <TouchableWithoutFeedback onPress={onEditPressed}>
            <Image source={images.editProfilePencil} style={styles.editImage} />
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      {authContext.entity.role === Verbs.entityTypeTeam && (
        <View
          style={{
            marginTop: 5,
          }}>
          <TCInfoField
            title={strings.positionPlaceholder}
            value={
              groupData.positions?.length && groupData.positions[0] !== {}
                ? groupData.positions.toString()
                : strings.NAText
            }
            marginLeft={25}
          />
          <TCInfoField
            title={strings.jerseyNumberPlaceholder}
            value={
              groupData.jersey_number ? groupData.jersey_number : strings.NAText
            }
            marginLeft={25}
          />

          <TCInfoField
            title={strings.statusPlaceholder}
            value={
              groupData.status
                ? groupData.status.length > 0
                  ? groupData.status.join(', ')
                  : strings.NAText
                : strings.NAText
            }
            marginLeft={25}
            color={colors.darkThemeColor}
          />
        </View>
      )}
      {/* {groupData.note ? (
        <Text style={styles.groupDescriptionText}>{groupData.note}</Text>
      ) : null} */}
    </>
  );
};
const styles = StyleSheet.create({
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,
  },

  topViewContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-between',
  },

  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },

  editImage: {
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 12,
  },
  teamTImage: {
    marginHorizontal: 5,
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
});

export default GroupMembership;
