import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import firebase from '@react-native-firebase/app';

import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import {QBconnectAndSubscribe, QBlogin} from '../../utils/QuickBlox';
import {eventDefaultColorsData} from '../../Constants/LoaderImages';
import apiCall from '../../utils/apiCall';
import {getAppSettingsWithoutAuth} from '../../api/Users';
import {getHitSlop} from '../../utils/index';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('makani20@gmail.com');
  const [password, setPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);
  const dummyAuthContext = {...authContext};

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = useCallback(() => {
    if (email === '') {
      setloading(false);
      Alert.alert(strings.emailNotBlankText);
      return false;
    }
    if (validateEmail(email) === false) {
      setloading(false);
      Alert.alert(strings.validEmailMessage);
      return false;
    }
    if (password === '') {
      setloading(false);
      Alert.alert(strings.appName, strings.passwordCanNotBlank);
      return false;
    }
    return true;
  }, [email, password]);

  const validateEmail = (emailText) => {
    if (/^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailText)) {
      return true;
    }
    return false;
  };

  const getRedirectionScreenName = useCallback(
    (townscupUser) =>
      new Promise((resolve, reject) => {
        if (!townscupUser.birthday) resolve({screen: 'AddBirthdayScreen'});
        else if (!townscupUser.gender) resolve({screen: 'ChooseGenderScreen'});
        else if (!townscupUser.city) resolve({screen: 'ChooseLocationScreen'});
        else if (!townscupUser.sports)
          resolve({
            screen: 'ChooseSportsScreen',
            params: {
              city: townscupUser?.city,
              state: townscupUser?.state_abbr,
              country: townscupUser?.country,
            },
          });
        else reject(new Error({error: strings.completeProfile}));
      }),
    [],
  );

  const loginFinalRedirection = useCallback(
    async (firebaseUser, townscupUser) => {
      const entity = {...dummyAuthContext.entity};
      const userData = {...townscupUser};

      entity.auth.user = {...userData};
      entity.obj = {...userData};
      await authContext.setTokenData(dummyAuthContext?.tokenData);
      await Utility.setStorage('authContextUser', {...userData});
      await authContext.setUser({...userData});
      await Utility.setStorage('authContextEntity', {...entity});
      await Utility.setStorage('loggedInEntity', entity);
      await authContext.setEntity({...entity});

      // eslint-disable-next-line no-underscore-dangle
      if (!firebaseUser?._user?.emailVerified) {
        firebaseUser.sendEmailVerification();
        setloading(false);
        navigation.navigate('EmailVerificationScreen', {
          emailAddress: email,
          password,
        });
        // eslint-disable-next-line no-underscore-dangle
      } else if (firebaseUser?._user?.emailVerified) {
        getRedirectionScreenName(userData)
          .then((responseScreen) => {
            navigation.replace(responseScreen?.screen, {
              ...responseScreen?.params,
            });
          })
          .catch(async () => {
            entity.isLoggedIn = true;
            await Utility.setStorage('authContextEntity', {...entity});
            await Utility.setStorage('loggedInEntity', {...entity});
            getAppSettingsWithoutAuth()
              .then(async (response) => {
                console.log('without token api res', response.payload);
                global.sport_icon_baseurl =
                  response.payload.app.base_url_sporticon;

                await Utility.setStorage('appSetting', response.payload.app);
                await authContext.setEntity({...entity});
              })
              .catch((e) => {
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          });
      }
    },
    [
      authContext,
      dummyAuthContext.entity,
      dummyAuthContext?.tokenData,
      email,
      getRedirectionScreenName,
      navigation,
      password,
    ],
  );

  const QBInitialLogin = useCallback(
    (firebaseUser, townscupUser) => {
      const response = {...townscupUser};
      let qbEntity = {...dummyAuthContext?.entity};

      QBlogin(qbEntity.uid, response)
        .then(async (res) => {
          qbEntity = {
            ...qbEntity,
            QB: {...res.user, connected: true, token: res?.session?.token},
          };
          QBconnectAndSubscribe(qbEntity);
          dummyAuthContext.entity = {...qbEntity};
          loginFinalRedirection(firebaseUser, response);
        })
        .catch((error) => {
          console.log('QB Login Error : ', error.message);
          qbEntity = {...qbEntity, QB: {connected: false}};
          dummyAuthContext.entity = {...qbEntity};
          loginFinalRedirection(firebaseUser, response);
        });
    },
    [dummyAuthContext, loginFinalRedirection],
  );

  const onAuthStateChanged = useCallback(
    (user) => {
      if (user) {
        console.log('user', user)
        user.getIdTokenResult().then((idTokenResult) => {
          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          dummyAuthContext.tokenData = token;
          Utility.setStorage('eventColor', eventDefaultColorsData);
          Utility.setStorage('groupEventValue', true);
          // eslint-disable-next-line no-underscore-dangle
          if (!user._user.emailVerified) {
            navigateToEmailVarificationScreen(user);
          } 
          else{
            const userConfig = {
              method: 'get',
              url: `${Config.BASE_URL}/users/${user.uid}`,
              headers: {Authorization: `Bearer ${token.token}`},
            };
            console.log('Login Request:=>', userConfig);
            apiCall(userConfig)
              .then((response) => {
                dummyAuthContext.entity = {
                  uid: user.uid,
                  role: 'user',
                  obj: response.payload,
                  auth: {
                    user_id: user.uid,
                    user: response.payload,
                  },
                };
                QBInitialLogin(user, response.payload);
              })
              .catch(() => {
                navigateToAddNameScreen(user);
              });
          }
        });
      }
    },
    [QBInitialLogin, dummyAuthContext],
  );

  const navigateToEmailVarificationScreen = async (user) => {
    const entity = {
      auth: {user_id: user.uid},
      uid: user.uid,
      role: 'user',
    };
    const token = {...dummyAuthContext?.tokenData};
    await authContext.setTokenData(token);
    await authContext.setEntity(entity);
    user.sendEmailVerification();
    setloading(false);
    navigation.navigate('EmailVerificationScreen', {
      signupInfo: {
        emailAddress: email,
        password,
      },
    });

    // This commented code we will be used in production for email varification please dont remove it
    /*
    const entity = {
      auth: {user_id: user.uid},
      uid: user.uid,
      role: 'user',
    };
    const token = {...dummyAuthContext?.tokenData};
    await authContext.setTokenData(token);
    await authContext.setEntity(entity);
    console.log('111111111');
    userEmailVerification(email)
      .then(() => {
        setloading(false);
        navigation.navigate('EmailVerificationScreen', {
          signupInfo: {
            emailAddress: email,
            password,
          },
        });
        console.log('varification email send succefully to user');
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.varificationLinkSendFailed);
        console.log('', e);
      });
      */
  };

  const navigateToAddNameScreen = async (user) => {
    const entity = {
      auth: {user_id: user.uid},
      uid: user.uid,
      role: 'user',
    };
    const token = {...dummyAuthContext?.tokenData};
    await authContext.setTokenData(token);
    await authContext.setEntity(entity);
    setloading(false);
    navigation.navigate('AddNameScreen', {
      signupInfo: {
        emailAddress: email,
        password,
      },
    });
  };

  const login = useCallback(async () => {
    await Utility.clearStorage();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('signInWithEmailAndPassword')
        const loginOnAuthStateChanged = firebase
          .auth()
          .onAuthStateChanged(onAuthStateChanged);
        loginOnAuthStateChanged();
      })
      .catch((error) => {
        setloading(false);
        let message = error.message;
        if (error.code === 'auth/user-not-found') {
          message = strings.userNotFound;
        }
        if (error.code === 'auth/invalid-email') {
          message = strings.validEmailMessage;
        }
        if (error.code === 'auth/user-disabled') {
          message = strings.terminationAlert;
        }
        if (error.code === 'auth/wrong-password') {
          message = strings.userNotFound;
        }
        if (error.code === 'auth/too-many-requests') {
          message = strings.manyRequestForLogin;
        }
        if (error.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '')
          setTimeout(() => Alert.alert(strings.appName, message), 100);
      });
  }, [email, onAuthStateChanged, password]);

  // Psaaword Hide/Show function for setState
  const hideShowPassword = useCallback(() => {
    setHidePassword((val) => !val);
  }, []);

  const renderEmailInput = useMemo(
    () => (
      <TCTextField
        testID={'email-input'}
        style={styles.textFieldStyle}
        placeholder={strings.emailPlaceHolder}
        placeholderTextColor={colors.darkYellowColor}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
        height={40}
        width={wp(86.6)}
      />
    ),
    [email],
  );

  const renderPasswordInput = useMemo(
    () => (
      <View style={styles.passwordContainer}>
        <TextInput
          testID={'password-input'}
          style={styles.passwordInput}
          placeholder={strings.passwordPlaceHolder}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholderTextColor={colors.themeColor}
          secureTextEntry={hidePassword}
          keyboardType={'default'}
          height={40}
          width={wp(72)}
        />
        <TouchableOpacity
          onPress={() => hideShowPassword()}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          {hidePassword ? (
            <Text style={styles.passwordEyes}>SHOW</Text>
          ) : (
            <Text style={styles.passwordEyes}>HIDE</Text>
          )}
        </TouchableOpacity>
      </View>
    ),
    [hidePassword, hideShowPassword, password],
  );

  const onLogin = useCallback(async () => {
    setloading(true);
    if (validate()) {
      if (authContext.networkConnected) {
        login();
      } else {
        authContext.showNetworkAlert();
      }
    }
  }, [authContext, login, validate]);

  const renderLoginAndForgotPasswordButtons = useMemo(
    () => (
      <View style={{marginTop: hp('4.31%')}}>
        <TCButton
          testID={'login-button'}
          title={strings.LOGIN}
          extraStyle={{marginTop: hp('0%')}}
          onPress={onLogin}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPasswordText}>
            {strings.forgotPassword}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation, onLogin],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('LoginScreen');
            // navigation.dispatch(StackActions.popToTop());
            navigation.pop();
            // navigation.dispatch(StackActions.replace('WelcomeScreen'));
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <TouchableWithoutFeedback
        style={styles.container}
        disabled
        onPress={() => Keyboard.dismiss()}>
        <KeyboardAwareScrollView
          ref={React.createRef()}
          nestedScrollEnabled={true}
          bounces={false}
          enableOnAndroid={false}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex: 1}}
          extraScrollHeight={hp(5)}>
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}} bounces={false}>
              <Text style={styles.loginText}>{strings.loginText}</Text>
              <View style={{marginTop: 30}}>
                {renderEmailInput}
                {renderPasswordInput}
              </View>
              {renderLoginAndForgotPasswordButtons}
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
      <SafeAreaView>
        <View style={{bottom: 16}}>
          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            onPress={() => navigation.navigate('SignupScreen')}
            style={styles.alreadyView}>
            <Text style={styles.alreadyMemberText}>
              {strings.notAMemberYetSignup}
              <Text> </Text>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.RBold,
                }}>
                {strings.signUp}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  forgotPasswordText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginTop: hp('3.07%'),
    textAlign: 'center',
  },
  loginText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: hp('11.39%'),
    marginLeft: wp('6.6%'),
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    paddingVertical: 25,
  },
  passwordEyes: {
    fontSize: 10,
    color: colors.darkYellowColor,
    textDecorationLine: 'underline',
  },

  passwordContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: wp('86.6%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    height: 40,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    justifyContent: 'space-between',
    marginTop: 15,
  },

  passwordInput: {
    alignSelf: 'center',
    paddingHorizontal: 0,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: wp('65%'),
    height: 40,
    color: 'black',
  },

  textFieldStyle: {
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
    // marginTop: hp('38%'),
  },
  alreadyView: {
    alignSelf: 'center',
  },
});

export default LoginScreen;
