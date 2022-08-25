import {Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import StatsSelectionView from '../../../../components/Home/StatsSelectionView';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {heightPercentageToDP as hp} from '../../../../utils';
import {monthsSelectionData} from '../../../../utils/constant';
import TCWinDrawLooseChart from './tennisSingle/TCWinDrawLooseChart';

const TopHeader = ({title, selectWeekMonth, setSelectWeekMonth}) => (
  <View
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: 15,
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
);

const HomeAwayStatsView = ({home, away}) => {
  const [selectWeekMonth, setSelectWeekMonth] = useState(
    monthsSelectionData[3]?.value,
  );
  const GradiantIndicator = ({gradiantColor, style}) => (
    <LinearGradient
      colors={gradiantColor}
      style={{...styles.gradiantIndicator, ...style}}
    />
  );

  return (
    <View style={{flex: 1}}>
      {/*    Home And Away Matches */}
      <TopHeader
        title={'Home & Away'}
        selectWeekMonth={selectWeekMonth}
        setSelectWeekMonth={setSelectWeekMonth}
      />

      {/* Indicator */}
      <View style={styles.teamIndicatorContainer}>
        <View style={{...styles.teamIndicatorContentContainer}}>
          <GradiantIndicator
            gradiantColor={[colors.blueGradiantStart, colors.blueGradiantEnd]}
          />
          <Text>Win</Text>
        </View>
        <View style={{...styles.teamIndicatorContentContainer}}>
          <GradiantIndicator
            gradiantColor={[colors.greenGradientStart, colors.greenGradientEnd]}
          />
          <Text>{'Draws'}</Text>
        </View>
        <View style={{...styles.teamIndicatorContentContainer}}>
          <GradiantIndicator
            gradiantColor={[colors.themeColor, colors.yellowColor]}
          />
          <Text>Losses</Text>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        {/* Home Team */}
        <TCWinDrawLooseChart
          heading={'Home'}
          totalCount={home?.total_games ? home.total_games : 0}
          winCount={home?.winner ? home.winner : 0}
          drawCount={home?.draw ? home.draw : 0}
          lossCount={home?.looser ? home.looser : 0}
        />
        {/* Away Team */}
        <TCWinDrawLooseChart
          heading={'Away'}
          totalCount={away?.total_games ? away.total_games : 0}
          winCount={away?.winner ? away.winner : 0}
          drawCount={away?.draw ? away.draw : 0}
          lossCount={away?.looser ? away.looser : 0}
        />
      </View>
    </View>
  );
};

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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  teamIndicatorContentContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
export default HomeAwayStatsView;
