import React, {
  useState, useEffect, Fragment, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList, TouchableOpacity,
} from 'react-native';

import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import { getGameDateTimeInHMSformat, getNumberSuffix, tennisGameStats } from '../../../../../utils/gameUtils';
import TennisGameScoreRight from '../gameRecordList/TennisGameScoreRight';
import TennisGameState from '../gameRecordList/TennisGameState';
import TennisGameScoreLeft from '../gameRecordList/TennisGameScoreLeft';
import AuthContext from '../../../../../context/auth';
import TCInnerLoader from '../../../../TCInnerLoader';

const MIN_MATCH_RECORD_TO_DISPLAY = 5;
export default function MatchRecordList({
  gameId,
  gameData,
  getGameMatchRecords,

}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [teamIds, setTeamIds] = useState(null);

  useEffect(() => {
    loadAtOnce()
  }, [gameId, isFocused])

  const loadAtOnce = async () => {
    if (gameId) {
      setLoading(true);
      if (gameData?.singlePlayerGame) {
        setTeamIds({
          home_team: { group_id: gameData?.home_team?.user_id },
          away_team: { group_id: gameData?.away_team?.user_id },
        })
      } else {
        setTeamIds({
          home_team: { group_id: gameData?.home_team?.group_id },
          away_team: { group_id: gameData?.away_team?.group_id },
        })
      }
      getGameMatchRecords(gameId, authContext).then((matchRes) => {
        setMatchRecords(matchRes.payload);
        const records = matchRes.payload;
        processModifiedMatchRecords(records.reverse());
      })
    }
  }

  const processModifiedMatchRecords = (records) => {
    const wholeRecords = [];
    let set_number = 0;
    let game_number = 0;
    records.map((recordData) => {
      const isGameState = ['start', 'resume', 'pause', 'end'].includes(recordData?.verb);
      if (isGameState) {
        wholeRecords.push({ type: 'game_stats', data: recordData })
      } else {
        const isSetState = ['setStart', 'setEnd'].includes(recordData?.verb);
        if (isSetState) {
          if (recordData?.verb === 'setStart') {
            set_number += 1
            game_number = 1;
            const win_count = gameData?.scoreboard?.sets.filter((item) => item?.s_id === recordData?.s_id)[0];
            wholeRecords.push({
              type: 'set',
              set_number,
              setId: recordData?.s_id,
              isOpen: false,
              start_date: getGameDateTimeInHMSformat(recordData?.timestamp),
              end_date: '-',
              setGames: [],
              home_team_win_count: win_count?.home_team_win_count ?? '-',
              away_team_win_count: win_count?.away_team_win_count ?? '-',
            })
            wholeRecords[wholeRecords?.length - 1].setGames.push({ type: 'set_stats', data: recordData })
          } else {
            wholeRecords[wholeRecords?.length - 1].end_date = getGameDateTimeInHMSformat(recordData?.timestamp)
            wholeRecords[wholeRecords?.length - 1].setGames.push({ type: 'set_stats', data: recordData })
          }
        } else {
          const set_index = wholeRecords.findIndex((item) => item.setId === recordData?.s_id)
          const isSetGameState = ['gameStart', 'gameEnd'].includes(recordData?.verb);

          if (isSetGameState) {
            if (recordData?.verb === 'gameStart') {
              const set_game_index = wholeRecords[set_index].setGames.findIndex((item) => item.setGameId === recordData?.g_id)
              if (set_game_index === -1) {
                wholeRecords[set_index].setGames.push({
                  type: 'set_games',
                  game_number,
                  start_date: getGameDateTimeInHMSformat(recordData?.timestamp),
                  end_date: '-',
                  isOpen: false,
                  setGameId: recordData?.g_id,
                  home_team_score: '-',
                  away_team_score: '-',
                  setGamesRecords: [],
                })
                game_number += 1
                const setGamesnew_index = wholeRecords[set_index].setGames.findIndex((item) => item?.setGameId === recordData?.g_id);
                if (setGamesnew_index !== -1) wholeRecords[set_index].setGames[setGamesnew_index].setGamesRecords.push({ type: 'set_game_stats', data: recordData });
              }
            } else {
              const setGamesnew_index = wholeRecords[set_index].setGames.findIndex((item) => item?.setGameId === recordData?.g_id);
              wholeRecords[set_index].setGames[setGamesnew_index].home_team_score = recordData?.game_score?.home_team_point ?? '-';
              wholeRecords[set_index].setGames[setGamesnew_index].away_team_score = recordData?.game_score?.away_team_point ?? '-';
              wholeRecords[set_index].setGames[setGamesnew_index].end_date = getGameDateTimeInHMSformat(recordData?.timestamp) ?? '-';
              wholeRecords[set_index].setGames[setGamesnew_index].setGamesRecords.push({ type: 'set_game_stats', data: recordData })
            }
          } else {
            const set_game_index = wholeRecords[set_index].setGames.findIndex((item) => item?.setGameId === recordData?.g_id)
            wholeRecords[set_index].setGames[set_game_index].setGamesRecords.push(recordData)
          }
        }
      }
      return true;
    })

    // Reverse Whole Data
    wholeRecords.reverse();
    wholeRecords.map((item, index) => {
      if (item.type === 'set') {
        wholeRecords[index].setGames.reverse()
        wholeRecords[index].setGames.map((gameItem, gameIndex) => {
          if (wholeRecords[index].setGames[gameIndex].type === 'set_games') {
            wholeRecords[index].setGames[gameIndex].setGamesRecords.reverse()
          }
          return true;
        })
      }
      return true;
    })
    setMatchRecords(wholeRecords);
    setLoading(false)
  }

  const toggleMatchSets = (index) => {
    const records = _.cloneDeep(matchRecords);
    records[index].isOpen = !records[index]?.isOpen ?? false
    setMatchRecords(records);
  }
  const RenderSets = ({
    item,
    index,
    set_number,
    home_team_score,
    away_team_score,
    timeString,
  }) => (
    <View style={styles.setContainer}>

      {/* Down Arrow */}
      <TouchableOpacity style={styles.downArrowContainer} onPress={() => toggleMatchSets(index)}>
        <FastImage
              resizeMode={'contain'}
              source={images.yellowDownArrow}
              style={{
                ...styles.downArrow,
                tintColor: 'red',
                transform: [{ rotateZ: item?.isOpen ? '180deg' : '0deg' }],
              }} />
      </TouchableOpacity>

      {/* Left Score */}
      <View style={{
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={styles.setScoreText}>{home_team_score}</Text>
      </View>

      {/* Set Number */}
      <View style={{
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={styles.setNumberText}>{getNumberSuffix(set_number)} set</Text>
        <Text style={styles.setTimeDurationText}>{timeString}</Text>
      </View>

      {/* Right Score */}
      <View style={{
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={styles.setScoreText}>{away_team_score}</Text>
      </View>
    </View>
  )
  const renderMatchRecords = ({ item, index }) => {
    if (item.type === 'game_stats') {
      return (
        <TennisGameState gameStats={tennisGameStats} recordData={item.data}/>
      )
    }
    return (
      <View>
        <RenderSets
            item={item}
            index={index}
            set_number={item?.set_number}
            home_team_score={item?.home_team_win_count}
            away_team_score={item?.away_team_win_count}
            timeString={`${item.start_date} - ${item.end_date === '-' ? 'Not Ended' : item.end_date}`}
        />
        {/* Inner Set Records */}

        {item?.isOpen && (
          <View style={styles.innerSetContainer}>
            <FlatList
                    keyExtractor={({ index: keyIndex }) => keyIndex?.toString()}
                    listKey={`renderGames${index * 2}`}
                    data={item?.setGames ?? []}
                    renderItem={({ item: gameItem, index: gameIndex }) => renderGames(gameItem, gameIndex, index)}
                />
          </View>
        )}

      </View>
    )
  }

  const toggleGameRecords = (parentIndex, index) => {
    const records = _.cloneDeep(matchRecords);
    records[parentIndex].setGames[index].isOpen = !records[parentIndex]?.setGames[index]?.isOpen
    setMatchRecords(records);
  }
  const renderGames = (item, index, parentIndex) => {
    if (item.type === 'set_stats') {
      return (
        <TennisGameState gameStats={tennisGameStats} recordData={item.data}/>
      )
    }
    return (
      <View>
        <View style={{
          ...styles.setContainer,
          backgroundColor: colors.whiteColor,
          borderTopWidth: 0,
          marginBottom: 0,
        }}>

          {/* Down Arrow */}
          <TouchableOpacity style={styles.downArrowContainer} onPress={() => toggleGameRecords(parentIndex, index)}>
            <FastImage
                  resizeMode={'contain'}
                  source={images.dropDownArrow}
                  style={{
                    ...styles.downArrow,
                    tintColor: 'red',
                    transform: [{ rotateZ: item.isOpen ? '180deg' : '0deg' }],
                  }} />
          </TouchableOpacity>

          {/* Left Score */}
          <View style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ ...styles.setScoreText, fontFamily: fonts.RRegular }}>
              {item?.home_team_score}
            </Text>
          </View>

          {/* Set Number */}
          <View style={{
            flex: 0.4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ ...styles.setNumberText, color: colors.googleColor, fontSize: 17 }}>
              {getNumberSuffix(item?.game_number)} game
            </Text>
            <Text style={styles.setTimeDurationText}>
              {`${item.start_date} - ${item.end_date === '-' ? 'Not Ended' : item.end_date}`}
            </Text>
          </View>

          {/* Right Score */}
          <View style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ ...styles.setScoreText, fontFamily: fonts.RRegular }}>
              {item?.away_team_score}
            </Text>
          </View>
        </View>

        {item?.isOpen && (
          <FlatList
                  keyExtractor={({ index: keyIndex }) => keyIndex?.toString()}
                  listKey={`setGameRecords${index * 2}`}
                  data={item?.setGamesRecords ?? []}
                  renderItem={renderGameRecords}
              />
        )}
        <View style={{
          backgroundColor: colors.grayBackgroundColor, width: '90%', alignSelf: 'center', height: 3,
        }}/>
      </View>
    )
  }

  const renderGameRecords = ({ item }) => {
    if (item.type === 'set_game_stats') {
      return (
        <TennisGameState gameStats={tennisGameStats} recordData={item.data}/>
      )
    }
    const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    const isGameState = item.verb in tennisGameStats;

    return (
      <View>
        {!isGameState && isHomeTeam && (
          <TennisGameScoreLeft
                  gameData={gameData}
                  recordData={item}
                  editor={true}
              />
        )}
        {!isGameState && !isHomeTeam && (
          <TennisGameScoreRight
                  gameData={gameData}
                  recordData={item}
                  editor={true}
              />
        )}
        {isGameState && <TennisGameState gameStats={tennisGameStats} recordData={item}/>}
      </View>
    )
  }
  return (
    <View style={ styles.mainContainer }>
      <Dash
            style={ {
              alignSelf: 'center',
              flex: 1,
              height: '100%',
              position: 'absolute',
              zIndex: 1,
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
        />
      <TCInnerLoader visible={loading}/>
      {!loading && (
        <Fragment>
          <FlatList
                bounces={false}
                scrollEnabled={false}
                listKey={'matchRecordList'}
                keyExtractor={({ index }) => index?.toString()}
                // style={{ height: hp(30) }}
                data={matchRecords.slice(0, MIN_MATCH_RECORD_TO_DISPLAY)}
                renderItem={renderMatchRecords}
                ListEmptyComponent={() => (
                  <View>
                    {!loading && <Text style={styles.notAvailableTextStyle}>
                      Not available yet
                    </Text>}
                  </View>
                )}/>
        </Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 10,
  },
  notAvailableTextStyle: {
    marginTop: hp(5),
    textAlign: 'center',
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  setContainer: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,1,0.1)',
    borderTopWidth: 1.5,
    borderTopColor: colors.themeColor,
    marginBottom: 27,
  },
  setScoreText: {
    color: colors.themeColor,
    fontSize: 20,
    fontFamily: fonts.RMedium,
  },
  setNumberText: {
    color: colors.themeColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  setTimeDurationText: {
    color: colors.lightBlackColor,
    fontSize: 10,
    fontFamily: fonts.RRegular,
  },
  downArrowContainer: {
    position: 'absolute',
    right: 15,
    zIndex: 100,
  },
  downArrow: {
    height: 12,
    width: 12,
  },
});
