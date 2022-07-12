import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import apiCall from '../../utils/apiCall';
import {QBconnectAndSubscribe, QBlogin} from '../../utils/QuickBlox';
import {setStorage} from '../../utils';
import {getAppSettingsWithoutAuth} from '../../api/Users';

export default function EmailVerificationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const dummyAuthContext = {...authContext};

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const timerController =
      timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(timerController);
  }, [timer]);
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
    });
  });

  const getRedirectionScreenName = useCallback(
    (townscupUser) =>
      new Promise((resolve, reject) => {
        console.log('screen name object:=>', townscupUser);
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
        else reject(new Error({error: 'completed user profile'}));
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
      await setStorage('authContextUser', {...userData});
      await authContext.setUser({...userData});
      await setStorage('authContextEntity', {...entity});
      await setStorage('loggedInEntity', entity);
      await authContext.setEntity({...entity});

      console.log('User Data:', userData);
      getRedirectionScreenName(userData)
        .then((responseScreen) => {
          setLoading(false);
          navigation.replace(responseScreen?.screen, {
            ...responseScreen?.params,
          });
        })
        .catch(async () => {
          entity.isLoggedIn = true;
          await setStorage('authContextEntity', {...entity});
          await setStorage('loggedInEntity', {...entity});
          getAppSettingsWithoutAuth()
            .then(async (response) => {
              console.log('Settings without auth:=>', response);
              await setStorage('appSetting', response.payload.app);
              await authContext.setEntity({...entity});
            })
            .catch((e) => {
              setTimeout(() => {
                console.log('catch -> location screen setting api');
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 10);
            });
        });
    },
    [
      authContext,
      dummyAuthContext.entity,
      dummyAuthContext?.tokenData,

      getRedirectionScreenName,
      navigation,
    ],
  );

  const QBInitialLogin = useCallback(
    (firebaseUser, townscupUser) => {
      const response = {...townscupUser};
      let qbEntity = {...dummyAuthContext?.entity};

      console.log('response : ', response);
      console.log('qbEntity : ', qbEntity);

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
      setLoading(true);
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          console.log('token:=>', token);
          dummyAuthContext.tokenData = token;

          setStorage('groupEventValue', true);
          const userConfig = {
            method: 'get',
            url: `${Config.BASE_URL}/users/${user?.uid}`,
            headers: {Authorization: `Bearer ${token?.token}`},
          };
          console.log('Login Request:=>', userConfig);
          apiCall(userConfig)
            .then((response) => {
              console.log('ressssss==>', response);
              if (response.status) {
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
              } else {
                navigation.navigate('AddNameScreen', {
                  signupInfo: {
                    ...route?.params?.signupInfo,
                    emailAddress:
                      route?.params?.signupInfo?.emailAddress ??
                      route?.params?.emailAddress,
                    password:
                      route?.params?.signupInfo?.password ??
                      route?.params?.password,
                  },
                });
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
              navigation.navigate('AddNameScreen', {
                signupInfo: {
                  ...route?.params?.signupInfo,
                  emailAddress:
                    route?.params?.signupInfo?.emailAddress ??
                    route?.params?.emailAddress,
                  password:
                    route?.params?.signupInfo?.password ??
                    route?.params?.password,
                },
              });
            });
        });
      }
    },
    [QBInitialLogin, dummyAuthContext],
  );

  const verifyUserEmail = () => {
    console.log(route?.params?.signupInfo);
    console.log(route?.params?.signupInfo?.password);
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(
        route?.params?.signupInfo?.emailAddress ?? route?.params?.emailAddress,
        route?.params?.signupInfo?.password ?? route?.params?.password,
      )
      .then((res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          console.log('firebase user data', res);

          const loginOnAuthStateChanged = firebase
            .auth()
            .onAuthStateChanged(onAuthStateChanged);
          loginOnAuthStateChanged();
        } else {
          setTimeout(() => {
            Alert.alert('Your email hasn’t been verified yet.');
          }, 100);
        }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const resend = async () => {
    setLoading(true);
    const user = await firebase.auth().currentUser;
    user
      .sendEmailVerification()
      .then(() => {
        setLoading(false);
        setTimer(60);
        setTimeout(() => Alert.alert(strings.varificationLinkSend), 100);
      })
      .catch((e) => {
        let message = '';
        setLoading(false);
        if (e.code === 'auth/too-many-requests') {
          message =
            'Email Verification Link is already Sent, Try after some moment';
        } else {
          message = e.message;
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, message);
        }, 100);
      });
  };

  const getVerificationEmailText = `We have sent an email to ${
    route?.params?.signupInfo?.emailAddress ?? ''
  }. You need to verify your email to continue. If you have not received the verification email, please check your spam folder or click the resend button below.`;

  // const auth = await firebase?.auth()?.currentUser;
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
      <View style={{marginTop: '30%', alignSelf: 'center', width: '80%'}}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: fonts.RBold,
            color: colors.whiteColor,
            marginBottom: 25,
          }}>
          Please verify your email.
        </Text>
        <Text style={{fontSize: 16, color: 'white', fontFamily: fonts.RMedium}}>
          {getVerificationEmailText}
        </Text>
      </View>
      <FastImage
        style={{
          height: 112,
          width: 180,
          alignSelf: 'center',
          marginVertical: 15,
        }}
        resizeMode={'contain'}
        source={images.emailSendIconBG}
      />

      <TouchableOpacity
        onPress={resend}
        disabled={timer !== 0}
        style={{alignItems: 'center'}}>
        <Text
          style={{
            width: '85%',
            textAlign: 'center',
            color: colors.lightGreen,
            textDecorationLine: 'underline',
            fontSize: 13,
            fontWeight: '700',
          }}>
          {timer !== 0
            ? `YOU CAN SEND VERIFICATION EMAIL AGAIN AFTER ${timer} SECONDS.`
            : 'SEND VERIFICATION EMAIL AGAIN'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verifyUserEmail}>
        <View
          style={{
            borderRadius: 40,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'orange',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: '10%',
            height: 50,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fonts.RBold,
              color: colors.darkYellowColor,
            }}>
            {' '}
            I’VE VERIFIED MY EMAIL ADDRESS
          </Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
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
});
