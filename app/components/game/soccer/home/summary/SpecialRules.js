import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';

const SpecialRules = ({ specialRulesData }) => (<View style={styles.mainContainer}>
  <Text style={styles.title}>
    Rules
  </Text>
  <View style={{ marginTop: hp(1), marginLeft: wp(1) }}>
    <Text style={styles.ruleText}>{specialRulesData}</Text>
  </View>
</View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  ruleText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

})
export default SpecialRules;
