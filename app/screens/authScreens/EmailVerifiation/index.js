import React from 'react';
import {
  View, Text, Image, TouchableOpacity, Alert,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import styles from './style';
import images from '../../../Constants/ImagePath';

function EmailVerification({ navigation, route }) {
  const verifyUserEmail = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(route.params.emailAddress, route.params.password)
      .then((res) => {
        if (res.user.emailVerified) {
          navigation.navigate('AddBirthdayScreen');
        } else {
          Alert.alert('Email not verified yet');
        }
      })
      .catch((error) => Alert.alert(error.messages || error.code || JSON.stringify(error)));
  };

  const resend = () => {
    console.log('link send again ');
    const user = firebase.auth().currentUser;
    user
      .sendEmailVerification()
      .then(() => {
        Alert.alert('Verification Link send sucessfully');
      })
      .catch((error) => Alert.alert(error.messages || error.code || JSON.stringify(error)));
  };

  return (
    <View style={styles.mainContainer}>
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
        <TouchableOpacity onPress={() => resend()}>
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
            <Text style={{ color: 'orange', fontSize: 15, fontWeight: '700' }}>
              Resend Verification Link{' '}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default EmailVerification;
