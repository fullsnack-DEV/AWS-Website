import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ReservationStatusView({ data }) {
  return (

    <View style={styles.reservationTitleView}>
      <TouchableOpacity>
        <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.borderView}>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>Feb{'\n'}15</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.reservationTypeView}>
        <Text style={[styles.reservationText, { color: '#FF4E00' }]}>
          RESERVATION REQUEST SENT
        </Text>

        {data.responsible_to_secure_venue && (
          <Text style={styles.matchText}>Match · {data.sport}</Text>
        )}
        {data.referee && data.game && (
          <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
        )}
        {data.scorekeeper && data.game && (
          <Text style={styles.matchText}>
            Scorekeeper · {data.game.sport}
          </Text>
        )}
      </View>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${data.amount} CAD</Text>
        <Text style={styles.cancelAmountText}>$35 CAD</Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  amountText: {
    color: colors.reservationAmountColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
    textAlign: 'right',
  },
  amountView: {
    marginTop: 10,
    position: 'absolute',
    right: 15,
  },

  borderView: {
    alignItems: 'center',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    marginLeft: 15,
    width: 54,
  },

  cancelAmountText: {
    color: colors.veryLightGray,
    fontFamily: fonts.RLight,
    fontSize: 14,
    textAlign: 'right',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  dateText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },

  reservationText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  reservationTitleView: {
    flexDirection: 'row',

  },
  reservationTypeView: {
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
