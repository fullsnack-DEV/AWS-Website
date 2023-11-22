import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import firebase from '@react-native-firebase/app';
import FastImage from 'react-native-fast-image';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {setStorage} from '../../utils';
import AuthScreenHeader from './AuthScreenHeader';

const windowHeight = Dimensions.get('window').height;

export default function EmailVerificationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const dummyAuthContext = {...authContext};
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [addedEmail, setAddedemail] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!addedEmail) {
        setEmail(route?.params?.signupInfo?.emailAddress);
        setAddedemail(true);
      }
    }, [route]),
  );

  useEffect(() => {
    const timerController =
      timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(timerController);
  }, [timer]);

  const onAuthStateChanged = useCallback(
    (user) => {
      if (user) {
        setLoading(true);
        user.getIdTokenResult().then((idTokenResult) => {
          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          dummyAuthContext.tokenData = token;
          setStorage('groupEventValue', true);
          setLoading(false);
          navigation.navigate('AddNameScreen', {
            signupInfo: {
              ...route.params?.signupInfo,
              emailAddress: email,
              password: route.params?.signupInfo?.password,
            },
          });
        });
      }
    },
    [dummyAuthContext],
  );

  const verifyUserEmail = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, route?.params?.signupInfo?.password)
      .then((res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          const loginOnAuthStateChanged = firebase
            .auth()
            .onAuthStateChanged(onAuthStateChanged);
          loginOnAuthStateChanged();
        } else {
          Alert.alert(
            strings.emailNotVerifiedText,
            '',
            [
              {
                text: strings.okTitleText,
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
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
    const user = firebase.auth().currentUser;
    user
      .sendEmailVerification()
      .then(() => {
        setLoading(false);
        setTimer(60);
        Alert.alert(
          strings.varificationLinkSend,
          '',
          [
            {
              text: strings.okTitleText,
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
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
    email ?? '',
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.kHexColorFF8A01}}>
      <ActivityLoader visible={loading} />
      <FastImage style={styles.background} source={images.loginBg} />
      <AuthScreenHeader
        title={strings.verifyEmailText}
        showNext={false}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.verificationemailText}>
          {getVerificationEmailText}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => resend()}
        disabled={timer !== 0}
        style={{alignItems: 'center'}}>
        <Text style={styles.sendTextagain}>
          {timer !== 0
            ? format(strings.sentVerificationEmailAfterSecond, timer)
            : strings.sentEmailAgainTExt}
        </Text>
      </TouchableOpacity>
      <FastImage
        style={styles.planeImgStyle}
        resizeMode={'contain'}
        source={images.verficationPlane}
      />

      <TouchableOpacity
        testID="verify-email-button"
        onPress={() => verifyUserEmail()}
        style={[
          styles.ihaveVerfiedButton,
          {marginTop: Dimensions.get('screen').height * 0.22},
        ]}>
        <View style={styles.ihaveverfied}>
          <Text style={styles.ihaveverfiedText}>
            {' '}
            {strings.iHaveVerifiedEmail}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  background: {
    height: windowHeight,
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },

  ihaveverfied: {
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    opacity: 1,
  },
  ihaveverfiedText: {
    fontSize: 15,
    fontFamily: fonts.RBold,
    color: colors.darkYellowColor,
  },
  ihaveVerfiedButton: {
    borderRadius: 50,
    marginTop: 120,
    height: 45,
    marginLeft: 25,
    marginRight: 25,
    opacity: 1,
  },

  headerContainer: {
    marginTop: 25,
    alignSelf: 'center',
    marginLeft: 25,
    marginRight: 25,
  },

  verificationemailText: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts.RMedium,
  },
  sendTextagain: {
    textAlign: 'center',
    color: colors.lightGreen,
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: fonts.RBold,
    marginTop: 30,
    marginHorizontal: 10,
  },
  planeImgStyle: {
    height: 65.33,
    width: 101,
    alignSelf: 'center',
    marginTop: 100,
  },
});
