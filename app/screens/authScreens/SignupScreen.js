import React, {useContext, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import firebase from '@react-native-firebase/app';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
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
import Verbs from '../../Constants/Verbs';
import AuthScreenHeader from './AuthScreenHeader';

const windowHeight = Dimensions.get('window').height;

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

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = () => {
    if (fName === '') {
      displayAlert(strings.firstnamevalidation);
      return false;
    }
    if (Utility.validatedName(fName) === false) {
      displayAlert(strings.fNameCanNotBlank);
      return false;
    }
    if (lName === '') {
      displayAlert(strings.lastnamevalidation);
      return false;
    }

    if (Utility.validatedName(lName) === false) {
      displayAlert(strings.lNameCanNotBlank);
      return false;
    }
    if (email === '') {
      displayAlert(strings.emailNotBlankText);
      return false;
    }
    if (validateEmail(email) === false) {
      displayAlert(strings.validEmailMessage);
      return false;
    }

    if (password.length < Verbs.PASSWORD_LENGTH) {
      Utility.showAlert(strings.passwordWarningMessage);

      return false;
    }

    if (password === '') {
      displayAlert(strings.passwordCanNotBlank);
      return false;
    }
    if (cPassword === '') {
      displayAlert(strings.cofirmpPswCanNotBlank);
      return false;
    }
    if (password !== cPassword) {
      displayAlert(strings.confirmAndPasswordNotMatch);
      return false;
    }

    return true;
  };
  const displayAlert = (message) => {
    Alert.alert(
      strings.appName,
      message,
      [
        {
          text: strings.okTitleText,
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
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

  const onBackPress = () => {
    navigation.pop();
  };

  const signUpPress = () => {
    if (validate()) {
      if (authContext.networkConnected) {
        signupUser();
      } else {
        authContext.showNetworkAlert();
      }
    }
  };

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
        emailAddress: email.toLowerCase(),
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
        if (message !== '') setTimeout(() => Utility.showAlert(message), 50);
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
          Utility.showAlert(strings.alreadyRegisteredMessage);
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
                      [{text: strings.okTitleText, onPress: () => {}}],
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#FF8A01'}}>
      <ActivityLoader visible={loading} />
      <FastImage
        style={styles.background}
        source={images.loginBg}
        resizeMode="cover"
      />

      <AuthScreenHeader
        title={strings.signupwithemail}
        onBackPress={onBackPress}
        showNext={false}
      />

      <TCKeyboardView>
        <View
          style={{
            marginHorizontal: 25,

            marginTop: 35,
          }}>
          <TCTextField
            testID={'email-signup-input'}
            focus={true}
            placeholderTextColor={colors.darkYellowColor}
            style={styles.textFieldStyle}
            height={40}
            placeholder={strings.email}
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
            <TouchableOpacity
              onPress={() => hideShowPassword()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              {hidePassword ? (
                <Text style={styles.passwordEyes}>{strings.SHOW}</Text>
              ) : (
                <Text style={styles.passwordEyes}>{strings.HIDE}</Text>
              )}
            </TouchableOpacity>
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
          <View style={{marginTop: 5}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                lineHeight: 24,
                color: colors.whiteColor,
              }}>
              {strings.signUpPasswordText}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => signUpPress()}
            style={{
              backgroundColor: colors.whiteColor,
              borderRadius: 30,
              width: '100%',
              height: 48,
              alignItems: 'center',
              marginTop: 35,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                paddingVertical: 8,
                color: colors.orangeColorCard,
                fontSize: 16,
                fontFamily: fonts.RBold,
                lineHeight: 24,
                textTransform: 'uppercase',
              }}>
              {strings.signUpbuttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </TCKeyboardView>
      <View style={{bottom: 70}}>
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
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
    resizeMode: 'cover',
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
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    marginVertical: 5,
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
    backgroundColor: colors.bhirthdaybgcolor,
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
});
