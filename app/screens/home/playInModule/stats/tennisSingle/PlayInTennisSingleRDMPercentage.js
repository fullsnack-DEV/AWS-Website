import {Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import StatsSelectionView from '../../../../../components/Home/StatsSelectionView';
import {strings} from '../../../../../../Localization/translation';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCRangeChart from './TCRangeChart';
import TCTextTableView from './TCTextTableView';
import TCThinDivider from '../../../../../components/TCThinDivider';
import {monthsSelectionData} from '../../../../../utils/constant';

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

const PlayInTennisSingleRDMPercentage = () => {
  const [selectWeekMonth, setSelectWeekMonth] = useState(
    monthsSelectionData[3]?.value,
  );

  return (
    <View style={{flex: 1}}>
      <TopHeader
        title={strings.RDMPercentage}
        selectWeekMonth={selectWeekMonth}
        setSelectWeekMonth={setSelectWeekMonth}
      />

      {/* Indicator */}
      <View style={{paddingHorizontal: 15}}>
        {/* Home Team */}
        <TCRangeChart
          heading={strings.RDMRT}
          totalCount={100}
          progressCount={22}
        />
      </View>

      <View style={{padding: 15}}>
        <TCTextTableView leftTitle={strings.totalMatches} rightTitle={102} />

        <TCTextTableView
          leftTitle={strings.RDMs}
          leftSubTitle={strings.resultDisapprovedMatches}
          rightTitle={2}
        />
        <View style={{marginVertical: 10}}>
          <TCThinDivider />
        </View>

        <TCTextTableView
          leftTitle={strings.RTs}
          leftSubTitle={strings.RDMTotalMatches}
          rightTitle={104}
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
export default PlayInTennisSingleRDMPercentage;
