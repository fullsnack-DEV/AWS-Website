import React from 'react';
import {
  View, StyleSheet, Image, Text,
} from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function GroupIconImage({
  entityName,
  entityImg,
  placeholderImage,
  currentState,
  unreadCount,
}) {
  return (
    <View>
      {entityImg ? (
        <View
          style={
            currentState === 'Active'
              ? styles.placeholderViewActive
              : styles.placeholderViewInActive
          }>
          <Image source={{ uri: entityImg }} style={styles.entityImg} />
        </View>
      ) : (
        <View
          style={
            currentState === 'Active'
              ? styles.placeholderViewActive
              : styles.placeholderViewInActive
          }>
          <Image source={placeholderImage} style={styles.entityImg} />
          <Text style={styles.oneCharacterText}>
            {entityName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      {unreadCount > 0 && (
        <View style={styles.badgeView}>
          <Text style={unreadCount > 99 ? styles.ovalBadgeView : styles.badgeCounter}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  entityImg: {
    alignSelf: 'center',
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    width: 30,
    resizeMode: 'cover',
  },
  oneCharacterText: {
    // alignSelf:'center',
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderViewActive: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.themeColor,
    borderRadius: 18,
    borderWidth: 2,
    height: 38,
    width: 38,
    justifyContent: 'center',
  },
  placeholderViewInActive: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 18,
    borderWidth: 2,
    height: 38,
    width: 38,
    justifyContent: 'center',
  },
  badgeCounter: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
    height: 17,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 17,
  },
  badgeView: {
    backgroundColor: 'red',
    borderRadius: 8,
    height: 16,
    position: 'absolute',
    left: 20,
    width: 16,
  },
  ovalBadgeView: {
    backgroundColor: 'red',
    borderRadius: 8,
    height: 16,
    position: 'absolute',
    left: 20,
    width: 22,
  },
});

export default GroupIconImage;
