import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
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

// import constants from '../../../config/constants';
// const {strings, urls, PATH, endPoints} = constants;

import {getuserDetail} from '../../../api/Authapi';
import AuthContext from '../../../auth/context';
import TCForm from '../../../components/TCForm';
import TCFormField from '../../../components/TCFormField';
import TCFormSubmit from '../../../components/TCFormSubmit';
import TCKeyboardView from '../../../components/TCKeyboardView';
import Loader from '../../../components/loader/Loader';
import styles from './style';
import * as Utility from '../../../utility/index';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
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
  const authContext = useContext(AuthContext);

  useEffect(() => {
    firebase.initializeApp(config);
  });

  const authToken = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          try {
            console.log('User JWT: ', idTokenResult.token);
            //console.log('User JWT Expiry time: ', idTokenResult.expirationTime);
            console.log('auth Token called... ');
            let tokenDetail = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };

            await AsyncStorage.setItem(
              token_details,
              JSON.stringify(tokenDetail),
            );

            Utility.setStorage('token', idTokenResult.token);
            Utility.setStorage('expiryTime', idTokenResult.expirationTime);
            Utility.setStorage('UID', user.uid);
            getUserInfo();
          } catch (error) {
            console.log(error.message);
          }
          //console.log('TokenID', idToken);
        });
      }
    });
  };

  signUpUser = async (fname, lname, email, password) => {
    await Utility.setInLocalStorge('email', email);
    await Utility.setInLocalStorge('password', password);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('User account created & signed in!', response);
        authToken();
        var user = {
          first_name: fname,
          last_name: lname,
          email: email,
          thumbnail: '',
          full_image: '',
        };

        firebase.auth().onAuthStateChanged(function (user) {
          user.sendEmailVerification();
        });
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
  getUserInfo = async () => {
    console.log('get user detail called... ');
    var uid = '';
    var token = '';
    try {
      token = await Utility.getStorage('token');
      console.log('TOKEN RETRIVED... get user detail ');
    } catch (e) {
      // error reading value
    }
    try {
      uid = await await Utility.getStorage('UID');
      if (uid !== null) {
        console.log('UID RETRIVED... ', uid);
      } else {
        console.log('UID::::::::::::EMPTY...get user detail');
      }
    } catch (e) {
      // error reading value
    }
    getuserDetail(uid).then((response) => {
      console.log('PAYLOAD::', JSON.stringify(response));
      if (response.status == true) {
        //authContext.setUser(response.payload);
        navigation.navigate('LoginScreen');
      } else {
        console.log(response);
        navigation.navigate('EmailVerification');
      }
    });
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
