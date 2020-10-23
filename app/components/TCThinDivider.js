import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../Constants/Colors';

export default function TCThinDivider({ height = 1 }) {
  return (

    <View style={[styles.bigDivider, { height }]}></View>

  );
}

const styles = StyleSheet.create({

  bigDivider: {
    backgroundColor: colors.thinDividerColor,
    width: wp('90%'),
    marginTop: 15,
    alignSelf: 'center',
  },

});
