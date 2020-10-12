import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import QB from 'quickblox-react-native-sdk';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import * as Yup from 'yup';
import {create} from 'apisauce';

import FacebookButton from '../../../components/FacebookButton';
import GoogleButton from '../../../components/GoogleButton';

import TCForm from '../../../components/TCForm';

import TCFormField from '../../../components/TCFormField';
import TCFormSubmit from '../../../components/TCFormSubmit';

import constants from '../../../config/constants';

import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from '../../../auth/context';
import useApi from '../../../hooks/useApi';
import listing from '../../../api/listing';
import storage from '../../../auth/storage';
import Loader from '../../../components/loader/Loader';
import styles from './style';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utility/index';

import {getuserDetail} from '../../../api/Authapi';
import {token_details} from '../../../utils/constant';
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

function LoginScreen({navigation}) {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    firebase.initializeApp({
      apiKey: 'AIzaSyDgnt9jN8EbVwRPMClVf3Ac1tYQKtaLdrU',
      authDomain: 'townscup-fee6e.firebaseapp.com',
      databaseURL: 'https://townscup-fee6e.firebaseio.com',
      projectId: 'townscup-fee6e',
      storageBucket: 'townscup-fee6e.appspot.com',
      messagingSenderId: '1003329053001',
      appId: '1:1003329053001:web:f079b7ed53716fa8463a98',
      measurementId: 'G-N44NC0Z1Q7',
    });
  }, []);

  const getUser = async (uid) => {
    getuserDetail(JSON.parse(uid)).then(async(response) => {
      if (response.status == true) {
        await Utility.setStorage('user',response.payload);
        authContext.setUser(response.payload); 
      } else {
        alert(response.messages);
      }
    });
  };
  const loginUsers = async (email, password) => {
    firebase

      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        console.log('FIREBASE RESPONSE:', JSON.stringify(response));
        auth().onAuthStateChanged((user) => {
          console.log('User :-', user);
          if (user) {
            user.getIdTokenResult().then(async (idTokenResult) => {
              let tokenDetail = {
                token: idTokenResult.token,
                expirationTime: idTokenResult.expirationTime,
              };
    
              await Utility.setStorage(token_details,JSON.stringify(tokenDetail));
              await Utility.setStorage('UID', JSON.stringify(user.uid));
              getUser(JSON.stringify(user.uid));
            
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
      });
  };
  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={getUserData.loading} /> */}
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />

      <Text style={styles.loginText}>{strings.loginText}</Text>
      <FacebookButton />
      <GoogleButton />
      <Text style={styles.orText}>{strings.orText}</Text>

      <TCForm
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values) => loginUsers(values.email, values.password)}
        validationSchema={validationSchema}>
        <TCFormField
          placeholder={strings.emailPlaceHolder}
          autoCapitalize="none"
          keyboardType="email-address"
          name="email"
        />
        <TCFormField
          placeholder={strings.passwordPlaceHolder}
          autoCapitalize="none"
          secureText={true}
          name="password"
        />

        <TCFormSubmit
          title={strings.loginCapTitle}
          extraStyle={{marginTop: hp('3%')}}
          //() => navigation.navigate('ChooseLocationScreen')
        />
      </TCForm>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPasswordText}>{strings.forgotPassword}</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        <Text>By continuing you agree to Towny's </Text>
        <TouchableOpacity onPress={() => alert('Terms and services..')}>
          <Text style={styles.hyperlinkText}>Terms of Service</Text>
        </TouchableOpacity>
        <Text>, We will manage information about you as described in our </Text>
        <TouchableOpacity onPress={() => alert('Privacy policy..')}>
          <Text style={styles.hyperlinkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text> and </Text>
        <TouchableOpacity onPress={() => alert('cookie policy..')}>
          <Text style={styles.hyperlinkText}>Cookie Policy.</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

export default LoginScreen;
