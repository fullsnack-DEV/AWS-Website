import React, {useState, useEffect, Fragment, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {
  deleteGameRecord,
  getGameData,
  getGameMatchRecords,
  resetGame,
} from '../../../api/Games';
import {getNumberSuffix, tennisGameStats} from '../../../utils/gameUtils';
import TennisGameScoreRight from './home/gameRecordList/TennisGameScoreRight';
import TennisGameState from './home/gameRecordList/TennisGameState';
import TennisGameScoreLeft from './home/gameRecordList/TennisGameScoreLeft';
import AuthContext from '../../../auth/context';
import SwipeableRow from '../../gameRecordList/SwipeableRow';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ActivityLoader from '../../loader/ActivityLoader';
import strings from '../../../Constants/String';

const SwipeableRowButtons = [
  {key: 'revert', fillColor: colors.themeColor, image: images.deleteIcon},
];
export default function TennisDeletedRecordsList({matchData, isAdmin}) {
  const authContext = useContext(AuthContext);
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [teamIds, setTeamIds] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  useEffect(() => {
    loadAtOnce();
  }, [matchData]);

  const loadAtOnce = async () => {
    const gameId = matchData?.game_id;
    if (gameId) {
      setLoading(true);
      if (matchData?.user_challenge) {
        setTeamIds({
          home_team: {group_id: matchData?.home_team?.user_id},
          away_team: {group_id: matchData?.away_team?.user_id},
        });
      } else {
        setTeamIds({
          home_team: {group_id: matchData?.home_team?.group_id},
          away_team: {group_id: matchData?.away_team?.group_id},
        });
      }
      setGameData(matchData ?? null);
      getGameData(gameId, true, authContext).then(async (res) => {
        if (res.status) {
          setGameData({...res.payload});
          const home_team_score =
            res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          const away_team_score =
            res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          setCurrentScore({...currentScore, home_team_score, away_team_score});
        }
        getGameMatchRecords(
          gameId,
          authContext,
          'status=deleted&grouped=true',
        ).then((matchRes) => {
          setMatchRecords([...matchRes.payload]);
          setLoading(false);
        });
      });
    }
  };

  const refreshGameAndRecords = () => {
    getGameData(gameData?.game_id, true, authContext)
      .then(async (res) => {
        if (res.status) {
          setGameData({...res.payload});
          const home_team_score =
            res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          const away_team_score =
            res?.payload?.scoreboard?.game_inprogress?.home_team_point;
          setCurrentScore({...currentScore, home_team_score, away_team_score});
        }
        getGameMatchRecords(
          gameData?.game_id,
          authContext,
          'status=deleted&grouped=true',
        )
          .then((matchRes) => {
            setMatchRecords([...matchRes.payload]);
            setLoading(false);
          })
          .finally(() => setFullScreenLoading(false));
      })
      .catch(() => setFullScreenLoading(false));
  };

  const toggleMatchSets = (index) => {
    const records = _.cloneDeep(matchRecords);
    records[index].isOpen = !records[index]?.isOpen ?? false;
    setMatchRecords(records);
  };

  const RenderSets = ({
    item,
    index,
    set_number,
    home_team_score,
    away_team_score,
  }) => (
    <Fragment>
      <View
        style={{
          ...styles.setContainer,
          backgroundColor: 'rgba(255,138,1,0.1)',
        }}>
        <RenderDash />
        {/* Down Arrow */}
        <TouchableOpacity
          style={styles.downArrowContainer}
          onPress={() => toggleMatchSets(index)}>
          <FastImage
            resizeMode={'contain'}
            source={images.yellowDownArrow}
            style={{
              ...styles.downArrow,
              tintColor: 'red',
              transform: [{rotateZ: item?.isOpen ? '180deg' : '0deg'}],
            }}
          />
        </TouchableOpacity>

        {/* Left Score */}
        <View
          style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.setScoreText}>{home_team_score}</Text>
        </View>

        {/* Set Number */}
        <View
          style={{
            flex: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.setNumberText}>
            {getNumberSuffix(set_number)} set
          </Text>
        </View>

        {/* Right Score */}
        <View
          style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.setScoreText}>{away_team_score}</Text>
        </View>
      </View>
      <View style={{height: 26}}>
        <RenderDash />
      </View>
    </Fragment>
  );

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
    ];
    if (isAdmin && isDeleted && showSwipeRow.includes(verb)) {
      return true;
    }
    return false;
  };
  const renderMatchRecords = ({item, index}) => {
    if (
      [GameVerb.Start, GameVerb.End, GameVerb.Pause, GameVerb.Resume].includes(
        item?.verb,
      )
    ) {
      return (
        <View>
          <SwipeableRow
            buttons={SwipeableRowButtons}
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
            <TennisGameState recordData={item} />
          </SwipeableRow>
        </View>
      );
    }
    return (
      <View>
        <RenderSets
          item={item}
          index={index}
          set_number={item?.number}
          home_team_score={0}
          away_team_score={0}
        />

        {item?.isOpen && (
          <View style={styles.innerSetContainer}>
            <FlatList
              keyExtractor={(keyItem, keyIndex) =>
                keyIndex?.toString() + Math.random().toString()
              }
              listKey={`renderGames${index * 2}`}
              data={item?.items ?? []}
              renderItem={({item: gameItem, index: gameIndex}) =>
                renderGames(gameItem, gameIndex, index)
              }
            />
          </View>
        )}
      </View>
    );
  };

  const toggleGameRecords = (parentIndex, index) => {
    const records = _.cloneDeep(matchRecords);
    records[parentIndex].items[index].isOpen =
      !records[parentIndex]?.items?.[index]?.isOpen;
    setMatchRecords(records);
  };

  const getGameScoreText = (
    firstTeamScore = 0,
    secondTeamScore = 0,
    teamNumber = 1,
  ) => {
    const isGreterTeam = firstTeamScore > secondTeamScore ? 1 : 2;
    let color = colors.lightBlackColor;
    if (firstTeamScore !== secondTeamScore) {
      if (teamNumber === isGreterTeam) color = colors.yellowColor;
      else color = colors.lightBlackColor;
    }
    return (
      <Text style={{...styles.setScoreText, color, fontFamily: fonts.RRegular}}>
        {teamNumber === 1 ? firstTeamScore : secondTeamScore ?? 0}
      </Text>
    );
  };

  const renderGames = (item, index, parentIndex) => {
    if ([GameVerb.SetStart, GameVerb.SetEnd].includes(item.verb)) {
      return (
        <View>
          <SwipeableRow
            buttons={SwipeableRowButtons}
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
            <TennisGameState recordData={item} titleColor={colors.themeColor} />
          </SwipeableRow>
        </View>
      );
    }

    return (
      <View>
        <View
          style={{
            ...styles.setContainer,
            borderTopWidth: 0,
            marginBottom: 0,
          }}>
          <RenderDash />
          {/* Down Arrow */}
          <TouchableOpacity
            style={styles.downArrowContainer}
            onPress={() => toggleGameRecords(parentIndex, index)}>
            <FastImage
              resizeMode={'contain'}
              source={images.dropDownArrow}
              style={{
                ...styles.downArrow,
                tintColor: 'red',
                transform: [{rotateZ: item.isOpen ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>

          {/* Left Score */}
          <View
            style={{
              flex: 0.3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {getGameScoreText(item?.home_team_point, item?.away_team_point, 1)}
          </View>

          {/* Set Number */}
          <View
            style={{flex: 0.4, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                ...styles.setNumberText,
                color: colors.googleColor,
                fontSize: 17,
              }}>
              {getNumberSuffix(item?.number)} game
            </Text>
          </View>

          {/* Right Score */}
          <View
            style={{
              flex: 0.3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {getGameScoreText(item?.home_team_point, item?.away_team_point, 2)}
          </View>
        </View>

        {item?.isOpen && (
          <FlatList
            keyExtractor={(keyItem, keyIndex) =>
              keyIndex?.toString() + Math.random().toString()
            }
            listKey={`setGameRecords${index * 2}`}
            data={item?.items ?? []}
            renderItem={renderGameRecords}
          />
        )}
        <View
          style={{
            backgroundColor: colors.grayBackgroundColor,
            width: '90%',
            alignSelf: 'center',
            height: 3,
          }}
        />
      </View>
    );
  };

  const resetGameDetail = () => {
    setFullScreenLoading(true);
    resetGame(gameData?.game_id, authContext)
      .then(() => {
        refreshGameAndRecords(gameData?.game_id);
      })
      .catch((e) => {
        setFullScreenLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onSwipeRowItemPress = (verb, record_id) => {
    if (verb === GameVerb.Start) {
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
              if (
                gameData.status === GameStatus.accepted ||
                gameData.status === GameStatus.reset
              ) {
                Alert.alert('Game not started yet.');
              } else if (gameData.status === GameStatus.ended) {
                Alert.alert('Game is ended.');
              } else {
                resetGameDetail(gameData.game_id);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      setFullScreenLoading(true);
      deleteGameRecord(gameData?.game_id, record_id, authContext)
        .then(() => {
          refreshGameAndRecords(gameData?.game_id);
        })
        .finally(() => setFullScreenLoading(false));
    }
  };
  const renderGameRecords = ({item}) => {
    if (
      [
        GameVerb.Resume,
        GameVerb.Pause,
        GameVerb.GameStart,
        GameVerb.GameEnd,
      ]?.includes(item.verb)
    ) {
      return (
        <SwipeableRow
          buttons={SwipeableRowButtons}
          enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
          onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
          <View style={{backgroundColor: colors.whiteColor}}>
            <TennisGameState recordData={item} />
          </View>
        </SwipeableRow>
      );
    }
    const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    const isGameState = item.verb in tennisGameStats;

    return (
      <SwipeableRow
        buttons={SwipeableRowButtons}
        enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
        onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
        <View>
          {!isGameState && isHomeTeam && (
            <View style={{backgroundColor: colors.whiteColor}}>
              <RenderDash zIndex={1} />
              <TennisGameScoreLeft
                gameData={gameData}
                recordData={item}
                editor={editorChecked}
              />
            </View>
          )}
          {!isGameState && !isHomeTeam && (
            <View style={{backgroundColor: colors.whiteColor}}>
              <RenderDash zIndex={1} />
              <TennisGameScoreRight
                gameData={gameData}
                recordData={item}
                editor={editorChecked}
              />
            </View>
          )}
          {isGameState && <TennisGameState recordData={item} />}
        </View>
      </SwipeableRow>
    );
  };
  const RenderDash = ({zIndex = 0}) => (
    <Dash
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(100),
        alignSelf: 'center',
        flex: 1,
        zIndex,
        height: '100%',
        position: 'absolute',
        flexDirection: 'column',
      }}
      dashColor={colors.lightgrayColor}
    />
  );

  return (
    <View style={{...styles.mainContainer}}>
      <ActivityLoader visible={fullScreenLoading} />
      <View>
        <View style={{flexDirection: 'row', paddingBottom: 10}}>
          <RenderDash />
          <View style={{...styles.editorView}}>
            <Text style={{fontSize: 12, fontFamily: fonts.RRegular}}>
              Show editors
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setEditorChecked(!editorChecked);
              }}>
              {editorChecked === true ? (
                <FastImage
                  resizeMode={'contain'}
                  source={images.checkEditor}
                  style={styles.checkboxImg}
                />
              ) : (
                <FastImage
                  resizeMode={'contain'}
                  source={images.uncheckEditor}
                  style={styles.checkboxImg}
                />
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          listKey={'matchRecordList'}
          keyExtractor={(item, index) =>
            index?.toString() + Math.random().toString()
          }
          style={{height: hp(30)}}
          data={matchRecords}
          renderItem={renderMatchRecords}
          onRefresh={async () => {
            await loadAtOnce();
          }}
          refreshing={loading}
          ListEmptyComponent={() => (
            <View>
              {!loading && (
                <Text style={styles.notAvailableTextStyle}>
                  Not available yet
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  mainContainer: {
    flex: 1,
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
    borderTopWidth: 1.5,
    borderTopColor: colors.themeColor,
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
