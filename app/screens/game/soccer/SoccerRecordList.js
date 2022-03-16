/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useState, useEffect, Fragment, useContext, useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  FlatList, StatusBar, Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../../auth/context'
import TCGameScoreLeft from '../../../components/gameRecordList/TCGameScoreLeft';
import TCGameScoreRight from '../../../components/gameRecordList/TCGameScoreRight';
import TCGameState from '../../../components/gameRecordList/TCGameState';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import {
  deleteGameRecord, getGameData, getGameMatchRecords, patchGameRecord, resetGame,
} from '../../../api/Games';
import { soccerGameStats } from '../../../utils/gameUtils';
import SwipeableRow from '../../../components/gameRecordList/SwipeableRow';
import GameStatus from '../../../Constants/GameStatus';
import strings from '../../../Constants/String';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';

export default function SoccerRecordList({ route }) {
  const authContext = useContext(AuthContext)
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [showEditDateTimeModal, setShowEditDateTimeModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [teamData, setTeamData] = useState({});
  useEffect(() => {
    loadAtOnce()
  }, []);

  const getTeamName = (group_id) => {
    const singleTeamData = teamData?.home_team?.group_id?.toString() === group_id?.toString() ? teamData?.home_team : teamData?.away_team;
    return singleTeamData?.group_name ?? '';
  }

  const loadAtOnce = async () => {
    const gameId = route?.params?.gameId ?? null
    if (gameId) {
      setLoading(true);
      setGameData(route?.params?.gameData ?? null);
      getGameData(gameId, true, authContext).then(async (res) => {
        if (res.status) {
          setGameData(res.payload ?? 0);
          setTeamData({
            home_team: res?.payload?.home_team,
            away_team: res?.payload?.away_team,
          })
        }
      })
      getGameMatchRecords(gameId, authContext).then((res) => {
        setMatchRecords(res.payload);
      }).finally(() => setLoading(false));
    }
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

  const refreshGameAndRecords = (gameId) => {
    setFullScreenLoading(true);
    setGameData(route?.params?.gameData ?? null);
    getGameData(gameId, true, authContext).then(async (res) => {
      if (res.status) {
        setGameData(res.payload ?? 0);
      }
    });
    getGameMatchRecords(gameId, authContext).then((res) => {
      setMatchRecords(res.payload);
    }).finally(() => setFullScreenLoading(false));
  }
  const resetGameDetail = (gameId) => {
    setFullScreenLoading(true);
    resetGame(gameId, authContext).then(() => {
      if (gameId) {
        refreshGameAndRecords(gameId);
      }
    }).catch((e) => {
      setFullScreenLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const onSwipeRowItemPress = (key, item) => {
    if (key === 'edit') {
      setSelectedRecord(item);
      setShowEditDateTimeModal(true);
    } else if (key === 'delete') {
      if (item?.verb === 'start') {
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
        deleteGameRecord(gameData?.game_id, item?.record_id, authContext).then(() => {
          refreshGameAndRecords(gameData?.game_id);
        }).finally(() => setFullScreenLoading(false));
      }
    }
  }
  const onSelectEditDate = (date) => {
    setShowEditDateTimeModal(false);
    setTimeout(() => {
      const timestamp = Number((date.getTime()) / 1000).toFixed(0);
      setFullScreenLoading(true);
      patchGameRecord(gameData?.game_id, selectedRecord?.record_id, { timestamp, verb: selectedRecord?.verb }, authContext).then(() => {
        refreshGameAndRecords(gameData?.game_id);
      }).catch((error) => {
        setFullScreenLoading(false);
        setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
      }).finally(() => setSelectedRecord(null))
    }, 500);
  }

  const renderSoccerMatchRecords = useCallback(({ item }) => {
      const { isAdmin } = route?.params
      const isHomeTeam = item?.game?.home_team === item.team_id;
      const isGameState = item.verb in soccerGameStats;
      return (
        <View>
          <SwipeableRow
                enabled={isAdmin && !item?.deleted}
                buttons={[
                  { key: 'delete', fillColor: '#E63E3F', image: images.deleteIcon },
                  { key: 'edit', fillColor: '#4D4D4D', image: images.editButton },
                ]}
                onPress={(key) => onSwipeRowItemPress(key, item)}
            >
            {!isGameState && isHomeTeam && (
              <TCGameScoreLeft
                      style={{ opacity: item?.deleted ? 0.5 : 1 }}
                      gameData={gameData}
                      recordData={item}
                      editor={editorChecked}
                  />
              )}
            {!isGameState && !isHomeTeam && (
              <TCGameScoreRight
                      style={{ opacity: item?.deleted ? 0.5 : 1 }}
                      gameData={gameData}
                      recordData={item}
                      editor={editorChecked}
                  />
              )}
            {isGameState && <TCGameState recordData={item}/>}
          </SwipeableRow>
        </View>
      )
  }, [editorChecked, gameData, onSwipeRowItemPress, route?.params])

  return (
    <View style={ styles.mainContainer }>
      <StatusBar barStyle={'dark-content'}/>
      <ActivityLoader visible={fullScreenLoading}/>
      <DateTimePickerView
          visible={showEditDateTimeModal}
          onDone={onSelectEditDate}
          onCancel={() => {
            setSelectedRecord(null);
            setShowEditDateTimeModal(false)
          }}
          onHide={() => {
            setSelectedRecord(null);
            setShowEditDateTimeModal(false)
          }}
          mode={'datetime'}
          date={new Date(selectedRecord?.timestamp * 1000) ?? new Date()}
      />
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
                  source={gameData?.home_team?.thumbnail ? { uri: gameData?.home_team?.thumbnail } : images.teamPlaceholder }
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
            {gameData?.home_team?.group_name ?? ''}
          </Text>
        </View>
        <View style={ styles.centerView }>
          {getScoreText(gameData?.home_team_goal, gameData?.away_team_goal, 1)}
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
          {getScoreText(gameData?.home_team_goal, gameData?.away_team_goal, 2)}
        </View>
        <View style={ styles.rightView }>
          <Text style={{
            ...styles.rightText,
            color: gameData?.away_team_goal !== gameData?.home_team_goal && gameData?.away_team_goal > gameData?.home_team_goal ? colors.themeColor : colors?.lightBlackColor || colors.lightBlackColor,
          }}
          numberOfLines={ 2 }>
            {gameData?.away_team?.group_name ?? ''}
          </Text>
          <View style={ styles.profileShadow }>
            <FastImage
                  resizeMode={'cover'}
                  source={gameData?.away_team?.thumbnail ? { uri: gameData?.away_team?.thumbnail } : images.teamPlaceholder }
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
              renderItem={renderSoccerMatchRecords}
              onRefresh={async () => { await loadAtOnce() }}
              refreshing={loading}
              ListEmptyComponent={() => (
                <View>
                  {!loading && <Text style={styles.notAvailableTextStyle}>
                    Not available yet
                  </Text>}
                </View>
              )}/>
        {/* <View style={ styles.updatedByView }>
          {matchRecords.length > 0 && <Text
                      style={ {
                        color: colors.grayColor,
                        // fontFamily: fonts.RLight,
                        fontSize: 14,
                        marginLeft: 10,
                      } }>
            Last updated by{'\n'}({getTeamName(matchRecords[matchRecords.length - 1]?.updated_by?.group_id)})
          </Text>}
          <Text
                      style={ {
                        color: colors.themeColor,
                        fontSize: 14,
                        marginLeft: 10,
                      } }>

          </Text>
        </View> */}

        {matchRecords.length > 0 && <Text
                      style={ {
                        color: colors.grayColor,
                        // fontFamily: fonts.RLight,
                        padding: 5,
                        fontSize: 14,
                        marginLeft: 10,
                      } }>
          Last updated by{'\n'}({getTeamName(matchRecords[matchRecords.length - 1]?.updated_by?.group_id)})
        </Text>}

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
    // backgroundColor: 'red',
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
  // updatedByView: {
  //   height: hp('10%'),
  //   marginTop: 10,
  // },
  notAvailableTextStyle: {
    marginTop: hp(5),
    textAlign: 'center',
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
