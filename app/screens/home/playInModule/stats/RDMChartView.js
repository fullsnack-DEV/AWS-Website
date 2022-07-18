import {Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import StatsSelectionView from '../../../../components/Home/StatsSelectionView';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCThinDivider from '../../../../components/TCThinDivider';
import {monthsSelectionData} from '../../../../utils/constant';
import TCRangeChart from './tennisSingle/TCRangeChart';
import TCTextTableView from './tennisSingle/TCTextTableView';

const TopHeader = ({title, selectWeekMonth, setSelectWeekMonth}) => (
  <View
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: 15,
    }}
  >
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

const RDMChartView = ({RDMData, name}) => {
  console.log('RDM CHART', RDMData, name);
  const [selectWeekMonth, setSelectWeekMonth] = useState(
    monthsSelectionData[3]?.value,
  );

  return (
    <View style={{flex: 1}}>
      <TopHeader
        title={'RDM Percentage'}
        selectWeekMonth={selectWeekMonth}
        setSelectWeekMonth={setSelectWeekMonth}
      />

      {/* Indicator */}
      <View style={{paddingHorizontal: 15}}>
        {/* Home Team */}
        <TCRangeChart
          heading={'RDMs/R&Ts'}
          totalCount={RDMData?.total_games}
          progressCount={RDMData?.approved_games}
        />
      </View>

      <View style={{padding: 15}}>
        <TCTextTableView
          leftTitle={'Total Matches'}
          rightTitle={RDMData?.total_games}
        />

        <TCTextTableView
          leftTitle={'RDMs'}
          leftSubTitle={'(Result-Dissapproved Matches)'}
          rightTitle={RDMData?.disapproved_games}
        />
        <View style={{marginVertical: 10}}>
          <TCThinDivider />
        </View>

        <TCTextTableView
          leftTitle={'R&Ts'}
          leftSubTitle={'(RDMs + Total Matches)'}
          rightTitle={RDMData?.total_games}
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
});
export default RDMChartView;
