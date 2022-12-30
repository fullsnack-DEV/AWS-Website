import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';

import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'react-string-format';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import TCKeyboardView from '../../components/TCKeyboardView';
import ActivityLoader from '../../components/loader/ActivityLoader';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCTextField from '../../components/TCTextField';
import AuthContext from '../../auth/context';
import apiCall from '../../utils/apiCall';
import {checkTownscupEmail} from '../../api/Users';

import {getHitSlop} from '../../utils/index';

export default function SignupScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const dummyAuthContext = {...authContext};
  const [fName] = useState('Kishan');
  const [lName] = useState('Makani');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const [profilePic] = useState(null);
  const SCREEN_HEIGHT = Dimensions.get('screen').height; // device height
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  const WINDOW_HEIGHT = Dimensions.get('window').height;

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = () => {
    if (fName === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      return false;
    }
    if (Utility.validatedName(fName) === false) {
      Alert.alert(strings.appName, strings.fNameCanNotBlank);
      return false;
    }
    if (lName === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      return false;
    }
    if (Utility.validatedName(lName) === false) {
      Alert.alert(strings.appName, strings.lNameCanNotBlank);
      return false;
    }
    if (email === '') {
      Alert.alert(strings.appName, strings.emailNotBlankText);
      return false;
    }
    if (validateEmail(email) === false) {
      Alert.alert('', strings.validEmailMessage);
      return false;
    }
    if (password === '') {
      Alert.alert(strings.appName, strings.passwordCanNotBlank);
      return false;
    }
    if (cPassword === '') {
      Alert.alert(strings.appName, strings.cofirmpPswCanNotBlank);
      return false;
    }
    if (password !== cPassword) {
      Alert.alert(strings.appName, strings.confirmAndPasswordNotMatch);
      return false;
    }
    if (password.length < 6) {
      Alert.alert(strings.appName, strings.passwordWarningMessage);
      return false;
    }
    return true;
  };
  const validateEmail = (emailText) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        emailText,
      )
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    console.log('status bar h', StatusBar.currentHeight);
    console.log('SCREEN_HEIGHT', SCREEN_HEIGHT);
    console.log('STATUS_BAR_HEIGHT', STATUS_BAR_HEIGHT);
    console.log('WINDOW_HEIGHT', WINDOW_HEIGHT);
    console.log('H', SCREEN_HEIGHT - WINDOW_HEIGHT + StatusBar.currentHeight);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Text
          testID="signup-nav-text"
          style={styles.nextButtonStyle}
          onPress={() => {
            if (validate()) {
              if (authContext.networkConnected) {
                signupUser();
              } else {
                authContext.showNetworkAlert();
              }
            }
          }}>
          {strings.signUp}
        </Text>
      ),
    });
  });
  const checkUserIsRegistratedOrNotWithTownscup = () =>
    new Promise((resolve) => {
      checkTownscupEmail(encodeURIComponent(email))
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

  const checkUserIsRegistratedOrNotWithFirebase = () =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
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

  const setDummyAuthContext = (key, value) => {
    dummyAuthContext[key] = value;
  };
  const saveUserDetails = async (user) => {
    if (user) {
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          console.log('idTokenResult', idTokenResult);

          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          const uploadImageConfig = {
            method: 'get',
            url: `${Config.BASE_URL}/pre-signed-url?count=2`,
            headers: {Authorization: `Bearer ${token?.token}`},
          };
          const entity = {
            auth: {user_id: user.uid},
            uid: user.uid,
            role: 'user',
          };
          setDummyAuthContext('tokenData', token);
          await authContext.setTokenData(token);
          await authContext.setEntity(entity);

          if (profilePic) {
            const apiResponse = await apiCall(uploadImageConfig);
            const preSignedUrls = apiResponse?.payload?.preSignedUrls ?? [];
            Promise.all([
              uploadImageOnPreSignedUrls({
                url: preSignedUrls?.[0],
                uri: profilePic.path,
                type: profilePic.path.split('.')[1] || 'jpeg',
              }),
              uploadImageOnPreSignedUrls({
                url: preSignedUrls?.[1],
                uri: profilePic?.path,
                type: profilePic?.path.split('.')[1] || 'jpeg',
              }),
            ])
              .then(async () => {
                setDummyAuthContext('entity', entity);
                navigateToEmailVarificationScreen();
              })
              .catch(async () => {
                setDummyAuthContext('entity', entity);
                // await signUpToTownsCup();
                navigateToEmailVarificationScreen();
              });
          } else {
            setDummyAuthContext('entity', entity);
            // await signUpToTownsCup();
            navigateToEmailVarificationScreen();
          }
        })
        .catch(() => setloading(false));
    }
  };

  const navigateToEmailVarificationScreen = () => {
    setloading(false);
    navigation.navigate('EmailVerificationScreen', {
      signupInfo: {
        emailAddress: email,
        password,
      },
    });
  };
  const signUpWithFirebase = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const signUpOnAuthChanged = firebase
          .auth()
          .onAuthStateChanged((user) => {
            if (user) {
              user.sendEmailVerification();
              // console.log('Firebase user', user);
              // callEmailVerification();
              saveUserDetails(user);
            }
          });

        signUpOnAuthChanged();
      })
      .catch((e) => {
        setloading(false);
        let message = '';
        if (e.code === 'auth/user-not-found') {
          message = strings.emailNotRegisterdValidation;
        }
        if (e.code === 'auth/email-already-in-use') {
          message = strings.emailAlreadyRegisteredValidation;
        }
        if (e.code === 'auth/invalid-email') {
          message = strings.validEmailMessage;
        }
        if (e.code === 'auth/too-many-requests') {
          message = strings.manyRequestForSignUpValidation;
        }
        if (e.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '')
          setTimeout(() => Alert.alert(strings.appName, message), 50);
      });
  };
  // This commented code we will be used in production for email varification please dont remove it.
  /*
  const callEmailVerification = () =>
    new Promise((resolve) => {
      console.log('email-->', email);
      userEmailVerification(email)
        .then(() => {
          console.log('Email varification done');
          resolve(true);
        })
        .catch((e) => {
          console.log('Email varification failed', e);
          resolve(false);
        });
    });
   */

  const registerWithAnotherProvider = (param) =>
    new Promise((resolve, reject) => {
      if (param[0].includes('facebook')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'facebook'});
      }
      if (param[0].includes('google')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'google'});
      }
      if (param[0].includes('apple.com')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'apple'});
      }
      resolve(true);
    });
  const signupUser = () => {
    setloading(true);
    checkUserIsRegistratedOrNotWithTownscup().then((userExist) => {
      if (userExist) {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alreadyRegisteredMessage);
        }, 100);
      } else {
        checkUserIsRegistratedOrNotWithFirebase()
          .then((firebaseUserExist) => {
            if (firebaseUserExist) {
              registerWithAnotherProvider(firebaseUserExist)
                .then(() => {
                  signUpWithFirebase();
                })
                .catch((error) => {
                  console.log(error);
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(
                      strings.appName,
                      format(
                        strings.emailAlreadyRegisteredWith,
                        error?.provider,
                      ),
                    );
                  }, 100);
                });
            } else {
              signUpWithFirebase();
            }
          })
          .catch(() => {
            signUpWithFirebase();
          });
      }
    });
  };
  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };
  const hideShowConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  return (
    <>
      <LinearGradient
        colors={[colors.themeColor1, colors.themeColor3]}
        style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <FastImage
          resizeMode={'stretch'}
          style={styles.background}
          source={images.loginBg}
        />
        <Text style={styles.checkEmailText}>{strings.signupwithemail}</Text>
        <TCKeyboardView>
          <View
            style={{
              marginVertical: 66,
              marginLeft: 35,
              marginRight: 35,
            }}>
            <TCTextField
              testID={'email-signup-input'}
              placeholderTextColor={colors.darkYellowColor}
              style={styles.textFieldStyle}
              height={40}
              placeholder={strings.emailPlaceHolder}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />

            <View style={styles.passwordView}>
              <TextInput
                testID="password-signup-input"
                style={{
                  ...styles.textInput,
                }}
                placeholder={strings.passwordText}
                onChangeText={(text) => {
                  if (text.includes(' ')) {
                    setPassword(text.trim());
                  } else {
                    setPassword(text);
                  }
                }}
                value={password}
                placeholderTextColor={colors.darkYellowColor}
                secureTextEntry={hidePassword}
                keyboardType={'default'}
              />
              <View>
                <TouchableOpacity
                  onPress={() => hideShowPassword()}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    top: 10,
                  }}>
                  {hidePassword ? (
                    <Text style={styles.passwordEyes}>{strings.SHOW}</Text>
                  ) : (
                    <Text style={styles.passwordEyes}>{strings.HIDE}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordView}>
              <TextInput
                testID="cpassword-signup-input"
                autoCapitalize="none"
                style={{...styles.textInput}}
                placeholder={strings.confirmPasswordText}
                onChangeText={(text) => {
                  if (text.includes(' ')) {
                    setCPassword(text.trim());
                  } else {
                    setCPassword(text);
                  }
                }}
                value={cPassword}
                placeholderTextColor={colors.darkYellowColor}
                secureTextEntry={hideConfirmPassword}
                keyboardType={'default'}
              />
              <TouchableOpacity
                onPress={() => hideShowConfirmPassword()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                {hideConfirmPassword ? (
                  <Text style={styles.passwordEyes}>{strings.SHOW}</Text>
                ) : (
                  <Text style={styles.passwordEyes}>{strings.HIDE}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TCKeyboardView>
        <SafeAreaView>
          <View style={{bottom: 15}}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              onPress={() => navigation.navigate('LoginScreen')}
              style={styles.alreadyView}>
              <Text style={styles.alreadyMemberText}>
                {strings.alreadyMember}
                <Text> </Text>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontFamily: fonts.RBold,
                  }}>
                  {strings.loginText}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  passwordEyes: {
    fontSize: 10,
    color: colors.darkYellowColor,
    textDecorationLine: 'underline',
    textAlign: 'right',
    width: 50,
  },
  passwordView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    height: 40,
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    flex: 1,
  },
  textFieldStyle: {
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    paddingHorizontal: 5,
    marginHorizontal: 0,
  },

  alreadyMemberText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  alreadyView: {
    alignSelf: 'center',
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    textAlign: 'left',
  },
});
