import React, {useState, useEffect, useContext} from 'react';
import {
  
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';


import FacebookButton from '../../../components/FacebookButton';
import GoogleButton from '../../../components/GoogleButton';
import AuthContext from '../../../auth/context';
import Loader from '../../../components/loader/Loader';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import styles from './style';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utility/index';
import   colors from "../../../Constants/Colors";

import {getuserDetail} from '../../../api/Authapi';
import {token_details} from '../../../utils/constant';
import TCButton from '../../../components/TCButton';
import TCTextField from '../../../components/TCTextField';

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

function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);
 // For activity indigator
 const [loading, setloading] = useState(false);

  //Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId: '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
    offlineAccess:false,
  });

  useEffect(() => {
    firebase.initializeApp(config);
  },[]);
  const checkValidation = () => {
     if (email == '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
     
    }else if (password == '') {
      Alert.alert('Towns Cup', 'Password cannot be blank');
     
    }
  };
  
  const getUser = async (uid) => {
    setloading(true);
    getuserDetail(JSON.parse(uid)).then(async(response) => {
      if (response.status == true) {
        await Utility.setStorage('user',response.payload);
        authContext.setUser(response.payload); 
      } else {
        alert(response.messages);
      }
    });
    setloading(false);
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

  //Psaaword Hide/Show function for setState
  const hideShowPassword = () =>{
    setHidePassword(!hidePassword);
  }

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
    });;  ;
  }

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {/* <Loader visible={getUserData.loading} /> */}
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />

      <Text style={styles.loginText}>{strings.loginText}</Text>
      <FacebookButton onPress={() => onFacebookButtonPress()}/>
      <GoogleButton onPress={() => onGoogleButtonPress()}/>
      <Text style={styles.orText}>{strings.orText}</Text>
      
        <TCTextField
          placeholder={strings.emailPlaceHolder}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)} 
          value={email}
        />
       
      <View style={styles.passwordView}>
        <TextInput
          style={styles.textInput}
          placeholder={strings.passwordPlaceHolder}
          onChangeText={(text) => setPassword(text)} 
          value={password}
          placeholderTextColor={colors.themeColor}
          secureTextEntry={hidePassword}
          keyboardType={'default'}
        />
        <TouchableWithoutFeedback onPress={()=>hideShowPassword()}>
        {hidePassword ? <Image source={PATH.showPassword} style={styles.passwordEyes} /> : <Image source={PATH.hidePassword} style={styles.passwordEyes} />}
        </TouchableWithoutFeedback>
        
      </View>
        
            <TCButton
            title={strings.loginCapTitle}
            extraStyle={{marginTop: hp('10%'), marginTop: hp('3%')}}
            onPress={()=>{
              checkValidation();
              if(email != '' && password != ''){
                loginUsers(email, password)
              }
            }}
          />
        
      
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
