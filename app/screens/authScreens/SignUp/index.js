import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { getuserDetail } from '../../../api/Authapi';
import TCKeyboardView from '../../../components/TCKeyboardView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import styles from './style';
import * as Utility from '../../../utility/index';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import { token_details } from '../../../utils/constant';
import colors from '../../../Constants/Colors';
import TCButton from '../../../components/TCButton';
import TCTextField from '../../../components/TCTextField';

const config = {
  apiKey: 'AIzaSyDgnt9jN8EbVwRPMClVf3Ac1tYQKtaLdrU',
  authDomain: 'townscup-fee6e.firebaseapp.com',
  databaseURL: 'https://townscup-fee6e.firebaseio.com',
  projectId: 'townscup-fee6e',
  storageBucket: 'townscup-fee6e.appspot.com',
  messagingSenderId: '1003329053001',
  appId: '1:1003329053001:web:f079b7ed53716fa8463a98',
  measurementId: 'G-N44NC0Z1Q7',
};

const SignupScreen = ({ navigation }) => {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  // For activity indigator
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
  }, []);

  const validate = () => {
    if (fName === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false;
    } if (lName === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false;
    } if (email === '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false;
    } if (validateEmail(email) === false) {
      Alert.alert('Towns Cup', 'You have entered an invalid email address!');
      return false;
    } if (password === '') {
      Alert.alert('Towns Cup', 'Password cannot be blank');
      return false;
    } if (cPassword === '') {
      Alert.alert('Towns Cup', 'Conform password cannot be blank');
      return false;
    } if (password !== cPassword) {
      Alert.alert('Towns Cup', 'Both password should be same');
      return false;
    }
    return true;
  };
  const validateEmail = (emailText) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        emailText,
      )
    ) {
      return true;
    }

    return false;
  };
  const setAuthToken = async () => auth().onAuthStateChanged((user) => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        const tokenDetail = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        const userDetail = {
          first_name: fName,
          last_name: lName,
          email,
        };
        Utility.setStorage(token_details, JSON.stringify(tokenDetail));
        Utility.setStorage('token', idTokenResult.token);
        Utility.setStorage('expiryTime', idTokenResult.expirationTime);
        Utility.setStorage('UID', user.uid);
        Utility.setStorage('userInfo', userDetail);
        return user;
      });
    }
  });

  const signupUser = (fname, lname, emailAddress, passwordInput) => {
    auth()
      .createUserWithEmailAndPassword(emailAddress, passwordInput)
      .then(async () => {
        firebase.auth().onAuthStateChanged((user) => {
          user.sendEmailVerification();
        });
        return setAuthToken().then((user) => {
          getuserDetail(user.uid)
            .then(() => {
              Alert.alert('This user is already registered!');
              navigation.navigate('LoginScreen');
            })
            .catch(() => {
              navigation.navigate('EmailVerification', {
                emailAddress,
                password,
              });
            });
        });
      })
      .catch((error) => Alert.alert(error.messages || error.code || JSON.stringify(error)));
  };

  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };
  return (
      <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          {/* <Loader visible={true} /> */}
          <Image style={styles.background} source={PATH.orangeLayer} />
          <Image style={styles.background} source={PATH.bgImage} />
          <ScrollView>
              <TouchableOpacity
          onPress={() => alert('image picked')}
          style={styles.profile}>
                  <Image style={styles.profile} source={PATH.profilePlaceHolder} />
              </TouchableOpacity>
              <TCKeyboardView>
                  <TCTextField
            placeholder={strings.fnameText}
            onChangeText={(text) => setFName(text)}
            value={fName}
          />
                  <TCTextField
            placeholder={strings.lnameText}
            onChangeText={(text) => setLName(text)}
            value={lName}
          />
                  <TCTextField
            placeholder={strings.emailPlaceHolder}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
                  <View style={styles.passwordView}>
                      <TextInput
              style={styles.textInput}
              placeholder={strings.passwordText}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholderTextColor={colors.themeColor}
              secureTextEntry={hidePassword}
              keyboardType={'default'}
            />
                      <TouchableWithoutFeedback onPress={() => hideShowPassword()}>
                          {hidePassword ? (
                              <Image source={PATH.showPassword} style={styles.passwordEyes} />
                          ) : (
                              <Image source={PATH.hidePassword} style={styles.passwordEyes} />
                          )}
                      </TouchableWithoutFeedback>
                  </View>

                  <TCTextField
            placeholder={strings.confirmPasswordText}
            autoCapitalize="none"
            secureText={true}
            onChangeText={(text) => setCPassword(text)}
            value={cPassword}
          />
              </TCKeyboardView>

              <TCButton
          title={strings.signUpCapitalText}
          extraStyle={{ marginTop: hp('10%'), marginBottom: hp('4%') }}
          onPress={() => {
            setloading(true);
            if (validate()) {
              signupUser(fName, lName, email, password);
            }
            setloading(false);
          }}
          // () => navigation.navigate('ChooseLocationScreen')
        />
          </ScrollView>
      </View>
  );
};

export default SignupScreen;
