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
import {get} from '../../../api/services';
import {CREATE_USER} from '../../../api/Url';
import {token_details} from '../../../utils/constant';
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

function LoginScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const getUserData = useApi(listing.getUserDetail);
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

  const authToken = () => {
    auth().onAuthStateChanged((user) => {
      console.log('User :-', user);
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          let tokenDetail = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };

          await AsyncStorage.setItem(
            token_details,
            JSON.stringify(tokenDetail),
          );

          try {
            await Utility.setInLocalStorge(
              'token',
              JSON.stringify(idTokenResult.token),
            );
            const token = await Utility.getFromLocalStorge('token');
            await Utility.setInLocalStorge(
              'expiryTime',
              idTokenResult.expirationTime,
            );
            await Utility.setInLocalStorge('UID', JSON.stringify(user.uid));
            //tokenrefresh();
            // navigation.navigate("NewsFeedNavigator")
            getUser(JSON.stringify(user.uid));
          } catch (error) {
            // console.log('error....', error.message);
          }
        });
      }
    });
  };
  getUser = async (uid) => {
    const value = await Utility.getFromLocalStorge('token');
    const endPoint = CREATE_USER + JSON.parse(uid);
    console.log('endPoint  IS: ', endPoint);
    get(endPoint, JSON.parse(value)).then((response) => {
      if (response.status == true) {
        authContext.setUser(response.payload);
        storage.storeData('user', response.payload);
        console.log('STATUS::', response.status);
        console.log('authContext::', JSON.stringify(authContext.user));

        QB.auth
          .login({
            login: JSON.parse(uid),
            password: 'quickblox',
          })
          .then(function (info) {
            alert('QB signed in successfully');
            console.log('signed in successfully, handle info as necessary');
            // signed in successfully, handle info as necessary
            // info.user - user information
            // info.session - current session
          })
          .catch(function (e) {
            // handle error
          });
        QB.chat
          .connect({
            userId: JSON.parse(uid),
            password: 'quickblox',
          })
          .then(function () {
            // connected successfully
            alert('Connected  successfully');
          })
          .catch(function (e) {
            // some error occurred
          });
      } else {
        alert(response.messages);
      }
    });
  };
  const tokenrefresh = async () => {
    console.log('sffgfhgffasff');
    const uid = await Utility.getFromLocalStorge('firebasetoken');
    console.log(uid);
    const vid = JSON.parse(uid);
    console.log('json remove ', vid);
    // try{

    //     firebase.auth().revokeRefreshTokens(vid)
    //   .then(() => {
    //     return firebase.auth().getUser(vid);
    //   })
    //   .then((userRecord) => {
    //     return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    //   })
    //   .then((timestamp) => {
    //     console.log('Tokens revoked at: ', timestamp);
    //   });
    // }catch(error){
    //   console.log(" firebase bekar error",error.toString(error));
    // }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          try {
            storage.storeData(
              'token.....................',
              JSON.stringify(idTokenResult.token),
            );
            console.log('Stored Token...........: ', idTokenResult.token);
          } catch (error) {
            console.log(error.message);
          }
        });
      }
    });
  };

  const loginUsers = async (email, password) => {
    firebase

      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        authToken();
        console.log('resssss', res);
        console.log('user', res.user.email);
        await Utility.setInLocalStorge('useremail', res.user.email);
        const tokeen = await Utility.getFromLocalStorge('useremail');
        console.log('tokeeennn', tokeen);
        navigation.navigate('BottomTab');
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
