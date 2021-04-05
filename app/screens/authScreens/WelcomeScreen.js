/* eslint-disable react-native/split-platform-components */
import React, {
 useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
 Alert, Animated, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../auth/context'
import FacebookButton from '../../components/FacebookButton';
import GoogleButton from '../../components/GoogleButton';
import ActivityLoader from '../../components/loader/ActivityLoader';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils/index';
import apiCall from '../../utils/apiCall';
import { QBconnectAndSubscribe, QBlogin } from '../../utils/QuickBlox';
import AppleButton from '../../components/AppleButton';
import { checkTownscupEmail, createUser } from '../../api/Users';

const BACKGROUND_CHANGE_INTERVAL = 4000; // 4 seconds
export default function WelcomeScreen({ navigation }) {
  const fadeInOpacity = new Animated.Value(0);
  // For activity indigator
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const [currentBackground, setCurrentBackground] = useState(1);

  useEffect(() => {
    onLoad()
  }, [currentBackground])
  useEffect(() => {
    const backgroundInterval = setInterval(changeBackground, BACKGROUND_CHANGE_INTERVAL);
    return () => {
      clearInterval(backgroundInterval);
    }
  }, [])

  const changeBackground = useCallback(() => {
        setCurrentBackground((curBg) => {
          if (curBg < 4) return curBg + 1
          return 1
        })
  }, [])

  // Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId: '1003329053001-tmrapda76mrggdv8slroapq21icrkdb9.apps.googleusercontent.com',
    offlineAccess: false,
  });

  const getRedirectionScreenName = useCallback((townscupUser) => new Promise((resolve, reject) => {
    if (!townscupUser.birthday) resolve({ screen: 'AddBirthdayScreen' })
    else if (!townscupUser.gender) resolve({ screen: 'ChooseGenderScreen' })
    else if (!townscupUser.city) resolve({ screen: 'ChooseLocationScreen' })
    else if (!townscupUser.sports) resolve({ screen: 'ChooseSportsScreen', params: { city: townscupUser?.city, state: townscupUser?.state_abbr, country: townscupUser?.country } })
    else reject(new Error({ error: 'completed user profile' }))
  }), [])

  const loginFinalRedirection = useCallback(async (townscupUser, dummyAuthContext) => {
    let entity = { ...dummyAuthContext?.entity }
    entity = {
      ...entity,
      auth: { ...entity?.auth, user: townscupUser },
      obj: { ...entity?.obj, ...townscupUser },
    }
    await authContext.setTokenData(dummyAuthContext?.tokenData);
    await Utility.setStorage('authContextUser', { ...townscupUser })
    await Utility.setStorage('authContextEntity', { ...entity })
    await Utility.setStorage('loggedInEntity', entity)
    await authContext.setUser({ ...townscupUser });
    await authContext.setEntity({ ...entity })
    // eslint-disable-next-line no-underscore-dangle
    getRedirectionScreenName(townscupUser).then((responseScreen) => {
      setloading(false);
      navigation.replace(responseScreen?.screen, { ...responseScreen?.params })
    }).catch(async () => {
      entity.isLoggedIn = true;
      await Utility.setStorage('authContextEntity', { ...entity })
      await Utility.setStorage('loggedInEntity', { ...entity })
      setloading(false);
      await authContext.setEntity({ ...entity })
    });
  }, [authContext, getRedirectionScreenName, navigation])

  const QBInitialLogin = async (dummyAuth, townscupUser) => {
    const dummyAuthContext = { ...dummyAuth };
    let qbEntity = { ...dummyAuthContext?.entity }
    QBlogin(qbEntity?.uid, townscupUser).then(async (res) => {
      qbEntity = { ...qbEntity, QB: { ...res?.user, connected: true, token: res?.session?.token } }
      QBconnectAndSubscribe(qbEntity);
      dummyAuthContext.entity = { ...qbEntity }
      await loginFinalRedirection(townscupUser, dummyAuthContext);
    }).catch(async (error) => {
      console.log('QB Login Error : ', error.message);
      qbEntity = { ...qbEntity, QB: { connected: false } }
      dummyAuthContext.entity = { ...qbEntity }
      await loginFinalRedirection(townscupUser, dummyAuthContext);
    });
  }

  const wholeSignUpProcessComplete = async (userData, dummyAuthContext) => {
    const entity = { ...dummyAuthContext?.entity };
    const tokenData = dummyAuthContext?.tokenData;
    entity.auth.user = { ...userData }
    entity.obj = { ...userData }
    entity.uid = userData?.user_id;
    await Utility.setStorage('loggedInEntity', { ...entity })
    await Utility.setStorage('authContextEntity', { ...entity })
    await Utility.setStorage('authContextUser', { ...userData });
    await authContext.setTokenData(tokenData);
    await authContext.setUser({ ...userData });
    await authContext.setEntity({ ...entity });
    setloading(false);
    navigation.navigate('AddBirthdayScreen')
  }

  const signUpWithQB = (response, dummyAuth) => {
    const dummyAuthContext = { ...dummyAuth };
    let qbEntity = { ...dummyAuthContext?.entity };
    QBlogin(qbEntity?.uid, response).then(async (res) => {
      qbEntity = { ...qbEntity, QB: { ...res?.user, connected: true, token: res?.session?.token } }
      QBconnectAndSubscribe(qbEntity)
      dummyAuthContext.entity = qbEntity
      await wholeSignUpProcessComplete(response, dummyAuthContext);
    }).catch(async (error) => {
      console.log('QB Login Error : ', error.message);
      qbEntity = { ...qbEntity, QB: { connected: false } }
      dummyAuthContext.entity = qbEntity
      await wholeSignUpProcessComplete(response, dummyAuthContext);
    });
  }

  const signUpToTownsCup = async (userDetail, dummyAuth) => {
    const dummyAuthContext = { ...dummyAuth }
    setloading(true);
    const data = {
      first_name: userDetail?.first_name,
      last_name: userDetail?.last_name,
      email: userDetail?.email,
    };

    createUser(data, dummyAuthContext).then((createdUser) => {
      const authEntity = { ...dummyAuthContext?.entity }
      authEntity.obj = createdUser?.payload
      authEntity.auth.user = createdUser?.payload
      authEntity.role = 'user'
      dummyAuthContext.entity = authEntity
      dummyAuthContext.user = createdUser?.payload;
      signUpWithQB(createdUser?.payload, dummyAuthContext);
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const checkUserIsRegistratedOrNotWithTownscup = (email) => new Promise((resolve) => {
    checkTownscupEmail(encodeURIComponent(email)).then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    })
  })

  const socialSignInSignUp = (authResult, message, extraData = {}) => {
    const dummyAuthContext = { ...authContext }
    const socialSignInSignUpOnAuthChanged = auth().onAuthStateChanged((user) => {
      console.log('User :-', user);
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          console.log('User JWT: ', idTokenResult.token);
          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          dummyAuthContext.tokenData = token;
          checkUserIsRegistratedOrNotWithTownscup(user?.email).then((userEsxist) => {
            const userConfig = {
              method: 'get',
              url: `${Config.BASE_URL}/users/${user?.uid}`,
              headers: { Authorization: `Bearer ${token?.token}` },
            }
            if (userEsxist) {
              apiCall(userConfig).then(async (response) => {
                dummyAuthContext.entity = {
                  uid: user.uid,
                  role: 'user',
                  obj: response.payload,
                  auth: {
                    user_id: user.uid,
                    user: response.payload,
                  },
                }
                QBInitialLogin(dummyAuthContext, response?.payload);
              }).catch((error) => {
                console.log('Login Error', error)
                setloading(false);
              })
            } else {
              dummyAuthContext.entity = {
                auth: { user_id: user.uid },
                uid: user.uid,
                role: 'user',
              }
              const flName = user?.displayName?.split(' ');
              const userDetail = { ...extraData };
              if (flName?.length >= 2) [userDetail.first_name, userDetail.last_name] = flName
              else if (flName?.length === 1) [userDetail.first_name, userDetail.last_name] = [flName[0], '']
              else if (flName?.length === 0) {
                userDetail.first_name = 'Towns';
                userDetail.last_name = 'Cup';
              }
              if (!userDetail?.first_name) {
                userDetail.first_name = 'Towns';
                userDetail.last_name = 'Cup';
              }
              userDetail.email = user.email;
              signUpToTownsCup(userDetail, dummyAuthContext)
            }
          }).catch((error) => {
            console.log('Check TC Email Error', error)
          })
        }).catch(() => setloading(false));
      }
    });
    socialSignInSignUpOnAuthChanged();
  }

  const signInSignUpWithSocialCredential = async (credential, provider, extraData = {}) => {
    auth().signInWithCredential(credential).then(async (authResult) => {
      socialSignInSignUp(authResult, provider, extraData);
    }).catch((error) => {
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
      if (error.code === 'auth/network-request-failed') {
        message = strings.networkConnectivityErrorMessage;
      }
      if (message !== '') setTimeout(() => Alert.alert('Towns Cup', message), 500);
    });
  }

  // Login With Facebook manage function
  const onFacebookButtonPress = async () => {
    setloading(true);
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      setloading(false);
      throw new Error('User cancelled the login process');
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      setloading(false);
      throw new Error('Something went wrong obtaining access token');
    }
    const facebookCredential = await auth.FacebookAuthProvider.credential(data.accessToken);
    await signInSignUpWithSocialCredential(facebookCredential, 'FACEBOOK | ')
  }

 // Login With Google manage function
  const onGoogleButtonPress = async () => {
    try {
      setloading(true);
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
      await signInSignUpWithSocialCredential(googleCredential, 'GOOGLE | ')
    } catch (error) {
      let message = '';
      setloading(false)
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Play services are not available'
      }
      if (message !== '') setTimeout(() => Alert.alert('Towns cup', message), 100)
    }
  }

  // Login With Apple manage function

  const handleIOSAppleLogin = async () => {
    if (!appleAuth.isSupported) {
      alert('Apple Login not supported')
    } else {
      setloading(true);
      appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      }).then(async (appleAuthRequestResponse) => {
        if (!appleAuthRequestResponse?.identityToken) {
          setloading(false);
          setTimeout(() => {
            Alert.alert('Apple Sign-In failed - no identify token returned');
          }, 200)
        } else {
          // Create a Firebase credential from the response
          const { identityToken, nonce, fullName } = appleAuthRequestResponse;
          const appleCredential = await auth.AppleAuthProvider.credential(identityToken, nonce);
          await signInSignUpWithSocialCredential(appleCredential, 'APPLE iOS| ', { first_name: fullName?.givenName, last_name: fullName?.familyName })
        }
      }).catch(() => setloading(false));
    }
  };

  const handleAndroidAppleLogin = async () => {
    if (!appleAuthAndroid?.isSupported) {
      alert('Apple Login not supported')
    } else {
      const rawNonce = uuid();
      const state = uuid();
      appleAuthAndroid.configure({
        clientId: 'com.townscup',
        redirectUri: 'https://townscup-fee6e.firebaseapp.com/__/auth/handler',
        scope: appleAuthAndroid.Scope.ALL,
        responseType: appleAuthAndroid.ResponseType.ALL,
        nonce: rawNonce,
        state,
      });
      const appleAuthRequestResponse = await appleAuthAndroid.signIn();
      console.log(appleAuthRequestResponse);
      setloading(true);
      const { id_token, nonce, fullName } = appleAuthRequestResponse;
      const appleAndroidCredential = await auth.AppleAuthProvider.credential(id_token, nonce);
      await signInSignUpWithSocialCredential(appleAndroidCredential, 'APPLE Android| ', { first_name: fullName?.givenName, last_name: fullName?.familyName })
    }
  };

  const onAppleButtonPress = async () => {
    if (Platform.OS === 'ios') handleIOSAppleLogin()
    else handleAndroidAppleLogin()
  }

  const onLoad = useCallback(() => {
    fadeInOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeInOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeInOpacity]);

  const renderBackgroundImages = useMemo(() => (
    <Animated.Image
          style={{
            ...styles.background,
            opacity: fadeInOpacity,
          }}
          // resizeMode={'stretch'}
          source={ images[`welcomeImage${currentBackground}`] }
      />
    ), [currentBackground, fadeInOpacity])

  return (
    <LinearGradient
        colors={[colors.themeColor1, colors.themeColor3]}
        style={styles.mainContainer}>
      <StatusBar backgroundColor="white" barStyle="dark-content"/>
      <ActivityLoader visible={ loading } />
      {renderBackgroundImages}
      <View style={ styles.logoContainer }>
        <FastImage style={ styles.logo } resizeMode={'contain'} source={ images.townsCupLogo } />
        <Text style={ styles.logoTitle }>{strings.townsCupTitle}</Text>
        <Text style={ styles.logoTagLine }>{strings.townsCupTagLine}</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ marginBottom: hp(2) }}>
          {/* {Platform.OS === 'ios' && ( */}
          <AppleButton onPress={() => {
            if (authContext.networkConnected) onAppleButtonPress();
            else authContext.showNetworkAlert();
          }}/>
          {/* )} */}

          <FacebookButton onPress={() => {
            if (authContext.networkConnected) onFacebookButtonPress();
            else authContext.showNetworkAlert();
          }}/>

          <GoogleButton onPress={() => {
            if (authContext.networkConnected) onGoogleButtonPress();
            else authContext.showNetworkAlert();
          }}/>

          <TouchableOpacity
            style={styles.allButton }
            onPress={ () => navigation.navigate('SignupScreen')}>
            <FastImage source={ images.email } resizeMode={'contain'} style={ styles.signUpImg } />
            <Text style={ styles.signUpText }>{strings.signUpText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={ () => navigation.navigate('LoginScreen') }
            style={ styles.alreadyView }>
            <Text style={ styles.alreadyMemberText }>{strings.alreadyMember}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          By continuing or signing up you agree to Townty’s{'\n'}
          <Text onPress={() => {}} style={{ textDecorationLine: 'underline' }}>Terms of Service.</Text> We will manage information about you{'\n'}
          as described in our{' '}
          <Text onPress={() => {}} style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text> and{' '}
          <Text onPress={() => {}} style={{ textDecorationLine: 'underline' }}>Cookie Policy</Text>.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  allButton: {
    marginVertical: 5,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    alignItems: 'center',
    padding: 12,
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
    marginVertical: 10,
    alignSelf: 'center',
  },
  privacyText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.whiteColor,
    width: '80%',
    alignSelf: 'center',
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  logo: {
    alignContent: 'center',
    height: hp(12),
    width: wp(22),
    marginBottom: hp(4),
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: hp('15%'),
  },
  logoTagLine: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  logoTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('9%'),
    letterSpacing: 5,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 25,
  },

  signUpImg: {
    flex: 0.2,
    alignSelf: 'center',
    height: 20,
    width: 20,
    position: 'absolute',
    left: 30,
  },
  signUpText: {
    color: colors.themeColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    textAlign: 'center',
  },
});
