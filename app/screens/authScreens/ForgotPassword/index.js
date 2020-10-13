import React,{useEffect, useState,useContext} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import constants from '../../../config/constants';
import TCButton from '../../../components/TCButton';
import TCTextField from '../../../components/TCTextField';
import strings from '../../../Constants/String';
import styles from "./style"
const { colors, fonts, urls, PATH} = constants;

function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');

// Basic input validation
  const checkValidation = () => {
    if (email == '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false
    }else if(ValidateEmail(email) == false){
      Alert.alert('Towns Cup', 'You have entered an invalid email address!');
      return false
    }else{
      return true
    }
  };

  // Email input format validation
  const ValidateEmail = (email) =>
  {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
    {
      return (true)
    }
      
      return (false)
  }
//Firebase forgot pasword function
  const forgotPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(function (user) {
        navigation.navigate('ForgotPasswordLinkSentScreen');
      }).catch(function (e) {
        console.log(e)
      })
  }
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <Text style={styles.forgotText}>{strings.forgotPassword}</Text>
      <Text style={styles.resetText}>{strings.resetText}</Text>
      <TCTextField
        placeholder={strings.enterEmailPlaceholder}
        secureText={false}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)} value={email}
      />
      <TCButton
        title={strings.nextTitle}
        onPress={() => {
          if(checkValidation()){
            forgotPassword(email);
          }
        }}
        extraStyle={{bottom: hp('11%'), position: 'absolute'}}
      />
      <TCButton
        title={strings.cancelTitle}
        onPress={() => navigation.goBack()}
        textColor={{color: colors.whiteColor}}
        extraStyle={{
          bottom: hp('4%'),
          position: 'absolute',
          borderColor: colors.whiteColor,
          borderWidth: 1,

          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}

export default ForgotPasswordScreen;
