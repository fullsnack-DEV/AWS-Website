/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prefer-spread */
/* eslint-disable no-extend-native */
/* eslint-disable no-multi-assign */
/* eslint-disable import/no-extraneous-dependencies */
import React, {useEffect,useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import StatsSelectionView from '../../../../../components/Home/StatsSelectionView';

import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import strings from '../../../../../Constants/String';
import { getMaxFromRange } from '../../../../../utils';
import {monthsSelectionData} from '../../../../../utils/constant';


export default function MonthWiseChart({
  gameChartData,
  selectMonth,
  setSelectMonth,
}) {
  console.log('gameChartData', gameChartData);
const [maxValue,setMaxValue] = useState()
  useEffect(() => {
    const maxArray = gameChartData?.map((o) => { return o.value; });
    const max_of_array = Math.max.apply(Math, maxArray);
    setMaxValue(getMaxFromRange(max_of_array))

    console.log('maxmax', max_of_array);
  }, [gameChartData]);

  const renderMonths = ({item}) => {
    console.log('Month ITEM', item);
    return (
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 15,
          marginRight: 15,
        }}>
        <Text style={styles.textRegularStyle}>{item.month_name}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: item?.value > 0 ? (item?.value * 100 / maxValue) /100 : 0.01,
              marginLeft: 15,
              marginRight: 15,
              height: 8,
              backgroundColor: colors.themeColor,
              borderBottomRightRadius: 30,
              borderTopRightRadius: 30,
            }}
          />
          <Text styl={styles.textRegularStyle}>{item.value}</Text>
        </View>
      </View>
    );
  };

  const renderSeparator = () => (
    <View
      style={{
        height: 15,
      }}
    />
  );

  return (
    <View>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 5,
          paddingHorizontal: 15,
        }}>
        <View style={styles.totalGameViewStyle}>
          <Text style={styles.totalGameTextStyle}>{'Monthly Matches'}</Text>
        </View>
        <StatsSelectionView
          dataSource={monthsSelectionData}
          placeholder={strings.selectTimePlaceholder}
          value={selectMonth}
          onValueChange={setSelectMonth}
        />
      </View>

      <FlatList
        horizontal={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={gameChartData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMonths}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textRegularStyle: {
    width: 25,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
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
});
