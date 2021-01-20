import React, {
  useState, useEffect, Fragment, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList, TouchableOpacity, Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import {
  deleteGameRecord, getGameData, getGameMatchRecords, resetGame,
} from '../../../api/Games';
import { getGameDateTimeInHMSformat, getNumberSuffix, tennisGameStats } from '../../../utils/gameUtils';
import TennisGameScoreRight from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreRight';
import TennisGameState from '../../../components/game/tennis/home/gameRecordList/TennisGameState';
import TennisGameScoreLeft from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreLeft';
import AuthContext from '../../../auth/context';
import SwipeableRow from '../../../components/gameRecordList/SwipeableRow';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';

export default function TennisMatchRecordsList({ matchData, visibleSetScore = true, isAdmin }) {
  const authContext = useContext(AuthContext)
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [teamIds, setTeamIds] = useState(null);
  const [currentScore, setCurrentScore] = useState(null)
  const [servingTeamID, setServingTeamID] = useState();
  const [homeTeamMatchPoint, setHomeMatchPoint] = useState(0);
  const [awayTeamMatchPoint, setAwayMatchPoint] = useState(0);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  useEffect(() => {
    loadAtOnce()
  }, [matchData])

  useEffect(() => {
    if (gameData) {
      calculateMatchScore();
      defineServingTeamID(gameData);
    }
  }, [gameData])
  const defineServingTeamID = (data) => {
    if (data?.game_inprogress && data?.game_inprogress?.serving_team_id) {
      setServingTeamID(data?.game_inprogress?.serving_team_id);
    } else {
      setServingTeamID(data?.home_team?.user_id);
    }
  };

  const loadAtOnce = async () => {
    const gameId = matchData?.game_id;
    if (gameId) {
      setLoading(true);
      if (matchData?.singlePlayerGame) {
        setTeamIds({
          home_team: { group_id: matchData?.home_team?.user_id },
          away_team: { group_id: matchData?.away_team?.user_id },
        })
      } else {
        setTeamIds({
          home_team: { group_id: matchData?.home_team?.group_id },
          away_team: { group_id: matchData?.away_team?.group_id },
        })
      }
      setGameData(matchData ?? null);
      getGameData(gameId, true, authContext).then(async (res) => {
        if (res.status) {
          setGameData({ ...res.payload });
          const home_team_score = res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          const away_team_score = res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          setCurrentScore({ ...currentScore, home_team_score, away_team_score })
        }
        getGameMatchRecords(gameId, authContext).then((matchRes) => {
          // setMatchRecords(matchRes.payload);
          const records = matchRes.payload;
          processModifiedMatchRecords(records.reverse());
        })
      })
    }
  }

  const refreshGameAndRecords = () => {
    getGameData(gameData?.game_id, true, authContext).then(async (res) => {
      if (res.status) {
        setGameData({ ...res.payload });
        const home_team_score = res?.payload?.scoreboard?.game_inprogress?.home_team_point;
        const away_team_score = res?.payload?.scoreboard?.game_inprogress?.home_team_point;
        setCurrentScore({ ...currentScore, home_team_score, away_team_score })
      }
      getGameMatchRecords(gameData?.game_id, authContext).then((matchRes) => {
        setMatchRecords(matchRes.payload);
        const records = matchRes.payload;
        processModifiedMatchRecords(records.reverse());
      }).finally(() => setFullScreenLoading(false));
    }).catch(() => setFullScreenLoading(false))
  }
  const calculateMatchScore = () => {
    setHomeMatchPoint(0);
    setAwayMatchPoint(0);
    let homePoint = 0;
    let awayPoint = 0;
    console.log('SETS::->', gameData?.scoreboard?.sets);
    (gameData?.scoreboard?.sets || []).map((e) => {
      if (e?.winner) {
        if (e.winner === gameData?.home_team?.user_id) {
          homePoint += 1;
          console.log('SETS NO::->', homePoint);
        } else {
          awayPoint += 1;
        }
      }
      setHomeMatchPoint(homePoint);
      setAwayMatchPoint(awayPoint);
      return e;
    });
  };
  const processModifiedMatchRecords = (records) => {
    const wholeRecords = [];
    let set_number = 0;
    let game_number = 0;
    records.map((recordData) => {
      const isGameState = ['start', 'end'].includes(recordData?.verb);
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
          const isSetGameState = ['resume', 'pause', 'gameStart', 'gameEnd'].includes(recordData?.verb);
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
              if (!setGamesnew_index || setGamesnew_index === -1) {
                const setGamesSecondnew_index = wholeRecords[set_index].setGames?.length - 1;
                wholeRecords[set_index].setGames[setGamesSecondnew_index].setGamesRecords.push({ type: 'set_game_stats', data: recordData })
              } else {
                wholeRecords[set_index].setGames[setGamesnew_index].home_team_score = recordData?.game_score?.home_team_point ?? '-';
                wholeRecords[set_index].setGames[setGamesnew_index].away_team_score = recordData?.game_score?.away_team_point ?? '-';
                wholeRecords[set_index].setGames[setGamesnew_index].end_date = getGameDateTimeInHMSformat(recordData?.timestamp) ?? '-';
                wholeRecords[set_index].setGames[setGamesnew_index].setGamesRecords.push({ type: 'set_game_stats', data: recordData })
              }
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

  const getScoreText = (firstTeamScore = 0, secondTeamScore = 0, teamNumber = 1) => {
    const isGreterTeam = firstTeamScore > secondTeamScore ? 1 : 2;
    let color = colors.lightBlackColor
    if (firstTeamScore !== secondTeamScore) {
      if (teamNumber === isGreterTeam) color = colors.yellowColor
      else color = colors.lightBlackColor
    }
    return (
      <Text style={{ ...styles.centerText, color }}>
        {teamNumber === 1 ? firstTeamScore : secondTeamScore ?? 0}
      </Text>
    )
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

  const getVisibleSwipableRowValue = (verb, isDeleted = false) => {
    const showSwipeRow = [
      // GameVerb.End,
      // GameVerb.Start,
      // GameVerb.SetStart,
      // GameVerb.SetEnd,
      // GameVerb.SetEndMannually,
      // GameVerb.GameStart,
      // GameVerb.GameEnd,
      // GameVerb.GameEndMannually,
      GameVerb.Pause,
      GameVerb.Resume,
      GameVerb.Ace,
      GameVerb.Fault,
      GameVerb.FeetFault,
      GameVerb.Doublefault,
      GameVerb.Unforced,
      GameVerb.LetScore,
      GameVerb.Score,
    ]
    if (isAdmin && !isDeleted && showSwipeRow.includes(verb)) {
      return true
    }
    return false
  }

  const renderMatchRecords = ({ item, index }) => {
    if (item.type === 'game_stats') {
      return (
        <SwipeableRow
              enabled={getVisibleSwipableRowValue(item?.data?.verb, item?.data?.deleted)}
              onPress={() => onSwipeRowItemPress(item?.data?.verb, item?.data?.record_id)}
          >
          <TennisGameState recordData={item.data}/>
        </SwipeableRow>
      )
    }
    return (
      <View>
        <RenderDash/>
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
        <SwipeableRow
              enabled={getVisibleSwipableRowValue(item?.data?.verb, item?.data?.deleted)}
              onPress={() => onSwipeRowItemPress(item?.data?.verb, item?.data?.record_id)}
          >
          <TennisGameState recordData={item.data}/>
        </SwipeableRow>
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
          <RenderDash/>
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

  const resetGameDetail = () => {
    setFullScreenLoading(true);
    resetGame(gameData?.game_id, authContext).then(() => {
      refreshGameAndRecords(gameData?.game_id);
    }).catch((e) => {
      setFullScreenLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    });
  };

  const onSwipeRowItemPress = (verb, record_id) => {
    if (verb === 'start') {
      Alert.alert(
        'Do you want to reset all the match records?',
        '',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              if (gameData.status === GameStatus.accepted || gameData.status === GameStatus.reset) {
                Alert.alert('Game not started yet.');
              } else if (gameData.status === GameStatus.ended) {
                Alert.alert('Game is ended.');
              } else {
                resetGameDetail(gameData.game_id);
              }
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      setFullScreenLoading(true);
      deleteGameRecord(gameData?.game_id, record_id, authContext).then(() => {
        refreshGameAndRecords(gameData?.game_id);
      }).finally(() => setFullScreenLoading(false));
    }
  }
  const renderGameRecords = ({ item }) => {
    if (item.type === 'set_game_stats') {
      return (
        <View style={{ opacity: item?.deleted ? 0.5 : 1 }}>
          <SwipeableRow
              enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
              onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}
          >
            <TennisGameState recordData={item.data}/>
          </SwipeableRow>
        </View>
      )
    }
    const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    const isGameState = item.verb in tennisGameStats;

    return (
      <SwipeableRow
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}
        >
        <View style={{ opacity: item?.deleted ? 0.5 : 1 }}>
          {!isGameState && isHomeTeam && (
            <View>
              <RenderDash zIndex={1}/>
              <TennisGameScoreLeft
                            gameData={gameData}
                            recordData={item}
                            editor={editorChecked}
                        />
            </View>
          )}
          {!isGameState && !isHomeTeam && (
            <View>
              <RenderDash zIndex={1}/>
              <TennisGameScoreRight
                            gameData={gameData}
                            recordData={item}
                            editor={editorChecked}
                        />
            </View>
          )}
          {isGameState && <TennisGameState recordData={item}/>}
        </View>
      </SwipeableRow>
    )
  }
  const RenderDash = ({ zIndex = 0 }) => (
    <Dash
            style={ {
              alignItems: 'center',
              justifyContent: 'center',
              width: wp(100),
              alignSelf: 'center',
              flex: 1,
              zIndex,
              height: '100%',
              position: 'absolute',
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
        />
  )
  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={fullScreenLoading}/>
      <View>
        <View style={ { flexDirection: 'row', paddingBottom: 10 } }>
          <RenderDash/>
          <View style={ styles.editorView }>
            <Text style={{ fontSize: 12, fontFamily: fonts.RRegular }}>Show editors</Text>
            <TouchableWithoutFeedback
                        onPress={ () => {
                          setEditorChecked(!editorChecked);
                        } }>
              {editorChecked === true ? (
                <FastImage resizeMode={'contain'} source={ images.checkEditor } style={ styles.checkboxImg } />
              ) : (
                <FastImage resizeMode={'contain'} source={ images.uncheckEditor } style={ styles.checkboxImg } />
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>
        {visibleSetScore && (
          <View style={styles.headerView}>
            <RenderDash/>
            <View style={styles.leftView}>
              <View style={styles.profileShadow}>
                <FastImage
                    resizeMode={'cover'}
                      source={
                        gameData?.home_team?.thumbnail
                          ? { uri: gameData?.home_team?.thumbnail }
                          : images.profilePlaceHolder
                      }
                      style={
                        servingTeamID === gameData?.home_team?.user_id
                          ? styles.profileImg
                          : [styles.profileImg, { borderColor: colors.themeColor }]
                      }
                  />
              </View>
              <Text style={styles.leftText} numberOfLines={2}>
                {gameData?.home_team?.first_name} {gameData?.home_team?.last_name}
              </Text>
            </View>

            <TouchableWithoutFeedback>
              <View>
                <Text style={styles.centerSetText}>SET SCORES</Text>
                <View style={styles.centerView}>
                  <Text style={styles.centerText}>
                    {getScoreText(homeTeamMatchPoint, awayTeamMatchPoint, 1)}
                  </Text>
                  <View style={{ width: 10 }}/>
                  <Text style={styles.centerText}>
                    {getScoreText(homeTeamMatchPoint, awayTeamMatchPoint, 2)}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.rightView}>
              <Text style={styles.rightText} numberOfLines={2}>
                {gameData?.away_team?.first_name} {gameData?.away_team?.last_name}
              </Text>
              <View style={styles.profileShadow}>
                <FastImage
                      resizeMode={'cover'}
                      source={
                        gameData?.away_team?.thumbnail
                          ? { uri: gameData?.away_team?.thumbnail }
                          : images.profilePlaceHolder
                      }
                      style={
                        servingTeamID === gameData?.away_team?.user_id
                          ? styles.profileImg
                          : [styles.profileImg, { borderColor: colors.themeColor }]
                      }
                  />
              </View>
            </View>
          </View>
        )}
      </View>
      <Fragment>
        <FlatList
                    listKey={'matchRecordList'}
                    keyExtractor={({ index }) => index?.toString()}
                    style={{ height: hp(30) }}
                    data={matchRecords}
                    renderItem={renderMatchRecords}
                    onRefresh={async () => { await loadAtOnce() }}
                    refreshing={loading}
                    ListEmptyComponent={() => (
                      <View>
                        {!loading && <Text style={styles.notAvailableTextStyle}>
                          Not available yet
                        </Text>}
                      </View>
                    )}/>
      </Fragment>
    </View>
  );
}

const styles = StyleSheet.create({
  centerSetText: {
    color: colors.userPostTimeColor,
    alignSelf: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  centerText: {
    fontFamily: fonts.RRegular,
    fontSize: 30,
    color: colors.lightBlackColor,
  },
  centerView: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('20%'),
  },
  checkboxImg: {
    alignSelf: 'center',
    height: 15,

    marginRight: 10,
    paddingLeft: 30,
    resizeMode: 'contain',
    width: 15,
  },

  editorView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    width: '100%',
    // paddingTop: 10,
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  leftView: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  mainContainer: {
    flex: 1,
  },
  profileShadow: {
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  profileImg: {
    borderRadius: 15,
    height: 25,
    marginLeft: 15,
    marginRight: 15,
    resizeMode: 'contain',
    width: 25,
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  rightView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',

    width: wp('40%'),
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
