/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ActionSheet from 'react-native-actionsheet';
import * as Utils from '../../challenge/ChallengeUtility';
import { toggleView, heightPercentageToDP as hp } from '../../../utils/index'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCGameButton from '../../../components/TCGameButton';

import {
  resetGame,
  getGameByGameID,
  decreaseGameScore,
  addGameRecord,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import TennisScoreView from '../../../components/game/tennis/TennisScoreView';
import strings from '../../../Constants/String';

import TennisMatchRecordsList from './TennisMatchRecordsList';

const { width } = Dimensions.get('window');

const recordButtonList = [
  'General',
  'Ace',
  'Winner',
  'Unforced',
  'Fault',
  'Foot Fault',
  'Let',
];
let entity = {};
let timer, timerForTimeline;
let lastTimeStamp;
let lastVerb;
let homeTeamGamePoint = 0;
let awayTeamGamePoint = 0;
const opetions = ['End Match', 'Cancel'];
export default function TennisRecording({ navigation, route }) {
  const isFocused = useIsFocused();
  const actionSheet = useRef();
  const scrollView = useRef();
  const headerActionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [pickerShow, setPickerShow] = useState(false);
  const [timelineTimer, setTimelineTimer] = useState('00 : 00 : 00');
  const [detailRecording, setDetailRecording] = useState(false);
  const [gameObj, setGameObj] = useState();
  const [player1Selected, setPlayer1Selected] = useState(false);
  const [player2Selected, setPlayer2Selected] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [homeTeamMatchPoint, setHomeMatchPoint] = useState(0);
  const [awayTeamMatchPoint, setAwayMatchPoint] = useState(0);
  const [servingTeamID, setServingTeamID] = useState();
  const [date, setDate] = useState();
  const [actionByTeamID, setActionByTeamID] = useState();
  const [loading, setloading] = useState(false);
  const [footerUp, setFooterUp] = useState(true);
  const [isServingPressed, setIsServingPressed] = useState(false);

  const [gameData] = useState(route?.params?.gameDetail);

  const [showToast, setShowToast] = useState(false);
  const [undoTeamID, setUndoTeamID] = useState();
  useEffect(() => {
    clearInterval(timer);
    clearInterval(timerForTimeline);
    // const { gameDetail } = route.params ?? {};
    entity = authContext.entity;
    console.log(entity);
    if (route && route.params && route.params.gameDetail) {
      getGameDetail(route.params.gameDetail.game_id, true);
      console.log('GAME DATA:', JSON.stringify(route.params.gameDetail));
      setloading(false);
      setTimelineTimer('00 : 00 : 00');
      // setGameObj(route?.params?.gameDetail)
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => headerActionSheet.current.show()}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, date, gameObj]);

  // useFocusEffect(() => {
  //   getGameDetailFrequently()
  //   startStopTimerTimeline();
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useFocusEffect(() => {
    timer = setInterval(() => {
      if (gameObj && gameObj.status !== GameStatus.ended) {
        getGameDetail(route?.params?.gameDetail?.game_id, false);
      }
    }, 3000);

    timerForTimeline = setInterval(() => {
      startStopTimerTimeline()
    }, 1000);

    return () => {
      clearInterval(timer)
      clearInterval(timerForTimeline)
    }
  }, [])

  const configurePeriodOpetions = (data) => {
    if (data?.scoreboard?.game_inprogress) {
      if (
        !(
          data?.scoreboard?.game_inprogress?.winner
          || data?.scoreboard?.game_inprogress?.end_datetime
        )
      ) {
        opetions.unshift('End Game');
      }
      const reverseData = data?.scoreboard?.sets.reverse();
      if (!(reverseData[0].winner || reverseData[0].end_datetime)) {
        opetions.unshift('End Set');
      }
    }
  };
  const defineServingTeamID = (data) => {
    console.log('serving:', isServingPressed);
    if (!isServingPressed) {
      if (data?.scoreboard?.game_inprogress && data?.scoreboard?.game_inprogress?.serving_team_id) {
        const tempServingID = data?.scoreboard?.game_inprogress?.serving_team_id
        if (data?.scoreboard?.game_inprogress?.winner || data?.scoreboard?.game_inprogress?.end_datetime) {
          if (tempServingID === data?.home_team?.user_id) {
            setServingTeamID(data?.away_team?.user_id);
          } else {
            setServingTeamID(data?.home_team?.user_id);
          }
        } else {
          setServingTeamID(tempServingID);
        }
      } else {
        setServingTeamID(data?.home_team?.user_id);
      }
    }
  };
  const calculateMatchScore = () => {
    setHomeMatchPoint(0);
    setAwayMatchPoint(0);
    let homePoint = 0;
    let awayPoint = 0;
    console.log('SETS::->', gameObj?.scoreboard?.sets);
    (gameObj?.scoreboard?.sets || []).map((e) => {
      if (e?.winner) {
        if (e.winner === gameObj?.home_team?.user_id) {
          homePoint += 1;
          console.log('SETS NO::->', homePoint);
          // setHomeMatchPoint(homeTeamMatchPoint + 1)
        } else {
          awayPoint += 1;
          // setAwayMatchPoint(awayTeamMatchPoint + 1)
        }
      }
      setHomeMatchPoint(homePoint);
      setAwayMatchPoint(awayPoint);
    });
  };
  const calculateGameScore = (data) => {
    // eslint-disable-next-line array-callback-return
    if (
      data?.scoreboard?.game_inprogress?.winner
      || data?.scoreboard?.game_inprogress?.end_datetime
    ) {
      homeTeamGamePoint = 0;
      awayTeamGamePoint = 0;
    } else {
      homeTeamGamePoint = data?.scoreboard?.game_inprogress?.home_team_point || 0;
      awayTeamGamePoint = data?.scoreboard?.game_inprogress?.away_team_point || 0;
    }
  };
  const validate = () => {
    if (
      gameObj.status === GameStatus.accepted
      || gameObj.status === GameStatus.reset
    ) {
      Alert.alert('Please, start the game first.');
      return false;
    }
    if (gameObj.status === GameStatus.ended) {
      Alert.alert('Game is ended.');
      return false;
    }
    if (gameObj.status === GameStatus.paused) {
      Alert.alert('Game is paused.');
      return false;
    }
    if (!selectedTeam) {
      Alert.alert('Please, select a player first');
      return false;
    }
    return true;
  };
  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('hh : mm a, MMM DD');
  };
  const openToast = () => {
    toggleView(() => setShowToast(true), 500)
    setTimeout(() => { toggleView(() => setShowToast(false), 500) }, 5000)
  }
  const renderGameButton = ({ item }) => (
    <TCGameButton
      title={item}
      onPress={() => {
        if (validate()) {
          openToast()
          if (item === 'General') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.Score;
          } else if (item === 'Ace') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.Ace;
          } else if (item === 'Winner') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.Winner;
          } else if (item === 'Unforced') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.Unforced;
          } else if (item === 'Fault') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.Fault;
          } else if (item === 'Foot Fault') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.FeetFault;
          } else if (item === 'Let') {
            lastTimeStamp = date ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0) : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.LetScore;
          }
          let body = [{}];
          body = [
            {
              verb: lastVerb,
              timestamp: lastTimeStamp,
              team_id: selectedTeam,
              doneBy: selectedTeam,
              serving_team_id: servingTeamID,
            },
          ];
          setUndoTeamID(selectedTeam)
          addGameRecordDetail(gameObj.game_id, body);
        }
      }}
      buttonColor={colors.whiteColor}
      imageName={
        (item === 'General' && images.tennisGeneral)
        || (item === 'Ace' && images.tennisAce)
        || (item === 'Winner' && images.tennisWinner)
        || (item === 'Unforced' && images.tennisUnForced)
        || (item === 'Fault' && images.tennisFault)
        || (item === 'Foot Fault' && images.tennisFootFault)
        || (item === 'Let' && images.tennisLet)
      }
      textColor={colors.googleColor}
      imageSize={32}
    />
  );
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setPickerShow(Platform.OS === 'ios');
    setDate(currentDate);
    startStopTimerTimeline();
  };
  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let breakTime = 0;
    if (gameObj && gameObj.breakTime) {
      breakTime = gameObj.breakTime / 1000;
    }
    if (date) {
      // eslint-disable-next-line no-param-reassign
      eDate = date;
    }

    const tempDate = new Date(eDate);
    tempDate.setMinutes(tempDate.getMinutes() + breakTime);
    let delta = Math.abs(new Date(sDate).getTime() - new Date(tempDate).getTime()) / 1000;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = Math.floor(delta % 60);

    if (hours >= 99) {
      return '99 : 00 : 00';
    }
    let hr, min, sec;
    if (hours <= 9) {
      hr = `0${hours}`;
    } else {
      hr = hours;
    }
    if (minutes <= 9) {
      min = `0${minutes}`;
    } else {
      min = minutes;
    }
    if (seconds <= 9) {
      sec = `0${seconds}`;
    } else {
      sec = seconds;
    }
    return `${hr} : ${min} : ${sec}`;
  };
  const getMessageText = () => {
    let name;
    let verbString;
    if (gameObj?.home_team?.user_id === selectedTeam) {
      name = `${gameObj?.home_team?.first_name} ${gameObj?.home_team?.last_name}`
    } else {
      name = `${gameObj?.away_team?.first_name} ${gameObj?.away_team?.last_name}`
    }
    if (lastVerb === GameVerb.Score) {
      verbString = 'score a point'
    } else if (lastVerb === GameVerb.Ace) {
      verbString = 'smacked an ace'
    } else if (lastVerb === GameVerb.Winner) {
      verbString = 'marked as a winner'
    } else if (lastVerb === GameVerb.Unforced) {
      verbString = 'done an unforced error'
    } else if (lastVerb === GameVerb.FeetFault) {
      verbString = 'committed a feet fault'
    } else if (lastVerb === GameVerb.Fault) {
      verbString = 'committed a fault'
    } else if (lastVerb === GameVerb.LetScore) {
      verbString = 'committed a let'
    }
    return `${name} ${verbString}`
  }
  const startStopTimerTimeline = () => {
    // clearInterval(timer);
    // clearInterval(timerForTimeline);
    if (gameObj && gameObj.status === GameStatus.ended) {
      setTimelineTimer(
        getTimeDifferent(
          gameObj && gameObj.actual_enddatetime && gameObj.actual_enddatetime * 1000,
          gameObj
            && gameObj.actual_startdatetime
            && gameObj.actual_startdatetime * 1000,
        ),
      );
    } else if (
      (gameObj && gameObj.status === GameStatus.accepted)
      || (gameObj && gameObj.status === GameStatus.reset)
    ) {
      setTimelineTimer(
        getTimeDifferent(new Date().getTime(), new Date().getTime()),
      );
    } else if (gameObj && gameObj.status === GameStatus.paused) {
      setTimelineTimer(
        getTimeDifferent(
          gameObj && gameObj.pause_datetime && gameObj.pause_datetime * 1000,
          gameObj
            && gameObj.actual_startdatetime
            && gameObj.actual_startdatetime * 1000,
        ),
      );
    } else if (date) {
      setTimelineTimer(
        getTimeDifferent(
          gameObj
            && gameObj.actual_startdatetime
            && gameObj.actual_startdatetime * 1000,
          new Date(date).getTime(),
        ),
      );
    } else {
      // console.log(`Date:${new Date().getTime()}:gameObj.actual_startdatetime:${gameObj.actual_startdatetime * 1000}`);
      setTimelineTimer(
        getTimeDifferent(
          new Date().getTime(),
          gameObj
                && gameObj.actual_startdatetime
                && gameObj.actual_startdatetime * 1000,
        ),
      );
    }
  };
  const resetGameDetail = (gameId) => {
    setloading(true);
    resetGame(gameId, authContext)
      .then((response) => {
        getGameDetail(gameId, true);
        startStopTimerTimeline();
        setloading(false);
        setDate();
        console.log('RESET GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const getGameDetail = (gameId, isLoading) => {
    if (isLoading) {
      setloading(true);
    }
    getGameByGameID(gameId, authContext)
      .then((response) => {
        console.log('GAME RESPONSE::', JSON.stringify(response.payload));
        setGameObj(response.payload);

        if (
          entity
          === (gameObj?.home_team?.group_id || gameObj?.home_team?.user_id)
        ) {
          setActionByTeamID(
            gameObj?.home_team?.group_id || gameObj?.home_team?.user_id,
          );
        } else {
          setActionByTeamID(
            gameObj?.away_team?.group_id || gameObj?.away_team?.user_id,
          );
        }
        calculateMatchScore();
        calculateGameScore(response.payload);

        defineServingTeamID(response.payload);

        configurePeriodOpetions(response.payload);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const decreaseGameScoreRecord = (teamId, gameId) => {
    setloading(true);
    decreaseGameScore(teamId, gameId, authContext)
      .then((response) => {
        if (
          selectedTeam
          === (gameObj?.home_team?.group_id || gameObj?.home_team?.user_id)
        ) {
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
        setloading(false);
        console.log('DECREASE GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const addGameRecordDetail = (gameId, params) => {
    setloading(true);
    addGameRecord(gameId, params, authContext)
      .then((response) => {
        setIsServingPressed(false)
        console.log('response of game record::', response);
        setloading(false);
        setDate();
        if (lastVerb === GameVerb.Goal) {
          if (
            selectedTeam
            === (gameObj?.home_team?.group_id || gameObj?.home_team?.user_id)
          ) {
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
          startStopTimerTimeline();
        } else if (lastVerb === GameVerb.Pause) {
          setGameObj({
            ...gameObj,
            pause_datetime: lastTimeStamp,
            status: GameStatus.paused,
          });
          startStopTimerTimeline();
        } else if (lastVerb === GameVerb.Resume) {
          setGameObj({ ...gameObj, status: GameStatus.resume });
          startStopTimerTimeline();
        } else if (lastVerb === GameVerb.End) {
          setGameObj({
            ...gameObj,
            actual_enddatetime: lastTimeStamp,
            status: GameStatus.ended,
          });
          startStopTimerTimeline();
        }
        getGameDetail(gameId, true);
        console.log('GAME RESPONSE::', response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const matchEnd = () => {
    if (
      gameObj.status === GameStatus.accepted
      || gameObj.status === GameStatus.reset
    ) {
      Alert.alert('Please, start the game first.');
    } else if (gameObj.status === GameStatus.ended) {
      Alert.alert('Game is ended.');
    } else {
      lastTimeStamp = parseFloat(new Date().getTime() / 1000).toFixed(0);
      lastVerb = GameVerb.End;
      const body = [
        {
          verb: lastVerb,
          timestamp: lastTimeStamp,
          team_id: actionByTeamID,
        },
      ];
      addGameRecordDetail(gameObj.game_id, body);
    }
  };

  const handleHorizontalScroll = (event) => {
    const WIDTH = wp(100);
    const offset = event.nativeEvent.contentOffset;
    if (offset) {
      const page = Math.round(offset.x / WIDTH) + 1;
      if (page === 1) {
        toggleView(() => setFooterUp(true), 200);
      } else {
        toggleView(() => setFooterUp(false), 200);
      }
    }
  }
  return (
    <>
      {gameObj && gameObj?.home_team && gameObj?.away_team && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ActivityLoader visible={loading} />
            <View style={styles.headerView}>
              <View style={styles.leftView}>
                <View style={styles.profileShadow}>
                  <Image
                    source={
                      gameObj?.home_team?.thumbnail
                        ? { uri: gameObj?.home_team?.thumbnail }
                        : images.profilePlaceHolder
                    }
                    style={
                      servingTeamID === gameObj.home_team.user_id
                        ? styles.profileImg
                        : [styles.profileImg, { borderColor: colors.themeColor }]
                    }
                  />
                </View>
                <Text style={styles.leftText} numberOfLines={2}>
                  {gameObj.home_team.first_name} {gameObj.home_team.last_name}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  let canChange = false;
                  if (!gameObj?.scoreboard?.game_inprogress) {
                    canChange = true;
                  } else if (!gameObj?.scoreboard?.game_inprogress?.winner) {
                    canChange = false;
                  } else {
                    canChange = true;
                  }
                  if (!canChange) {
                    Alert.alert(strings.canNotChangeServing)
                  } else {
                    Alert.alert(
                      'Do you want to change the serving player?',
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
                            if (gameObj?.game_inprogress?.winner) {
                              Alert.alert(
                                'You can not change serving player during game.',
                              );
                            } else if (
                              gameObj?.home_team?.user_id === servingTeamID
                            ) {
                              setServingTeamID(gameObj?.away_team?.user_id);
                            } else {
                              setServingTeamID(gameObj?.home_team?.user_id);
                            }
                            setIsServingPressed(true)
                            console.log('OK Pressed');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}>
                <View>
                  <Text style={styles.centerSetText}>SET SCORES</Text>
                  <View style={styles.centerView}>
                    <Text style={styles.centerText}>{homeTeamMatchPoint}</Text>
                    <Image
                      source={
                        servingTeamID === gameObj.home_team.user_id
                          ? images.tennisArrowLeft
                          : images.tennisArrowRight
                      }
                      style={styles.orangeArrow}
                    />
                    <Text style={styles.centerText}>{awayTeamMatchPoint}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.rightView}>
                <Text style={styles.rightText} numberOfLines={2}>
                  {gameObj.away_team.first_name} {gameObj.away_team.last_name}
                </Text>
                <View style={styles.profileShadow}>
                  <Image
                    source={
                      gameObj?.away_team?.thumbnail
                        ? { uri: gameObj?.away_team?.thumbnail }
                        : images.profilePlaceHolder
                    }
                    style={
                      servingTeamID === gameObj.away_team.user_id
                        ? styles.profileImg
                        : [styles.profileImg, { borderColor: colors.themeColor }]
                    }
                  />
                </View>
              </View>
            </View>
            {/* <ScrollView style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'red',
            }} horizontal={true}
           decelerationRate={0}
          snapToInterval={Dimensions.get('window').width - 60}
            snapToAlignment={'center'}
            >

              <TennisScoreView scoreDataSource={gameObj}/>

            </ScrollView> */}
            {showToast && <LinearGradient
                    colors={[colors.yellowColor, colors.themeColor]}
                    style={styles.messageToast}>
              <View style={{

                flexDirection: 'row',
                width: '100%',
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
                <View style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', width: '100%',
                }}>
                  <View style={styles.gameRecordButton}>
                    <View
                          colors={colors.whiteColor}
                          style={styles.gameRecordButton}>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.messageText}>{getMessageText()}</Text>
                  <TouchableOpacity onPress={() => {
                    decreaseGameScoreRecord(
                      undoTeamID,
                      gameObj.game_id,
                    );
                    getGameDetail(gameObj.game_id, true);
                  }}>
                    <Image
                  source={images.undoImage}
                  style={{
                    width: 13,
                    height: 13,
                    tintColor: colors.whiteColor,
                    marginRight: 1,
                  }}
                />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
                  setShowToast(false)
                  // decreaseGameScoreRecord(
                  //   selectedTeam,
                  //   gameObj.game_id,
                  // );
                }}>
                  <Image
                  source={images.cancelImage}
                  style={{
                    width: 13,
                    height: 13,
                    tintColor: colors.whiteColor,
                    marginRight: 1,
                  }}
                />
                </TouchableOpacity>
              </View>
            </LinearGradient>}

            <ScrollView
                onMomentumScrollEnd={handleHorizontalScroll}
              ref={scrollView}
              style={styles.container}
              pagingEnabled={true}
              horizontal= {true}
              showsHorizontalScrollIndicator={false}
              decelerationRate={0}
              snapToInterval={width}
              snapToAlignment={'center'}
              contentInset={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}>

              <View style={styles.view}>
                <TennisScoreView scoreDataSource={gameObj}/>
              </View>
              <View style={styles.view2}>
                <TennisMatchRecordsList matchData={gameData} visibleSetScore={false}/>
              </View>
            </ScrollView>
          </View>

          {gameObj && (
            <View style={styles.bottomView}>
              <View style={styles.timeView}>
                <Text style={styles.timer}>{timelineTimer}</Text>

                {pickerShow && (
                  <View style={styles.curruentTimeView}>
                    <TouchableOpacity
                      onPress={() => {
                        setDate();
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
                  {(gameObj
                    && gameObj.status
                    && gameObj.status === GameStatus.accepted)
                  || (gameObj
                    && gameObj.status
                    && gameObj.status === GameStatus.reset)
                    ? 'Game start at now'
                    : getDateFormat(
                      date ? new Date(date.getTime()) : new Date(),
                    )}
                </Text>
                <TouchableOpacity onPress={() => {
                  console.log('Arrow Pressed.');
                  toggleView(() => setFooterUp(!footerUp), 200)
                }}>
                  <Image source={images.dropDownArrow} style={styles.downArrow} />
                </TouchableOpacity>
                {footerUp && <View style={styles.separatorLine}></View>}
              </View>
              {footerUp && <View>
                {pickerShow && (
                  <View>
                    <RNDateTimePicker
                    locale={'en'}
                    display="spinner"
                    value={date || new Date()}
                    onChange={onChange}
                    mode={'datetime'}
                    minimumDate={gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset ? new Date() : new Date(gameObj.actual_startdatetime * 1000)}
                    maximumDate={new Date()}
                    // gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset ? new Date(1950, 0, 1) : new Date()
                  />
                  </View>
                )}
                <View style={styles.middleViewContainer}>
                  <TouchableWithoutFeedback
                  style={styles.playerView}
                  onPress={() => {
                    setPlayer2Selected(false);
                    setPlayer1Selected(true);
                    setSelectedTeam(gameObj.home_team.user_id);
                    setActionByTeamID(gameObj.home_team.user_id);
                  }}>
                    {player1Selected ? (
                      <LinearGradient
                      colors={[colors.yellowColor, colors.themeColor]}
                      style={styles.playerView}>
                        <Image
                        source={
                          gameObj?.home_team?.thumbnail
                            ? { uri: gameObj?.home_team?.thumbnail }
                            : images.profilePlaceHolder
                        }
                        style={styles.playerProfile}
                      />
                        <Text style={styles.selectedPlayerNameText}>
                          {gameObj?.home_team?.first_name}{' '}
                          {gameObj?.home_team?.last_name}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.playerView}>
                        <Image
                        source={
                          gameObj?.home_team?.thumbnail
                            ? { uri: gameObj?.home_team?.thumbnail }
                            : images.profilePlaceHolder
                        }
                        style={styles.playerProfile}
                      />
                        <Text style={styles.playerNameText}>
                          {gameObj?.home_team?.first_name}{' '}
                          {gameObj?.home_team?.last_name}
                        </Text>
                      </View>
                    )}
                  </TouchableWithoutFeedback>
                  <Text style={{ marginLeft: 10, marginRight: 10 }}>:</Text>
                  <TouchableWithoutFeedback
                  style={styles.playerView}
                  onPress={() => {
                    setPlayer1Selected(false);
                    setPlayer2Selected(true);
                    setSelectedTeam(gameObj.away_team.user_id);
                    setActionByTeamID(gameObj.away_team.user_id);
                  }}>
                    {player2Selected ? (
                      <LinearGradient
                      colors={[colors.yellowColor, colors.themeColor]}
                      style={styles.playerView}>
                        <Image
                        source={
                          gameObj?.away_team?.thumbnail
                            ? { uri: gameObj?.away_team?.thumbnail }
                            : images.profilePlaceHolder
                        }
                        style={styles.playerProfile}
                      />
                        <Text style={styles.selectedPlayerNameText}>
                          {gameObj.away_team.first_name}{' '}
                          {gameObj.away_team.last_name}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.playerView}>
                        <Image
                        source={
                          gameObj?.away_team?.thumbnail
                            ? { uri: gameObj?.away_team?.thumbnail }
                            : images.profilePlaceHolder
                        }
                        style={styles.playerProfile}
                      />
                        <Text numberOfLines={2} style={styles.playerNameText}>
                          {gameObj.away_team.first_name}{' '}
                          {gameObj.away_team.last_name}
                        </Text>
                      </View>
                    )}
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.scoreView}>
                  <Text style={styles.playerScore}>{homeTeamGamePoint}</Text>
                  <Text style={styles.playerScore}>{awayTeamGamePoint}</Text>
                </View>
                {!detailRecording && (
                  <View style={styles.plusMinusContainer}>
                    <TouchableWithoutFeedback
                    onPress={() => {
                      if (gameObj.status === GameStatus.accepted || gameObj.status === GameStatus.reset) {
                        Alert.alert('Game not started yet.');
                      } else if (gameObj.status === GameStatus.paused) {
                        Alert.alert('Game is paused.');
                      } else if (gameObj.status === GameStatus.ended) {
                        Alert.alert('Game is ended.');
                      } else if (!selectedTeam) {
                        Alert.alert('Select Team');
                      } else {
                        lastTimeStamp = date
                          ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0)
                          : parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
                        lastVerb = GameVerb.Score;
                        const body = [
                          {
                            verb: lastVerb,
                            timestamp: lastTimeStamp,
                            team_id: selectedTeam,
                            serving_team_id: servingTeamID,
                          },
                        ];
                        setUndoTeamID(selectedTeam)
                        openToast()
                        addGameRecordDetail(gameObj.game_id, body);
                      }
                    }}>
                      <Image
                      source={images.gameOrangePlus}
                      style={{
                        height: 76,
                        width: 76,
                        resizeMode: 'cover',
                        marginLeft: 50,
                      }}
                    />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                    onPress={() => {
                      if (
                        gameObj.status === GameStatus.accepted
                        || gameObj.status === GameStatus.reset
                      ) {
                        Alert.alert('Game not started yet.');
                      } else if (gameObj.status === GameStatus.paused) {
                        Alert.alert('Game is paused.');
                      } else if (gameObj.status === GameStatus.ended) {
                        Alert.alert('Game is ended.');
                      } else if (!selectedTeam) {
                        Alert.alert('Select Team');
                      } else if (
                        selectedTeam === gameObj.home_team.user_id && gameObj.home_team_goal <= 0
                      ) {
                        Alert.alert('Goal not added yet.');
                      } else if (
                        selectedTeam === gameObj.away_team.user_id
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
                                setUndoTeamID(selectedTeam)
                                getGameDetail(gameObj.game_id, true);
                              },
                            },
                          ],
                          { cancelable: false },
                        );
                      }
                    }}>
                      <Image
                      source={images.deleteRecentGoal}
                      style={{
                        height: 34,
                        width: 34,
                        resizeMode: 'cover',
                        marginLeft: 15,
                      }}
                    />
                    </TouchableWithoutFeedback>
                  </View>
                )}
                <TCThinDivider width={'100%'} />
                {detailRecording && (
                  <FlatList
                  data={recordButtonList}
                  renderItem={renderGameButton}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={
                    gameObj.status === GameStatus.accepted
                    || gameObj.status === GameStatus.reset
                    || gameObj.status === GameStatus.ended
                      ? [styles.buttonListView, { opacity: 0.4 }]
                      : styles.buttonListView
                  }
                />
                )}
                <View />
                <TCThinDivider width={'100%'} />
                <View style={styles.gameRecordButtonView}>
                  {(gameObj.status === GameStatus.accepted
                  || gameObj.status === GameStatus.reset) && (
                    <TCGameButton
                    title="Start"
                    onPress={() => {
                      if (
                        gameObj?.challenge_status
                        === (ReservationStatus.pendingrequestpayment
                          || ReservationStatus.pendingpayment)
                      ) {
                        Alert.alert(
                          'Game cannot be start unless the payment goes through',
                        );
                      } else {
                        lastTimeStamp = date
                          ? parseFloat(date.setSeconds(0, 0) / 1000).toFixed(0)
                          : parseFloat(new Date().getTime() / 1000).toFixed(0);
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
                      lastTimeStamp = parseFloat(new Date().getTime() / 1000).toFixed(0);
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
                      lastTimeStamp = parseFloat(new Date().getTime() / 1000).toFixed(0);
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
                      Alert.alert(
                        'Do you want to end match?',
                        '',
                        [
                          {
                            text: 'Cancel',
                            // style: 'cancel',
                          },
                          {
                            text: 'Ok',

                            // style: 'destructive',
                            onPress: () => {
                              matchEnd();
                            },
                          },
                        ],
                        { cancelable: false },
                      );
                    }}
                    gradientColor={[colors.yellowColor, colors.themeColor]}
                    buttonTitle={'END'}
                    buttonTextColor={colors.whiteColor}
                    textColor={colors.themeColor}
                    imageSize={15}
                  />
                  )}
                  {(gameObj.status === GameStatus.playing
                  || gameObj.status === GameStatus.resume
                  || gameObj.status === GameStatus.paused) && (
                    <TCGameButton
                    title="End"
                    onPress={() => {
                      actionSheet.current.show();
                    }}
                    gradientColor={[colors.yellowColor, colors.themeColor]}
                    buttonTitle={'PERIOD'}
                    buttonTextColor={colors.whiteColor}
                    textColor={colors.themeColor}
                    imageSize={15}
                  />
                  )}
                  <TCGameButton
                    title="Records"
                    onPress={() => {
                      toggleView(() => setFooterUp(false), 200);
                      scrollView.current?.scrollToEnd({ animated: true });
                    }}
                    gradientColor={[
                      colors.veryLightBlack,
                      colors.veryLightBlack,
                    ]}
                    imageName={images.gameRecord}
                    textColor={colors.darkGrayColor}
                    imageSize={25}
                  />
                  {(gameObj.status === GameStatus.accepted
                  || gameObj.status === GameStatus.reset
                  || gameObj.status === GameStatus.playing
                  || gameObj.status === GameStatus.paused
                  || gameObj.status !== GameStatus.ended
                  || gameObj.status === GameStatus.resume) && (
                    <TCGameButton
                    title={detailRecording ? 'Simple' : 'Detail'}
                    onPress={() => {
                      setDetailRecording(!detailRecording);
                    }}
                    gradientColor={[
                      colors.greenGradientStart,
                      colors.greenGradientEnd,
                    ]}
                    imageName={
                      detailRecording ? images.gameSimple : images.gameDetail
                    }
                    textColor={colors.gameDetailColor}
                    imageSize={30}
                  />
                  )}
                </View>
              </View>}
            </View>
          )}
        </View>
      )}
      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
        options={opetions}
        cancelButtonIndex={opetions.length + 1}
        // destructiveButtonIndex={1}
        onPress={(index) => {
          if (opetions[index] === 'End Game') {
            lastTimeStamp = parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.GameEnd;
            const body = [
              {
                verb: lastVerb,
                timestamp: lastTimeStamp,
                is_manual: true,
              },
            ];
            addGameRecordDetail(gameObj.game_id, body);
          } else if (opetions[index] === 'End Set') {
            lastTimeStamp = parseFloat(new Date().setSeconds(0, 0) / 1000).toFixed(0);
            lastVerb = GameVerb.SetEnd;
            const body = [
              {
                verb: lastVerb,
                timestamp: lastTimeStamp,
                is_manual: true,
              },
            ];
            addGameRecordDetail(gameObj.game_id, body);
          } else if (opetions[index] === 'End Match') {
            matchEnd();
          }
        }}
      />
      <ActionSheet
        ref={headerActionSheet}
        // title={'News Feed Post'}
        options={(gameObj?.status === GameStatus.playing || gameObj?.status === GameStatus.paused || gameObj?.status === GameStatus.resume) ? [
          'Game Reservation Detail',
          'Add Set or Game',
          'Deleted Records',
          'Reset Match',
          'Cancel',
        ] : [
          'Game Reservation Detail',
          'Add Set or Game',
          'Deleted Records',
          'Cancel',
        ]}
        cancelButtonIndex={(gameObj?.status === GameStatus.playing || gameObj?.status === GameStatus.paused || gameObj?.status === GameStatus.resume) ? 4 : 3}
        destructiveButtonIndex={(gameObj?.status === GameStatus.playing || gameObj?.status === GameStatus?.paused || gameObj?.status === GameStatus.resume) && 3}
        onPress={(index) => {
          if (index === 0) {
            setloading(true);
            Utils.getChallengeDetail(gameObj.challenge_id, authContext).then((obj) => {
              console.log('Challenge Object:', JSON.stringify(obj.challengeObj));
              console.log('Screen name of challenge:', obj.screenName);
              navigation.navigate(obj.screenName, {
                challengeObj: obj.challengeObj || obj.challengeObj[0],
              });
              setloading(false);
            }).catch(() => setloading(false));
          } else if (index === 1) {
            console.log('ok');
          } else if (index === 2) {
            console.log('ok');
          } else if (index === 3) {
            if (gameObj?.status === GameStatus.playing || gameObj?.status === GameStatus.paused || gameObj?.status === GameStatus.resume) {
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
                        gameObj.status === GameStatus.accepted
                        || gameObj.status === GameStatus.reset
                      ) {
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
          }
        }}
      />
    </>
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
    fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('22%'),
  },

  headerView: {
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

    width: wp('39%'),
  },

  profileImg: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.whiteColor,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    resizeMode: 'cover',
    width: 30,
  },

  profileShadow: {
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },

  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('39%'),
  },

  orangeArrow: {
    width: 7,
    height: 9.5,
    resizeMode: 'cover',
    marginLeft: 5,
    marginRight: 5,
  },
  bottomView: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
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
  gameRecordButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  separatorLine: {
    backgroundColor: colors.thinDividerColor,
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
  },
  playerView: {
    flex: 0.5,
    flexDirection: 'row',
    height: 36,
    backgroundColor: colors.lightBG,
    borderRadius: 8,
    alignItems: 'center',
  },
  playerProfile: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 13,
  },
  middleViewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 25,
    marginBottom: 10,
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  scoreView: {
    flex: 1,
    height: 33,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  playerScore: {
    flex: 0.5,
    textAlign: 'center',
    fontSize: 25,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },
  playerNameText: {
    fontSize: 13,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    flex: 1,
    marginRight: 2,
    marginLeft: 2,
  },
  selectedPlayerNameText: {
    fontSize: 14,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    flex: 1,
    marginRight: 2,
    marginLeft: 2,
  },
  buttonListView: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  plusMinusContainer: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  container: { flex: 1 },
  view: {
    marginTop: 0,
    // backgroundColor: 'blue',
    width,

    height: 200,
    borderRadius: 10,
    // paddingHorizontal : 30
  },
  view2: {
    width,
    paddingBottom: hp(15),
    borderRadius: 10,
    // paddingHorizontal : 30
  },
  messageToast: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    marginTop: -10,
    backgroundColor: colors.themeColor,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    marginLeft: 2,
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
});
