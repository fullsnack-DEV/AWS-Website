import React from 'react';
import {StyleSheet, Text} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../../Localization/translation';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCUserRoleBadge({
  title = strings.admin,
  titleColor = colors.themeColor,
  gradientColor = colors.blackGradientColor,
  gradientColor1 = colors.whiteGradientColor,
}) {
  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor]}
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
    borderRadius: 4,
    height: 16,
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  roleTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 10,
    textAlign: 'center',
  },
});
