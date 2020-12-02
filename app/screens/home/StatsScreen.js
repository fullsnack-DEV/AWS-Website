import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  FlatList,
} from 'react-native';
import Pie from 'react-native-pie';
import { BarChart, XAxis } from 'react-native-svg-charts'
import StatsSelectionView from '../../components/Home/StatsSelectionView';
import WinProgressView from '../../components/Home/WinProgressView';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import StatsGradiantView from '../../components/Home/StatsGradiantView';

const game_data = [
  {
    id: 0,
    image: images.gamesImage,
    selectImage: images.gamesSelected,
    title: 'Games',
    total: 139,
    isSelected: true,
  },
  {
    id: 1,
    image: images.assistsImage,
    selectImage: images.assistsSelected,
    title: 'Assists',
    total: 28,
    isSelected: false,
  },
  {
    id: 2,
    image: images.goalsImage,
    selectImage: images.goalsSelected,
    title: 'Goals',
    total: 12,
    isSelected: false,
  },
  {
    id: 3,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Yellow card',
    total: 6,
    isSelected: false,
  },
  {
    id: 4,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Red card',
    total: 2,
    isSelected: false,
  },
];

export default function StatsScreen({
  gameChartData,
  gameStatsData,
}) {
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [gameData, setGameData] = useState(game_data);
  const [graphData, setGraphData] = useState(gameChartData);
  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <StatsSelectionView
        dataSource={[
          { label: 'Past 3 Months', value: 'Past 3 Months' },
          { label: 'Past 6 Months', value: 'Past 6 Months' },
          { label: 'Past 9 Months', value: 'Past 9 Months' },
          { label: 'Past 12 Months', value: 'Past 12 Months' },
        ]}
        placeholder={strings.selectTimePlaceholder}
        value={selectWeekMonth}
        onValueChange={(value) => {
          setSelectWeekMonth(value);
        }}
      />
      <View style={styles.containerStyle}>
        <View>
          <View style={styles.totalGameViewStyle}>
            <Text style={styles.totalGameTextStyle}>{'Total Games'}</Text>
            <Text style={styles.totalGameCounterText}>{gameStatsData ? gameStatsData.total_games : ''}</Text>
          </View>
          <WinProgressView
              titleText={'Wins'}
              percentageCount={gameStatsData ? gameStatsData.winner : ''}
              progress={gameStatsData.winner !== 0 ? (1 * gameStatsData.winner) / gameStatsData.total_games : 0}
              prgressColor={colors.orangeColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.orangeColor }]}
              textStyle={styles.textStyle}
              containerStyle={{ marginVertical: 5 }}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
          <WinProgressView
              titleText={'Draws'}
              percentageCount={gameStatsData ? gameStatsData.draw : ''}
              progress={gameStatsData.draw !== 0 ? (1 * gameStatsData.draw) / gameStatsData.total_games : 0}
              prgressColor={colors.greeColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.greeColor }]}
              textStyle={styles.textStyle}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
          <WinProgressView
              titleText={'Losses'}
              percentageCount={gameStatsData ? gameStatsData.looser : ''}
              progress={gameStatsData.looser !== 0 ? (1 * gameStatsData.looser) / gameStatsData.total_games : 0}
              prgressColor={colors.blueColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.blueColor }]}
              textStyle={styles.textStyle}
              containerStyle={{ marginVertical: 5 }}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Pie
            radius={60}
            innerRadius={52}
            sections={[
              {
                percentage: gameStatsData.winner !== 0 ? (100 * gameStatsData.winner) / gameStatsData.total_games : 0,
                color: colors.orangeColor,
              },
              {
                percentage: gameStatsData.draw !== 0 ? (100 * gameStatsData.draw) / gameStatsData.total_games : 0,
                color: colors.greeColor,
              },
              {
                percentage: gameStatsData.looser !== 0 ? (100 * gameStatsData.looser) / gameStatsData.total_games : 0,
                color: colors.blueColor,
              },
            ]}
            strokeCap={'butt'}
          />
          <View style={styles.winPercentageView}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.percentageStyle}>{gameStatsData.winner !== 0 ? (1 * gameStatsData.winner) / gameStatsData.total_games : 0}</Text>
              <Text style={styles.percentIconStyle}>%</Text>
            </View>
            <Text style={styles.winTextStyle}>{'Winning\nPercentage'}</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 250, marginTop: 30 }}>
        <BarChart
            style={{ flex: 1 }}
            data={graphData}
            gridMin={0}
            contentInset={{ marginTop: 10 }}
            svg={{ fill: colors.orangeColor }}
            spacingInner={0.7}
            spacingOuter={0.7}
        >
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
              paddingTop: 5,
            }}
            data={graphData}
            formatLabel={(value, index) => {
              if (index === 0) return 'Jan';
              if (index === 1) return 'Feb';
              if (index === 2) return 'Mar';
              if (index === 3) return 'Apr';
              if (index === 4) return 'May';
              if (index === 5) return 'Jun';
              if (index === 6) return 'Jul';
              if (index === 7) return 'Aug';
              if (index === 8) return 'Sep';
              if (index === 9) return 'Oct';
              if (index === 10) return 'Nov';
              if (index === 11) return 'Dec';
              return null;
            }}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 12, fill: colors.lightBlackColor, fontFamily: fonts.RRegular }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={gameData}
          horizontal={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 5 }}
          ListHeaderComponent={() => <View style={{ marginHorizontal: 10 }} />}
          ListFooterComponent={() => <View style={{ marginHorizontal: 10 }} />}
          ItemSeparatorComponent={() => <View style={{ marginHorizontal: 8 }} />}
          renderItem={({ item }) => <StatsGradiantView
            title={item.title}
            topGradiantColor1={item.isSelected ? colors.orangeColor : colors.lightgrayColor}
            bottomGradiantColor1={item.isSelected ? colors.yellowColor : colors.offwhite}
            topGradiantColor2={item.isSelected ? colors.orangeColor : colors.lightgrayColor}
            bottomGradiantColor2={item.isSelected ? colors.yellowColor : colors.offwhite}
            sourceImage={item.isSelected ? item.selectImage : item.image}
            counterNumber={item.total}
            onItemPress={() => {
              if (item.id === 0) {
                setGraphData(gameChartData);
              }
              if (item.id === 1) {
                setGraphData(gameChartData);
              }
              if (item.id === 2) {
                setGraphData(gameChartData);
              }
              if (item.id === 3) {
                setGraphData(gameChartData);
              }
              if (item.id === 4) {
                setGraphData(gameChartData);
              }
              gameData.map((gameItem) => {
                const gameValue = gameItem;
                if (gameValue.id === item.id) {
                  gameValue.isSelected = true;
                } else {
                  gameValue.isSelected = false;
                }
                return null;
              })
              setGameData([...gameData]);
            }}
            counterTextStyle={{ color: item.isSelected ? colors.whiteColor : colors.orangeColor }}
            titleTextStyle={{ color: item.isSelected ? colors.whiteColor : colors.lightBlackColor }}
          />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  containerStyle: {
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
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
    color: colors.themeColor,
    textAlign: 'center',
  },
  percentageStyle: {
    fontSize: 25,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
  },
  percentIconStyle: {
    fontSize: 20,
    fontFamily: fonts.RLight,
    color: colors.themeColor,
    alignSelf: 'flex-end',
  },
});
