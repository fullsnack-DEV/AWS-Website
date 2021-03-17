import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../Constants/Colors'

function Separator() {
  return <View style={ styles.separatorLine }></View>;
}

const styles = StyleSheet.create({
  separatorLine: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    bottom: 0,
    height: 1,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
});

export default Separator;
