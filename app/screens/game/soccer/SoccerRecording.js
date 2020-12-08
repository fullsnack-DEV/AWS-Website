import React, {
  useLayoutEffect, useState, useEffect, useRef, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCGameButton from '../../../components/TCGameButton';
import AuthContext from '../../../auth/context'
import {
  getGameByGameID,
  addGameRecord,
  resetGame,
  decreaseGameScore,
} from '../../../api/Games';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

let entity = {};
let timer, timerForTimeline;
let lastTimeStamp;
let lastVerb;
export default function SoccerRecording({ navigation, route }) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext)

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [actionByTeamID, setActionByTeamID] = useState();
  const [pickerShow, setPickerShow] = useState(false);
  const [gameObj, setGameObj] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const [timelineTimer, setTimelineTimer] = useState('00 : 00 : 00');
  const [date, setDate] = useState();

  useEffect(() => {
    entity = authContext.entity
    const { gameId } = route.params ?? {};
    getGameDetail(gameId, true);
  }, [isFocused]);
  const startStopTimerTimeline = () => {
    clearInterval(timer)
    clearInterval(timerForTimeline)
    if (gameObj && gameObj.status === GameStatus.ended) {
      setTimelineTimer(getTimeDifferent(gameObj && gameObj.actual_enddatetime && gameObj.actual_enddatetime, gameObj && gameObj.actual_startdatetime && gameObj.actual_startdatetime))
    } else if ((gameObj && gameObj.status === GameStatus.accepted) || (gameObj && gameObj.status === GameStatus.reset)) {
      setTimelineTimer(getTimeDifferent(new Date().getTime(), new Date().getTime()))
    } else if (gameObj && gameObj.status === GameStatus.paused) {
      setTimelineTimer(getTimeDifferent(gameObj && gameObj.pause_datetime && gameObj.pause_datetime, gameObj && gameObj.actual_startdatetime && gameObj.actual_startdatetime))
    } else if (date) {
      setTimelineTimer(getTimeDifferent(gameObj && gameObj.actual_startdatetime && gameObj.actual_startdatetime, new Date(date).getTime()))
    } else {
      timerForTimeline = setInterval(() => {
        if (gameObj) {
          setTimelineTimer(getTimeDifferent(new Date().getTime(), gameObj && gameObj.actual_startdatetime && gameObj.actual_startdatetime))
        }
      }, 1000);
    }
  }
  useFocusEffect(() => {
    startStopTimerTimeline()
    timer = setInterval(() => {
      if (gameObj && gameObj.status !== GameStatus.ended) {
        getGameDetail(gameObj.game_id, false);
      }
    }, 3000);

    return () => {
      clearInterval(timer)
      clearInterval(timerForTimeline)
    }
  }, [])

  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let breakTime = 0;
    if (gameObj && gameObj.breakTime) {
      breakTime = gameObj.breakTime / 1000
    }
    if (date) {
      // eslint-disable-next-line no-param-reassign
      eDate = date
    }

    const tempDate = new Date(eDate)
    tempDate.setMinutes(tempDate.getMinutes() + breakTime)
    let delta = Math.abs(new Date(sDate).getTime() - new Date(tempDate).getTime()) / 1000;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = Math.floor(delta % 60);

    if (hours >= 99) {
      return '99 : 00 : 00'
    }
    let hr, min, sec;
    if (hours <= 9) {
      hr = `0${hours}`
    } else {
      hr = hours
    }
    if (minutes <= 9) {
      min = `0${minutes}`
    } else {
      min = minutes
    }
    if (seconds <= 9) {
      sec = `0${seconds}`
    } else {
      sec = seconds
    }
    return `${hr} : ${min} : ${sec}`;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => actionSheet.current.show()}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, date]);

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('hh : mm a, MMM DD')
  }
  const getGameDetail = (gameId, isLoading) => {
    if (isLoading) {
      setloading(true);
    }
    getGameByGameID(gameId, authContext)
      .then((response) => {
        if (response.payload.status === GameStatus.reset) {
          setGameObj({
            ...response.payload,
            actual_startdatetime: undefined,
            actual_enddatetime: undefined,
            pause_datetime: undefined,
            resume_datetime: undefined,
            away_team_goal: 0,
            home_team_goal: 0,
            status: GameStatus.accepted,
          });
        } else {
          setGameObj(response.payload);
        }

        if (entity === gameObj.home_team.group_id) {
          setActionByTeamID(gameObj.home_team.group_id);
        } else {
          setActionByTeamID(gameObj.away_team.group_id);
        }
        setloading(false);
        console.log('GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };
  const resetGameDetail = (gameId) => {
    setloading(true);
    resetGame(gameId, authContext)
      .then((response) => {
        setGameObj({
          ...gameObj,
          actual_startdatetime: undefined,
          actual_enddatetime: undefined,
          pause_datetime: undefined,
          resume_datetime: undefined,
          away_team_goal: 0,
          home_team_goal: 0,
          status: GameStatus.accepted,
        });
        startStopTimerTimeline()
        setloading(false);
        setDate();
        console.log('RESET GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };
  const decreaseGameScoreRecord = (teamId, gameId) => {
    setloading(true)
    decreaseGameScore(teamId, gameId, authContext)
      .then((response) => {
        if (selectedTeam === gameObj.home_team.group_id) {
          setGameObj({
            ...gameObj,
            home_team_goal: gameObj.home_team_goal - 1,
          });
        } else if (selectedTeam === gameObj.away_team.group_id) {
          setGameObj({
            ...gameObj,
            away_team_goal: gameObj.away_team_goal - 1,
          });
        }
        setloading(false)
        console.log('DECREASE GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false)
        Alert.alert(e.messages)
      });
  };
  const addGameRecordDetail = (gameId, params) => {
    setloading(true);
    addGameRecord(gameId, params, authContext)
      .then((response) => {
        setloading(false);
        setDate();
        if (lastVerb === GameVerb.Goal) {
          if (selectedTeam === gameObj.home_team.group_id) {
            setGameObj({
              ...gameObj,
              home_team_goal: gameObj.home_team_goal + 1,
            });
          } else if (selectedTeam === gameObj.away_team.group_id) {
            setGameObj({
              ...gameObj,
              away_team_goal: gameObj.away_team_goal + 1,
            });
          }
        } else if (lastVerb === GameVerb.Start) {
          setGameObj({
            ...gameObj,
            actual_startdatetime: lastTimeStamp,
            status: GameStatus.playing,
          });
          startStopTimerTimeline()
        } else if (lastVerb === GameVerb.Pause) {
          setGameObj({
            ...gameObj,
            pause_datetime: lastTimeStamp,
            status: GameStatus.paused,
          });
          startStopTimerTimeline()
        } else if (lastVerb === GameVerb.Resume) {
          setGameObj({ ...gameObj, status: GameStatus.resume });
          startStopTimerTimeline()
        } else if (lastVerb === GameVerb.End) {
          setGameObj({
            ...gameObj,
            actual_enddatetime: lastTimeStamp,
            status: GameStatus.ended,
          });
          startStopTimerTimeline()
        }
        console.log('GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setPickerShow(Platform.OS === 'ios');
    startStopTimerTimeline()
    setDate(currentDate);
  };
  return (
    <>
      {gameObj && (
        <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <View>
            <View style={styles.headerView}>
              {gameObj && gameObj.home_team && (
                <View style={styles.leftView}>
                  <View style={styles.profileShadow}>
                    <Image
                      source={
                        gameObj.home_team.thumbnail
                          ? { uri: gameObj.home_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.profileImg}
                    />
                  </View>
                  {gameObj.home_team.group_name
                  && gameObj.home_team_goal > gameObj.away_team_goal ? (
                    <Text
                      style={[styles.leftText, { color: colors.themeColor }]}
                      numberOfLines={2}>
                      {gameObj.home_team.group_name}
                    </Text>
                    ) : (
                      <Text style={styles.leftText} numberOfLines={2}>
                        {gameObj.home_team.group_name}
                      </Text>
                    )}
                </View>
              )}

              <View style={styles.centerView}>
                <Text style={styles.centerText}>
                  {gameObj.home_team_goal > gameObj.away_team_goal ? (
                    <Text
                      style={{
                        fontFamily: fonts.RBold,
                        color: colors.themeColor,
                      }}>
                      {gameObj.home_team_goal}
                    </Text>
                  ) : (
                    <Text>{gameObj.home_team_goal}</Text>
                  )}{' '}
                  :{' '}
                  {gameObj.away_team_goal > gameObj.home_team_goal ? (
                    <Text
                      style={{
                        fontFamily: fonts.RBold,
                        color: colors.themeColor,
                      }}>
                      {gameObj.away_team_goal}
                    </Text>
                  ) : (
                    <Text>{gameObj.away_team_goal}</Text>
                  )}
                </Text>
              </View>
              {gameObj && gameObj.away_team && (
                <View style={styles.rightView}>
                  {gameObj.away_team.group_name
                  && gameObj.away_team_goal > gameObj.home_team_goal ? (
                    <Text
                      style={[styles.rightText, { color: colors.themeColor }]}
                      numberOfLines={2}>
                      {gameObj.away_team.group_name}
                    </Text>
                    ) : (
                      <Text style={styles.rightText} numberOfLines={2}>
                        {gameObj.away_team.group_name}
                      </Text>
                    )}
                  <View style={styles.profileShadow}>
                    <Image
                      source={
                        gameObj.away_team.thumbnail
                          ? { uri: gameObj.away_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.profileImg}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.timeView}>
              <Text style={styles.timer}>{timelineTimer}</Text>
              {pickerShow && date && (
                <View style={styles.curruentTimeView}>
                  <TouchableOpacity onPress={() => {
                    setDate()
                  }}>
                    <Image
                    source={images.curruentTime}
                    style={styles.curruentTimeImg}
                  />
                  </TouchableOpacity>
                </View>
              )}

              <Text
                style={styles.startTime}
                onPress={() => {
                  setPickerShow(!pickerShow);
                }}>
                {((gameObj && gameObj.status && gameObj.status === GameStatus.accepted) || (gameObj && gameObj.status && gameObj.status === GameStatus.reset)) ? 'Game start at now' : getDateFormat(date ? new Date(date.getTime()) : new Date())}
              </Text>
              <Image source={images.dropDownArrow} style={styles.downArrow} />

              <View style={styles.separatorLine}></View>
            </View>
            {pickerShow && (
              <View>
                <RNDateTimePicker
                locale={'en'}
                default = 'spinner'
                value={date || new Date()}
                onChange={onChange}
                mode={'datetime'}
                minimumDate={gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset ? new Date(1950, 0, 1) : new Date(gameObj.actual_startdatetime)}
                maximumDate={gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset ? new Date(1950, 0, 1) : new Date()}
                />
                <View style={styles.separatorLine} />
              </View>
            )}
          </View>
          <View style={{
            flex: 1, justifyContent: 'center',
          }}>
            <View >
              <View style={pickerShow ? styles.entityView : [styles.entityView, { marginBottom: 30 }]}>
                <TouchableOpacity
                onPress={() => setSelectedTeam(gameObj.home_team.group_id)}>
                  {selectedTeam === gameObj.home_team.group_id ? (
                    <LinearGradient
                    colors={
                      selectedTeam === gameObj.home_team.group_id
                        ? [colors.yellowColor, colors.themeColor]
                        : [colors.whiteColor, colors.whiteColor]
                    }
                    style={

                         styles.leftEntityView
                    }>
                      <Image
                      source={
                        gameObj
                        && gameObj.home_team
                        && gameObj.home_team.thumbnail
                          ? { uri: gameObj.home_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.teamProfileView}
                    />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameObj.home_team.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                    style={

                       styles.leftEntityView
                    }>
                      <Image
                      source={
                        gameObj
                        && gameObj.home_team
                        && gameObj.home_team.thumbnail
                          ? { uri: gameObj.home_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.teamProfileView}
                    />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameObj.home_team.group_name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text style={styles.vs}>VS</Text>

                <TouchableOpacity
                onPress={() => setSelectedTeam(gameObj.away_team.group_id)}>
                  {selectedTeam === gameObj.away_team.group_id ? (
                    <LinearGradient
                    colors={
                      selectedTeam === gameObj.away_team.group_id
                        ? [colors.yellowColor, colors.themeColor]
                        : [colors.whiteColor, colors.whiteColor]
                    }
                    style={

                    styles.rightEntityView
                    }>
                      <Image
                      source={
                        gameObj
                        && gameObj.away_team
                        && gameObj.away_team.thumbnail
                          ? { uri: gameObj.away_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.teamProfileView}
                    />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameObj.away_team.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                    style={
                        styles.rightEntityView
                    }>
                      <Image
                      source={
                        gameObj
                        && gameObj.away_team
                        && gameObj.away_team.thumbnail
                          ? { uri: gameObj.away_team.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.teamProfileView}
                    />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameObj.away_team.group_name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {!pickerShow && (
                <View style={styles.plusMinusView}>
                  <TouchableOpacity
                  onPress={() => {
                    if (gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset) {
                      Alert.alert('Game not started yet.');
                    } else if (gameObj.status === GameStatus.ended) {
                      Alert.alert('Game is ended.');
                    } else if (!selectedTeam) {
                      Alert.alert('Select Team');
                    } else {
                      lastTimeStamp = date ? date.getTime() : new Date().getTime()
                      lastVerb = GameVerb.Goal;
                      const body = [
                        {
                          verb: lastVerb,
                          timestamp: lastTimeStamp,
                          team_id: selectedTeam,
                        },
                      ];
                      addGameRecordDetail(gameObj.game_id, body);
                    }
                  }}>
                    <LinearGradient
                    colors={[colors.yellowColor, colors.themeColor]}
                    style={styles.plusButton}>
                      <Image source={images.gamePlus} style={styles.gamePlus} />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={() => {
                    if (gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset) {
                      Alert.alert('Game not started yet.');
                    } else if (gameObj.status === GameStatus.ended) {
                      Alert.alert('Game is ended.');
                    } else if (!selectedTeam) {
                      Alert.alert('Select Team');
                    } else if (
                      selectedTeam === gameObj.home_team.group_id
                      && gameObj.home_team_goal <= 0
                    ) {
                      Alert.alert('Goal not added yet.');
                    } else if (
                      selectedTeam === gameObj.away_team.group_id
                      && gameObj.away_team_goal <= 0
                    ) {
                      Alert.alert('Goal not added yet.');
                    } else {
                      Alert.alert(
                        'The recent goal will be cancelled.',
                        '',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Ok',
                            style: 'default',
                            onPress: () => {
                              decreaseGameScoreRecord(
                                selectedTeam,
                                gameObj.game_id,
                              );
                            },
                          },
                        ],
                        { cancelable: false },
                      );
                    }
                  }}>
                    <Image
                    source={images.deleteRecentGoal}
                    style={styles.gameMinus}
                  />
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </View>
          <View>
            <View style={{ flex: 1 }} />
            <View style={styles.bottomLine}></View>
            <View style={styles.gameRecordButtonView}>
              {gameObj.status === GameStatus.accepted && (
                <TCGameButton
                  title="Start"
                  onPress={() => {
                    if (
                      gameObj.challenge_status
                      && gameObj.challenge_status
                        === ReservationStatus.pendingrequestpayment
                    ) {
                      Alert.alert(
                        'Game cannot be start unless the payment goes through',
                      );
                    } else {
                      lastTimeStamp = date ? date.getTime() : new Date().getTime();
                      lastVerb = GameVerb.Start;
                      const body = [
                        {
                          verb: lastVerb,
                          timestamp: lastTimeStamp,
                          team_id: actionByTeamID,
                        },
                      ];
                      addGameRecordDetail(gameObj.game_id, body);
                    }
                  }}
                  gradientColor={[colors.yellowColor, colors.themeColor]}
                  imageName={images.gameStart}
                  textColor={colors.themeColor}
                  imageSize={16}
                />
              )}
              {gameObj.status === GameStatus.paused && (
                <TCGameButton
                  title="Resume"
                  onPress={() => {
                    lastTimeStamp = new Date().getTime();
                    lastVerb = GameVerb.Resume;
                    const body = [
                      {
                        verb: lastVerb,
                        timestamp: lastTimeStamp,
                        team_id: actionByTeamID,
                      },
                    ];
                    addGameRecordDetail(gameObj.game_id, body);
                  }}
                  gradientColor={[colors.yellowColor, colors.themeColor]}
                  imageName={images.gameStart}
                  textColor={colors.themeColor}
                  imageSize={16}
                />
              )}
              {(gameObj.status === GameStatus.playing
                || gameObj.status === GameStatus.resume) && (
                  <TCGameButton
                  title="Pause"
                  onPress={() => {
                    lastTimeStamp = new Date().getTime();
                    lastVerb = GameVerb.Pause;
                    const body = [
                      {
                        verb: lastVerb,
                        timestamp: lastTimeStamp,
                        team_id: actionByTeamID,
                      },
                    ];
                    addGameRecordDetail(gameObj.game_id, body);
                  }}
                  gradientColor={[colors.yellowColor, colors.themeColor]}
                  imageName={images.gamePause}
                  textColor={colors.themeColor}
                  imageSize={15}
                />
              )}
              {(gameObj.status === GameStatus.playing
                || gameObj.status === GameStatus.paused
                || gameObj.status === GameStatus.resume) && (
                  <TCGameButton
                  title="Match End"
                  onPress={() => {
                    lastTimeStamp = new Date().getTime();
                    lastVerb = GameVerb.End;
                    const body = [
                      {
                        verb: lastVerb,
                        timestamp: lastTimeStamp,
                        team_id: actionByTeamID,
                      },
                    ];
                    addGameRecordDetail(gameObj.game_id, body);
                  }}
                  gradientColor={[colors.yellowColor, colors.themeColor]}
                  buttonTitle={'END'}
                  buttonTextColor={colors.whiteColor}
                  textColor={colors.themeColor}
                  imageSize={15}
                />
              )}
              {(gameObj.status === GameStatus.accepted
                || gameObj.status === GameStatus.playing
                || gameObj.status === GameStatus.paused
                || gameObj.status === GameStatus.ended
                || gameObj.status === GameStatus.resume) && (
                  <TCGameButton
                  title="Records"
                  onPress={() => {
                    navigation.navigate('SoccerRecordList', {
                      gameId: gameObj.game_id,
                      gameData: gameObj,
                    });
                  }}
                  gradientColor={[colors.veryLightBlack, colors.veryLightBlack]}
                  imageName={images.gameRecord}
                  textColor={colors.darkGrayColor}
                  imageSize={25}
                />
              )}
              {(gameObj.status === GameStatus.accepted
                || gameObj.status === GameStatus.playing
                || gameObj.status === GameStatus.paused
                || gameObj.status === GameStatus.ended
                || gameObj.status === GameStatus.resume) && (
                  <TCGameButton
                  title="Details"
                  onPress={() => {
                    clearInterval(timer)
                    navigation.navigate('GameDetailRecord', {
                      gameObject: gameObj,
                      gameId: gameObj.game_id,
                    });
                  }}
                  gradientColor={[
                    colors.greenGradientStart,
                    colors.greenGradientEnd,
                  ]}
                  imageName={images.gameDetail}
                  textColor={colors.gameDetailColor}
                  imageSize={30}
                />
              )}
            </View>
          </View>
          <ActionSheet
            ref={actionSheet}
            // title={'News Feed Post'}
            options={[
              'Edit Roster and Non-roster',
              'Reset Match Records',
              'Cancel',
            ]}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('EditRosterScreen', {
                  gameObj,
                  selectedTeam: 'home',
                })
              } else if (index === 1) {
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
                        if (gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset) {
                          Alert.alert('Game not started yet.');
                        } else if (gameObj.status === GameStatus.ended) {
                          Alert.alert('Game is ended.');
                        } else {
                          resetGameDetail(gameObj.game_id);
                        }
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bottomLine: {
    // position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },

  centerText: {
    fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    alignItems: 'center',
    width: wp('22%'),
  },
  curruentTimeImg: {
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  curruentTimeView: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    elevation: 10,
    height: 30,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    shadowColor: colors.googleColor,

    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: 30,
  },
  downArrow: {
    height: 12,
    marginLeft: 10,
    marginRight: 15,

    resizeMode: 'contain',
    width: 12,
  },
  entityView: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameMinus: {
    height: 35,
    resizeMode: 'contain',
    width: 35,
  },
  gamePlus: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  gameRecordButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
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
    backgroundColor: colors.whiteColor,
    elevation: 10,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '100%',
  },
  leftEntityView: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 10,
    height: 183,
    marginLeft: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('37%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  mainContainer: {
    flex: 1,
  },
  plusButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,

    elevation: 10,
    height: 80,
    justifyContent: 'center',
    marginLeft: 60,
    marginRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    width: 80,
  },
  plusMinusView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',

  },
  profileImg: {
    borderRadius: 15,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
    resizeMode: 'cover',
    width: 30,
  },
  teamProfileView: {
    borderRadius: 30,
    marginBottom: 15,
    height: 60,
    width: 60,
    resizeMode: 'cover',
  },
  profileShadow: {
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  rightEntityView: {

    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    height: 183,
    marginRight: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('37%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('40%'),
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    bottom: 0,
    height: 0.5,
    position: 'absolute',
    width: wp('100%'),
  },
  startTime: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  timeView: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
  },
  timer: {
    fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
    color: colors.lightBlackColor,
  },
  vs: {
    alignSelf: 'center',
    fontFamily: fonts.RLight,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  teamNameText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
  },
  teamNameTextBlack: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
});
