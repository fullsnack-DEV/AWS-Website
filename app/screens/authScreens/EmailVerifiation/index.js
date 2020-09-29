import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import * as Utility from '../../../utility/index';
import constants from '../../../config/constants';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const {strings, urls, PATH, endPoints} = constants;

export default class EmailVerification extends Component {
  verifyUserEmail = async () => {
    let userEmail = await Utility.getFromLocalStorge('email');
    console.log('useremail', userEmail);
    let userPassword = await Utility.getFromLocalStorge('password');
    console.log('useremail', userPassword);
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(userEmail, userPassword)
        .then((res) => {
          console.log(res);
          console.log(res.user.email);
          console.log(res.user.emailVerified);
          if (res.user.emailVerified) {
            this.props.navigation.navigate('ChooseLocationScreen');
          }
        });
    } catch (error) {
      console.log(error.toString(error));
    }

    console.log('vikkkkkkakakkakkakkaka');
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Image style={styles.background} source={PATH.orangeLayer} />
        <Image style={styles.background} source={PATH.bgImage} />
        <TouchableOpacity onPress={() => this.verifyUserEmail()}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 40,
              backgroundColor: 'white',
              width: '60%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: '60%',
              height: 40,
            }}>
            <Text>E-mail Verified</Text>
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 40,
                backgroundColor: 'white',
                width: '60%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: '10%',
                height: 40,
              }}>
              <Text>Resend Link </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
