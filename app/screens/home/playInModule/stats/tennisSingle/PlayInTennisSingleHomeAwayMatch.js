import { Text, View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import StatsSelectionView from '../../../../../components/Home/StatsSelectionView';
import strings from '../../../../../Constants/String';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp } from '../../../../../utils';
import TCWinDrawLooseChart from './TCWinDrawLooseChart';

const monthsSelectionData = [
    { label: 'Past 3 Months', value: 'Past 3 Months' },
    { label: 'Past 6 Months', value: 'Past 6 Months' },
    { label: 'Past 9 Months', value: 'Past 9 Months' },
    { label: 'Past 12 Months', value: 'Past 12 Months' },
]

const TopHeader = ({ title, selectWeekMonth, setSelectWeekMonth }) => (
  <View style={{
        justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 15,
  }}>
    <View style={styles.totalGameViewStyle}>
      <Text style={styles.totalGameTextStyle}>{title}</Text>
    </View>
    <StatsSelectionView
            dataSource={monthsSelectionData}
            placeholder={strings.selectTimePlaceholder}
            value={selectWeekMonth}
            onValueChange={setSelectWeekMonth}
        />
  </View>
)

const PlayInTennisSingleHomeAwayMatch = () => {
    const [selectWeekMonth, setSelectWeekMonth] = useState(monthsSelectionData[3]?.value);
    const GradiantIndicator = ({ gradiantColor, style }) => (<LinearGradient
        colors={gradiantColor}
        style={{ ...styles.gradiantIndicator, ...style }}/>)

    return (
      <View style={{ flex: 1 }}>
        {/*    Home And Away Matches */}
        <TopHeader title={'Home & Away Matches'} selectWeekMonth={selectWeekMonth} setSelectWeekMonth={setSelectWeekMonth}/>

        {/* Indicator */}
        <View style={styles.teamIndicatorContainer}>
          <View style={{ ...styles.teamIndicatorContentContainer }}>
            <GradiantIndicator gradiantColor={[colors.blueGradiantStart, colors.blueGradiantEnd]}/>
            <Text>Win</Text>
          </View>
          <View style={{ ...styles.teamIndicatorContentContainer }}>
            <GradiantIndicator gradiantColor={[colors.greenGradientStart, colors.greenGradientEnd]}/>
            <Text>{'Draws'}</Text>
          </View>
          <View style={{ ...styles.teamIndicatorContentContainer }}>
            <GradiantIndicator gradiantColor={[colors.themeColor, colors.yellowColor]}/>
            <Text>Losses</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          {/* Home Team */}
          <TCWinDrawLooseChart
              heading={'Home'}
              totalCount={80}
              winCount={22}
              drawCount={16}
              lossCount={42}
          />
          {/* Away Team */}
          <TCWinDrawLooseChart
              heading={'Away'}
              totalCount={33}
              winCount={8}
              drawCount={10}
              lossCount={15}
          />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
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
    gradiantIndicator: {
        marginTop: hp(0.3),
        height: 14,
        width: 14,
        borderRadius: 15,
        marginRight: 5,
    },
    teamIndicatorContainer: {
        marginTop: hp(4),
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    teamIndicatorContentContainer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
})
export default PlayInTennisSingleHomeAwayMatch;
