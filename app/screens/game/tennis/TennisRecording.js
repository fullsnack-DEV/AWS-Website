/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, {
  useState, useEffect,
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
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
// import { useIsFocused } from '@react-navigation/native';

import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import GameStatus from '../../../Constants/GameStatus';

import TCGameButton from '../../../components/TCGameButton';
// import AuthContext from '../../../auth/context';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import TennisScoreView from '../../../components/game/tennis/TennisScoreView';

const recordButtonList = [
  'General',
  'Ace',
  'Winner',
  'Unforced',
  'Fault',
  'Foot Fault',
  'Let',
];
export default function TennisRecording({ route }) {
  const isFocused = useIsFocused();
  const [pickerShow, setPickerShow] = useState(false);
  const [timelineTimer, setTimelineTimer] = useState('00 : 00 : 00');
  const [detailRecording, setDetailRecording] = useState(false);
  const [gameObj, setGameObj] = useState();
  const [player1Selected, setPlayer1Selected] = useState(false);
  const [player2Selected, setPlayer2Selected] = useState(false);
  const [homeTeamMatchPoint, setHomeMatchPoint] = useState(0)
  const [awayTeamMatchPoint, setAwayMatchPoint] = useState(0)
  const [homeTeamGamePoint, setHomeTeamGamePoint] = useState('0')
  const [awayTeamGamePoint, setAwayTeamGamePoint] = useState('0')

  const [loading, setloading] = useState(false);

  useEffect(() => {
    // const { gameDetail } = route.params ?? {};
    if (route && route.params && route.params.gameDetail) {
      console.log('GAME DATA:', JSON.stringify(route.params.gameDetail));
      setloading(false)
      setTimelineTimer('00 : 00 : 00')
      setGameObj(route.params.gameDetail)

      calculateMatchScore()
      calculateGameScore()
    }
  }, [isFocused]);

  const calculateMatchScore = () => {
    gameObj?.scoreboard?.sets.map((e) => {
      if (e.winner) {
        if (e.winner === gameObj.home_team.user_id) {
          setHomeMatchPoint(homeTeamMatchPoint + 1)
        } else {
          setAwayMatchPoint(awayTeamMatchPoint + 1)
        }
      }
    })
  }
  const calculateGameScore = () => {
    // eslint-disable-next-line array-callback-return
    if (gameObj?.scoreboard?.game_inprogress?.winner || gameObj?.scoreboard?.game_inprogress?.end_datetime) {
      setHomeTeamGamePoint('0')
      setAwayTeamGamePoint('0')

      console.log('GAME SCORE:', `HOME:${homeTeamGamePoint}AWAY:${awayTeamGamePoint}`);
    } else {
      setHomeTeamGamePoint(gameObj?.scoreboard?.game_inprogress?.home_team_point)
      setAwayTeamGamePoint(gameObj?.scoreboard?.game_inprogress?.away_team_point)
    }
  }

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('hh : mm a, MMM DD');
  };
  const renderGameButton = ({ item }) => (
    <TCGameButton
      title={item}
      onPress={() => {
        console.log('Ok');
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
  return (
    <>
      {gameObj && <View style={{ flex: 1 }}>
        <View>
          <ActivityLoader visible={loading} />
          <View style={styles.headerView}>
            <View style={styles.leftView}>
              <View style={styles.profileShadow}>
                <Image
                source={gameObj?.home_team?.thumbnail ? { uri: gameObj?.home_team?.thumbnail } : images.profilePlaceHolder}
                style={player1Selected ? [styles.profileImg, { borderColor: colors.themeColor }] : styles.profileImg}
              />
              </View>
              <Text style={styles.leftText} numberOfLines={2}>
                {gameObj.home_team.first_name} {gameObj.home_team.last_name}
              </Text>
            </View>

            <View>
              <Text style={styles.centerSetText}>SET SCORES</Text>
              <View style={styles.centerView}>
                <Text style={styles.centerText}>{homeTeamMatchPoint}</Text>
                <Image source={images.tennisArrow} style={styles.orangeArrow} />
                <Text style={styles.centerText}>{awayTeamMatchPoint}</Text>
              </View>
            </View>

            <View style={styles.rightView}>
              <Text style={styles.rightText} numberOfLines={2}>
                {gameObj.away_team.first_name} {gameObj.away_team.last_name}
              </Text>
              <View style={styles.profileShadow}>
                <Image
                                source={gameObj?.away_team?.thumbnail ? { uri: gameObj?.away_team?.thumbnail } : images.profilePlaceHolder}
                                style={player2Selected ? [styles.profileImg, { borderColor: colors.themeColor }] : styles.profileImg}
              />
              </View>
            </View>
          </View>
          <TennisScoreView
          scoreDataSource={gameObj}
        />
        </View>
        <View style={{ flex: 1 }}></View>
        {gameObj && (
          <View style={styles.bottomView}>
            <View style={styles.timeView}>
              <Text style={styles.timer}>{timelineTimer}</Text>

              {pickerShow && (
                <View style={styles.curruentTimeView}>
                  <TouchableOpacity onPress={() => {}}>
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
              || (gameObj && gameObj.status && gameObj.status === GameStatus.reset)
                  ? 'Game start at now'
                  : getDateFormat(new Date())}
              </Text>
              <Image source={images.dropDownArrow} style={styles.downArrow} />
              <View style={styles.separatorLine}></View>
            </View>
            {pickerShow && (
              <View>
                <RNDateTimePicker
                locale={'en'}
                default="spinner"
               // display='default'
                value={new Date()}
                onChange={() => {
                  console.log('ok');
                }}
                mode={'datetime'}
                minimumDate={
                  gameObj.status === GameStatus.accepted
                  || gameObj.status === GameStatus.reset
                    ? new Date(1950, 0, 1)
                    : new Date(gameObj.actual_startdatetime)
                }
                maximumDate={
                  gameObj.status === GameStatus.accepted
                  || gameObj.status === GameStatus.reset
                    ? new Date(1950, 0, 1)
                    : new Date()
                }
              />
              </View>
            )}
            <View style={styles.middleViewContainer}>
              <TouchableWithoutFeedback
              style={styles.playerView}
              onPress={() => {
                setPlayer2Selected(false)
                setPlayer1Selected(true)
              }}>
                {player1Selected ? (
                  <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.playerView}>
                    <Image
                    source={gameObj?.home_team?.thumbnail ? { uri: gameObj?.home_team?.thumbnail } : images.profilePlaceHolder}
                    style={styles.playerProfile}
                  />
                    <Text
                    style={styles.selectedPlayerNameText}>
                      {gameObj.home_team.first_name} {gameObj.home_team.last_name}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.playerView}>
                    <Image
                    source={gameObj?.home_team?.thumbnail ? { uri: gameObj?.home_team?.thumbnail } : images.profilePlaceHolder}
                    style={styles.playerProfile}
                  />
                    <Text style={styles.playerNameText}>{gameObj.home_team.first_name} {gameObj.home_team.last_name}</Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
              <Text style={{ marginLeft: 10, marginRight: 10 }}>:</Text>
              <TouchableWithoutFeedback
              style={styles.playerView}
              onPress={() => {
                setPlayer1Selected(false);
                setPlayer2Selected(true);
              }}>
                {player2Selected ? (
                  <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.playerView}>
                    <Image
                    source={gameObj?.away_team?.thumbnail ? { uri: gameObj?.away_team?.thumbnail } : images.profilePlaceHolder}
                    style={styles.playerProfile}
                  />
                    <Text
                    style={styles.selectedPlayerNameText}>
                      {gameObj.away_team.first_name} {gameObj.away_team.last_name}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.playerView}>
                    <Image
                    source={gameObj?.away_team?.thumbnail ? { uri: gameObj?.away_team?.thumbnail } : images.profilePlaceHolder}
                    style={styles.playerProfile}
                  />
                    <Text numberOfLines={2} style={styles.playerNameText}>
                      {gameObj.away_team.first_name} {gameObj.away_team.last_name}
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
                <Image
                source={images.gameOrangePlus}
                style={{
                  height: 76,
                  width: 76,
                  resizeMode: 'cover',
                  marginLeft: 50,
                }}
              />
                <Image
                source={images.deleteRecentGoal}
                style={{
                  height: 34,
                  width: 34,
                  resizeMode: 'cover',
                  marginLeft: 15,
                }}
              />
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
              {gameObj.status === GameStatus.accepted && (
                <TCGameButton
                title="Start"
                onPress={() => {
                  console.log('ok');
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
                  console.log('ok');
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
                  console.log('ok');
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
                  console.log('ok');
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
                  console.log('ok');
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
          </View>
        )}
      </View>}
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
});
