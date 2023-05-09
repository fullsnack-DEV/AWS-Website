/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import React, {useState, useContext, useEffect, useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import AuthContext from '../../auth/context';

import {
  getGameStatsChartData,
  getGameStatsData,
  getStatsRDMData,
} from '../../api/Games';
import {monthsSelectionData} from '../../utils/constant';
// import PlayInTeamChartScreen from './playInModule/stats/PlayInTeamChartScreen';
import ActivityLoader from '../../components/loader/ActivityLoader';
// import MonthWiseChart from './playInModule/stats/commonViews/MonthWiseChart';
// import TCThickDivider from '../../components/TCThickDivider';
// import HomeAwayStatsView from './playInModule/stats/HomeAwayStatsView';
// import RDMChartView from './playInModule/stats/RDMChartView';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import StatsContentScreen from './SportActivity/contentScreens/StatsContentScreen';
// import {} from 'react';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
const EntityStatScreen = ({route, navigation}) => {
  const authContext = useContext(AuthContext);
  // const [selectWeekMonth, setSelectWeekMonth] = useState(
  //   monthsSelectionData[3]?.value,
  // );

  // const [selectMonth, setSelectMonth] = useState(monthsSelectionData[3]?.value);

  // const [gameStatsData, setGameStatsData] = useState({
  //   total_games: 0,
  //   winner: 0,
  //   looser: 0,
  //   draw: 0,
  // });
  const [gamesChartData, setGamesChartData] = useState();
  const [gamesRDMChartData, setgamesRDMChartData] = useState();
  const [homeAway, setHomeAway] = useState();
  const [loading, setloading] = useState(false);

  const loadStatsData = useCallback(
    (selectedMonth) => {
      setloading(true);

      //  Chart Params
      const date = new Date();
      if (selectedMonth === 'Past 3 Months') date.setMonth(date.getMonth() - 3);
      else if (selectedMonth === 'Past 6 Months')
        date.setMonth(date.getMonth() - 6);
      else if (selectedMonth === 'Past 9 Months')
        date.setMonth(date.getMonth() - 9);
      else if (selectedMonth === 'Past 12 Months')
        date.setMonth(date.getMonth() - 12);
      const chartParameter = {
        sport: route?.params?.entityData?.sport,
        fromDate: Math.floor(date?.getTime() / 1000),
      };

      getGameStatsData(
        route?.params?.entityData?.group_id,
        chartParameter,
        authContext,
      )
        .then((pieChartData) => {
          // Pie Chart
          if (pieChartData) {
            if (pieChartData.payload && pieChartData.payload.length > 0) {
              // setGameStatsData(pieChartData?.payload?.[0]?.stats?.all);
              setHomeAway({
                home: pieChartData?.payload?.[0]?.stats?.home,
                away: pieChartData?.payload?.[0]?.stats?.away,
              });
            }
          }

          setloading(false);
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
        });
    },
    [route.params, authContext],
  );

  const loadRDMData = useCallback(
    (selectedMonth) => {
      setloading(true);

      //  Chart Params
      const date = new Date();
      if (selectedMonth === 'Past 3 Months') date.setMonth(date.getMonth() - 3);
      else if (selectedMonth === 'Past 6 Months')
        date.setMonth(date.getMonth() - 6);
      else if (selectedMonth === 'Past 9 Months')
        date.setMonth(date.getMonth() - 9);
      else if (selectedMonth === 'Past 12 Months')
        date.setMonth(date.getMonth() - 12);
      const chartParameter = {
        sport: route?.params?.entityData?.sport,
        fromDate: Math.floor(date?.getTime() / 1000),
      };

      getStatsRDMData(
        route?.params?.entityData?.group_id,
        chartParameter,
        authContext,
      )
        .then((RDMChartData) => {
          //  RDM Chart

          console.log('RDMChartData', RDMChartData);
          if (RDMChartData.payload) {
            // barChartData.payload[0].data.map((gameChartItem) => {
            //   gameChart.push(gameChartItem.value);
            //   console.log(gameChartItem);
            //   months.push(gameChartItem?.month_name);
            //   return null;
            // });
            setgamesRDMChartData(RDMChartData.payload);
          }

          setloading(false);
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
        });
    },
    [route.params, authContext],
  );
  const loadChartData = useCallback(
    (selectedMonth) => {
      setloading(true);

      //  Chart Params
      const date = new Date();
      if (selectedMonth === 'Past 3 Months') date.setMonth(date.getMonth() - 3);
      else if (selectedMonth === 'Past 6 Months')
        date.setMonth(date.getMonth() - 6);
      else if (selectedMonth === 'Past 9 Months')
        date.setMonth(date.getMonth() - 9);
      else if (selectedMonth === 'Past 12 Months')
        date.setMonth(date.getMonth() - 12);
      const chartParameter = {
        sport: route?.params?.entityData?.sport,
        fromDate: Math.floor(date?.getTime() / 1000),
      };

      getGameStatsChartData(
        route?.params?.entityData?.group_id,
        chartParameter,
        authContext,
      )
        .then((barChartData) => {
          //  Bar Chart
          if (barChartData) {
            if (barChartData.payload && barChartData.payload.length > 0) {
              // barChartData.payload[0].data.map((gameChartItem) => {
              //   gameChart.push(gameChartItem.value);
              //   console.log(gameChartItem);
              //   months.push(gameChartItem?.month_name);
              //   return null;
              // });
              setGamesChartData([...barChartData.payload[0].data]);
            }
          }
          setloading(false);
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
        });
    },
    [route.params, authContext],
  );
  useEffect(() => {
    loadStatsData(monthsSelectionData[3]?.value);
    loadChartData(monthsSelectionData[3]?.value);
    loadRDMData(monthsSelectionData[3]?.value);
  }, [loadStatsData, loadChartData, loadRDMData]);
  return (
    <SafeAreaView style={styles.containerStyle}>
      <ScreenHeader
        title={strings.stateText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.chat3Dot}
        containerStyle={{
          paddingHorizontal: 10,
          paddingTop: 6,
          paddingBottom: 14,
        }}
      />
      <ActivityLoader visible={loading} />
      <ScrollView>
        {/* <StatsContentScreen
          authContext={authContext}
          // userId={route?.params?.userId}
          entityType={route.params.entityData}
        /> */}
        {/* <PlayInTeamChartScreen
          selectWeekMonth={selectWeekMonth}
          setSelectWeekMonth={(val) => {
            setSelectWeekMonth(val);
            loadStatsData(val);
          }}
          gameStatsData={gameStatsData}
        /> */}
        {/* <TCThickDivider marginVertical={15} />
        <MonthWiseChart
          gameChartData={gamesChartData}
          selectMonth={selectMonth}
          setSelectMonth={(val) => {
            setSelectMonth(val);
            loadChartData(val);
          }}
        /> */}
        {/* <TCThickDivider marginVertical={15} /> */}

        {/* <HomeAwayStatsView home={homeAway?.home} away={homeAway?.away} /> */}

        {/* <TCThickDivider marginVertical={15} /> */}

        {/* RDM Percentage */}
        {/* <RDMChartView RDMData={gamesRDMChartData} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {},
});

export default EntityStatScreen;
