import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BarChart, XAxis, PieChart as SVGPieChart,
} from 'react-native-svg-charts'
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import WinProgressView from '../../../../../components/Home/WinProgressView';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import StatsSelectionView from '../../../../../components/Home/StatsSelectionView';
import strings from '../../../../../Constants/String';
import PlayInCommonScoreTypesData from './PlayInCommonScoreTypesData';

const Gradient = () => (
  <Defs key={'gradient'}>
    <LinearGradient
          id={'gradient'}
          x1={'0%'}
          y={'0%'}
          x2={'0%'}
          y2={'100%'}
      >
      <Stop offset={'0%'} stopColor={colors.yellowColor} />
      <Stop offset={'100%'} stopColor={colors.themeColor} />
    </LinearGradient>
  </Defs>
);

const monthsSelectionData = [
  { label: 'Past 3 Months', value: 'Past 3 Months' },
  { label: 'Past 6 Months', value: 'Past 6 Months' },
  { label: 'Past 9 Months', value: 'Past 9 Months' },
  { label: 'Past 12 Months', value: 'Past 12 Months' },
]

export default function PlayInCommonChartScreen({
  gameChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  gameStatsData,
  gameChartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  selectWeekMonth,
  setSelectWeekMonth,
}) {
  const [pieData, setPieData] = useState([]);
  useEffect(() => {
    const data = Object.keys(gameStatsData)
      ?.filter((item) => ['winner', 'draw', 'looser']?.includes(item))
      ?.map((item) => ({
        key: item,
        value: gameStatsData[item] !== 0 ? (100 * gameStatsData[item]) / gameStatsData.total_games : 0,
        svg: { fill: `url(#${item})` },
        // svg: { fill: 'gray' },
      }))
    setPieData([...data]);
  }, [gameStatsData]);

  const GradientView = ({ keyName }) => {
    let startColor = colors.googleColor;
    let endColor = colors.googleColor;
    if (keyName === 'winner') {
      startColor = colors.blueGradiantEnd;
      endColor = colors.blueGradiantStart
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
    )
  };

  return (
    <View>
      <View style={{
        justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 15,
      }}>
        <View style={styles.totalGameViewStyle}>
          <Text style={styles.totalGameTextStyle}>{'Total Matches'}</Text>
          <Text style={styles.totalGameCounterText}>{gameStatsData ? gameStatsData.total_games : ''}</Text>
        </View>
        <StatsSelectionView
            dataSource={monthsSelectionData}
            placeholder={strings.selectTimePlaceholder}
            value={selectWeekMonth}
            onValueChange={setSelectWeekMonth}
        />
      </View>
      <View style={styles.containerStyle}>
        <View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <WinProgressView
              titleText={'Wins'}
              percentageCount={gameStatsData ? gameStatsData.winner : ''}
              progress={gameStatsData.winner !== 0 ? (1 * gameStatsData.winner) / gameStatsData.total_games : 0}
              prgressColor={colors.blueGradiantStart}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.blueGradiantStart }]}
              textStyle={styles.textStyle}
              containerStyle={{ marginVertical: 5 }}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
            <WinProgressView
              titleText={'Draws'}
              percentageCount={gameStatsData ? gameStatsData.draw : ''}
              progress={gameStatsData.draw !== 0 ? (1 * gameStatsData.draw) / gameStatsData.total_games : 0}
              prgressColor={colors.greenGradientEnd}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.greenGradientEnd }]}
              textStyle={styles.textStyle}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
            <WinProgressView
              titleText={'Losses'}
              percentageCount={gameStatsData ? gameStatsData.looser : ''}
              progress={gameStatsData.looser !== 0 ? (1 * gameStatsData.looser) / gameStatsData.total_games : 0}
              prgressColor={colors.orangeColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.orangeColor }]}
              textStyle={styles.textStyle}
              containerStyle={{ marginVertical: 5 }}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
          </View>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <SVGPieChart
              style={{ height: 160, width: 160 }}
              data={pieData}
              spacing={0}
              radius={60}
              outerRadius={60}
              innerRadius={52}>
            <GradientView keyName={'looser'}/>
            <GradientView keyName={'draw'}/>
            <GradientView keyName={'winner'}/>
          </SVGPieChart>
          <View style={styles.winPercentageView}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.percentageStyle}>{(gameStatsData.winner !== 0 ? (100 * gameStatsData.winner) / gameStatsData?.total_games : 0).toFixed(1)}</Text>
            </View>
            <Text style={styles.winTextStyle}>{'Winning\nPercentage'}</Text>
          </View>
        </View>
      </View>

      {/* Bar Chart */}
      <View>
        <View style={{ height: 250, marginTop: 30 }}>
          <BarChart
            style={{ flex: 1 }}
            data={gameChartData}
            gridMin={0}
            contentInset={{ marginTop: 10 }}
            svg={{ fill: 'url(#gradient)' }}
            spacingInner={0.5}
            spacingOuter={0.5}
        >
            <Gradient />
          </BarChart>
          <XAxis
            style={{
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: colors.lightgrayColor,
              shadowColor: colors.blackColor,
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.2,
              elevation: 2,
              backgroundColor: colors.whiteColor,
              justifyContent: 'space-evenly',
              paddingTop: 5,
            }}
            data={gameChartMonths}
            formatLabel={(value, index) => gameChartMonths?.[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 12, fill: colors.lightBlackColor, fontFamily: fonts.RRegular }}
        />
        </View>
      </View>

      {/*   Bottom Selection */}
      <PlayInCommonScoreTypesData />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalGameViewStyle: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  totalGameTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  totalGameCounterText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    width: 50,
  },
  percentageTextStyle: {
    textAlign: 'right',
    width: 20,
    fontSize: 16,
  },
  winPercentageView: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.blueGradiantStart,
    textAlign: 'center',
  },
  percentageStyle: {
    fontSize: 25,
    fontFamily: fonts.RMedium,
    color: colors.blueGradiantStart,
  },
});
