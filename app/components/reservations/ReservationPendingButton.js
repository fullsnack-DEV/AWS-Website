import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ReservationPendingButton({ ExpiryTime = '1d 23h 59m' }) {
  return (
    <View>

      {/* <TouchableOpacity>
              <LinearGradient
                    colors={[colors.yellowColor, colors.themeColor]}
                    style={styles.pendingButton}>
                  <Text style={styles.pendingTimerText}>{strings.respondWithinText} {ExpiryTime}</Text>
              </LinearGradient>
          </TouchableOpacity> */}
      <TouchableOpacity>
        <LinearGradient
                    colors={[colors.yellowColor, colors.themeColor]}
                    style={styles.pendingButton}>
          <Text style={styles.pendingTimerText}>{strings.respondWithinText} {ExpiryTime}</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  pendingButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginBottom: 30,
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
