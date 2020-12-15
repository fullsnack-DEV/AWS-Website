import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import strings from '../../Constants/String';
import TCThinDivider from '../TCThinDivider';

export default function MatchFeesCard({ senderOrReceiver = 'sender', challengeObj }) {
  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let time = ''

    if (hours > 0) {
      if (hours > 1) {
        time = `${hours} hours `
      } else {
        time = `${hours} hour `
      }
    }

    if (minutes > 0) {
      if (minutes > 1) {
        time = `${minutes} minutes`
      } else {
        time = `${minutes} minute`
      }
    }

    return time;
  };

  return (
    <View style={styles.backgroundView}>
      {challengeObj && <View>
        <View style={styles.feesRow}>
          <Text style={styles.matchServiceFeeText}>{strings.matchfee}<Text style={styles.smallFeeText}> ${challengeObj.hourly_game_fee} {challengeObj.currency_type || 'CAD'} x {getTimeDifferent(challengeObj.start_datetime, challengeObj.end_datetime)}</Text></Text>
          <Text style={styles.matchServiceFeeText}>${challengeObj.total_game_charges?.toFixed(2)} {challengeObj.currency_type || 'CAD'}</Text>
        </View>
        <View style={styles.feesRow}>
          <Text style={styles.matchServiceFeeText}>
            Service fee
          </Text>
          <Text style={styles.matchServiceFeeText}>
            ${senderOrReceiver === 'sender' ? challengeObj.service_fee1_charges?.toFixed(2) : challengeObj.service_fee2_charges?.toFixed(2)} {challengeObj.currency_type || 'CAD'}
          </Text>
        </View>

        <View style={{ flex: 1 }}/>
        <TCThinDivider width={'94%'}/>
        <View style={[styles.feesRow, { marginBottom: 5 }]}>
          <Text style={styles.feeStructureText}>
            {senderOrReceiver === 'sender' ? 'Total payment' : 'Total earning'}
          </Text>
          <Text style={styles.feeStructureText}>
            ${senderOrReceiver === 'sender' ? challengeObj.total_charges?.toFixed(2) : challengeObj.total_payout?.toFixed(2)} {challengeObj.currency_type || 'CAD'}
          </Text>
        </View>
      </View>}
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
