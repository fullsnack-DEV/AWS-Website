import React from 'react';
import {StyleSheet, Text} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCUserRoleBadge({
  title = 'Admin',
  titleColor = colors.themeColor,
}) {
  return (
    <LinearGradient
      colors={[colors.whiteGradientColor, colors.blackGradientColor]}
      style={styles.badgeView}>
      <Text style={[styles.roleTitle, {color: titleColor}]}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badgeView: {
    margin: 2,
    marginLeft: 0,
    marginRight: 4,
    alignItems: 'center',
    borderRadius: 5,
    height: 16,
    justifyContent: 'center',
    width: 38,
  },
  roleTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 10,
    textAlign: 'center',
  },
});
