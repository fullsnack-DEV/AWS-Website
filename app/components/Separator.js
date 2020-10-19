import React from 'react';
import { StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import constants from '../config/constants';

const { colors } = constants;

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
    width: wp('80%'),
  },
});

export default Separator;
