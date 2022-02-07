/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import StatsSelectionView from '../../../../../components/Home/StatsSelectionView';

import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import strings from '../../../../../Constants/String';
import {monthsSelectionData} from '../../../../../utils/constant';

export default function MonthWiseChart({
  gameChartMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  gameChartData,
  selectMonth,
  setSelectMonth,
}) {

  console.log('gameChartData',gameChartData);
  const renderMonths = ({item}) => {
    console.log('Month ITEM', item);
    return (

        
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 15,
          marginRight: 15,
        }}>
        <Text style={styles.textRegularStyle}>{item}</Text>

        <View
          style={{
            height: 8,
            backgroundColor: colors.themeColor,
            flex: 1,
            marginLeft: 15,
            marginRight: 15,
            borderBottomRightRadius: 30,
            borderTopRightRadius: 30,
          }}
        />
        <Text>10</Text>
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
        showsHorizontalScrollIndicator={false}
        data={gameChartMonths}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMonths}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textRegularStyle: {
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
