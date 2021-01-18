import {
  View, StyleSheet, FlatList, Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';
import TCGameScoreLeft from '../../../../gameRecordList/TCGameScoreLeft';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCGameScoreRight from '../../../../gameRecordList/TCGameScoreRight';
import TCInnerLoader from '../../../../TCInnerLoader';
import TCGameState from '../../../../gameRecordList/TCGameState';
import { soccerGameStats } from '../../../../../utils/gameUtils';

const MIN_MATCH_RECORD_TO_DISPLAY = 5;
const MatchRecordsList = ({
  gameData,
  gameId = null,
  getGameMatchRecords,
}) => {
  const [loading, setLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (gameId) {
        setLoading(true);
        getGameMatchRecords(gameId).then((res) => {
          setMatchRecords(res.payload);
        }).finally(() => setLoading(false));
      }
    }
  }, [isFocused])
  return (
    <View style={styles.mainContainer}>
      <TCInnerLoader visible={loading}/>
      {!loading && (<FlatList
        scrollEnabled={false}
        keyExtractor={(item, index) => index?.toString()}
        bounces={false}
        data={matchRecords.slice(0, MIN_MATCH_RECORD_TO_DISPLAY)}
        renderItem={({ item, index }) => {
          const isHomeTeam = item?.game?.home_team === item.team_id;
          const isGameState = item.verb in soccerGameStats;
          return (
            <View key={index}>
              {!isGameState && isHomeTeam && (
                <TCGameScoreLeft
                    gameData={gameData}
                    memberData={'d'}
                    recordData={item}
                    editor={true}
                />
              )}
              {!isGameState && !isHomeTeam && (
                <TCGameScoreRight
                    gameData={gameData}
                    recordData={item}
                    editor={true}
                />
              )}
              {isGameState && <TCGameState recordData={item}/>}
            </View>
          )
        }}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.notAvailableTextStyle}>
              Not available yet
            </Text>
          </View>
        )}/>
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
