import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ReservationNumber({
  reservationNumber = '12345678D-12',
}) {
  return (
    <View>
      <Text style={styles.reservationNumberText}>
        Reservation No: {reservationNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reservationNumberText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
    marginBottom: 10,
    marginRight: 15,
    marginTop: 15,
    textAlign: 'right',
  },
});
