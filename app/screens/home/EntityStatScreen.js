import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
} from 'react-native';
import AuthContext from '../../auth/context';

import {getGameStatsChartData, getGameStatsData} from '../../api/Games';
import {monthsSelectionData} from '../../utils/constant';
import PlayInTeamChartScreen from './playInModule/stats/PlayInTeamChartScreen';
import ActivityLoader from '../../components/loader/ActivityLoader';
import MonthWiseChart from './playInModule/stats/commonViews/MonthWiseChart';
import TCThickDivider from '../../components/TCThickDivider';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityStatScreen({route}) {
  const authContext = useContext(AuthContext);
  const {
    
    currentUserData,
  } = route?.params;
  const [selectWeekMonth, setSelectWeekMonth] = useState(
    monthsSelectionData[3]?.value,
  );
  const [gameStatsData, setGameStatsData] = useState({
    from_date: false,
    total_games: 0,
    winner: 0,
    looser: 0,
    draw: 0,
  });
  const [gamesChartData, setGamesChartData] = useState();
  const [loading, setloading] = useState(false);

  console.log('currentUserData:', currentUserData);

  

  const loadStatsData = (selectedMonth) => {
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
      sport: currentUserData?.sport,
      fromDate: Math.floor(date?.getTime() / 1000),
    };
    const promiseArr = [
      getGameStatsChartData(
        currentUserData?.group_id,
        chartParameter,
        authContext,
      ),
      getGameStatsData(currentUserData?.group_id, chartParameter, authContext),
    ];
    const gameChart = [];
    const months = [];
    Promise.all(promiseArr)
      .then(([barChartData, pieChartData]) => {
        // Pie Chart
        if (pieChartData) {
          if (pieChartData.payload && pieChartData.payload.length > 0) {
            setGameStatsData(pieChartData.payload[0].stats);
          }
        }
        //  Bar Chart
        if (barChartData) {
          console.log('barChartData',barChartData);
          if (barChartData.payload && barChartData.payload.length > 0) {
            barChartData.payload[0].data.map((gameChartItem) => {
              gameChart.push(gameChartItem.value);
              console.log(gameChartItem);
              months.push(gameChartItem?.month_name);
              return null;
            });
            setGamesChartData([...gameChart]);
          }
        }
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
      });
  };

  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />

      <PlayInTeamChartScreen
        selectWeekMonth={selectWeekMonth}
        setSelectWeekMonth={(val) => {
          console.log('VVVVal',val);
          setSelectWeekMonth(val);
          loadStatsData(val);
        }}
        gameChartData={gamesChartData}
        gameStatsData={gameStatsData}
      />
      <TCThickDivider marginVertical={15}/>
      <MonthWiseChart 
      gameChartData={gamesChartData}
      selectMonth={selectWeekMonth}
      setSelectMonth={(val) => {
        console.log('VVVVal',val);
        setSelectWeekMonth(val);
        loadStatsData(val);
      }}
      />
    </SafeAreaView>
  );
}


