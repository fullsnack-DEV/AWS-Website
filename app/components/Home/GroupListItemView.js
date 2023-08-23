import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import GroupIcon from '../GroupIcon';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';

const GroupListItemView = ({
  groupData = {},
  onPress = () => {},
  loggedInEntityType = Verbs.entityTypePlayer,
  loggedInEntityId = '',
  handleFollowUnfollow = () => {},
}) => {
  const showFollowBtn =
    loggedInEntityId !== groupData.group_id &&
    loggedInEntityType === (Verbs.entityTypeUser || Verbs.entityTypePlayer);

  return (
    <>
      <View style={styles.parent}>
        <TouchableOpacity onPress={() => onPress(groupData)} style={styles.row}>
          <GroupIcon
            groupName={groupData.group_name}
            imageUrl={groupData.thumbnail}
            entityType={groupData.entity_type}
            containerStyle={styles.profileView}
            textstyle={{fontSize: 12, marginTop: 1}}
          />
          <View style={{flex: 1}}>
            <Text style={styles.name} numberOfLines={1}>
              {groupData.group_name}
            </Text>
            <Text style={styles.citySport} numberOfLines={1}>{`${
              groupData.city
            } · ${groupData.sport ?? groupData.sports_string}`}</Text>
          </View>
        </TouchableOpacity>
        {showFollowBtn ? (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              groupData.is_following ? {} : {paddingHorizontal: 20},
            ]}
            onPress={handleFollowUnfollow}>
            <Text
              style={[
                styles.buttonText,
                groupData.is_following ? {} : {color: colors.themeColor},
              ]}>
              {groupData.is_following ? strings.following : strings.follow}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  profileView: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  citySport: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});
export default GroupListItemView;
