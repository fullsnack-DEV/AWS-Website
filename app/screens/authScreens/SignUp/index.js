import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-community/async-storage';
import {create} from 'apisauce';

import constants from '../../../config/constants';
const {strings, urls, PATH, endPoints} = constants;

import TCForm from '../../../components/TCForm';
import TCFormField from '../../../components/TCFormField';
import TCFormSubmit from '../../../components/TCFormSubmit';
import TCKeyboardView from '../../../components/TCKeyboardView';
import Loader from '../../../components/loader/Loader';
import styles from "./style"
import * as Utility from '../../../utility/index';
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

const validationSchema = Yup.object().shape({
  fname: Yup.string().required().label('First name'),
  lname: Yup.string().required().label('Last name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  cpassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref('password'), null],
      'Confirm passwords must match with password field',
    )
    .label('Confirm password'),
});

function SignupScreen({navigation, route}) {
  useEffect(() => {
    firebase.initializeApp(config);
  });

  authToken = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(function (idTokenResult) {
          try {
            console.log('User JWT: ', idTokenResult.token);
            //console.log('User JWT Expiry time: ', idTokenResult.expirationTime);
            console.log('auth Token called... ');

            storeToken(idTokenResult.token);
            storeExpiry(idTokenResult.expirationTime);
            storeUID(user.uid);
            getUserDetail();
          } catch (error) {
            console.log(error.message);
          }
          //console.log('TokenID', idToken);
        });
      }
    });
  };

  const storeToken = async (value) => {
    try {
      await AsyncStorage.setItem('token', value);
      console.log('TOKEN STORED... ');
    } catch (error) {
      console.log('error while store token ', error);
    }
  };
  const storeExpiry = async (value) => {
    try {
      await AsyncStorage.setItem('expiryTime', value);
      console.log('Expiry STORED... ');
    } catch (error) {
      console.log('error while store token ', error);
    }
  };
  const storeUID = async (value) => {
    try {
      await AsyncStorage.setItem('UID', value);
      console.log('UID STORED... ');
    } catch (error) {
      console.log('error while store token ', error);
    }
  };
  const storeUser = async (user) => {
    try {
      AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('DATA STORED... ');
    } catch (error) {
      console.log('error while store data ', error);
    }
  };

  signUpUser = async(fname, lname, email, password) => {
    await Utility.setInLocalStorge("email",email)
    await Utility.setInLocalStorge("password",password)
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('User account created & signed in!',response);
        authToken();
        var user = {
          first_name: fname,
          last_name: lname,
          email: email,
          thumbnail: '',
          full_image: '',
        };
    

        firebase.auth().onAuthStateChanged(function(user) {
          user.sendEmailVerification(); 
          // this.modal();
          // Alert.alert(
          //   'Alert Title',
          //   'alertMessage',
          //   [
          //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          //     {text: 'OK', onPress:() =>console.log("ffffjhfgdhfhf")},
          //   ],
          //   { cancelable: false })
          
        })
        try {
          AsyncStorage.setItem('userInfo', JSON.stringify(user));
          console.log('DATA STORED... ');
          authToken();
        } catch (error) {
          console.log('error while store data ', error);
        }
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          //alert('This email address is already registered please login!');
          authToken();
        }
        if (error.code === 'auth/invalid-email') {
        }
      });
  };
  getUserDetail = async () => {
    console.log('get user detail called... ');
    var uid = '';
    var token = '';
    try {
      token = await AsyncStorage.getItem('token');
      console.log('TOKEN RETRIVED... get user detail ');
    } catch (e) {
      // error reading value
    }
    try {
      uid = await AsyncStorage.getItem('UID');
      if (uid !== null) {
        console.log('UID RETRIVED... get user detail');
      } else {
        console.log('UID::::::::::::EMPTY...get user detail');
      }
    } catch (e) {
      // error reading value
    }
    const api = create({
      baseURL: 'https://90gtjgmtoe.execute-api.us-east-1.amazonaws.com/dev/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    const response = await api.get('users/' + uid);

    if (response.data.status == true) {
      console.log('PAYLOAD::', JSON.stringify(response.data));
      //authContext.setUser(data);
      navigation.navigate('LoginScreen');
    } else if (response.data.status == false) {
      console.log(response);
      navigation.navigate('EmailVerification');
    }
  };
  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={true} /> */}
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <ScrollView>
        <TouchableOpacity
          onPress={() => alert('image picked')}
          style={styles.profile}>
          <Image style={styles.profile} source={PATH.profilePlaceHolder} />
        </TouchableOpacity>

        <TCForm
          initialValues={{
            fname: '',
            lname: '',
            email: '',
            password: '',
            cpassword: '',
          }}
          onSubmit={(values) =>
            signUpUser(
              values.fname,
              values.lname,
              values.email,
              values.password,
            )
          }
          validationSchema={validationSchema}>
          <TCKeyboardView>
            <TCFormField placeholder={strings.fnameText} name="fname" />
            <TCFormField placeholder={strings.lnameText} name="lname" />
            <TCFormField
              placeholder={strings.emailPlaceHolder}
              autoCapitalize="none"
              keyboardType="email-address"
              name="email"
            />
            <TCFormField
              placeholder={strings.passwordText}
              autoCapitalize="none"
              secureText={true}
              name="password"
            />
            <TCFormField
              placeholder={strings.confirmPasswordText}
              autoCapitalize="none"
              secureText={true}
              name="cpassword"
            />
          </TCKeyboardView>

          <TCFormSubmit
            title={strings.signUpCapitalText}
            extraStyle={{marginTop: hp('10%'), marginBottom: hp('4%')}}
            //() => navigation.navigate('ChooseLocationScreen')
          />
        </TCForm>
      </ScrollView>
    </View>
  );
}

export default SignupScreen;
