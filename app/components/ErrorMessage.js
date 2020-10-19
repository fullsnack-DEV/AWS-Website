import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';

const { colors } = constants;

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.whiteColor,

    marginBottom: hp('1.5%'),
    marginLeft: wp('8%'),
  },
});

export default ErrorMessage;
