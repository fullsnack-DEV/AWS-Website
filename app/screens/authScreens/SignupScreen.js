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
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';

import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import TCKeyboardView from '../../components/TCKeyboardView';
import ActivityLoader from '../../components/loader/ActivityLoader';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
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
  const [email, setEmail] = useState('makani20@gmail.com');
  const [password, setPassword] = useState('123456');
  const [cPassword, setCPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const [profilePic] = useState(null);

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = () => {
    if (fName === '') {
      Alert.alert(strings.appName, 'First name cannot be blank');
      return false;
    }
    if (Utility.validatedName(fName) === false) {
      Alert.alert(
        strings.appName,
        'The first name cannot contain numbers or special characters.',
      );
      return false;
    }
    if (lName === '') {
      Alert.alert(strings.appName, 'Last name cannot be blank');
      return false;
    }
    if (Utility.validatedName(lName) === false) {
      Alert.alert(
        strings.appName,
        'The last name cannot contain numbers or special characters.',
      );
      return false;
    }
    if (email === '') {
      Alert.alert(strings.appName, 'Email cannot be blank');
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

  useEffect(() => {}, []);
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
              marginLeft: wp('5.33%'),
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Text
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

              saveUserDetails(user);
            }
          });

        signUpOnAuthChanged();
      })
      .catch((e) => {
        setloading(false);
        let message = '';
        if (e.code === 'auth/user-not-found') {
          message = 'This email address is not registerd';
        }
        if (e.code === 'auth/email-already-in-use') {
          message = 'That email address is already registrated! please login';
        }
        if (e.code === 'auth/invalid-email') {
          message = strings.validEmailMessage;
        }
        if (e.code === 'auth/too-many-requests') {
          message = 'Too many request for signup ,try after sometime';
        }
        if (e.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '')
          setTimeout(() => Alert.alert(strings.appName, message), 50);
      });
  };

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
                      'Townscup',
                      `This email is already registrated with ${error?.provider}`,
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
          <View style={{marginVertical: hp('8.12%')}}>
            <TCTextField
              placeholderTextColor={colors.darkYellowColor}
              style={styles.textFieldStyle}
              placeholder={strings.emailPlaceHolder}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <View style={styles.passwordView}>
              <TextInput
                style={{...styles.textInput, zIndex: 100}}
                placeholder={strings.passwordText}
                onChangeText={(text) => setPassword(text)}
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
                    marginLeft: wp('5%'),
                    top: 10,
                  }}>
                  {hidePassword ? (
                    <Text style={styles.passwordEyes}>SHOW</Text>
                  ) : (
                    <Text style={styles.passwordEyes}>HIDE</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordView}>
              <TextInput
                autoCapitalize="none"
                style={{...styles.textInput, zIndex: 100}}
                placeholder={strings.confirmPasswordText}
                onChangeText={setCPassword}
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
                  marginLeft: wp('5%'),
                }}>
                {hideConfirmPassword ? (
                  <Text style={styles.passwordEyes}>SHOW</Text>
                ) : (
                  <Text style={styles.passwordEyes}>HIDE</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TCKeyboardView>
        <SafeAreaView>
          <View style={{bottom: 16}}>
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
                  Log In
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
    fontFamily: fonts.RLight,
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
    width: wp('81.3%'),
  },
  textInput: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: wp('65%'),
  },
  textFieldStyle: {
    marginVertical: 5,
    alignSelf: 'center',
    width: wp('81.3%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: wp('4%'),
    color: colors.whiteColor,
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: wp('6.6%'),
    marginTop: hp('11.39%'),
    textAlign: 'left',
  },
});
