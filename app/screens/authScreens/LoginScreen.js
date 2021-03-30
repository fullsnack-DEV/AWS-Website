import React, {
  useState, useContext, useMemo, useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
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
  const dummyAuthContext = { ...authContext };
  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = useCallback(() => {
    if (email === '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false;
    } if (password === '') {
      Alert.alert('Towns Cup', 'Password cannot be blank');
      return false;
    }
    return true;
  }, [email, password]);

  const getRedirectionScreenName = useCallback((townscupUser) => new Promise((resolve, reject) => {
    if (!townscupUser.birthday) resolve({ screen: 'AddBirthdayScreen' })
    else if (!townscupUser.gender) resolve({ screen: 'ChooseGenderScreen' })
    else if (!townscupUser.city) resolve({ screen: 'ChooseLocationScreen' })
    else if (!townscupUser.sports) resolve({ screen: 'ChooseSportsScreen', params: { city: townscupUser?.city, state: townscupUser?.state_abbr, country: townscupUser?.country } })
    else reject(new Error({ error: 'completed user profile' }))
  }), [])

  const loginFinalRedirection = useCallback(async (firebaseUser, townscupUser) => {
    const entity = { ...dummyAuthContext.entity }
    const userData = { ...townscupUser }
    entity.auth.user = { ...userData }
    entity.obj = { ...userData };
    await authContext.setTokenData(dummyAuthContext?.tokenData);
    await Utility.setStorage('authContextUser', { ...userData })
    await authContext.setUser({ ...userData });
    await Utility.setStorage('authContextEntity', { ...entity })
    await Utility.setStorage('loggedInEntity', entity)
    await authContext.setEntity({ ...entity })
    // eslint-disable-next-line no-underscore-dangle
    if (!firebaseUser?._user?.emailVerified) {
      firebaseUser.sendEmailVerification()
      setloading(false);
      navigation.navigate('EmailVerificationScreen', {
          emailAddress: email,
          password,
        });
      // eslint-disable-next-line no-underscore-dangle
    } else if (firebaseUser?._user?.emailVerified) {
      getRedirectionScreenName(userData).then((responseScreen) => {
        setloading(false);
        navigation.replace(responseScreen?.screen, { ...responseScreen?.params })
      }).catch(async () => {
        entity.isLoggedIn = true;
        await Utility.setStorage('authContextEntity', { ...entity })
        await Utility.setStorage('loggedInEntity', { ...entity })
        await authContext.setEntity({ ...entity })
        setloading(false);
      });
    }
  }, [authContext, dummyAuthContext.entity, dummyAuthContext?.tokenData, email, getRedirectionScreenName, navigation, password])

  const QBInitialLogin = useCallback((firebaseUser, townscupUser) => {
    const response = { ...townscupUser };
    let qbEntity = { ...dummyAuthContext?.entity };
    QBlogin(qbEntity.uid, response).then(async (res) => {
      qbEntity = { ...qbEntity, QB: { ...res.user, connected: true, token: res?.session?.token } }
      QBconnectAndSubscribe(qbEntity)
      dummyAuthContext.entity = { ...qbEntity }
      loginFinalRedirection(firebaseUser, townscupUser);
    }).catch((error) => {
      console.log('QB Login Error : ', error.message);
      qbEntity = { ...qbEntity, QB: { connected: false } }
      dummyAuthContext.entity = { ...qbEntity }
      loginFinalRedirection(firebaseUser);
    });
  }, [dummyAuthContext, loginFinalRedirection])

  const onAuthStateChanged = useCallback((user) => {
    if (user) {
      user.getIdTokenResult().then(async (idTokenResult) => {
        const token = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        dummyAuthContext.tokenData = token;
        Utility.setStorage('eventColor', eventDefaultColorsData);
        Utility.setStorage('groupEventValue', true)
        const userConfig = {
          method: 'get',
          url: `${Config.BASE_URL}/users/${user?.uid}`,
          headers: { Authorization: `Bearer ${token?.token}` },
        }
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
          QBInitialLogin(user, response.payload);
        }).catch(async (error) => {
          // eslint-disable-next-line no-underscore-dangle
          setloading(false);
          setTimeout(() => Alert.alert(
              'TownsCup',
              error.message,
          ), 100)
        });
      });
    }
  }, [QBInitialLogin, dummyAuthContext]);

  const login = useCallback(async () => {
    setloading(true);
    await Utility.clearStorage();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
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
        if (error.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '') setTimeout(() => Alert.alert('Towns Cup', message), 100)
      });
  }, [email, onAuthStateChanged, password]);

  // Psaaword Hide/Show function for setState
  const hideShowPassword = useCallback(() => {
    setHidePassword((val) => !val);
  }, []);

  const renderEmailInput = useMemo(() => (
    <View style={styles.textFieldContainerStyle}>
      <TCTextField
            style={styles.textFieldStyle}
            placeholder={strings.emailPlaceHolder}
            placeholderTextColor={colors.darkYellowColor}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            value={email}
        />
    </View>
  ), [email]);

  const renderPasswordInput = useMemo(() => (
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
      <TouchableOpacity onPress={() => hideShowPassword()} style={{ alignItems: 'center', justifyContent: 'center' }}>
        {hidePassword ? (
          <Text style={styles.passwordEyes}>SHOW</Text>
          ) : (
            <Text style={styles.passwordEyes}>HIDE</Text>
          )}
      </TouchableOpacity>
    </View>
  ), [hidePassword, hideShowPassword, password]);

  const onLogin = useCallback(async () => {
    if (validate()) {
      if (authContext.networkConnected) login();
      else authContext.showNetworkAlert();
    }
  }, [authContext, email, login, password, validate])

  const renderLoginAndForgotPasswordButtons = useMemo(() => (
    <View style={{ marginTop: 35 }}>
      <TCButton
            title={'LOG IN'}
            extraStyle={{ marginTop: hp('3%') }}
            onPress={onLogin}
        />
      <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPasswordText}>{strings.forgotPassword}</Text>
      </TouchableOpacity>
    </View>
  ), [navigation, onLogin]);

  return (
    <LinearGradient
          colors={[colors.themeColor1, colors.themeColor3]}
          style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />
      <TCKeyboardView>
        <Text style={styles.loginText}>{strings.loginText}</Text>
        <View style={{ marginTop: 55 }}>
          {renderEmailInput}
          {renderPasswordInput}
        </View>
        {renderLoginAndForgotPasswordButtons}
      </TCKeyboardView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  forgotPasswordText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginTop: hp('3%'),
    textAlign: 'center',
  },
  loginText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginBottom: hp('3%'),
    marginTop: hp('11%'),
    paddingLeft: 30,
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
  passwordView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    height: 40,
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    marginTop: 4,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: wp('85%'),
  },
  textInput: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: wp('75%'),
  },
  textFieldContainerStyle: {
    height: 40,
    marginBottom: 10,
  },
  textFieldStyle: {
    alignSelf: 'center',
    width: wp('85%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
