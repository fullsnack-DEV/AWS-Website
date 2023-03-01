// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import StatsGraph from './StatsGraph';

const StatSection = ({
  onSeeAll = () => {},
  sportType = '',
  totalMatches = 0,
}) => (
  <View style={styles.parent}>
    <View style={styles.row}>
      <View style={[styles.row, {marginBottom: 0}]}>
        <Text style={styles.title}>{strings.statsTitle}</Text>
        <Text
          style={[
            styles.buttonText,
            {color: colors.userPostTimeColor, marginLeft: 10},
          ]}>
          {strings.past6Months}
        </Text>
      </View>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.buttonText}>{strings.seeAllText}</Text>
      </TouchableOpacity>
    </View>
    {sportType === Verbs.singleSport ? (
      <StatsGraph wins={20} draws={40} losses={10} total={70} />
    ) : (
      <View style={styles.container}>
        <Text style={styles.count}>{totalMatches}</Text>
        <Text style={styles.label}>{strings.matchesTitleText}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  parent: {
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  container: {
    height: 150,
    borderRadius: 5,
    backgroundColor: colors.lightGrayBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 64,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.googleColor,
    fontFamily: fonts.RMedium,
  },
});
export default StatSection;
