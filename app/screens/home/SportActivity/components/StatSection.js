// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import StatsGraph from './StatsGraph';
import images from '../../../../Constants/ImagePath';

const StatSection = ({
  onSeeAll = () => {},
  sportType = '',
  totalMatches = 0,
  totalWins = 0,
  totalLosses = 0,
  totalDraws = 0,
}) => (
  <View style={styles.parent}>
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      <View style={[styles.row, {marginBottom: 0}]}>
        <Text style={styles.title}>{strings.statsTitle}</Text>
        <TouchableOpacity style={styles.nextIcon} onPress={onSeeAll}>
          <Image source={images.rightArrow} style={styles.image} />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.buttonText,
          {color: colors.userPostTimeColor, marginLeft: 10},
        ]}>
        {strings.past6Months}
      </Text>
      {/* <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.buttonText}>{strings.seeAllText}</Text>
      </TouchableOpacity> */}
    </View>
    {sportType === Verbs.singleSport ? (
      <StatsGraph
        wins={totalWins}
        draws={totalDraws}
        losses={totalLosses}
        total={totalMatches}
      />
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
    // justifyContent: 'space-between',
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
  nextIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 4,
    backgroundColor: colors.grayBackgroundColor,
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default StatSection;
