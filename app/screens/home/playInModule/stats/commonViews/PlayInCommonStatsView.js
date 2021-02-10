import { View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { getGameStatsChartData, getGameStatsData } from '../../../../../api/Games';
import AuthContext from '../../../../../auth/context';
import PlayInCommonChartScreen from './PlayInCommonChartScreen';
import TCInnerLoader from '../../../../../components/TCInnerLoader';

const monthsSelectionData = [
    { label: 'Past 3 Months', value: 'Past 3 Months' },
    { label: 'Past 6 Months', value: 'Past 6 Months' },
    { label: 'Past 9 Months', value: 'Past 9 Months' },
    { label: 'Past 12 Months', value: 'Past 12 Months' },
]

const PlayInCommonStatsView = ({
         playInObject,
         currentUserData,
         sportName,
     }) => {
    const authContext = useContext(AuthContext);
    const [gamesChartData, setGamesChartData] = useState();
    const [gameChartMonths, setGameChartMonths] = useState();
    const [loading, setLoading] = useState(false);
    const [selectWeekMonth, setSelectWeekMonth] = useState(monthsSelectionData[3]?.value);
    const [gameStatsData, setGameStatsData] = useState({
        from_date: false,
        total_games: 0,
        winner: 0,
        looser: 0,
        draw: 0,
    });

    useEffect(() => {
        if (playInObject) {
            loadStatsData('Past 12 Months');
        }
    }, [playInObject])

    const loadStatsData = (selectedMonth) => {
        setLoading(true);

        //  Chart Params
        const date = new Date();
        if (selectedMonth === 'Past 3 Months') date.setMonth(date.getMonth() - 3);
        else if (selectedMonth === 'Past 6 Months') date.setMonth(date.getMonth() - 6);
        else if (selectedMonth === 'Past 9 Months') date.setMonth(date.getMonth() - 9);
        else if (selectedMonth === 'Past 12 Months') date.setMonth(date.getMonth() - 12);
        const chartParameter = {
            sport: sportName,
            fromDate: Math.abs(date?.getTime() / 1000),
        };
        const promiseArr = [
            getGameStatsChartData(currentUserData?.user_id, chartParameter, authContext),
            getGameStatsData(currentUserData?.user_id, chartParameter, authContext),
        ]
        const gameChart = [];
        const months = [];
        Promise.all(promiseArr).then(([barChartData, pieChartData]) => {
            // Pie Chart
            if (pieChartData) {
                if (pieChartData.payload && pieChartData.payload.length > 0) {
                    setGameStatsData(pieChartData.payload[0].stats)
                }
            }
            //  Bar Chart
            if (barChartData) {
                if (barChartData.payload && barChartData.payload.length > 0) {
                    barChartData.payload[0].data.map((gameChartItem) => {
                        gameChart.push(gameChartItem.value);
                        console.log(gameChartItem);
                        months.push(gameChartItem?.month_name);
                        return null;
                    })
                    setGameChartMonths([...months]);
                    setGamesChartData([...gameChart]);
                }
            }

            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        });
    }
    return (
      <View style={{ flex: 1 }}>
        {loading && (
          <View style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    zIndex: 1,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
          }}>
            <TCInnerLoader loaderStyle={{ top: '10%' }} visible={true} size={50}/>
          </View>
            )}
        <PlayInCommonChartScreen
                selectWeekMonth={selectWeekMonth}
                setSelectWeekMonth={(val) => {
                    setSelectWeekMonth(val)
                    loadStatsData(val);
                }}
                gameChartData={gamesChartData}
                gameStatsData={gameStatsData}
                gameChartMonths={gameChartMonths}

            />
      </View>
    )
}

export default PlayInCommonStatsView;
