import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function ErrorMessage({error, visible}) {
  if (!visible || !error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.whiteColor,
    marginLeft: wp('8%'),
    marginBottom: hp('1.5%'),
  },
});

export default ErrorMessage;
