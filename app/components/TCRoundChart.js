/* eslint-disable import/no-extraneous-dependencies */

import React, { memo } from 'react';
import {
StyleSheet, Text, View, Image,
} from 'react-native';
import { PieChart as SVGPieChart } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

let data = [];
const TCRoundChart = ({
  gameStatsData = {
    total_games: 10,
    winner: 5,
    draw: 2,
    looser: 3,
  },
}) => {
     data = Object.keys(gameStatsData)
      ?.filter((item) => ['winner', 'draw', 'looser']?.includes(item))
      ?.map((item) => ({
        key: item,
        value:
          gameStatsData[item] !== 0
            ? (100 * gameStatsData[item]) / gameStatsData.total_games
            : 0,
        svg: { fill: `url(#${item})` },
      }));

  const GradientView = ({ keyName }) => {
    let startColor = colors.googleColor;
    let endColor = colors.googleColor;
    if (keyName === 'winner') {
      startColor = colors.blueGradiantEnd;
      endColor = colors.blueGradiantStart;
    } else if (keyName === 'draw') {
      startColor = colors.greenGradientEnd;
      endColor = colors.greenGradientStart;
    } else if (keyName === 'looser') {
      startColor = colors.themeColor;
      endColor = colors.yellowColor;
    }
    return (
      <Defs key={keyName}>
        <LinearGradient id={keyName} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
          <Stop offset={'0%'} stopColor={startColor} />
          <Stop offset={'100%'} stopColor={endColor} />
        </LinearGradient>
      </Defs>
    );
  };
  return (
    <View style={{ paddingVertical: 6 }}>
      <View style={styles.containerStyle}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <SVGPieChart
            style={{ height: 64, width: 64 }}
            data={
              data?.filter((item) => item?.value === 0)?.length === 3 ? [
                {
                  key: 'nullData',
                  value: 100,
                  svg: { fill: colors.lightgrayColor },
                },
            ] : data
            }
            spacing={0}
            radius={30}
            outerRadius={30}
            innerRadius={25}>
            <GradientView keyName={'looser'} />
            <GradientView keyName={'draw'} />
            <GradientView keyName={'winner'} />
          </SVGPieChart>
          <View style={styles.chartProfileView}>
            <View
              style={{
                flexDirection: 'row',
                shadowColor: colors.googleColor,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}>
              <Image
                source={images.soccerBackground}
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: 'cover',
                  borderRadius: 20,
                }}
              />
            </View>
          </View>
        </View>
        <Text style={styles.winTextStyle}>
          Wins{' '}
          <Text style={styles.percentageStyle}>
            {(gameStatsData.winner !== 0
              ? (100 * gameStatsData.winner) / gameStatsData?.total_games
              : 0
            ).toFixed(0)}
            %
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'column',
  },
  chartProfileView: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 31,
  },
  winTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    textAlign: 'center',
    marginTop: 10,
  },
  percentageStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
});

export default memo(TCRoundChart);
