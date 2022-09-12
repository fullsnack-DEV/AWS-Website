import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../../../../Constants/Colors';
import ActivityLoader from '../../../../loader/ActivityLoader';
import fonts from '../../../../../Constants/Fonts';
import TCGameCard from '../../../../TCGameCard';
import Rivalry from './Rivalry';
import TennisScoreView from '../../TennisScoreView';
import TCLabel from '../../../../TCLabel';
import TCThickDivider from '../../../../TCThickDivider';
import TCTeamVS from '../../../../TCTeamVS';
import TCThinDivider from '../../../../TCThinDivider';
import GameStatus from '../../../../../Constants/GameStatus';
import {strings} from '../../../../../../Localization/translation';

const Stats = ({gameData, getGameStatsData}) => {
  console.log('stats gamedata:=>', gameData);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [gameStatsData, setGameStatsData] = useState(null);

  useEffect(() => {
    if (isFocused) {
      if (gameData?.game_id) {
        setLoading(true);
        getGameStatsData(gameData?.game_id)
          .then((res) => {
            console.log('Tennis Game Stats:=> ', res);
            setGameStatsData(res?.payload);
          })
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }
    }
  }, [isFocused]);

  const getHomeName = () => {
    if (gameData?.home_team?.group_name) {
      return `${gameData?.home_team?.group_name}`;
    }
    return `${gameData?.home_team?.first_name} ${gameData?.home_team?.last_name}`;
  };

  const getAwayName = () => {
    if (gameData?.away_team?.group_name) {
      return `${gameData?.away_team?.group_name}`;
    }
    return `${gameData?.away_team?.first_name} ${gameData?.away_team?.last_name}`;
  };

  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let breakTime = 0;
    if (gameData && gameData.breakTime) {
      breakTime = gameData.breakTime / 1000;
    }

    const tempDate = new Date(eDate);
    tempDate.setMinutes(tempDate.getMinutes() + breakTime);
    let delta =
      Math.abs(new Date(sDate).getTime() - new Date(tempDate).getTime()) / 1000;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // const seconds = Math.floor(delta % 60);

    if (hours >= 99) {
      return '99 : 00 : 00';
    }
    let hr, min;
    if (hours <= 9) {
      if (hours === 0) {
        hr = '0';
      } else {
        hr = `0${hours}`;
      }
    } else {
      hr = hours;
    }
    if (minutes <= 9) {
      if (minutes === 0) {
        min = '0';
      } else {
        min = `0${minutes}`;
      }
    } else {
      min = minutes;
    }

    return `${hr}h  ${min}m`;
  };

  const renderPreviousGame = ({item}) => (
    <View style={{marginVertical: 5}}>
      <TCGameCard data={item} />
    </View>
  );
  const renderGameStats = ({item}) => (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <Text style={styles.statsCounter}>
        {item.home_team === 0 ? '-' : Number(item.home_team).toFixed(2)}
      </Text>
      <Text style={styles.statsLable}>{item.label}</Text>
      <Text style={styles.statsCounter}>
        {item.away_team === 0 ? '-' : Number(item.away_team).toFixed(2)}
      </Text>
    </View>
  );
  return (
    <View>
      <ActivityLoader visible={loading} />
      <TCLabel title={'Scores'} />
      <TennisScoreView scoreDataSource={gameData} marginTop={'2%'} />
      <TCThickDivider width={'100%'} marginTop={15} />
      <TCLabel title={'Match Time'} />
      <Text style={styles.matchTimeText}>
        {gameData?.status === GameStatus.accepted ||
        gameData?.status === GameStatus.reset
          ? strings.NAText
          : getTimeDifferent(
              new Date().getTime(),
              gameData?.actual_startdatetime * 1000,
            )}
      </Text>
      <TCThickDivider width={'100%'} marginTop={15} />
      <TCLabel title={'Stats'} />
      <View style={{marginLeft: 10, marginRight: 10}}>
        <TCTeamVS
          firstTeamName={getHomeName()}
          secondTeamName={getAwayName()}
          firstTeamProfilePic={gameData?.home_team?.thumbnail}
          secondTeamProfilePic={gameData?.away_team?.thumbnail}
        />
      </View>
      <TCThinDivider width={'100%'} marginTop={8} marginBottom={15} />
      <FlatList
        keyExtractor={({index}) => index?.toString()}
        data={gameStatsData?.stats?.gameStats}
        renderItem={renderGameStats}
      />
      <TCThickDivider width={'100%'} marginTop={15} />

      <TCLabel title={'Rivalry'} />
      <Rivalry
        gameData={gameData}
        rivalryData={gameStatsData?.stats?.rivarly}
      />
      <TCThickDivider width={'100%'} marginTop={15} />

      <TCLabel title={' Previous Game'} />
      {gameStatsData?.games.length > 0 ? (
        <FlatList
          keyExtractor={({index}) => index?.toString()}
          data={gameStatsData?.games ?? []}
          renderItem={renderPreviousGame}
        />
      ) : (
        <Text style={styles.noPreviousGame}>No games yet</Text>
      )}

      <TCThickDivider width={'100%'} marginTop={15} />
    </View>
  );
};

const styles = StyleSheet.create({
  matchTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginLeft: 15,
    color: colors.lightBlackColor,
  },
  statsLable: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.veryLightBlack,
  },
  statsCounter: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  noPreviousGame: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 20,
  },
});

export default Stats;
