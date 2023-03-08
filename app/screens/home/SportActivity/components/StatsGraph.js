// @flow
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import Pie from 'react-native-pie';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const Colors = {
  wins: colors.winGraphColor,
  draws: colors.completeTextColor,
  losses: colors.redColorCard,
};

const Labels = {
  wins: strings.wins,
  draws: strings.draws,
  losses: strings.losses,
};

const StatsGraph = ({
  wins = 0,
  draws = 0,
  losses = 0,
  total = 0,
  showTotalMatches = true,
  containerStyle = {},
}) => {
  const [chartData, setChartData] = useState([
    {
      percentage: 100,
      color: colors.grayBackgroundColor,
    },
  ]);
  const [percentageObject, setPercentageObject] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
  });

  const calculatePercentage = useCallback(
    (value) => {
      if (value > 0) {
        return Math.round((value * 100) / total);
      }
      return 0;
    },
    [total],
  );

  useEffect(() => {
    if (total > 0) {
      const obj = {
        wins: calculatePercentage(wins),
        draws: calculatePercentage(draws),
        losses: calculatePercentage(losses),
      };

      const data = Object.keys(obj).map((item) => ({
        percentage: obj[item],
        color: Colors[item],
      }));

      setChartData([...data]);
      setPercentageObject(obj);
    }
  }, [wins, draws, losses, total, calculatePercentage]);

  return (
    <View style={[styles.parent, containerStyle]}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Pie
          radius={80}
          innerRadius={66}
          sections={chartData}
          strokeCap={'round'}
        />
        <View style={styles.gauge}>
          <Text style={styles.gaugePercentange}>
            {percentageObject.wins} <Text style={styles.gaugePercIcon}>%</Text>
          </Text>
          <Text style={styles.gaugeText}>{strings.winningPercentage}</Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        {showTotalMatches ? (
          <Text style={[styles.totalText, {marginBottom: 10}]}>
            {strings.totalMatches}{' '}
            <Text
              style={[
                styles.totalText,
                {fontFamily: fonts.RMedium, marginBottom: 10},
              ]}>
              {total}
            </Text>
          </Text>
        ) : null}

        {Object.keys(percentageObject).map((item, index) => (
          <View style={styles.row} key={`${index}${item}`}>
            <Text style={[styles.totalText, {textAlign: 'left'}]}>
              {Labels[item]}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBar,
                  {
                    marginHorizontal: 0,
                    backgroundColor: Colors[item],
                    width: `${percentageObject[item]}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.totalText,
                {
                  marginBottom: 0,
                  fontFamily: fonts.RMedium,
                  color: Colors[item],
                },
              ]}>
              {percentageObject[item]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  gauge: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercentange: {
    fontSize: Platform.OS === 'android' ? 20 : 40,
    lineHeight: Platform.OS === 'android' ? 24 : 48,
    color: colors.eventBlueColor,
    fontFamily: fonts.RBold,
    marginBottom: 5,
  },
  gaugePercIcon: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.eventBlueColor,
    fontFamily: fonts.RBold,
    marginBottom: 5,
  },
  gaugeText: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    textAlign: 'right',
    fontFamily: fonts.RRegular,
  },
  progressBar: {
    height: 8,
    flex: 1,
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 16,
  },
});
export default StatsGraph;
