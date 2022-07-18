/* eslint-disable no-unused-vars */
/* eslint-disable react-native/split-platform-components */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import jwtDecode from 'jwt-decode';

import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {v4 as uuid} from 'uuid';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from '../../auth/context';
import FacebookButton from '../../components/FacebookButton';
import GoogleButton from '../../components/GoogleButton';
import ActivityLoader from '../../components/loader/ActivityLoader';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import * as Utility from '../../utils/index';
import apiCall from '../../utils/apiCall';

import {QBconnectAndSubscribe, QBlogin} from '../../utils/QuickBlox';
import AppleButton from '../../components/AppleButton';
import {checkTownscupEmail, createUser} from '../../api/Users';
import {getHitSlop} from '../../utils/index';

const BACKGROUND_CHANGE_INTERVAL = 4000; // 4 seconds
export default function WelcomeScreen({navigation}) {
  const fadeInOpacity = new Animated.Value(0);
  // For activity indigator
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [currentBackground, setCurrentBackground] = useState(1);

  useEffect(() => {
    onLoad();
  }, [currentBackground]);

  useEffect(() => {
    const backgroundInterval = setInterval(
      changeBackground,
      BACKGROUND_CHANGE_INTERVAL,
    );
    return () => {
      clearInterval(backgroundInterval);
    };
  }, []);

  const changeBackground = useCallback(() => {
    setCurrentBackground((curBg) => {
      if (curBg < 4) return curBg + 1;
      return 1;
    });
  }, []);

  // Google sign-in configuration initialization
  GoogleSignin.configure({
    webClientId: Config.WEB_CLIENT_FIREBASE,
    offlineAccess: false,
  });

  const getRedirectionScreenName = useCallback(
    (townscupUser) =>
      new Promise((resolve, reject) => {
        if (!townscupUser.birthday) resolve({screen: 'AddBirthdayScreen'});
        else if (!townscupUser.gender) resolve({screen: 'ChooseGenderScreen'});
        else if (!townscupUser.city) resolve({screen: 'ChooseLocationScreen'});
        else if (!townscupUser.sports) {
          resolve({
            screen: 'ChooseSportsScreen',
            params: {
              city: townscupUser?.city,
              state: townscupUser?.state_abbr,
              country: townscupUser?.country,
            },
          });
        } else reject(new Error({error: 'completed user profile'}));
      }),
    [],
  );

  const loginFinalRedirection = useCallback(
    async (townscupUser, dummyAuthContext) => {
      let entity = {...dummyAuthContext?.entity};
      entity = {
        ...entity,
        auth: {...entity?.auth, user: townscupUser},
        obj: {...entity?.obj, ...townscupUser},
      };
      await authContext.setTokenData(dummyAuthContext?.tokenData);
      await Utility.setStorage('authContextUser', {...townscupUser});
      await Utility.setStorage('authContextEntity', {...entity});
      await Utility.setStorage('loggedInEntity', entity);
      await authContext.setUser({...townscupUser});
      await authContext.setEntity({...entity});
      // eslint-disable-next-line no-underscore-dangle
      getRedirectionScreenName(townscupUser)
        .then((responseScreen) => {
          setloading(false);
          navigation.replace(responseScreen?.screen, {
            ...responseScreen?.params,
          });
        })
        .catch(async () => {
          entity.isLoggedIn = true;
          await Utility.setStorage('authContextEntity', {...entity});
          await Utility.setStorage('loggedInEntity', {...entity});
          setloading(false);
          await authContext.setEntity({...entity});
        });
    },
    [authContext, getRedirectionScreenName, navigation],
  );

  const QBInitialLogin = async (dummyAuth, townscupUser) => {
    const dummyAuthContext = {...dummyAuth};
    let qbEntity = {...dummyAuthContext?.entity};
    QBlogin(qbEntity?.uid, townscupUser)
      .then(async (res) => {
        qbEntity = {
          ...qbEntity,
          QB: {...res?.user, connected: true, token: res?.session?.token},
        };
        QBconnectAndSubscribe(qbEntity);
        dummyAuthContext.entity = {...qbEntity};
        await loginFinalRedirection(townscupUser, dummyAuthContext);
      })
      .catch(async (error) => {
        console.log('QB Login Error : ', error.message);
        qbEntity = {...qbEntity, QB: {connected: false}};
        dummyAuthContext.entity = {...qbEntity};
        await loginFinalRedirection(townscupUser, dummyAuthContext);
      });
  };

  const wholeSignUpProcessComplete = async (userData, dummyAuthContext) => {
    const entity = {...dummyAuthContext?.entity};
    const tokenData = dummyAuthContext?.tokenData;
    entity.auth.user = {...userData};
    entity.obj = {...userData};
    entity.uid = userData?.user_id;
    await Utility.setStorage('loggedInEntity', {...entity});
    await Utility.setStorage('authContextEntity', {...entity});
    await Utility.setStorage('authContextUser', {...userData});
    await authContext.setTokenData(tokenData);
    await authContext.setUser({...userData});
    await authContext.setEntity({...entity});
    setloading(false);
    navigation.navigate('AddBirthdayScreen');
  };

  const signUpWithQB = (response, dummyAuth) => {
    const dummyAuthContext = {...dummyAuth};
    let qbEntity = {...dummyAuthContext?.entity};
    QBlogin(qbEntity?.uid, response)
      .then(async (res) => {
        qbEntity = {
          ...qbEntity,
          QB: {...res?.user, connected: true, token: res?.session?.token},
        };

        console.log('QB qbEntity : ', qbEntity);

        QBconnectAndSubscribe(qbEntity);
        dummyAuthContext.entity = qbEntity;
        await wholeSignUpProcessComplete(response, dummyAuthContext);
      })
      .catch(async (error) => {
        console.log('QB Login Error : ', error.message);
        qbEntity = {...qbEntity, QB: {connected: false}};
        dummyAuthContext.entity = qbEntity;
        await wholeSignUpProcessComplete(response, dummyAuthContext);
      });
  };
  const navigateToAddBirthdayScreen = async (userDetail, dummyAuth) => {
    // const entity = {
    //   auth: {user_id: user.uid},
    //   uid: user.uid,
    //   role: 'user',
    // };
    setloading(false);
    const dummyAuthContext = {...dummyAuth};
    const authEntity = {...dummyAuthContext?.entity};
    const token = {...dummyAuthContext?.tokenData};
    console.log('Token=====>', token);
    console.log('authEntity=====>', authEntity);
    console.log('userDetail=====>', userDetail);

    await authContext.setTokenData(token);
    await authContext.setEntity(authEntity);
    // navigation.navigate('AddBirthdayScreen', {
    //   signupInfo: {
    //     first_name: userDetail?.first_name,
    //     last_name: userDetail?.last_name,
    //     email: userDetail?.email,
    //   },
    // });

    navigation.navigate('AddNameScreen', {
      signupInfo: {
        first_name: userDetail?.first_name,
        last_name: userDetail?.last_name,
        emailAddress: userDetail?.email,
        uploadedProfilePic: userDetail?.uploadedProfilePic,
      },
    });
  };
  const signUpToTownsCup = async (userDetail, dummyAuth) => {
    const dummyAuthContext = {...dummyAuth};
    setloading(true);
    const data = {
      first_name: userDetail?.first_name,
      last_name: userDetail?.last_name,
      email: userDetail?.email,
    };
    console.log('Post userDetail:=>', userDetail);

    console.log('Post Data:=>', data);
    createUser(data, dummyAuthContext)
      .then((createdUser) => {
        const authEntity = {...dummyAuthContext?.entity};
        authEntity.obj = createdUser?.payload;
        authEntity.auth.user = createdUser?.payload;
        authEntity.role = 'user';
        dummyAuthContext.entity = authEntity;
        dummyAuthContext.user = createdUser?.payload;
        signUpWithQB(createdUser?.payload, dummyAuthContext);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const checkUserIsRegistratedOrNotWithFirebase = (email) =>
    new Promise((resolve, reject) => {
      auth()
        .fetchSignInMethodsForEmail(email)
        .then((isAccountThereInFirebase) => {
          if (isAccountThereInFirebase?.length > 0) {
            resolve(isAccountThereInFirebase);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });

  const checkUserIsRegistratedOrNotWithTownscup = (email) =>
    new Promise((resolve) => {
      checkTownscupEmail(encodeURIComponent(email))
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

  const socialSignInSignUp = (authResult, message, extraData = {}) => {
    const dummyAuthContext = {...authContext};
    const socialSignInSignUpOnAuthChanged = auth().onAuthStateChanged(
      (user) => {
        console.log('User :-', user);
        console.log('User email:-', user.email);
        if (user) {
          user
            .getIdTokenResult()
            .then(async (idTokenResult) => {
              console.log('User JWT: ', idTokenResult.token);
              const token = {
                token: idTokenResult.token,
                expirationTime: idTokenResult.expirationTime,
              };
              dummyAuthContext.tokenData = token;
              checkUserIsRegistratedOrNotWithTownscup(user?.email)
                .then((userExist) => {
                  console.log('User exist:=>', userExist);
                  const userConfig = {
                    method: 'get',
                    url: `${Config.BASE_URL}/users/${user?.uid}`,
                    headers: {Authorization: `Bearer ${token?.token}`},
                  };
                  if (userExist) {
                    apiCall(userConfig)
                      .then(async (response) => {
                        dummyAuthContext.entity = {
                          uid: user.uid,
                          role: 'user',
                          obj: response.payload,
                          auth: {
                            user_id: user.uid,
                            user: response.payload,
                          },
                        };
                        QBInitialLogin(dummyAuthContext, response?.payload);
                        console.log('Already register user details', user);
                        console.log(
                          'Already register extraData details',
                          extraData,
                        );
                        // setloading(false);
                        // setTimeout(() => {
                        //   Alert.alert(strings.alreadyRegisteredMessage);
                        // }, 100);
                      })
                      .catch((error) => {
                        console.log('Login Error', error);
                        setTimeout(() => {
                          Alert.alert(error);
                        }, 10);
                        setloading(false);
                      });
                  } else {
                    dummyAuthContext.entity = {
                      auth: {user_id: user.uid},
                      uid: user.uid,
                      role: 'user',
                    };
                    console.log('extraData:=>', extraData);

                    const flName = user?.displayName?.split(' ');
                    const userDetail = {...extraData};
                    if (flName?.length >= 2) {
                      [userDetail.first_name, userDetail.last_name] = flName;
                    } else if (flName?.length === 1) {
                      [userDetail.first_name, userDetail.last_name] = [
                        flName[0],
                        '',
                      ];
                    } else if (flName?.length === 0) {
                      userDetail.first_name = 'Towns';
                      userDetail.last_name = 'Cup';
                    }
                    if (!userDetail?.first_name) {
                      userDetail.first_name = 'Towns';
                      userDetail.last_name = 'Cup';
                    }
                    userDetail.email = user.email;
                    if (user.photoURL.length > 0) {
                      const uploadedProfilePic = {
                        full_image: user.photoURL,
                        thumbnail: user.photoURL,
                      };
                      userDetail.uploadedProfilePic = uploadedProfilePic;
                    }
                    console.log('Image==>', user.photoURL);
                    console.log('Prepared userDetail:=>', userDetail);

                    // signUpToTownsCup(userDetail, dummyAuthContext);
                    navigateToAddBirthdayScreen(userDetail, dummyAuthContext);
                  }
                })
                .catch((error) => {
                  console.log('Check TC Email Error', error);
                  setTimeout(() => {
                    Alert.alert(error);
                  });
                  setloading(false);
                });
            })
            .catch((error) => {
              setloading(false);
              setTimeout(() => {
                Alert.alert(error);
              });
            });
        }
      },
    );
    socialSignInSignUpOnAuthChanged();
  };

  const signInSignUpWithSocialCredential = async (
    credential,
    provider,
    extraData = {},
  ) => {
    console.log('social cred:=>', credential);

    auth()
      .signInWithCredential(credential)
      .then(async (authResult) => {
        console.log('social authResult:=>', authResult);
        console.log('social provider:=>', provider);

        console.log('social extraData:=>', extraData);

        socialSignInSignUp(authResult, provider, extraData);
      })
      .catch(async (error) => {
        // console.log('error lors de l\'authentification firebase : ', error);
        //   console.log('codeError : ', error.code);
        //  // error.email is undefined
        //   console.log('emailError : ', error.email);
        //   const codeError = error.code;
        // if (codeError === 'auth/account-exists-with-different-credential') {
        //   const providers = await auth().fetchSignInMethodsForEmail(error.email);
        //  console.log('providersproviders',providers);
        // }
        console.log('error.codeerror.code', error.code);
        setloading(false);
        let message = '';
        if (error.code === 'auth/user-not-found') {
          message = strings.userNotFound;
        }
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (error.code === 'auth/invalid-email') {
          message = strings.validEmailMessage;
        }
        if (error.code === 'auth/user-disabled') {
          message = strings.terminationAlert;
        }
        if (error.code === 'auth/account-exists-with-different-credential') {
          message = 'You are already registrated with different login method ';
        }
        if (error.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '') {
          setTimeout(() => Alert.alert(strings.appName, message), 500);
        }
      });
  };

  // Login With Facebook manage function
  const onFacebookButtonPress = async () => {
    try {
      setloading(true);
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_birthday',
      ]);
      console.log('facebook login result', result);
      if (result.isCancelled) {
        setloading(false);
        throw new Error('User canceled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      console.log('facebook login data', data);

      if (!data) {
        setloading(false);
        throw new Error('Something went wrong obtaining access token');
      }
      const facebookCredential = await auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      console.log('facebook facebookCredential', facebookCredential);

      await signInSignUpWithSocialCredential(facebookCredential, 'FACEBOOK | ');
    } catch (error) {
      setloading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert('Canceled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('play services not available or outdated');
      } else {
        console.log('Something went wrong:', error);
        Alert.alert('Something went wrong', error.toString());
      }
    }
  };

  // Login With Google manage function
  const onGoogleButtonPress = async () => {
    try {
      setloading(true);

      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      console.log('idToken', idToken);

      const googleCredential = await auth.GoogleAuthProvider.credential(
        idToken,
      );
      console.log('googleCredential', googleCredential);
      await signInSignUpWithSocialCredential(googleCredential, 'GOOGLE | ');
    } catch (error) {
      setloading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert('Canceled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('play services not available or outdated');
      } else {
        console.log('Something went wrong:', error);
        Alert.alert('Something went wrong', error.toString());
      }
    }
  };

  // Login With Apple manage function

  const registerWithAnotherProvider = (param) =>
    new Promise((resolve, reject) => {
      if (param.includes('facebook.com')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'facebook'});
      } else if (param.includes('google.com')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'google'});
      } else if (param.includes('apple.com')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'apple'});
      } else if (param.includes('password')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'email-password'});
      }
      resolve(true);
    });

  const commonCheckEmailVerification = ({
    email,
    provider,
    successCallback = () => {},
    errorCallback = () => {},
  }) => {
    checkUserIsRegistratedOrNotWithFirebase(email)
      .then(async (providerData) => {
        console.log('provider::=>', provider);
        console.log('providerData::=>', providerData);
        if (providerData?.length > 0 || !providerData) {
          successCallback();
        }
        // else {
        //   successCallback();
        // }
      })
      .catch(async (error) => {
        console.log(error);
        successCallback();
      });
  };

  const handleIOSAppleLogin = async () => {
    try {
      if (!appleAuth.isSupported) {
        Alert.alert('Apple Login not supported');
      } else {
        setloading(true);
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        console.log(' appleAuthRequestResponse', appleAuthRequestResponse);
        const {email} = await jwtDecode(appleAuthRequestResponse.identityToken);

        if (!appleAuthRequestResponse?.identityToken) {
          setloading(false);
          setTimeout(() => {
            Alert.alert('Apple Sign-In failed - no identify token returned');
          }, 10);
        } else {
          const {identityToken, nonce} = appleAuthRequestResponse;
          commonCheckEmailVerification({
            email,
            provider: 'apple',
            successCallback: async () => {
              const appleCredential = await auth.AppleAuthProvider.credential(
                identityToken,
                nonce,
              );
              console.log('appleCredential=>', appleCredential);
              await signInSignUpWithSocialCredential(
                appleCredential,
                'APPLE iOS| ',
                {
                  first_name: appleAuthRequestResponse.fullName.givenName,
                  last_name: appleAuthRequestResponse.fullName.familyName,
                },
              );
            },
          });
        }
      }
    } catch (e) {
      setloading(false);
      Alert.alert('Your sign up could not be completed.');
    }
  };

  const handleAndroidAppleLogin = async () => {
    try {
      console.log('1::=>:');
      setloading(true);
      if (!appleAuthAndroid?.isSupported) {
        alert('Apple Login not supported');
      } else {
        console.log('2::=>:');

        const rawNonce = uuid();
        const state = uuid();
        appleAuthAndroid.configure({
          clientId: 'com.townscup',
          redirectUri: 'https://townscup-fee6e.firebaseapp.com/__/auth/handler',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });
        console.log('3::=>:');

        const appleAuthRequestResponse = await appleAuthAndroid.signIn();
        console.log('4::=>:');
        const {email} = await jwtDecode(appleAuthRequestResponse.id_token);

        console.log(appleAuthRequestResponse);
        console.log('email:', email);

        setloading(true);
        const {id_token, nonce} = appleAuthRequestResponse;
        commonCheckEmailVerification({
          email,
          provider: 'apple',
          successCallback: async () => {
            const appleAndroidCredential =
              await auth.AppleAuthProvider.credential(id_token, nonce);
            await signInSignUpWithSocialCredential(
              appleAndroidCredential,
              'APPLE Android| ',
              {
                first_name: '',
                last_name: '',
              },
            );
          },
        });
      }
    } catch (e) {
      setloading(false);

      Alert.alert(e.message);
    }
  };

  const onAppleButtonPress = async () => {
    if (Platform.OS === 'ios') handleIOSAppleLogin();
    else handleAndroidAppleLogin();
  };

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
    ]).start();
  }, [fadeInOpacity]);

  const renderBackgroundImages = useMemo(
    () => (
      <Animated.Image
        style={{
          ...styles.background,
          opacity: fadeInOpacity,
        }}
        // resizeMode={'stretch'}
        source={images[`welcomeImage${currentBackground}`]}
      />
    ),
    [currentBackground, fadeInOpacity],
  );

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}
    >
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ActivityLoader visible={loading} />
      {renderBackgroundImages}
      <View style={styles.logoContainer}>
        <FastImage
          style={styles.logo}
          resizeMode={'contain'}
          source={images.townsCupLogo}
        />
        <Text style={styles.logoTitle}>{strings.townsCupTitle}</Text>
        <Text style={styles.logoTagLine}>{strings.townsCupTagLine}</Text>
      </View>

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={{marginBottom: hp(2)}}>
          {/* {Platform.OS === 'ios' && ( */}
          <AppleButton
            onPress={() => {
              if (authContext.networkConnected) onAppleButtonPress();
              else authContext.showNetworkAlert();
            }}
          />
          {/* )} */}

          <FacebookButton
            onPress={() => {
              if (authContext.networkConnected) onFacebookButtonPress();
              else authContext.showNetworkAlert();
            }}
          />

          <GoogleButton
            onPress={() => {
              if (authContext.networkConnected) onGoogleButtonPress();
              else authContext.showNetworkAlert();
            }}
          />

          <TouchableOpacity
            style={styles.allButton}
            onPress={() => navigation.navigate('SignupScreen')}
          >
            <FastImage
              source={images.email}
              resizeMode={'contain'}
              style={styles.signUpImg}
            />
            <Text style={styles.signUpText}>{strings.signUpText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.alreadyView}
          >
            <Text style={styles.alreadyMemberText}>
              {strings.alreadyMember}
              <Text> </Text>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.RBold,
                }}
              >
                Log In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          By continuing or signing up you agree to our{'\n'}
          <Text onPress={() => {}} style={{textDecorationLine: 'underline'}}>
            Terms of Service.
          </Text>{' '}
          We will manage information about you{'\n'}
          as described in our{' '}
          <Text onPress={() => {}} style={{textDecorationLine: 'underline'}}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text onPress={() => {}} style={{textDecorationLine: 'underline'}}>
            Cookie Policy
          </Text>
          .
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
    shadowOffset: {width: 0, height: 2},
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
