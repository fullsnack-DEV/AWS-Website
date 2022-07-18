import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCGameDetailRules = ({
  gameRules,
  isMore = true,
  onPressMoreLess,
  isShowTitle = true,
}) => {
  console.log('gameRulesgameRules;;', gameRules);
  return (
    <View style={{marginTop: 10}}>
      {isShowTitle && (
        <View
          style={{
            flexDirection: 'row',
            margin: 15,
            marginTop: 0,
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.mainTitle}>SETS, GAMES & DURATION</Text>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          margin: 15,
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.mainRulesTitle}>Number Of Sets to Win a Match</Text>
        <Text style={styles.subRulesTitle}>
          {gameRules?.total_sets} <Text style={styles.lightSubTitle}>Sets</Text>
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          margin: 15,
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.mainRulesTitle}>Number Of Games to Win a Set</Text>
        <Text style={styles.subRulesTitle}>
          {gameRules?.total_available_games_in_set}{' '}
          <Text style={styles.lightSubTitle}>Games</Text>
        </Text>
      </View>

      {gameRules?.win_set_by_two_games && (
        <Text
          style={{
            marginLeft: 30,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
          }}
        >
          • A player must win a set by two games.
        </Text>
      )}

      {isMore && (
        <View>
          {gameRules?.apply_tiebreaker_in_game && (
            <>
              <Text
                style={{
                  marginLeft: 30,
                  fontSize: 14,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}
              >
                Tie-breaker
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  margin: 15,
                  marginLeft: 45,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.lightSubTitle}>
                  • Play tie-breaker after the game scores are{'\n'}
                  <Text style={styles.subRulesTitle}>
                    {'  '}
                    {gameRules?.tiebreaker_apply_at}:
                    {gameRules?.tiebreaker_apply_at}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 15,
                  marginLeft: 45,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.lightSubTitle}>
                  • Winning points in tie-breaker are{' '}
                  <Text style={styles.subRulesTitle}>
                    {gameRules?.winning_point_in_tiebreaker}
                  </Text>
                  .
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 15,
                  marginLeft: 45,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.lightSubTitle}>
                  • A player must win the tie-breaker by two points
                </Text>
              </View>
            </>
          )}

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginBottom: 5,
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.mainRulesTitle}>Maximum Match Duration</Text>
            <Text style={styles.subRulesTitle}>
              {gameRules?.match_duration}
            </Text>
          </View>

          <View
            style={{
              margin: 15,
              marginBottom: 5,
            }}
          >
            <Text style={styles.mainRulesTitle}>Details</Text>
            <Text style={styles.lightSubTitle}>{gameRules?.details}</Text>
          </View>
        </View>
      )}
      <Text
        style={[styles.lightSubTitle, {textAlign: 'right', marginRight: 15}]}
        onPress={onPressMoreLess}
      >
        {isMore ? 'less' : 'more'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainRulesTitle: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  mainTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  subRulesTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  lightSubTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
});
export default TCGameDetailRules;
