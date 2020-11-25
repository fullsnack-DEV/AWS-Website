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

const data = [15, 8, 6, 3, 9, 4, 9, 10, 11, 15, 13, 5]

const game_data = [
  {
    id: 0,
    image: images.gamesImage,
    selectImage: images.gamesSelected,
    title: 'Games',
    total: 139,
  },
  {
    id: 1,
    image: images.assistsImage,
    selectImage: images.assistsSelected,
    title: 'Assists',
    total: 28,
  },
  {
    id: 2,
    image: images.goalsImage,
    selectImage: images.goalsSelected,
    title: 'Goals',
    total: 12,
  },
  {
    id: 3,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Yellow card',
    total: 6,
  },
  {
    id: 4,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Red card',
    total: 2,
  },
];

export default function StatsScreen() {
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [gameData, setGameData] = useState(game_data);
  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <StatsSelectionView
        dataSource={[
          { label: 'Past 6 months', value: 'Past 6 months' },
          { label: 'Past 12 months', value: 'Past 12 months' },
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
            <Text style={styles.totalGameCounterText}>{139}</Text>
          </View>
          <WinProgressView
              titleText={'Wins'}
              percentageCount={17}
              progress={0.7}
              prgressColor={colors.orangeColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.orangeColor }]}
              textStyle={styles.textStyle}
              containerStyle={{ marginVertical: 5 }}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
          <WinProgressView
              titleText={'Draws'}
              percentageCount={2}
              progress={0.2}
              prgressColor={colors.greeColor}
              percentageTextStyle={[styles.percentageTextStyle, { color: colors.greeColor }]}
              textStyle={styles.textStyle}
              progressBarStyle={{ backgroundColor: colors.lightgrayColor }}
          />
          <WinProgressView
              titleText={'Losses'}
              percentageCount={3}
              progress={0.3 }
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
            innerRadius={50}
            sections={[
              {
                percentage: 50,
                color: colors.orangeColor,
              },
              {
                percentage: 40,
                color: colors.greeColor,
              },
              {
                percentage: 10,
                color: colors.blueColor,
              },
            ]}
            strokeCap={'butt'}
          />
          <View style={styles.winPercentageView}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.percentageStyle}>{50}</Text>
              <Text style={styles.percentIconStyle}>%</Text>
            </View>
            <Text style={styles.winTextStyle}>{'Winning\nPercentage'}</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 250, marginTop: 30 }}>
        <BarChart
            style={{ flex: 1 }}
            data={data}
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
            data={data}
            formatLabel={(value, index) => {
              if (index === 0) return 'Apr';
              if (index === 1) return 'May';
              if (index === 2) return 'Jun';
              if (index === 3) return 'Jul';
              if (index === 4) return 'Aug';
              if (index === 5) return 'Sep';
              if (index === 6) return 'Oct';
              if (index === 7) return 'Nov';
              if (index === 8) return 'Dec';
              if (index === 9) return 'Jan';
              if (index === 10) return 'Feb';
              if (index === 11) return 'Mar';
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
