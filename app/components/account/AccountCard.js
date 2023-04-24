// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {getSportsLabel} from '../../utils/accountUtils';
import GroupIcon from '../GroupIcon';

const AccountCard = ({
  entityData = {},
  sportList = [],
  onPress = () => {},
  containerStyle = {},
  notificationCount = 0,
}) => {
  const [sportsName, setSportsName] = useState('');

  useEffect(() => {
    if (entityData.user_id || entityData.group_id) {
      setSportsName(getSportsLabel({entityData, sportList, maxSports: 1}));
    }
  }, [entityData, sportList]);

  return (
    <Pressable style={[styles.parent, containerStyle]} onPress={onPress}>
      <GroupIcon
        entityType={entityData.entity_type}
        groupName={entityData.group_name}
        imageUrl={entityData.thumbnail}
        containerStyle={styles.profileIcon}
      />
      <View style={{marginLeft: 15}}>
        <Text style={styles.entityName} numberOfLines={1}>
          {entityData.full_name ?? entityData.group_name}
        </Text>
        <View style={styles.parent}>
          <View>
            <Text style={styles.sportList} numberOfLines={1}>
              {sportsName}
            </Text>
          </View>
          {notificationCount > 0 ? (
            <View style={styles.countContainer}>
              <View style={styles.notificationIcon}>
                <Image source={images.tab_notification} style={styles.image} />
              </View>
              <Text style={styles.count}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  entityName: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  sportList: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  countContainer: {
    backgroundColor: colors.notificationCountBgColor,
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 25,
    alignSelf: 'baseline',
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  notificationIcon: {
    width: 7,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default AccountCard;
