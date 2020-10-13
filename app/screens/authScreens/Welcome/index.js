import React, {useEffect, useState,useContext} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

import FacebookButton from '../../../components/FacebookButton';
import GoogleButton from '../../../components/GoogleButton';
import AuthContext from '../../../auth/context';
import styles from './style';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utility/index';
import {getuserDetail} from '../../../api/Authapi';
import {token_details} from '../../../utils/constant';

const config = {
  apiKey: 'AIzaSyDgnt9jN8EbVwRPMClVf3Ac1tYQKtaLdrU',
  authDomain: 'townscup-fee6e.firebaseapp.com',
  databaseURL: 'https://townscup-fee6e.firebaseio.com',
  projectId: 'townscup-fee6e',
  storageBucket: 'townscup-fee6e.appspot.com',
  messagingSenderId: '1003329053001',
  appId: '1:1003329053001:web:f079b7ed53716fa8463a98',
  measurementId: 'G-N44NC0Z1Q7',
};


function WelcomeScreen({navigation}) {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    firebase.initializeApp(config);
  },[]);
//Google sign-in configuration initialization
GoogleSignin.configure({
  webClientId: '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
  offlineAccess:false,
});
const getUser =  (uid) => {
  getuserDetail(JSON.parse(uid)).then((response) => {
    if (response.status == true) {
      Alert.alert('TownsCup', 'User already registerd with TownsCup, please try to login.')
      
    } else {
      navigation.navigate('ChooseLocationScreen');
    }
  });
};


// Login With Facebook manage function
const onFacebookButtonPress = async()=> {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  auth().signInWithCredential(facebookCredential).then(async(authResult) => {
    console.log('FACEBOOK DETAIL:', JSON.stringify(authResult));
    auth().onAuthStateChanged((user) => {
      console.log('User :-', user);
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          console.log('User JWT: ', idTokenResult.token);
            let tokenDetail = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };
            await Utility.setStorage(token_details, JSON.stringify(tokenDetail));
            await Utility.setStorage('UID', user.uid);

            let flName=user.displayName.split(' ');

            let userDetail={};
            if(flName.length>=2 ){
              userDetail.first_name = flName[0];
              userDetail.last_name = flName[1];
            }
            else if(flName.length == 1){
              userDetail.first_name = flName[0];
              userDetail.last_name = '';
            }else if(flName.length == 0){
              userDetail.first_name = 'Towns';
              userDetail.last_name = 'Cup';
            }
            userDetail.email = user.email;
            await Utility.setStorage('userInfo', userDetail);
            
            getUser(user.uid);
            
        
        });
      }
    });
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      alert('This email address is not registerd');
    }
    if (error.code === 'auth/email-already-in-use') {
      alert('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      alert('That email address is invalid!');
    }
  });;  
}

// Login With Google manage function
const  onGoogleButtonPress =async()=> {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
   auth().signInWithCredential(googleCredential).then(async(authResult) => {
    console.log('GOOGLE DETAIL:', JSON.stringify(authResult));
    auth().onAuthStateChanged((user) => {
      console.log('User :-', user);
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          console.log('User JWT: ', idTokenResult.token);
          let tokenDetail = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          await Utility.setStorage(token_details, JSON.stringify(tokenDetail));
          await Utility.setStorage('UID', user.uid);

          let flName=user.displayName.split(' ');

          let userDetail={};
          if(flName.length>=2 ){
            userDetail.first_name = flName[0];
            userDetail.last_name = flName[1];
          }
          else if(flName.length == 1){
            userDetail.first_name = flName[0];
            userDetail.last_name = '';
          }else if(flName.length == 0){
            userDetail.first_name = 'Towns';
            userDetail.last_name = 'Cup';
          }
          userDetail.email = user.email;
          await Utility.setStorage('userInfo', userDetail);
          
          getUser(user.uid);
        
        });
      }
    });
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      alert('This email address is not registerd');
    }
    if (error.code === 'auth/email-already-in-use') {
      alert('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      alert('That email address is invalid!');
    }
  });;  ;
}
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

      <FacebookButton onPress={() => onFacebookButtonPress()}/>
      <GoogleButton onPress={() => onGoogleButtonPress()}/>

      <TouchableOpacity
        style={[styles.imgWithText, styles.allButton]}
        onPress={() =>
          navigation.navigate('SignupScreen')
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
