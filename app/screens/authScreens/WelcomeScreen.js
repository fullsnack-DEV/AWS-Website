import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Alert, StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

import FacebookButton from '../../components/FacebookButton';
import GoogleButton from '../../components/GoogleButton';
import ActivityLoader from '../../components/loader/ActivityLoader';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils/index';
import { getUserDetails } from '../../api/Users';

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

export default function WelcomeScreen({ navigation }) {
  // For activity indigator
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
  }, []);
  // Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId: '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
    offlineAccess: false,
  });

  // Login With Facebook manage function
  const onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    auth().signInWithCredential(facebookCredential).then(async (authResult) => {
      console.log('FACEBOOK DETAIL:', JSON.stringify(authResult));
      auth().onAuthStateChanged((user) => {
        console.log('User :-', user);
        if (user) {
          user.getIdTokenResult().then(async (idTokenResult) => {
            console.log('User JWT: ', idTokenResult.token);
            const token = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };

            await Utility.setStorage('UID', user.uid);
            const flName = user.displayName.split(' ');

            const userDetail = {};
            if (flName.length >= 2) {
              [userDetail.first_name, userDetail.last_name] = flName
            } else if (flName.length === 1) {
              [userDetail.first_name, userDetail.last_name] = [flName[0], ''];
            } else if (flName.length === 0) {
              userDetail.first_name = 'Towns';
              userDetail.last_name = 'Cup';
            }
            userDetail.email = user.email;
            const entity = {
              auth: { token, user_id: user.uid },
              uid: user.uid,
              role: 'user',
            }
            await Utility.setStorage('userInfo', userDetail);
            await Utility.setStorage('loggedInEntity', entity);

            getUserDetails(user.uid).then((response) => {
              setloading(false);
              if (response.status === true) {
                Alert.alert('TownsCup', 'User already registerd with TownsCup, please try to login.')
              } else {
                navigation.navigate('AddBirthdayScreen')
              // navigation.navigate('ChooseLocationScreen');
              }
            }).catch(() => {
              navigation.navigate('AddBirthdayScreen')
            });
            setloading(false);
          });
        }
      });
    })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('This email address is not registerd');
        }
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
      });
  }

  // Login With Google manage function
  const onGoogleButtonPress = async () => {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth().signInWithCredential(googleCredential).then(async (authResult) => {
      console.log('GOOGLE DETAIL:', JSON.stringify(authResult));
      auth().onAuthStateChanged((user) => {
        console.log('User :-', user);
        if (user) {
          user.getIdTokenResult().then(async (idTokenResult) => {
            console.log('User JWT: ', idTokenResult.token);
            const token = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };

            const entity = {
              auth: { token, user_id: user.uid },
              uid: user.uid,
              role: 'user',
            }
            await Utility.setStorage('loggedInEntity', entity);
            const flName = user.displayName.split(' ');

            const userDetail = {};
            if (flName.length >= 2) {
              [userDetail.first_name, userDetail.last_name] = flName
            } else if (flName.length === 1) {
              [userDetail.first_name, userDetail.last_name] = [flName[0], '']
            } else if (flName.length === 0) {
              userDetail.first_name = 'Towns';
              userDetail.last_name = 'Cup';
            }
            userDetail.email = user.email;

            await Utility.setStorage('userInfo', userDetail);

            getUserDetails(user.uid).then((response) => {
              setloading(false);
              if (response.status === true) {
                Alert.alert('TownsCup', 'User already registerd with TownsCup, please try to login.')
              } else {
                navigation.navigate('AddBirthdayScreen')
              // navigation.navigate('ChooseLocationScreen');
              }
            }).catch(() => {
              navigation.navigate('AddBirthdayScreen')
            });
            setloading(false);
          });
        }
      });
    })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('This email address is not registerd');
        }
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
      });
  }
  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={ loading } />
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.signUpBg1 } />

      <View style={ styles.logoContainer }>
        <Image style={ styles.logo } source={ images.townsCupLogo } />
        <Text style={ styles.logoTitle }>{strings.townsCupTitle}</Text>
        <Text style={ styles.logoTagLine }>{strings.townsCupTagLine}</Text>
      </View>

      <Text style={ styles.welcome }>{strings.welCome}</Text>
      <Text style={ styles.welcomeText }>{strings.welcomeText}</Text>

      <FacebookButton onPress={ () => onFacebookButtonPress() }/>
      <GoogleButton onPress={ () => onGoogleButtonPress() }/>

      <TouchableOpacity
        style={ [styles.imgWithText, styles.allButton] }
        onPress={ () => navigation.navigate('SignupScreen')
        }>
        <Image source={ images.email } style={ styles.signUpImg } />
        <Text style={ styles.signUpText }>{strings.signUpText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={ () => navigation.navigate('LoginScreen') }
        style={ styles.alreadyView }>
        <Text style={ styles.alreadyMemberText }>{strings.alreadyMember}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  allButton: {
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  alreadyMemberText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  alreadyView: {
    alignSelf: 'center',
    bottom: hp('4%'),
    position: 'absolute',
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
  logo: {
    alignContent: 'center',
    height: hp('15%'),
    marginBottom: hp('4%'),
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: hp('10%'),
  },
  logoTagLine: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  logoTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('9%'),
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  signUpImg: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  signUpText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    height: 50,
    padding: 12,
  },
  welcome: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 25,
    marginTop: hp('5%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
  welcomeText: {
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
    fontSize: 18,
    marginRight: wp('5%'),
    marginTop: hp('1%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
});
