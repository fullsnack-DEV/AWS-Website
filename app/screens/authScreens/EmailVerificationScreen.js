import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity, Alert,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import ActivityLoader from '../../components/loader/ActivityLoader';

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
            Alert.alert('Email not verified yet');
          }, 100)
        }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
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

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading}/>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <View style={{ marginTop: '80%', alignSelf: 'center', width: '80%' }}>
        <Text style={{ fontSize: 17, color: 'white' }}>
          We have sent you have a verification link to
        </Text>
        <Text style={{ fontSize: 17, color: 'white' }}>
          Your email please verify and proceed
        </Text>
      </View>
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
          <Text style={{ fontSize: 15, color: 'blue' }}>
            {' '}
            I Verified My Email
          </Text>
        </View>
      </TouchableOpacity>
      <View>
        <TouchableOpacity onPress={() => resend()} disabled={timer !== 0} style={{ opacity: timer > 0 ? 0.6 : 1 }}>
          <View
            style={{
              borderRadius: 40,
              backgroundColor: 'white',
              width: '80%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: '4%',
              height: 50,
            }}>
            <Text style={{
              width: '100%',
              textAlign: 'center',
              color: 'orange',
              fontSize: 15,
              fontWeight: '700',
            }}>
              {timer !== 0 ? `Resend Link After ${timer}s` : 'Resend Verification Link'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

});
