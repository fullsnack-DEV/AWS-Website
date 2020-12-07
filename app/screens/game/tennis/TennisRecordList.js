import React, {
  useState, useLayoutEffect, useEffect, Fragment, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  FlatList, TouchableOpacity,
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
import { getGameData, getGameMatchRecords } from '../../../api/Games';
import { getNumberSuffix, tennisGameStats } from '../../../utils/gameUtils';
import TennisGameScoreRight from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreRight';
import TennisGameState from '../../../components/game/tennis/home/gameRecordList/TennisGameState';
import TennisGameScoreLeft from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreLeft';
import AuthContext from '../../../auth/context';

export default function TennisRecordList({ route, navigation }) {
  const authContext = useContext(AuthContext)
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [teamIds, setTeamIds] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log(route?.params?.gameData);
    loadAtOnce()
  }, [])

  const loadAtOnce = async () => {
    const gameId = route?.params?.gameId ?? null
    if (gameId) {
      setLoading(true);
      if (route?.params?.gameData?.singlePlayerGame) {
        setTeamIds({
          home_team: { group_id: route?.params?.gameData?.home_team?.user_id },
          away_team: { group_id: route?.params?.gameData?.away_team?.user_id },
        })
      } else {
        setTeamIds({
          home_team: { group_id: route?.params?.gameData?.home_team?.group_id },
          away_team: { group_id: route?.params?.gameData?.away_team?.group_id },
        })
      }
      setGameData(route?.params?.gameData ?? null);
      getGameData(gameId, true, authContext).then(async (res) => {
        if (res.status) {
          setGameData(res.payload ?? 0);
        }
      })
      getGameMatchRecords(gameId, authContext).then((res) => {
        setMatchRecords(res.payload);
        const records = res.payload;
        processModifiedMatchRecords(records.reverse());
      }).finally(() => setLoading(false));
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
            wholeRecords.push({
              type: 'set', set_number, setId: recordData?.s_id, isOpen: false, setGames: [],
            })
            wholeRecords[wholeRecords?.length - 1].setGames.push({ type: 'set_stats', data: recordData })
          } else {
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
                  type: 'set_games', game_number, isOpen: false, setGameId: recordData?.g_id, setGamesRecords: [],
                })
                game_number += 1
                const setGamesnew_index = wholeRecords[set_index].setGames.findIndex((item) => item?.setGameId === recordData?.g_id);
                if (setGamesnew_index !== -1) wholeRecords[set_index].setGames[setGamesnew_index].setGamesRecords.push({ type: 'set_game_stats', data: recordData });
              }
            } else {
              const setGamesnew_index = wholeRecords[set_index].setGames.findIndex((item) => item?.setGameId === recordData?.g_id);
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
          home_team_score={7}
          away_team_score={5}
          timeString={'08:00 - 09:50 pm (1h50m)'}
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

    // const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    // const isGameState = item.verb in tennisGameStats;
    // return (
    //   <View>
    //     {!isGameState && isHomeTeam && (
    //       <TennisGameScoreLeft
    //                 gameData={gameData}
    //                 recordData={item}
    //                 editor={editorChecked}
    //             />
    //     )}
    //     {!isGameState && !isHomeTeam && (
    //       <TennisGameScoreRight
    //                 gameData={gameData}
    //                 recordData={item}
    //                 editor={editorChecked}
    //             />
    //     )}
    //     {isGameState && <TennisGameState gameStats={tennisGameStats} recordData={item}/>}
    //   </View>
    // )
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
            <Text style={{ ...styles.setScoreText, fontFamily: fonts.RRegular }}>{0}</Text>
          </View>

          {/* Set Number */}
          <View style={{
            flex: 0.4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ ...styles.setNumberText, color: colors.googleColor, fontSize: 17 }}>{getNumberSuffix(item?.game_number)} game</Text>
          </View>

          {/* Right Score */}
          <View style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ ...styles.setScoreText, fontFamily: fonts.RRegular }}>{0}</Text>
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
                         editor={editorChecked}
                     />
        )}
        {!isGameState && !isHomeTeam && (
          <TennisGameScoreRight
                         gameData={gameData}
                         recordData={item}
                         editor={editorChecked}
                     />
        )}
        {isGameState && <TennisGameState gameStats={tennisGameStats} recordData={item}/>}
      </View>
    )
  }
  return (
    <View style={ styles.mainContainer }>
      <View style={ { flexDirection: 'row' } }>
        <View
          style={ {
            alignSelf: 'center',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
          } }>
          <Dash
            style={ {
              width: 1,
              height: 36,
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
          />
        </View>
        <View style={ styles.editorView }>
          <Text style={{ fontSize: 12, fontFamily: fonts.RRegular }}>Show editors</Text>
          <TouchableWithoutFeedback
            onPress={ () => {
              setEditorChecked(!editorChecked);
            } }>
            {editorChecked === true ? (
              <Image source={ images.checkEditor } style={ styles.checkboxImg } />
            ) : (
              <Image source={ images.uncheckEditor } style={ styles.checkboxImg } />
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={ styles.headerView }>
        <View style={ styles.leftView }>
          <View style={ styles.profileShadow }>
            <FastImage
                  resizeMode={'cover'}
                  source={gameData?.home_team?.background_thumbnail ? { uri: gameData?.home_team?.background_thumbnail } : images.profilePlaceHolder }
                  style={styles.profileImg}
              />
          </View>
          <Text style={{
            ...styles.leftText,
            color: gameData?.away_team_goal !== gameData?.home_team_goal
            && gameData?.home_team_goal > gameData?.away_team_goal
              ? colors.themeColor
              : colors?.lightBlackColor
                || colors.lightBlackColor,
          }}>
            {gameData?.singlePlayerGame
              ? gameData?.home_team?.full_name
              : gameData?.home_team?.group_name}
          </Text>
        </View>
        <View style={ styles.centerView }>
          {getScoreText(gameData?.scoreboard?.game_inprogress?.home_team_point, gameData?.scoreboard?.game_inprogress?.away_team_point, 1)}
          <Dash
            style={ {
              width: 1,
              height: 70,
              flexDirection: 'column',
              paddingLeft: 10,
              paddingRight: 10,
            } }
            dashColor={ colors.lightgrayColor }
          />
          <Text style={ styles.centerText }>
            {getScoreText(gameData?.scoreboard?.game_inprogress?.home_team_point, gameData?.scoreboard?.game_inprogress?.away_team_point, 2)}
          </Text>
        </View>
        <View style={ styles.rightView }>
          <Text style={{
            ...styles.rightText,
            color: gameData?.away_team_goal !== gameData?.home_team_goal && gameData?.away_team_goal > gameData?.home_team_goal ? colors.themeColor : colors?.lightBlackColor || colors.lightBlackColor,
          }}
          numberOfLines={ 2 }>
            {gameData?.singlePlayerGame
              ? gameData?.away_team?.full_name
              : gameData?.away_team?.group_name}
          </Text>
          <View style={ styles.profileShadow }>
            <FastImage
                  resizeMode={'cover'}
                  source={gameData?.away_team?.background_thumbnail ? { uri: gameData?.away_team?.background_thumbnail } : images.profilePlaceHolder }
                  style={styles.profileImg}
              />
          </View>
        </View>
      </View>
      {/* {!loading && ( */}

      <Fragment>
        <FlatList
                keyExtractor={({ index }) => index}
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
      {/* )} */}

    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    fontFamily: fonts.RRegular,
    fontSize: 35,
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
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
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
    backgroundColor: 'rgba(255,138,1,0.15)',
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
