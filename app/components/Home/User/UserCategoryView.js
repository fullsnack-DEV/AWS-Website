import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function UserCategoryView({
  title = 'Admin', titleColor = colors.themeColor, badgeView,
}) {
  return (
    <View style={[styles.badgeView, badgeView]}>
      <Text style={[styles.roleTitle, { color: titleColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeView: {
    margin: 2,
    marginRight: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderRadius: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.grayColor,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    backgroundColor: colors.offGrayColor,
    justifyContent: 'center',
  },
  roleTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 10,
    marginTop: 1,
  },
});
