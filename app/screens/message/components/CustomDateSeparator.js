// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const CustomDateSeparator = ({date = new Date()}) => {
  const isToday = moment(new Date()).diff(date, 'hours') < 24;
  let dateString = '';
  if (typeof date === 'string') {
    dateString = date;
  } else {
    dateString = isToday
      ? strings.todayTitleText
      : moment(date).format('MMM DD');
  }

  return (
    <View style={styles.dateSeparatorContainer}>
      <Text style={styles.dateSeparator}>{dateString}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateSeparator: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});
export default CustomDateSeparator;
