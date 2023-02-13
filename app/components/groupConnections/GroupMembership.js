/* eslint-disable no-param-reassign */
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

const GroupMembership = ({
  groupData,
  switchID,
  edit = false,
  onEditPressed,
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
          <Image
            source={
              groupData.thumbnail
                ? {uri: groupData.thumbnail}
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
          />

          <View style={styles.topTextContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.nameText} numberOfLines={5}>
                {groupData.group_name}
              </Text>
              <Image source={typeImage} style={styles.teamTImage} />
            </View>
            <View style={{flexDirection: 'row'}}>
              {groupData.is_admin && (
                <TCUserRoleBadge
                  title={strings.admin}
                  titleColor={colors.themeColor}
                />
              )}
              {groupData.is_coach && (
                <TCUserRoleBadge
                  title={strings.coach}
                  titleColor={colors.greeColor}
                />
              )}
              {groupData.is_member && (
                <TCUserRoleBadge
                  title={strings.player}
                  titleColor={colors.playerBadgeColor}
                />
              )}
            </View>
          </View>
        </View>
        {(edit || groupData.group_id === switchID) &&
        authContext.entity.role === groupData.entity_type ? (
          <TouchableWithoutFeedback onPress={onEditPressed}>
            <Image source={images.editSection} style={styles.editImage} />
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      {authContext.entity.role === 'team' && (
        <>
          <TCInfoField
            title={strings.positionPlaceholder}
            value={
              groupData.positions?.length && groupData.positions[0] !== {}
                ? groupData.positions.toString()
                : strings.NAText
            }
            marginLeft={25}
            marginTop={30}
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
              groupData.status ? groupData.status.join(', ') : strings.NAText
            }
            marginLeft={25}
            color={colors.darkThemeColor}
          />
        </>
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
    marginTop: 10,
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
    height: 18,
    resizeMode: 'contain',
    width: 18,
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
