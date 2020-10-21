import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ReservationDetailButton({ onPressButon }) {
  return (

    <TouchableOpacity onPress={onPressButon}>
      <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.borderButtonView}>
        <View style={styles.borderButtonWhiteView}>
          <Text style={styles.detailButtonText}>{strings.detailText}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  borderButtonView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    width: wp('86%'),
  },
  detailButtonText: {
    alignSelf: 'center',
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
    textAlign: 'center',

  },
  borderButtonWhiteView: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 27.5,
    width: wp('85.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
