import React from 'react';
import {StyleSheet, View} from 'react-native';

import colors from '../Constants/Colors';

export default function TCThinDivider({height = 1, width = '90%', ...props}) {
  return <View style={[styles.bigDivider, {height, width}]} {...props}></View>;
}

const styles = StyleSheet.create({
  bigDivider: {
    backgroundColor: colors.grayBackgroundColor,

    marginTop: 0,
    alignSelf: 'center',
  },
});
