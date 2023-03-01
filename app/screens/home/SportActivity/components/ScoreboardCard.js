// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import GameStatus from '../../../../Constants/GameStatus';
import images from '../../../../Constants/ImagePath';

const ScoreboardCard = ({item = {}, style = {}}) => {
  const getWinCount = () => {
    let homeTeamWinCount = 0;
    let awayTeamWinCount = 0;
    (item.scoreboard?.sets ?? []).forEach((ele) => {
      homeTeamWinCount += ele.home_team_win_count;
      awayTeamWinCount += ele.away_team_win_count;
    });
    return (
      <View style={{alignItems: 'center', marginHorizontal: 12}}>
        <Text style={styles.goals}>
          <Text
            style={[
              styles.goals,
              homeTeamWinCount > awayTeamWinCount
                ? {color: colors.themeColor}
                : {color: colors.userPostTimeColor},
            ]}>
            {homeTeamWinCount}
          </Text>{' '}
          :{' '}
          <Text
            style={[
              styles.goals,
              homeTeamWinCount < awayTeamWinCount
                ? {color: colors.themeColor}
                : {color: colors.userPostTimeColor},
            ]}>
            {awayTeamWinCount}
          </Text>
        </Text>
      </View>
    );
  };
  return (
    <View style={[styles.card, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={images.scoreBoardBackgroundImage}
          style={[
            styles.image,
            {borderTopLeftRadius: 5, borderTopRightRadius: 5},
          ]}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.row}>
          <Text style={styles.dateTime}>
            {moment(item.start_datetime).format('ddd, MMM DD · HH:mma')}
          </Text>
          <View style={styles.verticalLine} />
          <Text
            style={
              styles.dateTime
            }>{`${item.venue?.city}, ${item.venue?.country}`}</Text>
        </View>

        <View
          style={[styles.row, {justifyContent: 'space-between', marginTop: 8}]}>
          <View style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
            <View style={[styles.logoContainer, {marginRight: 5}]}>
              <Image
                source={
                  item.home_team?.thumbnail
                    ? {uri: item.home_team.thumbnail}
                    : images.teamPH
                }
                style={[styles.image, {borderRadius: 15}]}
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
                numberOfLines={2}>
                {item.home_team?.full_name}
              </Text>
            </View>
          </View>
          {item.start_datetime > new Date().getTime() &&
          item.status !== GameStatus.ended
            ? null
            : getWinCount()}

          <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.dateTime,
                  {fontFamily: fonts.RMedium, textAlign: 'right'},
                ]}
                numberOfLines={2}>
                {item.away_team?.full_name}
              </Text>
            </View>
            <View style={[styles.logoContainer, {marginLeft: 5}]}>
              <Image
                source={
                  item.away_team?.thumbnail
                    ? {uri: item.away_team.thumbnail}
                    : images.teamPH
                }
                style={[styles.image, {borderRadius: 15}]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 303,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 15,
  },
  imageContainer: {
    width: 303,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bottomContainer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 7,
  },
  dateTime: {
    fontSize: 12,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  verticalLine: {
    height: 10,
    width: 1,
    marginHorizontal: 10,
    backgroundColor: colors.darkGrey,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  logoContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
  },
  goals: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default ScoreboardCard;
