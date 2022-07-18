import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import strings from '../Constants/String';

export default function TCInfoField({
  title = strings.NA,
  value = strings.NA,
  color = colors.lightBlackColor,
  titleStyle,
  valueStyle,
  ...Props
}) {
  return (
    <View style={[styles.fieldView, Props]}>
      <Text style={[styles.fieldTitle, titleStyle]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.fieldValue, valueStyle, {color}]} numberOfLines={3}>
        {value}
      </Text>
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
    alignItems: 'center',
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flex: 0.3,
    // paddingTop: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.65,
  },
});
