/* eslint-disable default-param-last */
/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actionsheet';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {
  addGameRecord,
  deleteGameRecord,
  getGameData,
  getGameMatchRecords,
  resetGame,
} from '../../../api/Games';
import {getNumberSuffix, tennisGameStats} from '../../../utils/gameUtils';
import TennisGameScoreRight from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreRight';
import TennisGameState from '../../../components/game/tennis/home/gameRecordList/TennisGameState';
import TennisGameScoreLeft from '../../../components/game/tennis/home/gameRecordList/TennisGameScoreLeft';
import AuthContext from '../../../auth/context';
import SwipeableRow from '../../../components/gameRecordList/SwipeableRow';
import GameStatus from '../../../Constants/GameStatus';
import GameVerb from '../../../Constants/GameVerb';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import * as Utils from '../../challenge/ChallengeUtility';
import AddSetGameModal from './AddSetGameModal';
import {getHitSlop} from '../../../utils';

const TennisMatchRecordsList = (
  {
    navigation,
    matchData,
    visibleSetScore = true,
    isAdmin,
    visibleAddSetGameButton = false,
    matchRecords3DotRef,
  },
  matchRef,
) => {
  const authContext = useContext(AuthContext);
  const [visibleAddSetAndGameButton, setVisibleAddSetAndGameButton] =
    useState(false);
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [teamIds, setTeamIds] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);
  const [servingTeamID, setServingTeamID] = useState();
  const [homeTeamMatchPoint, setHomeMatchPoint] = useState(0);
  const [awayTeamMatchPoint, setAwayMatchPoint] = useState(0);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [visibleAddSetModal, setVisibleAddSetModal] = useState(false);
  const [visibleAddGameModal, setVisibleAddGameModal] = useState(false);

  useImperativeHandle(matchRef, () => ({
    refreshMatchRecords() {
      loadAtOnce();
    },
  }));
  useEffect(() => {
    setVisibleAddSetAndGameButton(visibleAddSetGameButton);
  }, [visibleAddSetGameButton]);

  useEffect(() => {
    loadAtOnce();
  }, [matchData]);

  useEffect(() => {
    if (gameData) {
      calculateMatchScore();
      defineServingTeamID(gameData);
    }
  }, [gameData]);
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
        getGameMatchRecords(gameId, authContext, 'grouped=true').then(
          (matchRes) => {
            setMatchRecords([...matchRes.payload]);
            setLoading(false);
          },
        );
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
        getGameMatchRecords(gameData?.game_id, authContext, 'grouped=true')
          .then((matchRes) => {
            setMatchRecords([...matchRes.payload]);
            setLoading(false);
          })
          .finally(() => setFullScreenLoading(false));
      })
      .catch(() => setFullScreenLoading(false));
  };
  const calculateMatchScore = () => {
    setHomeMatchPoint(0);
    setAwayMatchPoint(0);
    let homePoint = 0;
    let awayPoint = 0;
    (gameData?.scoreboard?.sets || []).map((e) => {
      if (e?.winner) {
        if (e.winner === gameData?.home_team?.user_id) {
          homePoint += 1;
        } else {
          awayPoint += 1;
        }
      }
      setHomeMatchPoint(homePoint);
      setAwayMatchPoint(awayPoint);
      return e;
    });
  };

  const getDMYHM = (date) => {
    const currentDate = moment(new Date()).format('yyyy-MM-DD');
    const receiveDate = moment(date * 1000).format('yyyy-MM-DD');
    if (currentDate === receiveDate) {
      return moment(date * 1000).format('hh:mm A');
    }
    return moment(date * 1000).format('DD-MM-YYYY hh:mm A');
  };

  const getScoreText = (
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
      <Text style={{...styles.centerText, color}}>
        {teamNumber === 1 ? firstTeamScore : secondTeamScore ?? 0}
      </Text>
    );
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
    timeString,
  }) => (
    <Fragment>
      {renderAddSetButton()}
      <View
        style={{
          ...styles.setContainer,
          backgroundColor: 'rgba(255,138,1,0.1)',
        }}>
        <RenderDash />
        {/* Down Arrow */}
        <TouchableOpacity
          style={styles.downArrowContainer}
          onPress={() => toggleMatchSets(index)}
          hitSlop={getHitSlop(15)}>
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
            {getNumberSuffix(set_number)} {strings.set}
          </Text>
          <Text style={styles.setTimeDurationText}>{timeString}</Text>
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
    if (isAdmin && !isDeleted && showSwipeRow.includes(verb)) {
      return true;
    }
    return false;
  };

  const onAddGamePress = () => {
    setVisibleAddGameModal(true);
  };
  const renderAddGameButton = () =>
    isAdmin &&
    visibleAddSetAndGameButton && (
      <TouchableOpacity onPress={() => onAddGamePress()}>
        <View
          style={{
            backgroundColor: colors.googleColor,
            alignItems: 'center',
            padding: 5,
          }}>
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 12,
              color: colors.whiteColor,
            }}>
            {strings.addGame}
          </Text>
        </View>
      </TouchableOpacity>
    );

  const onAddSetPress = () => {
    setVisibleAddSetModal(true);
  };
  const renderAddSetButton = () =>
    isAdmin &&
    visibleAddSetAndGameButton && (
      <TouchableOpacity onPress={onAddSetPress}>
        <LinearGradient
          colors={[colors.themeColor, colors.yellowColor]}
          style={{alignItems: 'center', padding: 5}}>
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 12,
              color: colors.whiteColor,
            }}>
            {strings.addSet}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  const renderMatchRecords = ({item, index}) => {
    if (
      [GameVerb.Start, GameVerb.End, GameVerb.Pause, GameVerb.Resume].includes(
        item?.verb,
      )
    ) {
      return (
        <View
          style={{
            ...(!visibleAddSetAndGameButton && {
              backgroundColor: colors.whiteColor,
            }),
          }}>
          <SwipeableRow
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
            <TennisGameState recordData={item} />
          </SwipeableRow>
        </View>
      );
    }
    let timeString = '';
    if (item?.start_datetime) timeString += getDMYHM(item?.start_datetime);
    if (item?.end_datetime) timeString += ` - ${getDMYHM(item?.end_datetime)}`;
    else timeString += ` - ${strings.notEnded}`;

    return (
      <View>
        <RenderSets
          item={item}
          index={index}
          set_number={item?.number}
          home_team_score={0}
          away_team_score={0}
          timeString={timeString}
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
  const renderGames = (item, index, parentIndex) => {
    if ([GameVerb.SetStart, GameVerb.SetEnd].includes(item.verb)) {
      return (
        <View
          style={{
            ...(!visibleAddSetAndGameButton && {
              backgroundColor: colors.whiteColor,
            }),
          }}>
          <SwipeableRow
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
            <TennisGameState recordData={item} titleColor={colors.themeColor} />
          </SwipeableRow>
        </View>
      );
    }

    let timeString = '';
    if (item?.start_datetime) timeString += getDMYHM(item?.start_datetime);
    if (item?.end_datetime) timeString += ` - ${getDMYHM(item?.end_datetime)}`;
    else timeString += ` - ${strings.notEnded}`;

    return (
      <View>
        {renderAddGameButton()}
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
            onPress={() => toggleGameRecords(parentIndex, index)}
            hitSlop={getHitSlop(15)}>
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
              {getNumberSuffix(item?.number)} {strings.totalGames}
            </Text>
            <Text style={styles.setTimeDurationText}>{timeString}</Text>
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
        strings.resetMatchRecord,
        '',
        [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.resetTitleText,
            style: 'destructive',
            onPress: () => {
              if (
                gameData.status === GameStatus.accepted ||
                gameData.status === GameStatus.reset
              ) {
                Alert.alert(strings.gameNotStarted);
              } else if (gameData.status === GameStatus.ended) {
                Alert.alert(strings.gameEnded);
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
        <View
          style={{
            opacity: item?.deleted ? 0.5 : 1,
            ...(!visibleAddSetAndGameButton && {
              backgroundColor: colors.whiteColor,
            }),
          }}>
          <SwipeableRow
            enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
            onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
            <TennisGameState recordData={item} />
          </SwipeableRow>
        </View>
      );
    }
    const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    const isGameState = item.verb in tennisGameStats;
    return (
      <SwipeableRow
        enabled={getVisibleSwipableRowValue(item?.verb, item?.deleted)}
        onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}>
        {/* <AppleStyleSwipeableRow
         onPress={() => onSwipeRowItemPress(item?.verb, item?.record_id)}
         color={colors.redDelColor}
         image={images.deleteIcon}> */}

        <View style={{opacity: item?.deleted ? 0.5 : 1}}>
          {!isGameState && isHomeTeam && (
            <View
              style={{
                ...(!visibleAddSetAndGameButton && {
                  backgroundColor: colors.whiteColor,
                }),
              }}>
              <RenderDash zIndex={1} />
              <TennisGameScoreLeft
                gameData={gameData}
                recordData={item}
                editor={editorChecked}
              />
            </View>
          )}
          {!isGameState && !isHomeTeam && (
            <View
              style={{
                ...(!visibleAddSetAndGameButton && {
                  backgroundColor: colors.whiteColor,
                }),
              }}>
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

  const onAddSetOrGameDonePress = (type = '', startDateTime, endDateTime) => {
    console.log(type);
    console.log(startDateTime);
    console.log(endDateTime);
    if (startDateTime.getTime() > endDateTime.getTime()) {
      Alert.alert(strings.starttimeGreterEndTime);
    } else {
      setFullScreenLoading(true);
      const obj = [
        {timestamp: startDateTime.getTime() / 1000, verb: `${type}Start`},
        {timestamp: endDateTime.getTime() / 1000, verb: `${type}End`},
      ];
      addGameRecord(gameData?.game_id, obj, authContext)
        .then(() => {
          setVisibleAddSetAndGameButton(false);
          refreshGameAndRecords();
          if (type === 'set') setVisibleAddSetModal(false);
          else setVisibleAddGameModal(false);
        })
        .catch((error) => {
          setFullScreenLoading(false);
          setTimeout(() => Alert.alert(strings.appName, error.message), 100);
        });
    }
  };

  const getVisibleBackgroundColor = () =>
    visibleAddSetAndGameButton && {backgroundColor: 'rgba(0,0,0,0.26)'};
  return (
    <View style={{...styles.mainContainer, ...getVisibleBackgroundColor()}}>
      <ActivityLoader visible={fullScreenLoading} />
      <ActionSheet
        ref={matchRecords3DotRef}
        // title={'NewsFeed Post'}
        options={
          gameData?.status === GameStatus.playing ||
          gameData?.status === GameStatus.paused ||
          gameData?.status === GameStatus.resume
            ? [
                strings.gameReservationDetail,
                strings.addSetOrGame,
                strings.deletedRecords,
                strings.resetMatch,
                strings.cancel,
              ]
            : [
                strings.gameReservationDetail,
                strings.addSetOrGame,
                strings.deletedRecords,
                strings.cancel,
              ]
        }
        cancelButtonIndex={
          gameData?.status === GameStatus.playing ||
          gameData?.status === GameStatus.paused ||
          gameData?.status === GameStatus.resume
            ? 4
            : 3
        }
        destructiveButtonIndex={
          (gameData?.status === GameStatus.playing ||
            gameData?.status === GameStatus?.paused ||
            gameData?.status === GameStatus.resume) &&
          3
        }
        onPress={(index) => {
          if (index === 0) {
            setFullScreenLoading(true);
            Utils.getChallengeDetail(gameData.challenge_id, authContext)
              .then((obj) => {
                navigation.navigate(obj.screenName, {
                  challengeObj: obj.challengeObj || obj.challengeObj[0],
                });
                setFullScreenLoading(false);
              })
              .catch(() => setFullScreenLoading(false));
          } else if (index === 1) {
            setVisibleAddSetAndGameButton(true);
          } else if (index === 2) {
            navigation.navigate('TennisDeletedRecordScreen', {
              gameData,
              isAdmin,
            });
          } else if (index === 3) {
            if (
              gameData?.status === GameStatus.playing ||
              gameData?.status === GameStatus.paused ||
              gameData?.status === GameStatus.resume
            ) {
              Alert.alert(
                strings.resetMatchRecord,
                '',
                [
                  {
                    text: strings.cancel,
                    style: 'cancel',
                  },
                  {
                    text: strings.resetTitleText,
                    style: 'destructive',
                    onPress: () => {
                      if (
                        gameData.status === GameStatus.accepted ||
                        gameData.status === GameStatus.reset
                      ) {
                        Alert.alert(strings.gameNotStarted);
                      } else if (gameData.status === GameStatus.ended) {
                        Alert.alert(strings.gameEnded);
                      } else {
                        resetGameDetail();
                      }
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }
        }}
      />
      <View>
        <View style={{flexDirection: 'row', paddingBottom: 10}}>
          <RenderDash />
          <View style={{...styles.editorView}}>
            <Text style={{fontSize: 12, fontFamily: fonts.RRegular}}>
              {strings.showEditors}
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
        {visibleSetScore && (
          <View style={{...styles.headerView}}>
            <RenderDash />
            <View style={styles.leftView}>
              <View style={styles.profileShadow}>
                <FastImage
                  resizeMode={'cover'}
                  source={
                    gameData?.home_team?.thumbnail
                      ? {uri: gameData?.home_team?.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={
                    servingTeamID === gameData?.home_team?.user_id
                      ? styles.profileImg
                      : [styles.profileImg, {borderColor: colors.themeColor}]
                  }
                />
              </View>
              <Text style={styles.leftText} numberOfLines={2}>
                {gameData?.home_team?.first_name}{' '}
                {gameData?.home_team?.last_name}
              </Text>
            </View>

            <TouchableWithoutFeedback>
              <View>
                <Text style={styles.centerSetText}>{strings.setScore}</Text>
                <View style={styles.centerView}>
                  <Text style={styles.centerText}>
                    {getScoreText(homeTeamMatchPoint, awayTeamMatchPoint, 1)}
                  </Text>
                  <View style={{width: 10}} />
                  <Text style={styles.centerText}>
                    {getScoreText(homeTeamMatchPoint, awayTeamMatchPoint, 2)}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.rightView}>
              <Text style={styles.rightText} numberOfLines={2}>
                {gameData?.away_team?.first_name}{' '}
                {gameData?.away_team?.last_name}
              </Text>
              <View style={styles.profileShadow}>
                <FastImage
                  resizeMode={'cover'}
                  source={
                    gameData?.away_team?.thumbnail
                      ? {uri: gameData?.away_team?.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={
                    servingTeamID === gameData?.away_team?.user_id
                      ? styles.profileImg
                      : [styles.profileImg, {borderColor: colors.themeColor}]
                  }
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Add Set Modal */}
      <AddSetGameModal
        loading={fullScreenLoading}
        headingTitle={strings.addASet}
        title={strings.chooseStartEndTime}
        subTitle={strings.whenAddingNewSet}
        visible={visibleAddSetModal}
        onDatePickerClose={() => {
          setVisibleAddSetModal(false);
          setVisibleAddSetAndGameButton(false);
        }}
        onDonePress={(startDate, endDate) =>
          onAddSetOrGameDonePress('set', startDate, endDate)
        }
      />
      {/* Add Game Modal */}
      <AddSetGameModal
        loading={fullScreenLoading}
        headingTitle={strings.addAGame}
        title={strings.chooseStartEndTimeGame}
        subTitle={strings.addNewGameOrSet}
        visible={visibleAddGameModal}
        onDatePickerClose={() => {
          setVisibleAddGameModal(false);
          setVisibleAddSetAndGameButton(false);
        }}
        onDonePress={(startDate, endDate) =>
          onAddSetOrGameDonePress('game', startDate, endDate)
        }
      />
      <Fragment>
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
                  {strings.notAvailableYet}
                </Text>
              )}
            </View>
          )}
        />
      </Fragment>
    </View>
  );
};

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
    shadowOffset: {width: 0, height: 2},
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
  setTimeDurationText: {
    color: colors.lightBlackColor,
    fontSize: 10,
    textAlign: 'center',
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

export default forwardRef(TennisMatchRecordsList);
