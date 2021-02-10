import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';

export default function TCGradientDivider({
  height = 1,
  width = '90%',
  startGradiantColor = colors.themeColor,
  endGradiantColor = colors.yellowColor,
}) {
  return (
    <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ ...styles.bigDivider, height, width }}
          colors={ [startGradiantColor, endGradiantColor] }/>
  );
}

const styles = StyleSheet.create({

  bigDivider: {
    marginTop: 0,
    alignSelf: 'center',
  },

});
