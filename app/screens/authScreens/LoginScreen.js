import React, { useState, useContext, useEffect } from 'react';
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
import crashlytics from '@react-native-firebase/crashlytics';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Config from 'react-native-config';
import FacebookButton from '../../components/FacebookButton';
import GoogleButton from '../../components/GoogleButton';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import { QBconnectAndSubscribe, QBlogin } from '../../utils/QuickBlox';
import { eventDefaultColorsData } from '../../Constants/LoaderImages';
import apiCall from '../../utils/apiCall';
import TCKeyboardView from '../../components/TCKeyboardView';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('patidar.arvind1+3@gmail.com');
  const [password, setPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);
  // For activity indigator
  const [loading, setloading] = useState(false);

  useEffect(() => {
    crashlytics().crash()
  }, [])
  // Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId:
        '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
    offlineAccess: false,
  });

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

  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        const token = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        Utility.setStorage('eventColor', eventDefaultColorsData);
        Utility.setStorage('groupEventValue', true)
        const userConfig = {
          method: 'get',
          url: `${Config.BASE_URL}/users/${user?.uid}`,
          headers: { Authorization: `Bearer ${token?.token}` },
        }
        apiCall(userConfig).then(async (response) => {
          const entity = {
            uid: user.uid,
            role: 'user',
            obj: response.payload,
            auth: {
              user_id: user.uid,
              user: response.payload,
            },
          }
          await authContext.setTokenData(token);
          authContext.setUser({ ...response.payload });
          await Utility.setStorage('authContextEntity', { ...entity })
          await Utility.setStorage('authContextUser', { ...response.payload })
          await Utility.setStorage('loggedInEntity', entity)
          authContext.setEntity({ ...entity })
          await authContext.setUser(response.payload);
          QBInitialLogin(entity, response?.payload);
        }).catch((error) => {
          setloading(false);
          setTimeout(() => Alert.alert(
            'TownsCup',
            error.message,
          ), 100)
        });
      });
    }
  }

  const login = async (_email, _password) => {
    setloading(true);
    await Utility.clearStorage();
    firebase
      .auth()
      .signInWithEmailAndPassword(_email, _password)
      .then(() => {
        const loginOnAuthStateChanged = auth().onAuthStateChanged(onAuthStateChanged);
        loginOnAuthStateChanged();
      })
      .catch((error) => {
        setloading(false);
        let message = error.message;
        if (error.code === 'auth/user-not-found') {
          message = 'Your email or password is incorrect.Please try again';
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        if (error.code === 'auth/wrong-password') {
          message = 'The password is invalid or the user does not have a password.';
        }
        if (error.code === 'auth/too-many-requests') {
          message = 'Too many request for login ,try after sometime';
        }
        setTimeout(() => Alert.alert('Towns Cup', message), 100)
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
  // Psaaword Hide/Show function for setState
  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  // Login With Facebook manage function
  const onFacebookButtonPress = async () => {
    setloading(true);
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      setloading(false);
      throw new Error('User cancelled the login process')
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      setloading(false);
      throw new Error('Something went wrong obtaining access token')
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    auth()
      .signInWithCredential(facebookCredential)
      .then(async () => {
        const facebookOnAuthStateChanged = auth().onAuthStateChanged((user) => {
          if (user) {
            user.getIdTokenResult().then(async (idTokenResult) => {
              const token = {
                token: idTokenResult.token,
                expirationTime: idTokenResult.expirationTime,
              };

              const userConfig = {
                method: 'get',
                url: `${Config.BASE_URL}/users/${user?.uid}`,
                headers: { Authorization: `Bearer ${token?.token}` },
              }
              apiCall(userConfig).then(async (response) => {
                const entity = {
                  uid: user.uid,
                  role: 'user',
                  obj: response.payload,
                  auth: {
                    user_id: user.uid,
                    user: response.payload,
                  },
                }
                await authContext.setTokenData(token);
                await Utility.setStorage('loggedInEntity', entity)
                authContext.setEntity({ ...entity })
                await authContext.setUser(response.payload);
                QBInitialLogin(entity, response?.payload);
              }).catch((error) => {
                setloading(false);
                setTimeout(() => Alert.alert(
                  'TownsCup',
                  error.message,
                ), 100)
              });
            });
          } else {
            setloading(false);
          }
        });
        facebookOnAuthStateChanged();
      })
      .catch((error) => {
        setloading(false);
        let message = '';
        if (error.code === 'auth/user-not-found') {
          message = 'Your email or password is incorrect.Please try again';
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        if (error.code === 'auth/account-exists-with-different-credential') {
          message = 'You are already registrated with different login method ';
        }
        if (message !== '') setTimeout(() => Alert.alert('Towns Cup', message), 100);
      });
  };

  // Login With Google manage function
  const onGoogleButtonPress = async () => {
    try {
      setloading(true);
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      auth()
        .signInWithCredential(googleCredential)
        .then(async () => {
          const googleOnAuthStateChanged = auth().onAuthStateChanged((user) => {
            if (user) {
              user.getIdTokenResult().then(async (idTokenResult) => {
                const token = {
                  token: idTokenResult.token,
                  expirationTime: idTokenResult.expirationTime,
                };

                const userConfig = {
                  method: 'get',
                  url: `${Config.BASE_URL}/users/${user?.uid}`,
                  headers: { Authorization: `Bearer ${token?.token}` },
                }
                apiCall(userConfig).then(async (response) => {
                  const entity = {
                    uid: user.uid,
                    role: 'user',
                    obj: response.payload,
                    auth: {
                      user_id: user.uid,
                      user: response.payload,
                    },
                  }
                  await authContext.setTokenData(token);
                  await Utility.setStorage('loggedInEntity', entity)
                  authContext.setEntity({ ...entity })
                  authContext.setUser({ ...response.payload });
                  await Utility.setStorage('authContextEntity', { ...entity })
                  await Utility.setStorage('authContextUser', { ...response.payload })
                  await authContext.setUser(response.payload);
                  QBInitialLogin(entity, response?.payload);
                }).catch((error) => {
                  setloading(false);
                  setTimeout(() => Alert.alert(
                    'TownsCup',
                    error.message,
                  ), 100)
                });
              });
            }
          });
          googleOnAuthStateChanged();
        })
        .catch((error) => {
          setloading(false);
          let message = ''
          if (error.code === 'auth/user-not-found') {
            message = 'Your email or password is incorrect.Please try again';
          }
          if (error.code === 'auth/email-already-in-use') {
            message = 'That email address is already in use!';
          }
          if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
          }
          if (error.code === 'auth/account-exists-with-different-credential') {
            message = 'You are already registrated with different login method ';
          }
          if (message !== '') setTimeout(() => Alert.alert('Towns Cup', message), 100);
        });
    } catch (error) {
      let message = '';
      setloading(false)
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Play services are not available'
      }
      if (message !== '') setTimeout(() => Alert.alert('Towns cup', message), 100)
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {/* <Loader visible={getUserData.loading} /> */}
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <TCKeyboardView>
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
        <View style={{ marginTop: 15 }}>
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
      </TCKeyboardView>
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
