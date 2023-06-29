// @flow
import moment from 'moment';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {getGameScoreboardEvents} from '../../../../../api/Games';
import AuthContext from '../../../../../auth/context';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import Verbs from '../../../../../Constants/Verbs';
import {getJSDate} from '../../../../../utils';

const GameCard = ({containerStyle = {}, data = {}, onCardPress = () => {}}) => {
  const [counts, setCounts] = useState({homeTeam: 0, awayTeam: 0});
  const authContext = useContext(AuthContext);
  const getMatchList = useCallback(() => {
    const params = {
      sport: data.data?.sport,
      role: Verbs.entityTypePlayer,
    };

    getGameScoreboardEvents(authContext.entity.obj.user_id, params, authContext)
      .then((res) => {
        const obj = res.payload.find((item) => item.game_id === data.id);
        if (obj) {
          let homeTeamWinCount = 0;
          let awayTeamWinCount = 0;
          (obj.scoreboard?.sets ?? []).forEach((ele) => {
            homeTeamWinCount += ele.home_team_win_count;
            awayTeamWinCount += ele.away_team_win_count;
          });

          setCounts({homeTeam: homeTeamWinCount, awayTeam: awayTeamWinCount});
        }
      })
      .catch((err) => {
        console.log({err});
      });
  }, [data, authContext]);

  useEffect(() => {
    if (data.id) {
      getMatchList();
    }
  }, [data, getMatchList]);

  return (
    <Pressable style={[styles.parent, containerStyle]} onPress={onCardPress}>
      <View style={styles.row}>
        <Text style={styles.dateTime}>
          {moment(getJSDate(data.data?.start_time).getTime()).format(
            'ddd, MMM DD · HH:mma',
          )}
        </Text>
        <View style={styles.verticalLineSeparator} />
        <View style={{flex: 1}}>
          <Text
            style={[styles.dateTime, {fontFamily: fonts.RRegular}]}
            numberOfLines={1}>
            {data.data.venue?.address}
          </Text>
        </View>
      </View>
      <View
        style={[styles.row, {justifyContent: 'space-between', marginTop: 8}]}>
        <View style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
          <View style={styles.logoContainer}>
            <Image
              source={
                data.home_team?.data?.thumbnail
                  ? {uri: data.home_team.data.thumbnail}
                  : images.teamPH
              }
              style={[styles.image, {borderRadius: 15}]}
            />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
              numberOfLines={2}>
              {data.home_team?.data?.full_name}
            </Text>
          </View>
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
            style={[
              styles.score,
              counts.homeTeam > counts.awayTeam
                ? styles.winnerScore
                : {color: colors.userPostTimeColor},
            ]}>
            {counts.homeTeam} <Text style={styles.score}>:</Text>{' '}
            <Text
              style={[
                styles.score,
                counts.homeTeam < counts.awayTeam
                  ? styles.winnerScore
                  : {color: colors.userPostTimeColor},
              ]}>
              {counts.awayTeam}
            </Text>
          </Text>
        </View>

        <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
          <View style={{flex: 1}}>
            <Text
              style={[
                styles.dateTime,
                {fontFamily: fonts.RMedium, textAlign: 'right'},
              ]}
              numberOfLines={2}>
              {data.away_team?.data?.full_name}
            </Text>
          </View>
          <View style={[styles.logoContainer, {marginLeft: 5}]}>
            <Image
              source={
                data.away_team?.data?.thumbnail
                  ? {uri: data.away_team.data.thumbnail}
                  : images.teamPH
              }
              style={[styles.image, {borderRadius: 15}]}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 7,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    marginRight: 5,
  },
  dateTime: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  verticalLineSeparator: {
    width: 1,
    height: 10,
    backgroundColor: colors.darkGrey,
    marginLeft: 8,
    marginRight: 10,
  },
  score: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  winnerScore: {
    fontFamily: fonts.RBold,
    color: colors.tabFontColor,
  },
});
export default GameCard;
