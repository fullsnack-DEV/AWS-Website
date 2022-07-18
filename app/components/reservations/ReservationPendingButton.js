import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ReservationPendingButton({onPressButon}) {
  return (
    <TouchableOpacity onPress={onPressButon}>
      <LinearGradient
        colors={[colors.yellowColor, colors.themeColor]}
        style={styles.pendingButton}
      >
        <Text style={styles.pendingTimerText}>{strings.respondWithinText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pendingButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 30,
    width: wp('86%'),
  },
  pendingTimerText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
    textAlign: 'center',
  },
});
