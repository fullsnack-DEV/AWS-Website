import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';

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
      <Text style={[styles.fieldValue, valueStyle, {color}]} numberOfLines={0}>
        {value}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.veryLightBlack,
    flex: 0.4,
    marginRight: 15,
    alignSelf: 'flex-start',
    fontFamily: fonts.RMedium,

    lineHeight: 24,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    flex: 0.65,
    marginLeft: 30,

    fontFamily: fonts.RRegular,

    lineHeight: 21,
  },
});
