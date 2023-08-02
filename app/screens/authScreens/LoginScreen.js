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
  Platform,
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
import {eventDefaultColorsData} from '../../Constants/LoaderImages';
import apiCall from '../../utils/apiCall';
import {
  getAppSettingsWithoutAuth,
  updateFBToken,
  updateUserProfile,
} from '../../api/Users';
import {getHitSlop} from '../../utils/index';
import getUserToken from '../../api/StreamChat';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('vineetpatidar@gmail.com');
  const [password, setPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(true);

  const authContext = useContext(AuthContext);
  const dummyAuthContext = {...authContext};

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = useCallback(() => {
    if (email === '') {
      setloading(false);
      Utility.showAlert(strings.emailNotBlankText);

      return false;
    }
    if (validateEmail(email) === false) {
      setloading(false);
      Utility.showAlert(strings.validEmailMessage);
      return false;
    }
    if (password === '') {
      setloading(false);
      Utility.showAlert(strings.passwordCanNotBlank);
      return false;
    }
    if (password.length < 6) {
      setloading(false);
      Utility.showAlert(strings.passwordWarningMessage);
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

      await Promise.all([
        authContext.setTokenData(dummyAuthContext?.tokenData),
        Utility.setStorage('authContextUser', {...userData}),
        authContext.setUser({...userData}),
        Utility.setStorage('authContextEntity', {...entity}),
        Utility.setStorage('loggedInEntity', entity),
        authContext.setEntity({...entity}),
      ]);

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
                global.sport_icon_baseurl =
                  response.payload.app.base_url_sporticon;

                await Utility.setStorage('appSetting', response.payload.app);
                await authContext.setEntity({...entity});
                updateFBToken(dummyAuthContext);
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

  const onAuthStateChanged = useCallback(
    (user) => {
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
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
          } else {
            const userConfig = {
              method: 'get',
              url: `${Config.BASE_URL}/users/${user.uid}`,
              headers: {Authorization: `Bearer ${token.token}`},
            };

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

                // Call Stream chat token api and save in authContex
                await getUserToken(dummyAuthContext).then(
                  async (responseChat) => {
                    updateUserProfile(
                      {streamChatToken: responseChat.payload},
                      dummyAuthContext,
                    );
                    await authContext.setStreamChatToken(responseChat.payload);
                    loginFinalRedirection(user, response.payload);
                  },
                );
              })
              .catch((e) => {
                console.log('Error', e);
                navigateToAddNameScreen(user);
              });
          }
        });
      }
    },
    [dummyAuthContext],
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
        firebase.auth().onAuthStateChanged(onAuthStateChanged);
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
        // width={wp(81.33)}
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
        />
        <TouchableOpacity
          onPress={() => hideShowPassword()}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            right: 5,
          }}>
          {hidePassword ? (
            <Text style={styles.passwordEyes}>{strings.SHOW}</Text>
          ) : (
            <Text style={styles.passwordEyes}>{strings.HIDE}</Text>
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
      <View style={{marginTop: 35}}>
        <TCButton
          testID={'login-button'}
          title={strings.LOGIN}
          extraStyle={{marginTop: 0}}
          onPress={onLogin}
        />
        <TouchableOpacity
          hitSlop={getHitSlop(15)}
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
          hitSlop={getHitSlop(15)}
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
      <FastImage style={styles.background} source={images.loginBg} />
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
    marginTop: 25,
    textAlign: 'center',
  },
  loginText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    marginLeft: 25,
    textAlign: 'left',
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

  passwordContainer: {
    alignSelf: 'center',
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
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
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
  },

  passwordInput: {
    alignSelf: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    height: 40,
    color: 'black',
    flex: 1,
  },

  textFieldStyle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    paddingHorizontal: 5,
    marginLeft: 35,
    marginRight: 35,
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
