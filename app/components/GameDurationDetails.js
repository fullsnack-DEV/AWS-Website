// @flow
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const GameDurationDetails = ({game_duration = {}}) => (
  <View style={styles.parent}>
    <View style={{marginBottom: 15}}>
      <Text style={styles.label}>{strings.noOfSets}</Text>
      <Text style={styles.value}>
        {format(
          strings.bestOfSets,
          game_duration.total_sets,
          game_duration.total_sets === 1 ? strings.set : strings.sets,
        )}
      </Text>
    </View>

    <View style={{marginBottom: 15}}>
      <Text style={styles.label}>{strings.noOfGamesInSet}</Text>
      <Text style={styles.value}>
        {format(
          strings.bestOfSets,
          game_duration.total_available_games_in_set,
          game_duration.total_available_games_in_set === 1
            ? strings.set
            : strings.sets,
        )}
      </Text>
      <View style={{paddingLeft: 10}}>
        <Text style={styles.value}>
          •{'  '}
          {game_duration.win_set_by_two_games
            ? strings.winsSetByTwoGames
            : strings.winsSetByOneGame}
        </Text>
      </View>
      {game_duration.apply_tiebreaker_in_game ? (
        <View style={{paddingLeft: 20}}>
          <Text>
            •{'  '}
            {strings.applyTimebreaker}
          </Text>
          <View
            style={{
              marginLeft: 10,
              borderLeftWidth: 3,
              marginTop: 10,
              paddingLeft: 10,
              borderLeftColor: colors.ligherGray,
            }}>
            <Text style={styles.value}>
              {strings.tieBreakerAppliedAt}
              <Text
                style={[
                  styles.value,
                  {fontFamily: fonts.RBold},
                ]}>{` ${game_duration.tiebreaker_apply_at}:${game_duration.tiebreaker_apply_at}`}</Text>
            </Text>

            <Text style={styles.value}>
              {strings.winTieBreakerSetAt}
              <Text
                style={[
                  styles.value,
                  {fontFamily: fonts.RBold},
                ]}>{` ${game_duration.winning_point_in_tiebreaker} ${strings.pointText}s`}</Text>
            </Text>

            <Text style={styles.value}>
              •{'  '}
              {game_duration.win_two_points_in_tiebreaker
                ? strings.winSetByTwoInTieBreaker
                : strings.winSetByOneInTieBreaker}
            </Text>
          </View>
        </View>
      ) : null}
    </View>

    <Text style={styles.label}>{strings.maxMatchDuration}</Text>
    <Text style={[styles.value, {fontFamily: fonts.RBold}]}>
      {game_duration.match_duration}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 13,
    paddingTop: 18,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
});
export default GameDurationDetails;
