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
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
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
              marginTop: hp('1.5%'),
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
      await setStorage('authContextUser', {...userData});
      await authContext.setUser({...userData});
      await setStorage('authContextEntity', {...entity});
      await setStorage('loggedInEntity', entity);
      await authContext.setEntity({...entity});

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
              await setStorage('appSetting', response.payload.app);
              await authContext.setEntity({...entity});
            })
            .catch((e) => {
              setTimeout(() => {
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
          dummyAuthContext.tokenData = token;

          setStorage('groupEventValue', true);
          const userConfig = {
            method: 'get',
            url: `${Config.BASE_URL}/users/${user?.uid}`,
            headers: {Authorization: `Bearer ${token?.token}`},
          };
          apiCall(userConfig)
            .then((response) => {
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
                    emailAddress: route?.params?.signupInfo?.emailAddress,
                    password: route?.params?.signupInfo?.password,
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
                  emailAddress: route?.params?.signupInfo?.emailAddress,
                  password: route?.params?.signupInfo?.password,
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
        route?.params?.signupInfo?.emailAddress,
        route?.params?.signupInfo?.password,
      )
      .then((res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          const loginOnAuthStateChanged = firebase
            .auth()
            .onAuthStateChanged(onAuthStateChanged);
          loginOnAuthStateChanged();
        } else {
          setTimeout(() => {
            Alert.alert(strings.emailNotVerifiedText);
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
          message = strings.emailVerificationLintNotSendText;
        } else {
          message = e.message;
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, message);
        }, 100);
      });

    // This commented code we will be used in production for email varification please dont remove it
    /*
    setLoading(true);
    const user = await firebase.auth().currentUser;
    console.log('User======>', user);
    userEmailVerification(route?.params?.signupInfo.emailAddress)
      .then(() => {
        setLoading(false);
        setTimer(60);
        setTimeout(() => Alert.alert(strings.varificationLinkSend), 100);
      })
      .catch((e) => {
        let message = '';
        setLoading(false);
        if (e.code === 'auth/too-many-requests') {
          message = strings.emailVerificationLintNotSendText;
        } else {
          message = e.message;
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, message);
        }, 100);
      });
      */
  };

  const getVerificationEmailText = format(
    strings.emailVerificationDescription,
    route?.params?.signupInfo?.emailAddress ?? '',
  );

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
      <View
        style={{
          marginTop: hp('11.20%'),
          alignSelf: 'center',
          width: '80%',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: fonts.RBold,
            color: colors.whiteColor,
            marginBottom: 5,
          }}>
          {strings.verifyEmailText}
        </Text>
        <Text style={{fontSize: 16, color: 'white', fontFamily: fonts.RMedium}}>
          {getVerificationEmailText}
        </Text>
      </View>
      <FastImage
        style={{
          height: 65.33,
          width: 101,
          alignSelf: 'center',
          // marginVertical: hp(8.12),
          marginTop: hp(8.12),
        }}
        resizeMode={'contain'}
        source={images.emailSendIconBG}
      />
      <TouchableOpacity testID="verify-email-button" onPress={verifyUserEmail}>
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
            marginTop: hp('5.35%'),
            height: 50,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fonts.RBold,
              color: colors.darkYellowColor,
            }}>
            {' '}
            {strings.iHaveVerifiedEmail}
          </Text>
        </View>
      </TouchableOpacity>
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
            marginTop: hp('2.4%'),
          }}>
          {timer !== 0
            ? format(strings.sentVerificationEmailAfterSecond, timer)
            : strings.sentEmailAgainTExt}
        </Text>
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
