import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';

export default function GameFeeCard({ feeObject, currency, isChallenger }) {
  // eslint-disable-next-line no-return-assign
  return (
    <View style={styles.mainContainer}>
      <View style={styles.feeContainer}>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            Game Fee
          </Text>
        </View>
        <View>
          <Text
            style={[styles.normalTextStyle, { marginLeft: 0 }]}>{`$${parseFloat(
            feeObject?.total_game_fee,
          ).toFixed(2)} ${currency}`}</Text>
        </View>
      </View>
      <View style={styles.feeContainer}>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            Service Fee
          </Text>
        </View>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            {isChallenger
              ? `$${parseFloat(feeObject?.total_service_fee1).toFixed(
                  2,
                )} ${currency}`
              : `$${parseFloat(feeObject?.total_service_fee2).toFixed(
                  2,
                )} ${currency}`}
          </Text>
        </View>
        
      </View>

      {isChallenger && <View style={styles.feeContainer}>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            International Card Fee
          </Text>
        </View>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            {`$${parseFloat(feeObject?.international_card_fee).toFixed(
                  2,
                )} ${currency}`}
          </Text>
        </View>
      </View>}

      <TCThinDivider marginBottom={10} marginTop={10} />
      <View style={styles.feeContainer}>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            Total payment
          </Text>
        </View>
        <View>
          <Text style={[styles.normalTextStyle, { marginLeft: 0 }]}>
            {isChallenger
              ? `$${parseFloat(feeObject?.total_amount).toFixed(2)} ${currency}`
              : `$${parseFloat(feeObject?.total_payout).toFixed(
                  2,
                )} ${currency}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  normalTextStyle: {
    marginLeft: 25,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.RRegular,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  mainContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
});
