import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';

import colors from '../Constants/Colors';

export default function TCThinDivider({ height = 1, width = '90%' }) {
  return (

    <View style={[styles.bigDivider, { height, width }]}></View>

  );
}

const styles = StyleSheet.create({

  bigDivider: {
    backgroundColor: colors.thinDividerColor,

    marginTop: 15,
    alignSelf: 'center',
  },

});
