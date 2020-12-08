import React, {
  useLayoutEffect, useState, useRef, useEffect, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  SectionList,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,

} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import { addGameRecord, resetGame, getGameRoster } from '../../../api/Games';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GameStatus from '../../../Constants/GameStatus';
import ReservationStatus from '../../../Constants/ReservationStatus';
import GameVerb from '../../../Constants/GameVerb';
import TCGameButton from '../../../components/TCGameButton';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

let timer, timerForTimeline;
let lastTimeStamp;
let lastVerb;
const recordButtonList = ['Goal', 'Own Goal', 'YC', 'RC', 'In', 'Out'];
const assistButtonList = ['Assist'];
export default function GameDetailRecord({ navigation, route }) {
  const actionSheet = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [pickerShow, setPickerShow] = useState(false);
  const [selectedMemberID, setSelectedMemberID] = useState();
  const [date, setDate] = useState();
  const [isAssist, setIsAssist] = useState(false);
  const [selectedAssistMemberID, setSelectedAssistMemberID] = useState();
  const [gameObj, setGameObj] = useState();
  const [actionByTeamID, setActionByTeamID] = useState();
  const [homeField, setHomeField] = useState([]);
  const [homeBench, setHomeBench] = useState([]);
  const [awayField, setAwayField] = useState([]);
  const [messageToast, setMessageToast] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [timelineTimer, setTimelineTimer] = useState('00 : 00 : 00');
  const [awayBench, setAwayBench] = useState([]);

  useEffect(() => {
    const { gameId } = route.params ?? {};
    getGameRosterDetail(gameId, true);
    return () => {};
  }, [isFocused]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => actionSheet.current.show()}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, date, gameObj, selectedMemberID, selectedAssistMemberID, isAssist, messageText, messageToast]);

  useFocusEffect(() => {
    startStopTimerTimeline()
    timer = setInterval(() => {
      if (gameObj && gameObj.status !== GameStatus.ended) {
        getGameRosterDetail(gameObj.game_id, false);
      }
    }, 3000);
    return () => {
      clearInterval(timer)
      clearInterval(timerForTimeline)
    }
  }, [])

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
    if (!selectedMemberID) {
      Alert.alert('Please, select a player first');
      return false;
    }
    return true;
  };
  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('hh : mm a, MMM DD')
  }
  const getGameRosterDetail = (gameId, isLoading) => {
    if (isLoading) {
      setloading(true);
    }
    getGameRoster(gameId, authContext)
      .then((res2) => {
        setloading(false);
        console.log('ROSTER RESPONSE::', JSON.stringify(res2.payload));
        setHomeField(
          res2.payload.home_team.roster.filter(
            (obj) => obj.field_status === 'onField' && obj.role === 'player',
          ),
        );
        setHomeBench(
          res2.payload.home_team.roster.filter(
            (obj) => (obj.field_status === 'onBench' || !obj.field_status)
              && obj.role === 'player',
          ),
        );
        setAwayField(
          res2.payload.away_team.roster.filter(
            (obj) => obj.field_status === 'onField' && obj.role === 'player',
          ),
        );
        setAwayBench(
          res2.payload.away_team.roster.filter(
            (obj) => (obj.field_status === 'onBench' || !obj.field_status)
              && obj.role === 'player',
          ),
        );
        const { gameObject } = route.params ?? {};

        setGameObj({
          ...gameObject,
          status: (res2.payload.game_summary.status === GameStatus.reset && GameStatus.accepted) || res2.payload.game_summary.status,
          away_team_goal: res2.payload.game_summary.away_team_goal,
          home_team_goal: res2.payload.game_summary.home_team_goal,
        });
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
  const getMemberName = (memberID) => {
    console.log('Member Id', memberID);
    if (memberID === '0' || memberID === '1') {
      return 'No Specific Player'
    }
    let jerseyNumber = '';
    let firstName = '';
    let lastName = '';
    if (homeField.some((e) => e.member_id === memberID)) {
      // eslint-disable-next-line array-callback-return
      homeField.map((e) => {
        if (e.member_id === memberID) {
          if (e.first_name) {
            firstName = e.first_name;
            lastName = e.last_name;
            jerseyNumber = e.jersey_number;
          } else {
            firstName = e.profile.first_name;
            lastName = e.profile.last_name;
            jerseyNumber = e.profile.jersey_number;
          }
        }
      })
    } else if (homeBench.some((e) => e.member_id === memberID)) {
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line array-callback-return
      homeBench.map((e) => {
        if (e.member_id === memberID) {
          if (e.first_name) {
            firstName = e.first_name;
            lastName = e.last_name;
            jerseyNumber = e.jersey_number;
          } else {
            firstName = e.profile.first_name;
            lastName = e.profile.last_name;
            jerseyNumber = e.profile.jersey_number;
          }
        }
      })
    } else if (awayField.some((e) => e.member_id === memberID)) {
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line array-callback-return
      awayField.map((e) => {
        if (e.member_id === memberID) {
          if (e.first_name) {
            firstName = e.first_name;
            lastName = e.last_name;
            jerseyNumber = e.jersey_number;
          } else {
            firstName = e.profile.first_name;
            lastName = e.profile.last_name;
            jerseyNumber = e.profile.jersey_number;
          }
        }
      })
    } else if (awayBench.some((e) => e.member_id === memberID)) {
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line array-callback-return
      awayBench.map((e) => {
        if (e.member_id === memberID) {
          if (e.first_name) {
            firstName = e.first_name;
            lastName = e.last_name;
            jerseyNumber = e.jersey_number;
          } else {
            firstName = e.profile.first_name;
            lastName = e.profile.last_name;
            jerseyNumber = e.profile.jersey_number;
          }
        }
      })
    }
    if (jerseyNumber !== '') {
      jerseyNumber = `(${jerseyNumber})`
    }
    return `${firstName} ${lastName} ${jerseyNumber}`
  }
  const addGameRecordDetail = (gameId, params) => {
    setloading(true);
    addGameRecord(gameId, params, authContext)
      .then((response) => {
        console.log(lastVerb);
        setDate();
        if (lastVerb === GameVerb.Start) {
          setGameObj({
            ...gameObj,
            actual_startdatetime: lastTimeStamp,
            status: GameStatus.playing,
          });
          setloading(false);
          setIsAssist(false);
          setSelectedMemberID();
          setSelectedAssistMemberID();
          console.log('GAME RESPONSE::', response.payload);
        } else if (lastVerb === GameVerb.Pause) {
          setGameObj({
            ...gameObj,
            pause_datetime: lastTimeStamp,
            status: GameStatus.paused,
          });
          setloading(false);
          setIsAssist(false);
          setSelectedMemberID();
          setSelectedAssistMemberID();
          console.log('GAME RESPONSE::', response.payload);
        } else if (lastVerb === GameVerb.Resume) {
          setGameObj({ ...gameObj, status: GameStatus.resume });
          setloading(false);
          setIsAssist(false);
          setSelectedMemberID();
          setSelectedAssistMemberID();
          console.log('GAME RESPONSE::', response.payload);
        } else if (lastVerb === GameVerb.End) {
          setGameObj({
            ...gameObj,
            actual_enddatetime: lastTimeStamp,
            status: GameStatus.ended,
          });
          setloading(false);
          setIsAssist(false);
          setSelectedMemberID();
          setSelectedAssistMemberID();
          console.log('GAME RESPONSE::', response.payload);
        } else {
          setloading(false);
          setMessageText(
            (lastVerb === GameVerb.Goal && !isAssist && `Goal, ${getMemberName(selectedMemberID)}`)
            || (lastVerb === GameVerb.Goal && isAssist && `Goal, ${getMemberName(selectedMemberID)} /Assist, ${getMemberName(selectedAssistMemberID)}`)
              || (lastVerb === GameVerb.OwnGoal && `Goal, ${getMemberName(selectedMemberID)}`)
              || (lastVerb === GameVerb.YC && `YC, ${getMemberName(selectedMemberID)}`)
              || (lastVerb === GameVerb.RC && `RC, ${getMemberName(selectedMemberID)}`)
              || (lastVerb === GameVerb.In && `In, ${getMemberName(selectedMemberID)}`)
              || (lastVerb === GameVerb.Out && `Out, ${getMemberName(selectedMemberID)}`),
          );
          setMessageToast(true);

          setIsAssist(false);
          setSelectedMemberID();
          setSelectedAssistMemberID();
          console.log('ELSE GAME RESPONSE::', response.payload);
          getGameRosterDetail(gameObj.game_id, true);
        }
      })
      .catch((e) => {
        setloading(false);
        console.log('OWN ERROR ::', e);
        Alert.alert(e.Error);
      });
  };
  const checkMemberOnBench = (memberID) => homeBench.some((e) => e.member_id === memberID)
    || awayBench.some((e) => e.member_id === memberID);
  const checkMemberOnField = (memberID) => homeField.some((e) => e.member_id === memberID)
    || awayField.some((e) => e.member_id === memberID);
  const renderGameButton = ({ item }) => (
    <TCGameButton
      title={item}
      onPress={() => {
        if (validate()) {
          if (item === 'Goal') {
            if (selectedMemberID) {
              if (!checkMemberOnBench(selectedMemberID)) {
                Alert.alert(
                  'Do you want to add an assist?',
                  'If yes, choose a player and click the assist button.',
                  [
                    {
                      text: 'No',
                      onPress: () => {
                        lastTimeStamp = date ? date.getTime() : new Date().getTime()
                        lastVerb = GameVerb.Goal;
                        let body = [{}];
                        if (
                          selectedMemberID === '0'
                          || selectedMemberID === '1'
                        ) {
                          body = [
                            {
                              verb: lastVerb,
                              timestamp: lastTimeStamp,
                              team_id: actionByTeamID,
                            },
                          ];
                        } else {
                          body = [
                            {
                              verb: lastVerb,
                              timestamp: lastTimeStamp,
                              team_id: actionByTeamID,
                              doneBy: selectedMemberID,
                            },
                          ];
                        }
                        addGameRecordDetail(gameObj.game_id, body);
                      },
                      style: 'no',
                    },

                    {
                      text: 'Yes',
                      onPress: () => {
                        setIsAssist(true);
                      },
                    },
                  ],
                  { cancelable: false },
                );
              } else {
                Alert.alert('Goal can\'t be done by on bench player');
              }
            } else {
              Alert.alert('Please select player first.');
            }
          } else if (item === 'Assist') {
            if (selectedAssistMemberID) {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.Goal;
              let body = [{}];
              if (selectedMemberID === '0' || selectedMemberID === '1') {
                if (
                  selectedAssistMemberID === '0'
                  || selectedAssistMemberID === '1'
                ) {
                  body = [
                    {
                      verb: lastVerb,
                      timestamp: lastTimeStamp,
                      team_id: actionByTeamID,
                    },
                  ];
                } else {
                  body = [
                    {
                      verb: lastVerb,
                      timestamp: lastTimeStamp,
                      team_id: actionByTeamID,
                      assistedBy: selectedAssistMemberID,
                    },
                  ];
                }
              } else if (
                selectedAssistMemberID === '0'
                || selectedAssistMemberID === '1'
              ) {
                body = [
                  {
                    verb: lastVerb,
                    timestamp: lastTimeStamp,
                    team_id: actionByTeamID,
                    doneBy: selectedMemberID,
                  },
                ];
              } else {
                body = [
                  {
                    verb: lastVerb,
                    timestamp: lastTimeStamp,
                    team_id: actionByTeamID,
                    doneBy: selectedMemberID,
                    assistedBy: selectedAssistMemberID,
                  },
                ];
              }
              addGameRecordDetail(gameObj.game_id, body);
            } else {
              Alert.alert('Please select player first.');
            }
          } else if (item === 'Own Goal') {
            if (!checkMemberOnBench(selectedMemberID)) {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.Goal;
              let body = [{}];
              const tempActionTeamID = (actionByTeamID === gameObj.home_team.group_id
                  && gameObj.away_team.group_id)
                || gameObj.home_team.group_id;
              if (selectedMemberID === '0' || selectedMemberID === '1') {
                body = [
                  {
                    verb: lastVerb,
                    timestamp: lastTimeStamp,
                    team_id: tempActionTeamID,
                    own_goal: true,
                  },
                ];
              } else {
                body = [
                  {
                    verb: lastVerb,
                    timestamp: lastTimeStamp,
                    team_id: tempActionTeamID,
                    doneBy: selectedMemberID,
                    own_goal: true,
                  },
                ];
              }
              addGameRecordDetail(gameObj.game_id, body);
            } else {
              Alert.alert('Goal can\'t be done by on bench player');
            }
          } else if (item === 'YC') {
            if (!checkMemberOnBench(selectedMemberID)) {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.YC;
              const body = [
                {
                  verb: lastVerb,
                  timestamp: lastTimeStamp,
                  team_id: actionByTeamID,
                  to: selectedMemberID,
                },
              ];
              addGameRecordDetail(gameObj.game_id, body);
            } else {
              Alert.alert('Yellow card can\'t be apply to on bench player');
            }
          } else if (item === 'RC') {
            if (!checkMemberOnBench(selectedMemberID)) {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.RC;
              const body = [
                {
                  verb: lastVerb,
                  timestamp: lastTimeStamp,
                  team_id: actionByTeamID,
                  to: selectedMemberID,
                },
              ];
              addGameRecordDetail(gameObj.game_id, body);
            } else {
              Alert.alert('Red card can\'t be apply to on bench player');
            }
          } else if (item === 'In') {
            if (selectedMemberID === '0' || selectedMemberID === '1') {
              Alert.alert('Please, select a player first');
            } else if (checkMemberOnField(selectedMemberID)) {
              Alert.alert('This player is already on field');
            } else {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.In;
              const body = [
                {
                  verb: lastVerb,
                  timestamp: lastTimeStamp,
                  team_id: actionByTeamID,
                  to: selectedMemberID,
                },
              ];
              addGameRecordDetail(gameObj.game_id, body);
            }
          } else if (item === 'Out') {
            if (selectedMemberID === '0' || selectedMemberID === '1') {
              Alert.alert('Please, select a player first');
            } else if (checkMemberOnBench(selectedMemberID)) {
              Alert.alert('This player is already on bench');
            } else {
              lastTimeStamp = date ? date.getTime() : new Date().getTime()
              lastVerb = GameVerb.Out;
              const body = [
                {
                  verb: lastVerb,
                  timestamp: lastTimeStamp,
                  team_id: actionByTeamID,
                  to: selectedMemberID,
                },
              ];
              addGameRecordDetail(gameObj.game_id, body);
            }
          }
        }
      }}
      buttonColor={colors.whiteColor}
      imageName={
        (item === 'Goal' && images.gameGoal)
        || (item === 'Own Goal' && images.gameOwnGoal)
        || (item === 'YC' && images.gameYC)
        || (item === 'RC' && images.gameRC)
        || (item === 'In' && images.gameIn)
        || (item === 'Out' && images.gameOut)
        || (item === 'Assist' && images.assistsImage)
      }
      textColor={colors.googleColor}
      imageSize={32}
    />
  );
  const renderHomeSectionItems = ({ item }) => (
    <>
      {gameObj && (
        <TouchableOpacity
          onPress={() => {
            if (isAssist) {
              if (actionByTeamID !== gameObj.home_team.group_id) {
                Alert.alert('Goal can\'t be assist by other team\'s player.');
              } else if (checkMemberOnBench(item.member_id)) {
                Alert.alert('Goal can\'t be assist by on bench player');
              } else if (selectedMemberID === item.member_id) {
                Alert.alert('Assist goal can\'t be done by same player');
              } else {
                setSelectedAssistMemberID(item.member_id);
                setActionByTeamID(gameObj.home_team.group_id);
              }
            } else {
              setSelectedMemberID(item.member_id);
              setActionByTeamID(gameObj.home_team.group_id);
            }
          }}>
          {selectedMemberID === item.member_id
          || selectedAssistMemberID === item.member_id ? (
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.orangeFieldView}>
              <Image
                source={
                  item.profile.thumbnail
                    ? { uri: item.profile.thumbnail }
                    : (item.profile.first_name === 'No Specific'
                        && images.noSpecicPlayer)
                      || images.profilePlaceHolder
                }
                style={styles.playerImage}
              />
              <View
                style={[
                  styles.dividerView,
                  { backgroundColor: colors.whiteColor },
                ]}></View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.whitePlayerName}>
                  {item.profile.first_name} {item.profile.last_name}
                </Text>
                <Text style={styles.whitePlayerName}>
                  {item.profile.jersey_number}
                </Text>
              </View>
            </LinearGradient>
            ) : (
              <View style={styles.normalFieldView}>
                <Image
                source={
                  item.profile.thumbnail
                    ? { uri: item.profile.thumbnail }
                    : (item.profile.first_name === 'No Specific'
                        && images.noSpecicPlayer)
                      || images.profilePlaceHolder
                }
                style={styles.playerImage}
              />
                <View
                style={[
                  styles.dividerView,
                  { backgroundColor: colors.smallDividerColor },
                ]}></View>

                <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.blackPlayerName}>
                    {item.profile.first_name} {item.profile.last_name}
                  </Text>
                  <Text style={styles.blackPlayerName}>
                    {item.profile.jersey_number}
                  </Text>
                </View>
              </View>
            )}
        </TouchableOpacity>
      )}
    </>
  );
  const renderAwaySectionItems = ({ item }) => (
    <>
      {gameObj && (
        <TouchableOpacity
          onPress={() => {
            if (isAssist) {
              if (actionByTeamID !== gameObj.away_team.group_id) {
                Alert.alert('Goal can\'t be assist by other team\'s player.');
              } else if (checkMemberOnBench(item.member_id)) {
                Alert.alert('Goal can\'t be assist by on bench player');
              } else if (selectedMemberID === item.member_id) {
                Alert.alert('Assist goal can\'t be done by same player');
              } else {
                setSelectedAssistMemberID(item.member_id);
                setActionByTeamID(gameObj.away_team.group_id);
              }
            } else {
              setSelectedMemberID(item.member_id);
              setActionByTeamID(gameObj.away_team.group_id);
            }
          }}>
          {selectedMemberID === item.member_id
          || selectedAssistMemberID === item.member_id ? (
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.orangeFieldView}>
              <Image
                source={
                  item.profile.thumbnail
                    ? { uri: item.profile.thumbnail }
                    : (item.profile.first_name === 'No Specific'
                        && images.noSpecicPlayer)
                      || images.profilePlaceHolder
                }
                style={styles.playerImage}
              />
              <View
                style={[
                  styles.dividerView,
                  { backgroundColor: colors.whiteColor },
                ]}></View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.whitePlayerName}>
                  {item.profile.first_name} {item.profile.last_name}
                </Text>
                <Text style={styles.whitePlayerName}>
                  {item.profile.jersey_number}
                </Text>
              </View>
            </LinearGradient>
            ) : (
              <View style={styles.normalFieldView}>
                <Image
                source={
                  item.profile.thumbnail
                    ? { uri: item.profile.thumbnail }
                    : (item.profile.first_name === 'No Specific'
                        && images.noSpecicPlayer)
                      || images.profilePlaceHolder
                }
                style={styles.playerImage}
              />
                <View
                style={[
                  styles.dividerView,
                  { backgroundColor: colors.smallDividerColor },
                ]}></View>
                <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.blackPlayerName}>
                    {item.profile.first_name} {item.profile.last_name}
                  </Text>
                  <Text style={styles.blackPlayerName}>
                    {item.profile.jersey_number}
                  </Text>
                </View>
              </View>
            )}
        </TouchableOpacity>
      )}
    </>
  );

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
          <View style={styles.headerView}>
            {gameObj && gameObj.home_team && (
              <View style={styles.leftView}>
                <View style={styles.profileShadow}>
                  <Image
                    source={
                      gameObj.home_team && gameObj.home_team.thumbnail
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
                      gameObj.away_team && gameObj.away_team.thumbnail
                        ? { uri: gameObj.away_team.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.profileImg}
                  />
                </View>
              </View>
            )}
          </View>
          {messageToast && (
            <Animatable.View
            useNativeDriver={true}
            animation={'fadeInDown'}
             easing="ease-in-out">
              <LinearGradient
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
                        <Image
                            source={(lastVerb === GameVerb.Goal && images.gameGoal)
                          || (lastVerb === GameVerb.YC && images.gameYC)
                        || (lastVerb === GameVerb.RC && images.gameRC)
                      || (lastVerb === GameVerb.In && images.gameIn)
                    || (lastVerb === GameVerb.Out && images.gameOut)}
                            style={styles.gameRecordImg}
                          />
                      </View>
                    </View>
                    <Text numberOfLines={1} style={styles.messageText}>{(messageText.split('/')[1] && `${messageText.split('/')[0]}`) || messageText}</Text>
                    {messageText.split('/')[1] && <>
                      <Text style={{ color: colors.whiteColor }}>/ </Text>
                      <View
                          colors={colors.whiteColor}
                          style={styles.gameRecordButton}>

                        <Image
                            source={images.assistsImage}
                            style={styles.gameRecordImg}
                          />
                      </View>
                      <Text numberOfLines={1} style={[styles.messageText, { width: 130 }]}>  {(messageText.split('/') && messageText.split('/')[1])}</Text>
                    </>}
                  </View>
                  <TouchableOpacity onPress={() => {
                    setMessageToast(false)
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
              </LinearGradient>
            </Animatable.View>
          )}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <SectionList
              renderItem={renderHomeSectionItems}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeader}>
                  <Image
                    source={
                      gameObj.home_team && gameObj.home_team.thumbnail
                        ? { uri: gameObj.home_team.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.TeamImage}
                  />
                  <Text style={styles.sectionText}>{title}</Text>
                </View>
              )}
              sections={[
                {
                  title: 'ON FIELD',
                  data: [
                    {
                      member_id: '0',
                      team_id:
                        gameObj.home_team
                        && gameObj.home_team.group_id
                        && gameObj.home_team.group_id,
                      profile: {
                        first_name: 'No Specific',
                        last_name: 'Player',
                      },
                    },
                    ...homeField,
                  ],
                },
                {
                  title: 'ON BENCH',
                  data: homeBench,
                },
              ]}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: wp('72%'), height: hp('43%') }}
              showsVerticalScrollIndicator={false}
            />
            <View
              style={{
                height: hp('80%'),
                width: 1,
                backgroundColor: colors.lightgrayColor,
              }}
            />
            <SectionList
              renderItem={renderAwaySectionItems}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeader}>
                  <Image
                    source={
                      gameObj.away_team && gameObj.away_team.thumbnail
                        ? { uri: gameObj.away_team.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.TeamImage}
                  />
                  <Text style={styles.sectionText}>{title}</Text>
                </View>
              )}
              sections={[
                {
                  title: 'ON FIELD',
                  data: [
                    {
                      member_id: '1',
                      team_id:
                        gameObj.away_team
                        && gameObj.away_team.group_id
                        && gameObj.away_team.group_id,
                      profile: {
                        first_name: 'No Specific',
                        last_name: 'Player',
                      },
                    },
                    ...awayField,
                  ],
                },
                {
                  title: 'ON BENCH',
                  data: awayBench,
                },
              ]}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: wp('72%'), height: hp('43%') }}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>

          <View style={styles.bottomView}>
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
            <FlatList
              data={isAssist ? assistButtonList : recordButtonList}
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
                      lastTimeStamp = date ? date.getTime() : new Date().getTime()
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
                    clearInterval(timer)
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
                  title="Simple"
                  onPress={() => {
                    navigation.goBack();
                  }}
                  gradientColor={[
                    colors.greenGradientStart,
                    colors.greenGradientEnd,
                  ]}
                  imageName={images.gameSimple}
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
  TeamImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 10,
  },
  bottomLine: {
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  bottomView: {
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,
    position: 'absolute',
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
    marginBottom: 10,
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
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  mainContainer: {
    flex: 1,
  },
  playerImage: {
    height: 20,
    marginLeft: 15,
    borderRadius: 10,
    resizeMode: 'cover',
    width: 20,
  },
  profileImg: {
    borderRadius: 15,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
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

    width: wp('40%'),
  },
  sectionHeader: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    marginBottom: 5,
    paddingBottom: 8,
    paddingLeft: 30,

    paddingTop: 10,
  },
  sectionText: {
    fontSize: wp('3.2%'),
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    marginLeft: 15,
    backgroundColor: colors.whiteColor,
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
  },
  dividerView: {
    marginLeft: 15,
    marginRight: 15,
    height: 15,
    width: 1,
  },
  normalFieldView: {
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 8,
    marginLeft: 30,
    marginRight: 30,
    height: 34,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeFieldView: {
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 8,
    marginLeft: 30,
    marginRight: 30,
    height: 34,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whitePlayerName: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.whiteColor,
    width: 130,
  },
  blackPlayerName: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    width: 130,
  },
  buttonListView: {
    marginBottom: 10,
    alignSelf: 'center',
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
  gameRecordButton: {
    height: 20,
    width: 20,
    borderRadius: 11,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 10,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gameRecordImg: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
  },
});
