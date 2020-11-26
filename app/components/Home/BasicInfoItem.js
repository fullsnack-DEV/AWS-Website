import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function BasicInfoItem({
  title,
  value,
  titleStyle,
  valueStyle,
  fieldView,
}) {
  return (
    <View style={[styles.fieldView, fieldView]}>
      <Text style={[styles.fieldTitle, titleStyle]} numberOfLines={2}>{title}</Text>
      <Text style={[styles.fieldValue, valueStyle]} numberOfLines={3} >{value}</Text>
    </View>

  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  fieldTitle: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flex: 0.25,
  },
  fieldValue: {
    marginLeft: 5,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.75,
  },
});
