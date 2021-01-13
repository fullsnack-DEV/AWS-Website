import React, {
  useState, useLayoutEffect, useEffect, Fragment, useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  FlatList, StatusBar,
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
import { getGameData, getGameMatchRecords } from '../../../api/Games';
import { soccerGameStats } from '../../../utils/gameUtils';

export default function SoccerRecordList({ route, navigation }) {
  const authContext = useContext(AuthContext)
  const [editorChecked, setEditorChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const [gameData, setGameData] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { alignSelf: 'center' },
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadAtOnce()
  }, [])

  const loadAtOnce = async () => {
    const gameId = route?.params?.gameId ?? null
    if (gameId) {
      setLoading(true);
      setGameData(route?.params?.gameData ?? null);
      getGameData(gameId, true, authContext).then(async (res) => {
        if (res.status) {
          setGameData(res.payload ?? 0);
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

  return (
    <View style={ styles.mainContainer }>
      <StatusBar barStyle={'dark-content'}/>
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
          {/* <Text style={{ ...styles.centerText, color: colors.themeColor }}> */}
          {/*  {gameData?.home_team_goal ?? 0} */}
          {/* </Text> */}
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
              renderItem={({ item }) => {
                const isHomeTeam = item?.game?.home_team === item.team_id;
                const isGameState = item.verb in soccerGameStats;
                return (
                  <View>
                    {!isGameState && isHomeTeam && (
                      <TCGameScoreLeft
                              gameData={gameData}
                              recordData={item}
                              editor={editorChecked}
                          />
                    )}
                    {!isGameState && !isHomeTeam && (
                      <TCGameScoreRight
                              gameData={gameData}
                              recordData={item}
                              editor={editorChecked}
                          />
                    )}
                    {isGameState && <TCGameState recordData={item}/>}
                  </View>
                )
              }}
              onRefresh={async () => { await loadAtOnce() }}
              refreshing={loading}
              ListEmptyComponent={() => (
                <View>
                  {!loading && <Text style={styles.notAvailableTextStyle}>
                    Not available yet
                  </Text>}
                </View>
              )}/>
        <View style={ styles.updatedByView }>
          {matchRecords.length > 0 && <Text
                      style={ {
                        color: colors.grayColor,
                        // fontFamily: fonts.RLight,
                        fontSize: 14,
                        marginLeft: 10,
                      } }>
            Last updated by{'\n'}({matchRecords[matchRecords.length - 1]?.recorded_by_team_name})
          </Text>}
          <Text
                      style={ {
                        color: colors.themeColor,
                        // fontFamily: fonts.RLight,
                        fontSize: 14,
                        marginLeft: 10,
                      } }>

          </Text>
        </View>
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
  updatedByView: {
    height: hp('10%'),
    marginTop: 10,
  },
  notAvailableTextStyle: {
    marginTop: hp(5),
    textAlign: 'center',
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
