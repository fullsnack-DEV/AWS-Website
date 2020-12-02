import React, {
  useLayoutEffect, useState, useEffect, useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import * as Utility from '../../../utils/index';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCGameButton from '../../../components/TCGameButton';
import {
  getGameByGameID, addGameRecord, resetGame, decreaseGameScore,
} from '../../../api/Games';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

let entity = {};
let lastTimeStamp;
let lastVerb;
export default function SoccerRecording({ navigation, route }) {
  const actionSheet = useRef();
  const [loading, setloading] = useState(false);
  const [actionByTeamID, setActionByTeamID] = useState();
  const [pickerShow, setPickerShow] = useState(false);
  const [gameObj, setGameObj] = useState();
  const [selectedTeam, setSelectedTeam] = useState();

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
    };
    getAuthEntity();
    if (route && route.params && route.params.gameId) {
      getGameDetail(route.params.gameId);
    }
  }, []);

  useEffect(() => () => {
    console.log('cleaned up');
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => actionSheet.current.show()}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const getGameDetail = (gameId) => {
    getGameByGameID(gameId)
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
        console.log('GAME RESPONSE::', response.payload);
      })
      .catch((e) => Alert.alert(e.messages));
  };
  const resetGameDetail = (gameId) => {
    resetGame(gameId)
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
        console.log('RESET GAME RESPONSE::', response.payload);
      })
      .catch((e) => Alert.alert(e.messages));
  };
  const decreaseGameScoreRecord = (teamId, gameId) => {
    decreaseGameScore(teamId, gameId)
      .then((response) => {
        if ((selectedTeam === gameObj.home_team.group_id)) {
          setGameObj({
            ...gameObj,
            home_team_goal: gameObj.home_team_goal - 1,
          });
        } else if ((selectedTeam === gameObj.away_team.group_id)) {
          setGameObj({
            ...gameObj,
            away_team_goal: gameObj.away_team_goal - 1,
          });
        }
        console.log('DECREASE GAME RESPONSE::', response.payload);
      })
      .catch((e) => Alert.alert(e.messages));
  };
  const addGameRecordDetail = (gameId, params) => {
    setloading(true);
    addGameRecord(gameId, params)
      .then((response) => {
        setloading(false);
        if (lastVerb === GameVerb.Goal) {
          console.log('Goal');
        } else if (lastVerb === GameVerb.Start) {
          setGameObj({
            ...gameObj,
            actual_startdatetime: lastTimeStamp,
            status: GameStatus.playing,
          });
        } else if (lastVerb === GameVerb.Pause) {
          setGameObj({
            ...gameObj,
            pause_datetime: lastTimeStamp,
            status: GameStatus.paused,
          });
        } else if (lastVerb === GameVerb.Resume) {
          setGameObj({ ...gameObj, status: GameStatus.resume });
        } else if (lastVerb === GameVerb.End) {
          setGameObj({
            ...gameObj,
            actual_enddatetime: lastTimeStamp,
            status: GameStatus.ended,
          });
        }
        console.log('GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };
  // const resizeLeftTeamView = () => {
  //   if (Platform.OS === 'ios') {
  //     if (!pickerShow) {
  //       return ([styles.leftEntityView, { height: hp('30%') }])
  //     }
  //     return ([styles.leftEntityView, { height: hp('15%') }])
  //   }
  //   return (styles.leftEntityView)
  // }
  // const resizerightTeamView = () => {
  //   if (Platform.OS === 'ios') {
  //     if (!pickerShow) {
  //       return ([styles.rightEntityView, { height: hp('30%') }])
  //     }
  //     return ([styles.rightEntityView, { height: hp('15%') }])
  //   }
  //   return (styles.rightEntityView)
  // }
  return (
    <>
      {gameObj && (
        <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <View>
            <View style={styles.headerView}>
              {gameObj && gameObj.home_team && <View style={styles.leftView}>
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
                {gameObj.home_team.group_name && <Text style={styles.leftText} numberOfLines={2}>
                  {gameObj.home_team.group_name}
                </Text>}

              </View>}

              <View style={styles.centerView}>
                <Text style={styles.centerText}>{gameObj.home_team_goal} : {gameObj.away_team_goal}</Text>
              </View>
              {gameObj && gameObj.away_team && <View style={styles.rightView}>
                {gameObj.away_team.group_name && <Text style={styles.rightText} numberOfLines={2}>
                  {gameObj.away_team.group_name}
                </Text>}
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
              </View>}

            </View>

            <View style={styles.timeView}>
              <Text style={styles.timer}>90 : 00 : 00</Text>
              {pickerShow && (
                <View style={styles.curruentTimeView}>
                  <Image
                    source={images.curruentTime}
                    style={styles.curruentTimeImg}
                  />
                </View>
              )}

              <Text
                style={styles.startTime}
                onPress={() => {
                  setPickerShow(!pickerShow);
                }}>
                Game start at now
              </Text>
              <Image source={images.dropDownArrow} style={styles.downArrow} />

              <View style={styles.separatorLine}></View>
            </View>
            {pickerShow && (
              <View>
                <RNDateTimePicker value={new Date()} mode={'datetime'} />
                <View style={styles.separatorLine} />
              </View>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={styles.entityView}>
              <TouchableOpacity onPress={() => setSelectedTeam(gameObj.home_team.group_id)}>
                {selectedTeam === gameObj.home_team.group_id ? (
                  <LinearGradient
                    colors={
                      selectedTeam === gameObj.home_team.group_id
                        ? [colors.yellowColor, colors.themeColor]
                        : [colors.whiteColor, colors.whiteColor]
                    }
                    style={
                      // eslint-disable-next-line no-nested-ternary
                      Platform.OS === 'ios'
                        ? !pickerShow
                          ? [styles.leftEntityView, { height: hp('30%') }]
                          : [styles.leftEntityView, { height: hp('15%') }]
                        : styles.leftEntityView
                    }>
                    <Image
                      source={
                        gameObj && gameObj.home_team && gameObj.home_team.thumbnail
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
                      // eslint-disable-next-line no-nested-ternary
                      Platform.OS === 'ios'
                        ? !pickerShow
                          ? [styles.leftEntityView, { height: hp('30%') }]
                          : [styles.leftEntityView, { height: hp('15%') }]
                        : styles.leftEntityView
                    }>
                    <Image
                      source={
                        gameObj && gameObj.home_team && gameObj.home_team.thumbnail
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

              <TouchableOpacity onPress={() => setSelectedTeam(gameObj.away_team.group_id)}>
                {selectedTeam === gameObj.away_team.group_id ? (
                  <LinearGradient
                    colors={
                      selectedTeam === gameObj.away_team.group_id
                        ? [colors.yellowColor, colors.themeColor]
                        : [colors.whiteColor, colors.whiteColor]
                    }
                    style={
                      // eslint-disable-next-line no-nested-ternary
                      Platform.OS === 'ios'
                        ? !pickerShow
                          ? [styles.rightEntityView, { height: hp('30%') }]
                          : [styles.rightEntityView, { height: hp('15%') }]
                        : styles.rightEntityView
                    }>
                    <Image
                      source={
                        gameObj && gameObj.away_team && gameObj.away_team.thumbnail
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
                      // eslint-disable-next-line no-nested-ternary
                      Platform.OS === 'ios'
                        ? !pickerShow
                          ? [styles.rightEntityView, { height: hp('30%') }]
                          : [styles.rightEntityView, { height: hp('15%') }]
                        : styles.rightEntityView
                    }>
                    <Image
                      source={
                        gameObj && gameObj.away_team && gameObj.away_team.thumbnail
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
                <TouchableOpacity onPress={() => {
                  if (gameObj.status === GameStatus.accepted) {
                    Alert.alert('Game not started yet.')
                  } else if (gameObj.status === GameStatus.ended) {
                    Alert.alert('Game is ended.')
                  } else if (!selectedTeam) {
                    Alert.alert('Select Team')
                  } else {
                    lastTimeStamp = new Date().getTime();
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
                <TouchableOpacity onPress={() => {
                  if (gameObj.status === GameStatus.accepted) {
                    Alert.alert('Game not started yet.')
                  } else if (gameObj.status === GameStatus.ended) {
                    Alert.alert('Game is ended.')
                  } else if (!selectedTeam) {
                    Alert.alert('Select Team')
                  } else if ((selectedTeam === gameObj.home_team.group_id) && (gameObj.home_team_goal <= 0)) {
                    Alert.alert('Goal not added yet.')
                  } else if ((selectedTeam === gameObj.away_team.group_id) && (gameObj.away_team_goal <= 0)) {
                    Alert.alert('Goal not added yet.')
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
                            decreaseGameScoreRecord(selectedTeam, gameObj.game_id);
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
                      lastTimeStamp = new Date().getTime();
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
                  imageSize={24}
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
                  imageSize={24}
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
                    navigation.navigate('GameDetailRecord', {
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
                console.log('o');
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
                        if (gameObj.status === GameStatus.accepted) {
                          Alert.alert('Game not started yet.')
                        } else if (gameObj.status === GameStatus.ended) {
                          Alert.alert('Game is ended.')
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
    width: wp('20%'),
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
    marginTop: '10%',
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
    height: '30%',
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
    marginBottom: 20,
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
    height: '30%',
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
