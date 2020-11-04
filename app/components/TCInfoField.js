import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,

} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCInfoField({
  title = 'N/A',
  value = 'N/A',
  color = colors.lightBlackColor,
  ...Props
}) {
  return (
    <View style={[styles.fieldView, Props]}>
      <Text style={styles.fieldTitle} numberOfLines={1}>{title}</Text>
      <Text style={[styles.fieldValue, { color }]} numberOfLines={2} >{value}</Text>
    </View>

  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flex: 0.3,
    paddingTop: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.7,
  },
});
