/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import {
 FlatList, Image, StyleSheet, Text, View,
 } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import TCThinDivider from '../../TCThinDivider';
import colors from '../../../Constants/Colors';

let setsData = [];
const scoreData = [{}, {}, {}];
let homeTeamGamePoint = 0;
let awayTeamGamePoint = 0;
let homeTeamMatchPoint = 0;
let awayTeamMatchPoint = 0;
export default function TennisScoreView({ scoreDataSource, marginTop = '10%' }) {
  useEffect(() => {
    setsData = [];
    console.log('scoreDataSource', scoreDataSource);
    if (scoreDataSource?.scoreboard) {
      if (Object.keys(scoreDataSource?.scoreboard).length > 0) {
        const reversSets = scoreDataSource?.scoreboard?.sets?.reverse();

        // scoreDataSource?.score_rules?.total_sets
        for (let i = 0; i < 3; i++) {
          if (reversSets[i]) {
            setsData.push(reversSets[i]);
          } else {
            setsData.push({});
          }
        }
        calculateMatchScore();
        calculateGameScore();
      } else {
        setsData = [{}, {}, {}];
        homeTeamGamePoint = 0;
        awayTeamGamePoint = 0;
        homeTeamMatchPoint = 0;
        awayTeamMatchPoint = 0;
      }
    }
  }, [scoreDataSource]);

  const renderScores = ({ item, index }) => {
    console.log('Render score item:=>', item);
    if (item?.s_id) {
      if (item?.s_id === scoreDataSource?.scoreboard?.game_inprogress?.s_id) {
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.scoreTitle}>{index + 1}</Text>
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.scoreView}>
              <Text style={[styles.player1Score, { color: colors.whiteColor }]}>
                {item?.s_id ? item?.home_team_win_count : '-'}
              </Text>
              <TCThinDivider />
              <Text style={[styles.player2Score, { color: colors.whiteColor }]}>
                {item?.s_id ? item?.away_team_win_count : '-'}
              </Text>
            </LinearGradient>
          </View>
        );
      }
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.scoreTitle}>{index + 1}</Text>
        <View style={styles.scoreView}>
          <Text style={styles.player1Score}>
            {item?.s_id ? item?.home_team_win_count : '-'}
          </Text>
          <TCThinDivider />
          <Text style={styles.player2Score}>
            {item?.s_id ? item?.away_team_win_count : '-'}
          </Text>
        </View>
      </View>
    );
  };

  const getHomeGameScore = () => {
    console.log('end_datetime::', scoreDataSource?.scoreboard?.sets);
    if (scoreDataSource?.scoreboard?.sets?.[0].end_datetime) {
      return '0';
    }
    return scoreDataSource?.scoreboard?.sets?.[0].home_team_win_count || '0';
  };

  const getAwayGameScore = () => {
    console.log(
      'end_datetime::',
      scoreDataSource?.scoreboard?.sets?.[0].end_datetime,
    );
    if (scoreDataSource?.scoreboard?.sets?.[0].end_datetime) {
      return '0';
    }
    return scoreDataSource?.scoreboard?.sets?.[0].away_team_win_count || '0';
  };

  const renderCurruentScores = ({ index }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.scoreTitle}>
        {(index === 0 && 'Sets')
          || (index === 1 && 'Games')
          || (index === 2 && 'Points')}
      </Text>
      <View style={styles.scoreView}>
        <Text
          style={
            (index === 0 && homeTeamMatchPoint > awayTeamMatchPoint)
            || (index === 1
              && (scoreDataSource?.scoreboard?.sets?.length
                ? scoreDataSource?.scoreboard?.sets?.[0]?.home_team_win_count
                : 0)
                > (scoreDataSource?.scoreboard?.sets?.length
                  ? scoreDataSource?.scoreboard?.sets?.[0]?.away_team_win_count
                  : 0))
            || (index === 2 && homeTeamGamePoint > awayTeamGamePoint)
              ? [styles.player1Score, { color: colors.themeColor }]
              : styles.player1Score
          }>
          {(index === 0 && `${homeTeamMatchPoint}`)
            || (index === 1 && getHomeGameScore())
            || (index === 2 && `${homeTeamGamePoint}`)}
        </Text>
        <TCThinDivider />
        {/* <Text
          style={
            (index === 0 && homeTeamMatchPoint < awayTeamMatchPoint)
            || (index === 1
              && (scoreDataSource?.scoreboard?.sets?.length ? scoreDataSource?.scoreboard?.sets?.[scoreDataSource?.scoreboard?.sets?.length - 1 || 0]?.home_team_win_count : 0)
                < (scoreDataSource?.scoreboard?.sets?.length ? scoreDataSource?.scoreboard?.sets?.[scoreDataSource?.scoreboard?.sets?.length - 1 || 0]?.away_team_win_count : 0))
            || (index === 2 && homeTeamGamePoint < awayTeamGamePoint)
              ? [styles.player2Score, { color: colors.themeColor }]
              : styles.player2Score
          }>
          {(index === 0 && `${awayTeamMatchPoint}`)
            || (index === 1
              && (scoreDataSource?.scoreboard?.sets[scoreDataSource?.scoreboard?.sets?.length - 1].away_team_win_count.toString() ?? '0'))
            || (index === 2 && `${awayTeamGamePoint}`)}
        </Text> */}
        <Text
          style={
            (index === 0 && homeTeamMatchPoint < awayTeamMatchPoint)
            || (index === 1
              && (scoreDataSource?.scoreboard?.sets?.length
                ? scoreDataSource?.scoreboard?.sets?.[0]?.home_team_win_count
                : 0)
                < (scoreDataSource?.scoreboard?.sets?.length
                  ? scoreDataSource?.scoreboard?.sets?.[0]?.away_team_win_count
                  : 0))
            || (index === 2 && homeTeamGamePoint < awayTeamGamePoint)
              ? [styles.player2Score, { color: colors.themeColor }]
              : styles.player2Score
          }>
          {(index === 0 && `${awayTeamMatchPoint}`)
            || (index === 1 && getAwayGameScore())
            || (index === 2 && `${awayTeamGamePoint}`)}
        </Text>
      </View>
    </View>
  );

  const calculateMatchScore = () => {
    homeTeamMatchPoint = 0;
    awayTeamMatchPoint = 0;
    let homePoint = 0;
    let awayPoint = 0;
    // eslint-disable-next-line no-unused-expressions
    scoreDataSource?.scoreboard?.sets.map((e) => {
      if (e.winner) {
        if (e.winner === (scoreDataSource.home_team.user_id || scoreDataSource.home_team.group_id)) {
          homePoint += 1;
        } else {
          awayPoint += 1;
        }
      }
      homeTeamMatchPoint = homePoint;
      awayTeamMatchPoint = awayPoint;
    });
  };
  const calculateGameScore = () => {
    // eslint-disable-next-line array-callback-return
    if (
      scoreDataSource?.scoreboard?.game_inprogress?.winner
      || scoreDataSource?.scoreboard?.game_inprogress?.end_datetime
    ) {
      homeTeamGamePoint = 0;
      awayTeamGamePoint = 0;

      console.log(
        'GAME SCORE:',
        `HOME:${homeTeamGamePoint}AWAY:${awayTeamGamePoint}`,
      );
    } else {
      homeTeamGamePoint = scoreDataSource?.scoreboard?.game_inprogress?.home_team_point;
      awayTeamGamePoint = scoreDataSource?.scoreboard?.game_inprogress?.away_team_point;
      console.log(
        'GAME SCORE:',
        `HOME:${homeTeamGamePoint}AWAY:${awayTeamGamePoint}`,
      );
    }
  };

  return (
    <View style={[styles.scoreContainer, { marginTop }]}>
      <View style={styles.leftScoreView}>
        <FlatList
          data={setsData}
          renderItem={renderScores}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: 'transparent', width: 5 }}></View>
          )}
          style={{ alignSelf: 'center' }}
        />
      </View>
      <View style={styles.centerScoreContainer}>
        <Text style={styles.centerTitle}>Player</Text>
        <View style={styles.centerScoreView}>
          <Image
            source={
              scoreDataSource?.home_team?.thumbnail
                ? { uri: scoreDataSource?.home_team?.thumbnail }
                : images.profilePlaceHolder
            }
            style={styles.player1Image}
          />
          <Image
            source={
              scoreDataSource?.away_team?.thumbnail
                ? { uri: scoreDataSource?.away_team?.thumbnail }
                : images.profilePlaceHolder
            }
            style={styles.player2Image}
          />
        </View>
      </View>
      <View style={{ width: '44%', height: 112 }}>
        <FlatList
          data={scoreData}
          renderItem={renderCurruentScores}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: 'transparent', width: 5 }}></View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ alignSelf: 'center' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row',
    height: 112,
    width: '100%',

    paddingLeft: 15,
    paddingRight: 15,
  },
  leftScoreView: {
    width: '44%',
    height: 112,
  },
  centerScoreContainer: {
    width: '12%',
    height: 112,
    alignItems: 'center',
  },
  centerScoreView: {
    flex: 1,
    width: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  centerTitle: {
    marginBottom: 5,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  player1Image: {
    height: 27,
    width: 27,
    marginTop: 10,
    borderRadius: 14,
  },
  player2Image: {
    height: 27,
    width: 27,
    marginBottom: 10,
    borderRadius: 14,
  },

  scoreTitle: {
    marginBottom: 5,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  scoreView: {
    flex: 1,
    width: 45,
    backgroundColor: colors.lightBG,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  player1Score: {
    marginTop: 10,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  player2Score: {
    marginBottom: 10,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
