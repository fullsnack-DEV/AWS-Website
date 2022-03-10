/* eslint-disable no-unsafe-optional-chaining */
import { View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { getGameStatsChartData, getGameStatsData } from '../../../../../api/Games';
import AuthContext from '../../../../../auth/context';
import PlayInCommonChartScreen from '../commonViews/PlayInCommonChartScreen';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import TCThickDivider from '../../../../../components/TCThickDivider';
import PlayInTennisSingleHomeAwayMatch from './PlayInTennisSingleHomeAwayMatch';
import PlayInTennisSingleRDMPercentage from './PlayInTennisSingleRDMPercentage';
import PlayInTennisSingleFiveSetsGame from './PlayInTennisSingleFiveSetsGame';
import PlayInTennisSingleThreeSetsGame from './PlayInTennisSingleThreeSetsGame';
import PlayInCommonScoreTypesData from '../commonViews/PlayInCommonScoreTypesData';
import images from '../../../../../Constants/ImagePath';
import { monthsSelectionData } from '../../../../../utils/constant';

const game_data = [
    {
        id: 0,
        image: images.gamesImage,
        selectImage: images.gamesSelected,
        title: 'Match',
        total: 139,
        isSelected: true,
    },

    {
        id: 1,
        image: images.tennisGeneral,
        selectImage: images.goalsSelected,
        title: 'General',
        total: 12,
        isSelected: false,
    },
    {
        id: 2,
        image: images.tennisAce,
        selectImage: images.assistsSelected,
        title: 'Ace',
        total: 5,
        isSelected: false,
    },
    {
        id: 3,
        image: images.tennisWinner,
        selectImage: images.yellowCardSelected,
        title: 'Winner',
        total: 6,
        isSelected: false,
    },
    {
        id: 4,
        image: images.tennisUnForced,
        selectImage: images.yellowCardSelected,
        title: 'Unforced',
        total: 2,
        isSelected: false,
    },
    {
        id: 5,
        image: images.tennisFault,
        selectImage: images.yellowCardSelected,
        title: 'Fault',
        total: 2,
        isSelected: false,
    },
];

const PlayInTennisSingleStatsView = ({
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
                        months.push(gameChartItem?.month_name);
                        return null;
                    })
                    setGameChartMonths([...months]);
                    setGamesChartData([...gameChart]);
                }
            }
            setLoading(false);
        }).catch(() => {
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

        {/* Chart */}
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

        <PlayInCommonScoreTypesData game_data={game_data}/>
        <View style={{ marginVertical: 10 }}>
          <TCThickDivider />
        </View>

        {/*    Home And Away Matches */}
        <PlayInTennisSingleHomeAwayMatch
            sportName={sportName}
            currentUserData={currentUserData}
            playInObject={playInObject}
         />
        <View style={{ marginVertical: 10 }}>
          <TCThickDivider />
        </View>

        {/* RDM Percentage */}
        <PlayInTennisSingleRDMPercentage
              sportName={sportName}
              currentUserData={currentUserData}
              playInObject={playInObject}
          />
        <View style={{ marginVertical: 10 }}>
          <TCThickDivider />
        </View>
        {/* Stats per game (5 Sets) */}
        <PlayInTennisSingleFiveSetsGame
              sportName={sportName}
              currentUserData={currentUserData}
              playInObject={playInObject}
          />
        <View style={{ marginVertical: 10 }}>
          <TCThickDivider />
        </View>

        {/* Stats per game (3 Sets) */}
        <PlayInTennisSingleThreeSetsGame
              sportName={sportName}
              currentUserData={currentUserData}
              playInObject={playInObject}
          />
        <View style={{ marginVertical: 10 }}>
          <TCThickDivider />
        </View>
      </View>
    )
}
export default PlayInTennisSingleStatsView;
