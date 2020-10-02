import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FacebookButton from '../../../components/FacebookButton';
import GoogleButton from '../../../components/GoogleButton';
import styles from './style';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
function WelcomeScreen({navigation}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.signUpBg1} />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={PATH.townsCupLogo} />
        <Text style={styles.logoTitle}>{strings.townsCupTitle}</Text>
        <Text style={styles.logoTagLine}>{strings.townsCupTagLine}</Text>
      </View>

      <Text style={styles.welcome}>{strings.welCome}</Text>
      <Text style={styles.welcomeText}>{strings.welcomeText}</Text>

      <FacebookButton />
      <GoogleButton />

      <TouchableOpacity
        style={[styles.imgWithText, styles.allButton]}
        onPress={() =>
          navigation.navigate('SignupScreen', {
            name: 'SignupScreen',
          })
        }>
        <Image source={PATH.email} style={styles.signUpImg} />
        <Text style={styles.signUpText}>{strings.signUpText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
        style={styles.alreadyView}>
        <Text style={styles.alreadyMemberText}>{strings.alreadyMember}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default WelcomeScreen;
