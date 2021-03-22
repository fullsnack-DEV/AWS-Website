import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Alert,
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

export default function EmailVerificationScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const timerController = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(timerController);
  }, [timer]);

  const verifyUserEmail = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(route.params.emailAddress, route.params.password)
      .then((res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          navigation.navigate('AddBirthdayScreen');
        } else {
          setTimeout(() => {
            Alert.alert('Your email hasn’t been verified yet.');
          }, 100)
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
        setTimeout(() => Alert.alert('Verification Link send sucessfully'), 100)
      })
      .catch((e) => {
        let message = '';
        setLoading(false);
        if (e.code === 'auth/too-many-requests') {
          message = 'Email Verification Link is already Sent, Try after some moment';
        } else {
          message = e.message;
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, message);
        }, 100);
      });
  };

  const getVerificationEmailText = `We have sent an email to ${route?.params?.emailAddress ?? ''}. You need to verify your email to continue. If you have not received the verification email, please check your spam folder or click the resend button below.`

      // const auth = await firebase?.auth()?.currentUser;
  return (
    <LinearGradient
          colors={[colors.themeColor1, colors.themeColor3]}
          style={styles.mainContainer}>
      <ActivityLoader visible={loading}/>
      <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />
      <View style={{ marginTop: '30%', alignSelf: 'center', width: '80%' }}>
        <Text style={{
            fontSize: 25,
            fontFamily: fonts.RBold,
            color: colors.whiteColor,
            marginBottom: 25,
        }}>
          Please verify your email.
        </Text>
        <Text style={{ fontSize: 16, color: 'white', fontFamily: fonts.RMedium }}>
          {getVerificationEmailText}
        </Text>

      </View>
      <FastImage
          style={{
 height: 112, width: 180, alignSelf: 'center', marginVertical: 15,
          }}
          resizeMode={'contain'}
          source={images.emailSendIconBG}
        />

      <TouchableOpacity onPress={() => resend()} disabled={timer !== 0} style={{ alignItems: 'center' }}>
        <Text style={{
                        width: '85%',
                        textAlign: 'center',
                        color: colors.lightGreen,
                        textDecorationLine: 'underline',
                        fontSize: 13,
                        fontWeight: '700',
        }}>
          {timer !== 0 ? `YOU CAN SEND VERIFICATION EMAIL AGAIN AFTER ${timer}s` : 'SEND VERIFICATION EMAIL AGAIN'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => verifyUserEmail()}>
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
          <Text style={{ fontSize: 15, fontFamily: fonts.RBold, color: colors.darkYellowColor }}>
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
