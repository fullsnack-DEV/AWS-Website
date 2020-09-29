import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';

const {strings, colors, fonts, urls, PATH} = constants;

export default function WritePostScreen() {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.signUpBg1} />
      <Text>WritePost screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: hp('100%'),
    width: wp('100%'),
    resizeMode: 'stretch',
  },
});
