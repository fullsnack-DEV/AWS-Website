import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import {heightPercentageToDP as hp} from '../../../../../utils';

const SpecialRules = ({specialRulesData}) => (
  <View style={styles.mainContainer}>
    <View>
      <Text style={styles.title}>Game rules</Text>
      <Text style={styles.rulesTitle}>General Rules</Text>
      <Text style={styles.rulesDetail}>{specialRulesData?.general_rules}</Text>
      <View style={{marginBottom: 10}} />
      <Text style={styles.rulesTitle}>Special Rules</Text>
      <Text style={styles.rulesDetail}>{specialRulesData?.special_rules}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
});
export default SpecialRules;
