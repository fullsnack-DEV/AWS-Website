import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import strings from '../../Constants/String';
import TCThinDivider from '../TCThinDivider';
import {getShortTimeDifForReservation} from '../../utils/Time';

export default function MatchFeesCard({
  senderOrReceiver = 'sender',
  challengeObj,
  type = 'challenge',
}) {
  console.log('Challenge Obj of Fee card :', challengeObj);
  console.log('senderOrReceiver card', senderOrReceiver);
  // eslint-disable-next-line no-return-assign
  return (
    <View style={styles.backgroundView}>
      {challengeObj && (
        <View>
          <View style={styles.feesRow}>
            <Text style={styles.matchServiceFeeText}>
              {(type === 'referee' && strings.refereeFeecardText) ||
                (type === 'challenge' && strings.matchfee) ||
                (type === 'scorekeeper' && strings.scorekeeperFee)}{' '}
              {challengeObj.manual_fee === false && (
                <Text style={styles.smallFeeText}>
                  {' '}
                  ${challengeObj.hourly_game_fee || 0}{' '}
                  {challengeObj?.currency_type?.toUpperCase() ||
                    strings.defaultCurrency}{' '}
                  x{' '}
                  {getShortTimeDifForReservation(
                    challengeObj.start_datetime,
                    challengeObj.end_datetime,
                  )}
                </Text>
              )}
            </Text>
            <Text style={styles.matchServiceFeeText}>
              {`$${parseFloat(
                challengeObj?.total_game_charges ??
                  challengeObj?.total_game_fee,
              ).toFixed(2)} ${
                challengeObj?.currency_type?.toUpperCase() ||
                strings.defaultCurrency
              }`}
            </Text>
          </View>
          <View style={styles.feesRow}>
            <Text style={styles.matchServiceFeeText}>Service fee</Text>
            <Text style={styles.matchServiceFeeText}>
              {senderOrReceiver === 'sender' ? '$' : '-$'}
              {senderOrReceiver === 'sender'
                ? challengeObj?.total_service_fee1?.toFixed(2)
                : challengeObj?.total_service_fee2?.toFixed(2)}{' '}
              {challengeObj?.currency_type?.toUpperCase() ||
                strings.defaultCurrency}
            </Text>
          </View>

          {senderOrReceiver === 'sender' && (
            <View style={styles.feesRow}>
              <Text style={styles.matchServiceFeeText}>
                International card fee
              </Text>
              <Text style={styles.matchServiceFeeText}>
                {senderOrReceiver === 'sender' ? '$' : '-$'}
                {challengeObj?.international_card_fee?.toFixed(2)}{' '}
                {challengeObj?.currency_type?.toUpperCase() ||
                  strings.defaultCurrency}
              </Text>
            </View>
          )}

          <View style={{flex: 1}} />
          <TCThinDivider width={'94%'} />
          <View style={[styles.feesRow, {marginBottom: 5}]}>
            <Text style={styles.feeStructureText}>
              {senderOrReceiver === 'sender'
                ? 'Total payment'
                : 'Total earning'}
            </Text>
            <Text style={styles.feeStructureText}>
              $
              {senderOrReceiver === 'sender'
                ? challengeObj?.total_amount?.toFixed(2)
                : challengeObj?.total_payout?.toFixed(2)}{' '}
              {challengeObj?.currency_type?.toUpperCase() ||
                strings.defaultCurrency}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    height: 120, // 102
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
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
