import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PATH from '../../Constants/ImagePath';
import GroupIconImage from './GroupIconImage';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function NotificationProfileItem({ data, indexNumber, selectedIndex }) {
  let entityName = '';
  let entityImage = '';
  let placeHolder = '';
  let notificationUnreadCount = 0;
  if (data && data.group_name) {
    entityName = data.group_name;
  }
  if (data && data.thumbnail) {
    entityImage = data.thumbnail;
  }
  if (data.entity_type === 'player') {
    entityName = data.full_name;
    placeHolder = PATH.profilePlaceHolder;
  } else if (data.entity_type === 'team') {
    placeHolder = PATH.teamPlaceholder;
  } else if (data.entity_type === 'club') {
    placeHolder = PATH.clubPlaceholder;
  }
  notificationUnreadCount = data.unread;
  return (
    <View style={indexNumber === selectedIndex ? styles.selectedTab : ''}>
      <View
        style={[
          styles.container,
          indexNumber === selectedIndex ? styles.containerActive : '',
        ]}>
        <GroupIconImage
          entityName={entityName}
          entityImg={entityImage}
          placeholderImage={placeHolder}
          currentState={indexNumber === selectedIndex ? 'Active' : 'Inactive'}
          unreadCount={notificationUnreadCount}
        />
        <View>
          <Text
            style={[
              styles.entityNameTextStyle,
              indexNumber === selectedIndex
                ? styles.entityNameTextStyleActive
                : '',
            ]}
            numberOfLines={2}>
            {entityName}
          </Text>
        </View>
      </View>
      {/* <View
        style={indexNumber === selectedIndex ? styles.orangeSeprator : ''}
      /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    width: 160,
    opacity: 0.3,
  },
  containerActive: {
    // backgroundColor: 'white',
    opacity: 1,
  },
  // orangeSeprator: {
  //   backgroundColor: '#FF8A01',
  //   width: 160,
  //   height: 2,
  // },
  selectedTab: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingBottom: 3,
  },

  entityNameTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 7,
    width: 72,
  },
  entityNameTextStyleActive: {
    color: colors.kHexColorFF8A01,
  },
});

export default NotificationProfileItem;
