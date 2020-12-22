import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
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
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import { getUserDetails } from '../../api/Users';
import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import { QBconnectAndSubscribe, QBlogin } from '../../utils/QuickBlox';
import { eventDefaultColorsData } from '../../Constants/LoaderImages';

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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('patidar.arvind1+3@gmail.com');
  const [password, setPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);
  // For activity indigator
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onFirebaseAuthStateChanged);
    return subscriber;
  }, []);
  // Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId:
      '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
    offlineAccess: false,
  });

  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
  }, []);
  const validate = () => {
    if (email === '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false;
    } if (password === '') {
      Alert.alert('Towns Cup', 'Password cannot be blank');
      return false;
    }
    return true;
  };

  const onFirebaseAuthStateChanged = async (user) => {
    console.log('CALL from Login Screen');
    if (user) {
      user.getIdTokenResult().then(async (idTokenResult) => {
        const token = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        const entity = {
          uid: user.uid,
          role: 'user',
          auth: {
            token,
            user_id: user.uid,
          },
        }
        await Utility.setStorage('eventColor', eventDefaultColorsData);
        await Utility.setStorage('groupEventValue', true)
        await Utility.setStorage('loggedInEntity', entity)
        await authContext.setEntity({ ...entity })
        getUserInfo(entity).then((data) => {
          QBInitialLogin(entity, data.payload);
        }).catch((e) => {
          setloading(false);
          setTimeout(() => Alert.alert('Towns Cup', e.message), 1);
        })
      });
    }
  }

  const login = async (_email, _password) => {
    setloading(true);
    await Utility.clearStorage();
    firebase
      .auth()
      .signInWithEmailAndPassword(_email, _password)
      .catch((error) => {
        let message = '';
        setloading(false);
        if (error.code === 'auth/user-not-found') {
          message = 'This email address is not registerd';
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        setTimeout(() => Alert.alert('Towns Cup', message), 1)
      });
  };

  const QBInitialLogin = (entity, response) => {
    let qbEntity = entity;
    QBlogin(qbEntity.uid, response).then(async (res) => {
      qbEntity = { ...qbEntity, isLoggedIn: true, QB: { ...res.user, connected: true, token: res?.session?.token } }
      QBconnectAndSubscribe(qbEntity)
      await Utility.setStorage('authContextEntity', { ...qbEntity })
      authContext.setEntity({ ...qbEntity })
      setloading(false);
    }).catch(async (error) => {
      qbEntity = { ...qbEntity, QB: { connected: false } }
      await Utility.setStorage('authContextEntity', { ...qbEntity, isLoggedIn: true })
      authContext.setEntity({ ...qbEntity, isLoggedIn: true })
      console.log('QB Login Error : ', error.message);
      setloading(false);
    });
  }
  const getUserInfo = (e) => {
    const ac = authContext
    const entity = e
    ac.entity = entity

    return getUserDetails(entity.auth.user_id, ac).then((response) => {
      entity.auth.user = response.payload;
      entity.obj = response.payload;
      authContext.setEntity({ ...entity })
      authContext.setUser({ ...response.payload });
      Utility.setStorage('authContextEntity', { ...entity })
      Utility.setStorage('authContextUser', { ...response.payload })

      return true;
    })
  }
  // Psaaword Hide/Show function for setState
  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  // Login With Facebook manage function
  const onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw new Error('User cancelled the login process')
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining access token')
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    auth()
      .signInWithCredential(facebookCredential)
      .catch((error) => {
        let message = '';
        if (error.code === 'auth/user-not-found') {
          message = 'This email address is not registerd';
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        setTimeout(() => Alert.alert('Towns Cup', message), 100);
      });
  };

  // Login With Google manage function
  const onGoogleButtonPress = async () => {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth()
      .signInWithCredential(googleCredential)
      .catch((error) => {
        let message = ''
        if (error.code === 'auth/user-not-found') {
          message = 'This email address is not registerd';
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        setTimeout(() => Alert.alert('Towns Cup', message), 1);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={{
        zIndex: 100,
        position: 'absolute',
        top: hp(5),
        left: 15,
      }} onPress={() => navigation.replace('WelcomeScreen')}>
        <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
      </TouchableOpacity>
      <ActivityLoader visible={loading} />
      {/* <Loader visible={getUserData.loading} /> */}
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />

      <Text style={styles.loginText}>{strings.loginText}</Text>
      <FacebookButton onPress={() => onFacebookButtonPress()} />
      <GoogleButton onPress={() => onGoogleButtonPress()} />
      <Text style={styles.orText}>{strings.orText}</Text>
      <View style={styles.textFieldContainerStyle}>
        <TCTextField
        style={styles.textFieldStyle}
        placeholder={strings.emailPlaceHolder}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      </View>
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
        <TouchableWithoutFeedback onPress={() => hideShowPassword()}>
          {hidePassword ? (
            <Image source={images.showPassword} style={styles.passwordEyes} />
          ) : (
            <Image source={images.hidePassword} style={styles.passwordEyes} />
          )}
        </TouchableWithoutFeedback>
      </View>

      <TCButton
        title={strings.loginCapTitle}
        extraStyle={{ marginTop: hp('3%') }}
        onPress={() => {
          if (validate()) {
            login(email, password);
          }
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPasswordText}>{strings.forgotPassword}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}/>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.bottomText}>
          <Text>By continuing you agree to Towny`s </Text>

          <Text style={styles.hyperlinkText} onPress={() => Alert.alert('Terms and services..')}>Terms of Service</Text>

          <Text style={styles.hyperlinkText} onPress={() => alert('Terms and services..')}>Terms of Service</Text>

          <Text style={styles.hyperlinkText} onPress={() => Alert.alert('Privacy policy..')}>Privacy Policy</Text>

          <Text style={styles.hyperlinkText} onPress={() => alert('Privacy policy..')}>Privacy Policy</Text>

          <Text style={styles.hyperlinkText} onPress={() => Alert.alert('cookie policy..')}>Cookie Policy.</Text>

          <Text style={styles.hyperlinkText} onPress={() => alert('cookie policy..')}>Cookie Policy.</Text>

        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  bottomText: {
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },

  forgotPasswordText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginTop: hp('3%'),
    textAlign: 'center',
  },
  hyperlinkText: {
    fontFamily: fonts.RLight,
    fontSize: wp('3%'),
    textDecorationLine: 'underline',
  },
  loginText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('3%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',

  },
  orText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('3%'),
    marginBottom: hp('3%'),
    marginTop: hp('3%'),
    textAlign: 'center',
  },
  passwordEyes: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  passwordView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,

    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('4%'),
    height: 40,

    marginTop: 4,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: wp('84%'),
  },
  textInput: {

    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    height: 40,
    paddingLeft: 17,

    width: wp('75%'),
  },
  textFieldContainerStyle: {
    height: 40,
    marginBottom: 10,
  },
  textFieldStyle: {
    marginHorizontal: 32,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
