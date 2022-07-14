import React, {useEffect, useState, useLayoutEffect} from 'react';
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
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function EmailVerificationScreen({navigation, route}) {
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
              marginLeft: wp('5.33%'),
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });
  const verifyUserEmail = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(
        route?.params?.signupInfo?.emailAddress,
        route?.params?.signupInfo?.password,
      )
      .then(async (res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          console.log('route?.params?.signupInfo', route?.params?.signupInfo);
          navigation.navigate('AddNameScreen', {
            signupInfo: {
              ...route?.params?.signupInfo,
            },
          });
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
      <View
        style={{
          marginTop: hp('11.39%'),
          alignSelf: 'center',
          width: '86.8%',
          // backgroundColor: colors.redColor,
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: fonts.RBold,
            color: colors.whiteColor,
            marginBottom: 5,
          }}>
          Please verify your email.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: fonts.RMedium,
            marginVertical: 5,
          }}>
          {getVerificationEmailText}
        </Text>
      </View>
      <FastImage
        style={{
          height: 112,
          width: 180,
          alignSelf: 'center',
          marginTop: hp('8.38%'),
          marginBottom: hp('5.72%'),
        }}
        resizeMode={'contain'}
        source={images.emailSendIconBG}
      />
      <TouchableOpacity onPress={verifyUserEmail}>
        <View
          style={{
            borderRadius: 40,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'orange',
            width: '86.8%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            // marginTop: '5.72%',
            height: 45,
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
      <TouchableOpacity
        onPress={resend}
        disabled={timer !== 0}
        style={{alignItems: 'center'}}>
        <Text
          style={{
            width: '86.6%',
            textAlign: 'center',
            color: colors.lightGreen,
            textDecorationLine: 'underline',
            fontSize: 14,
            fontFamily: fonts.RBold,
            marginTop: hp('2.46%'),
          }}>
          {timer !== 0
            ? `YOU CAN SEND VERIFICATION EMAIL AGAIN AFTER ${timer} SECONDS.`
            : 'SEND VERIFICATION EMAIL AGAIN'}
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
