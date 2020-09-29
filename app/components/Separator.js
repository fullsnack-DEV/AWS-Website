import React from 'react';
import {StyleSheet, View} from 'react-native';
import constants from '../config/constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
const {colors} = constants;

function Separator() {
  return <View style={styles.separatorLine}></View>;
}

const styles = StyleSheet.create({
  separatorLine: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.whiteColor,

    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%'),
    height: 1,
  },
});

export default Separator;
