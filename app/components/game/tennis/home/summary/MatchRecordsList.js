import {
  View, StyleSheet, FlatList, Text,
} from 'react-native';
import React, {
 useCallback, useEffect, useMemo, useState,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import Dash from 'react-native-dash';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCInnerLoader from '../../../../TCInnerLoader';
import { tennisGameStats } from '../../../../../utils/gameUtils';
import TennisGameState from '../gameRecordList/TennisGameState';
import TennisGameScoreLeft from '../gameRecordList/TennisGameScoreLeft';
import TennisGameScoreRight from '../gameRecordList/TennisGameScoreRight';

const MIN_MATCH_RECORD_TO_DISPLAY = 5;

const MatchRecordsList = ({
  gameData,
  gameId = null,
  getGameMatchRecords,
}) => {
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const isFocused = useIsFocused();
  const [teamIds, setTeamIds] = useState(null);

  const loadAtOnce = async () => {
    if (gameId) {
      setLoading(true);
      if (gameData?.user_challenge) {
        setTeamIds({
          home_team: { group_id: gameData?.home_team?.user_id },
          away_team: { group_id: gameData?.away_team?.user_id },
        })
      } else {
        setTeamIds({
          home_team: { group_id: gameData?.home_team?.group_id },
          away_team: { group_id: gameData?.away_team?.group_id },
        })
      }
      getGameMatchRecords(gameId).then((matchRes) => {
        console.log('gameId', gameId);

        console.log('matchRes.payload', matchRes.payload);
        setMatchRecords(matchRes.payload);
      }).finally(() => setLoading(false));
    }
  }

  useEffect(() => {
      if (isFocused) {
          loadAtOnce();
      }
  }, [gameData, isFocused]);

  const RenderDash = useCallback(({ zIndex = 0 }) => (
    <Dash
          style={ {
            alignItems: 'center',
            justifyContent: 'center',
            width: wp(100),
            alignSelf: 'center',
            flex: 1,
            zIndex,
            height: '100%',
            position: 'absolute',
            flexDirection: 'column',
          } }
          dashColor={ colors.lightgrayColor }
      />
  ), [])

  const renderGameRecords = useCallback(({ item }) => {
    const isHomeTeam = teamIds?.home_team?.group_id === item.team_id;
    const isGameState = item.verb in tennisGameStats;

    return (
      <View>
        {!isGameState && isHomeTeam && (
          <View>
            <RenderDash zIndex={1}/>
            <TennisGameScoreLeft
                    gameData={gameData}
                    recordData={item}
                />
          </View>
        )}
        {!isGameState && !isHomeTeam && (
          <View>
            <RenderDash zIndex={1}/>
            <TennisGameScoreRight
                    gameData={gameData}
                    recordData={item}
                />
          </View>
        )}
        {isGameState && <TennisGameState recordData={item}/>}
      </View>
    )
  }, [gameData, teamIds?.home_team?.group_id])

  const ListEmptyComponent = useMemo(() => (
    <View>
      <Text style={styles.notAvailableTextStyle}>
        Not available yet
      </Text>
    </View>
  ), []);

  const matchRecordsKeyExtractor = useCallback((item, index) => index?.toString(), [])
  return (
    <View style={styles.mainContainer}>
      <TCInnerLoader visible={loading}/>
      {!loading && (<FlatList
                scrollEnabled={false}
                keyExtractor={matchRecordsKeyExtractor}
                bounces={false}
                data={matchRecords.slice(0, MIN_MATCH_RECORD_TO_DISPLAY) ?? []}
                renderItem={renderGameRecords}
                ListEmptyComponent={ListEmptyComponent}/>
      )}
      <View style={styles.seperateContainer}>

      </View>
      <Text style={styles.listFooterText}>This game record hasn’t yet been confirmed by teams. </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  notAvailableTextStyle: {
    marginLeft: wp(5),
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  seperateContainer: {
    width: '90%',
    alignSelf: 'center',
    height: 0.3,
    backgroundColor: colors.darkGrayTrashColor,
    marginVertical: hp(1),
  },
  listFooterText: {
    color: colors.orangeNotesColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    alignSelf: 'center',
    marginBottom: hp(1),
  },
})
export default MatchRecordsList;
