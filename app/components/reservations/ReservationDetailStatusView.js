import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ReservationDetailStatusView({

  status = 'pending', doneBy = 'Kishan Makani', amount = 30, currencyType = 'CAD',
}) {
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
        {status === 'pending' && <Text style={[styles.reservationText, { color: '#616161' }]}>
          ALTETATION REQUEST PENDING
        </Text>}

        <Text style={styles.doneByText}>{strings.doneByText}<Text style={styles.doneByNameText}> {doneBy}</Text></Text>

      </View>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${amount} {currencyType}</Text>
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
    marginLeft: 20,
    marginTop: 5,
  },
  borderView: {
    height: 54,
    width: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

  dateText: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
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

  doneByText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 11,
  },
  doneByNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
  },
  reservationText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    marginBottom: 5,
  },
  reservationTitleView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
  },
  reservationTypeView: {
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 10,

  },
});
