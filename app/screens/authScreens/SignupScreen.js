import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { getUserDetails } from '../../api/Users';
import TCKeyboardView from '../../components/TCKeyboardView';
import ActivityLoader from '../../components/loader/ActivityLoader';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import AuthContext from '../../auth/context'

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

export default function SignupScreen({ navigation }) {
  const authContext = useContext(AuthContext)
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
  const saveUserDetails = async () => auth().onAuthStateChanged(async (user) => {
    if (user) {
      user.getIdTokenResult().then(async (idTokenResult) => {
        const token = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        const userDetail = {
          first_name: fName,
          last_name: lName,
          email,
        };

        const entity = {
          auth: { token, user_id: user.uid },
          uid: user.uid,
          role: 'user',
        };
        await Utility.setStorage('userInfo', userDetail);
        await Utility.setStorage('loggedInEntity', entity);

        return user;
      });
    }
  });

  const signupUser = (fname, lname, emailAddress, passwordInput) => {
    setloading(true)
    auth()
      .createUserWithEmailAndPassword(emailAddress, passwordInput)
      .then(async () => {
        firebase.auth().onAuthStateChanged((user) => {
          user.sendEmailVerification();
        });
        return saveUserDetails().then((user) => {
          getUserDetails(user.uid, authContext)
            .then(() => {
              setloading(false);
              Alert.alert('This user is already registered!');

              navigation.navigate('LoginScreen');
            })
            .catch(() => {
              setloading(false);
              navigation.navigate('EmailVerificationScreen', {
                emailAddress,
                password,
              });
            });
        });
      })
      .catch((error) => {
        setloading(false)
        Alert.alert(error.messages || error.code || JSON.stringify(error))
      });
  };

  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {/* <Loader visible={true} /> */}
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <ScrollView>
        <TouchableOpacity
          onPress={() => alert('image picked')}
          style={styles.profile}>
          <Image style={styles.profile} source={images.profilePlaceHolder} />
        </TouchableOpacity>
        <TCKeyboardView>
          <TCTextField
          style={styles.textFieldStyle}
            placeholder={strings.fnameText}
            onChangeText={(text) => setFName(text)}
            value={fName}
          />
          <TCTextField
          style={styles.textFieldStyle}
            placeholder={strings.lnameText}
            onChangeText={(text) => setLName(text)}
            value={lName}
          />
          <TCTextField
            style={styles.textFieldStyle}
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
              // placeholderTextColor={colors.themeColor}
              secureTextEntry={hidePassword}
              keyboardType={'default'}
            />
            <TouchableWithoutFeedback onPress={() => hideShowPassword()}>
              <Image source={hidePassword ? images.hidePassword : images.showPassword} style={styles.passwordEyes} />
            </TouchableWithoutFeedback>
          </View>

          <TCTextField
          style={styles.textFieldStyle}
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
            if (validate()) {
              signupUser(fName, lName, email, password);
            }
          }}
          // () => navigation.navigate('ChooseLocationScreen')
        />
      </ScrollView>
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
  passwordEyes: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  passwordView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,

    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('4%'),
    height: 40,
    marginBottom: 16,

    marginTop: 2,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: wp('84%'),
  },
  profile: {
    alignContent: 'center',
    alignSelf: 'center',
    height: hp('25%'),
    marginBottom: hp('3%'),
    marginTop: hp('3%'),
    resizeMode: 'contain',
    width: wp('25%'),
  },
  textInput: {

    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    height: 40,
    paddingLeft: 17,

    width: wp('75%'),
  },
  textFieldStyle: {
    backgroundColor: colors.whiteColor,
    fontFamily: fonts.RRegular,

    marginBottom: 10,
    marginLeft: 32,
    marginRight: 32,

    paddingLeft: 8,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});
