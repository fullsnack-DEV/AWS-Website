// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const AccountHeader = ({
  notificationCount = 0,
  onPressNotification = () => {},
}) => (
  <View style={styles.parent}>
    <Text style={styles.label}>{strings.account}</Text>
    <TouchableOpacity style={styles.iconButton} onPress={onPressNotification}>
      <Image source={images.notificationBell} style={styles.image} />
      <View style={styles.countContainer}>
        <Text style={styles.count}>
          {notificationCount > 99 ? '99+' : notificationCount}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingLeft: 18,
    paddingBottom: 16,
    paddingTop: 4,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  label: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  iconButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  countContainer: {
    backgroundColor: colors.notificationCountBgColor,
    padding: 3,
    borderRadius: 25,
    position: 'absolute',
    top: -3,
    right: -3,
  },
  count: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
});
export default AccountHeader;
