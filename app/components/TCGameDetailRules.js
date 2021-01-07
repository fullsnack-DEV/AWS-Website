import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCThinDivider from './TCThinDivider';

const TCGameDetailRules = ({ gameRules }) => (
  <View style={{ marginTop: 10 }}>
    <View style={{ flexDirection: 'row', margin: 15, justifyContent: 'space-between' }}>
      <Text style={styles.mainRulesTitle}>NUMBER OF SETS</Text><Text style={styles.subRulesTitle}>{gameRules.total_sets} Sets</Text>
    </View>
    <TCThinDivider width={'92%'}/>

    <View style={{ flexDirection: 'row', margin: 15, justifyContent: 'space-between' }}>
      <Text style={styles.mainRulesTitle}>NUMBER OF GAME TO WIN SETS</Text><Text style={styles.subRulesTitle}>{gameRules.winning_point_in_game} Games</Text>
    </View>

    <Text style={{
      marginLeft: 15,
      marginBottom: 10,
      fontSize: 12,
      fontFamily: fonts.RMedium,
      color: colors.userPostTimeColor,
    }}>Apply deuce</Text>
    <Text style={{
      marginLeft: 15,
      fontSize: 12,
      fontFamily: fonts.RMedium,
      color: colors.userPostTimeColor,
    }}>Apply tie-breaker</Text>

    <View style={{
      flexDirection: 'row', margin: 15, marginLeft: 30, justifyContent: 'space-between',
    }}>
      <Text style={styles.subRulesTitle}>APPLY TIE-BREAKER AFTER{'\n'}THE GAME SCORE ARE</Text><Text style={styles.subRulesTitle}>{gameRules.tiebreaker_apply_at}:{gameRules.tiebreaker_apply_at}</Text>
    </View>
    <View style={{
      flexDirection: 'row', margin: 15, marginLeft: 30, justifyContent: 'space-between',
    }}>
      <Text style={styles.subRulesTitle}>WINNING POINTS IN{'\n'}TIE-BREAKER</Text><Text style={styles.subRulesTitle}>{gameRules.winning_point_in_tiebreaker} Points</Text>
    </View>
    <Text style={{
      marginLeft: 15,
      marginBottom: 10,
      fontSize: 12,
      fontFamily: fonts.RMedium,
      color: colors.userPostTimeColor,
    }}>Apply deuce in tie-breaker</Text>

    <TCThinDivider width={'92%'}/>
    <View style={{
      flexDirection: 'row', margin: 15, marginBottom: 5, justifyContent: 'space-between',
    }}>
      <Text style={styles.mainRulesTitle}>NUMBER OF POINTS TO WIN A GAME</Text><Text style={styles.subRulesTitle}>{gameRules.winning_point_in_game} Points</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({

  mainRulesTitle: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
  subRulesTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },

})
export default TCGameDetailRules;
