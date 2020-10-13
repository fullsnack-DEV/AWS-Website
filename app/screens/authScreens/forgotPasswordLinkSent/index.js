import React,{useEffect, useState,useContext} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import constants from '../../../config/constants';
import TCButton from '../../../components/TCButton';

import strings from '../../../Constants/String';
import styles from "./style"
const { colors, fonts, urls, PATH} = constants;

export default function ForgotPasswordLinkSentScreen({navigation}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <View style={styles.textContainer}>
      <Text style={styles.checkEmailText}>{strings.checkEmailText}</Text>
      <Text style={styles.resetText}>{strings.checkEmailDescText}</Text>
      </View>
      <TCButton
        title={strings.loginCapTitle}
        onPress={() => {
          navigation.navigate('LoginScreen');
        }}
        extraStyle={{bottom: hp('4%'), position: 'absolute'}}
      />
    </View>
  );
}
