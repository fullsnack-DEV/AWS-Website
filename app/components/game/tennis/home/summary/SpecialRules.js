import React, { memo } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp } from '../../../../../utils';
import TCChallengeTitle from '../../../../TCChallengeTitle';

const SpecialRules = ({ gameData }) => (<View style={styles.mainContainer}>
  <TCChallengeTitle title={'Game Rules'} />
  <Text style={styles.rulesTitle}>General Rules</Text>
  <Text style={styles.rulesDetail}>{gameData?.general_rules ?? ''}</Text>
  <View style={{ marginBottom: 10 }} />
  <Text style={styles.rulesTitle}>Special Rules</Text>
  <Text style={styles.rulesDetail}>{gameData?.special_rules ?? ''}</Text>
</View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
    paddingBottom: 15,
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

})
export default memo(SpecialRules);
