import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import TCThinDivider from '../TCThinDivider';

export default function MatchFeesCard() {
  return (

    <View style={styles.backgroundView}>
      <View style={styles.feesRow}>
        <Text style={styles.matchServiceFeeText}>Match fee <Text style={styles.smallFeeText}>$20 CAD x 2 hours</Text></Text>
        <Text style={styles.matchServiceFeeText}>$40 CAD</Text>
      </View>
      <View style={styles.feesRow}>
        <Text style={styles.matchServiceFeeText}>Service fee</Text>
        <Text style={styles.matchServiceFeeText}>$40 CAD</Text>
      </View>

      <View style={{ flex: 1 }}/>
      <TCThinDivider width={'94%'}/>
      <View style={[styles.feesRow, { marginBottom: 5 }]}>
        <Text style={styles.feeStructureText}>Total payment</Text>
        <Text style={styles.feeStructureText}>$40 CAD</Text>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    height: 102,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: wp('92%'),
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  feeStructureText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 10,
  },
  matchServiceFeeText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 5,
  },
  smallFeeText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
