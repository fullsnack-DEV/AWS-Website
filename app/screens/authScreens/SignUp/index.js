import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-community/async-storage';
import {create} from 'apisauce';

// import constants from '../../../config/constants';
// const {strings, urls, PATH, endPoints} = constants;

import {getuserDetail} from '../../../api/Authapi';
import AuthContext from '../../../auth/context';
import TCKeyboardView from '../../../components/TCKeyboardView';
import Loader from '../../../components/loader/Loader';
import styles from './style';
import * as Utility from '../../../utility/index';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import {token_details} from '../../../utils/constant';
import TCButton from '../../../components/TCButton';
import TCTextField from '../../../components/TCTextField';
import   colors from "../../../Constants/Colors";

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



function SignupScreen({navigation, route}) {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    firebase.initializeApp(config);
  },[]);

  const checkValidation = () => {
    if (fName == '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    } else if (lName == '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    } else if (email == '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false
    }else if(ValidateEmail(email) == false){
      Alert.alert('Towns Cup', 'You have entered an invalid email address!');
      return false
    }else if (password == '') {
      Alert.alert('Towns Cup', 'Password cannot be blank');
      return false
    } else if (cPassword == '') {
      Alert.alert('Towns Cup', 'Conform password cannot be blank');
      return false
    }  else if (password != cPassword) {
      Alert.alert('Towns Cup', 'Both password should be same');
      return false
    }else{
      return true
    }
  };
  const ValidateEmail = (email) =>
  {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
    {
      return (true)
    }
      
      return (false)
  }
  const authToken = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
         
            console.log('User JWT: ', idTokenResult.token);
            let tokenDetail = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };

            // await AsyncStorage.setItem(
            //   token_details,
            //   JSON.stringify(tokenDetail),
            // );

            await Utility.setStorage(token_details, JSON.stringify(tokenDetail));

            await Utility.setStorage('token', idTokenResult.token);
            await Utility.setStorage('expiryTime', idTokenResult.expirationTime);
            await Utility.setStorage('UID', user.uid);
            let userDetail={
              first_name: fName,
              last_name:lName,
              email:email
            };
            await Utility.setStorage('userInfo', userDetail);
            
            navigation.navigate('EmailVerification',{email:email,password:password});
            //getUserInfo();
         
          //console.log('TokenID', idToken);
        });
      }
    });
  };

  const signUpUser = async (fname, lname, email, password) => {
    console.log('Welcome to signupuser function..');
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('User account created & signed in!', JSON.stringify(response));


        firebase.auth().onAuthStateChanged(function (user) {
          user.sendEmailVerification();
        });
        
          //AsyncStorage.setItem('userInfo', JSON.stringify(user));
          //console.log('DATA STORED... ');
          authToken();
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
          
        }
        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }
      });
  };
  
 const getUserInfo = async () => {
    console.log('get user detail called... ');
    var uid = await Utility.getStorage('UID');
    getuserDetail(uid).then((response) => {
      console.log('PAYLOAD::', JSON.stringify(response));
      if (response.status == true) {
        navigation.navigate('LoginScreen');
      } else {
        console.log(response);
        navigation.navigate('EmailVerification');
      }
    });
  };
  const hideShowPassword = () =>{
    setHidePassword(!hidePassword);
  }
  return (
    <View style={styles.mainContainer}>
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
            <TCTextField placeholder={strings.fnameText}  onChangeText={(text) => setFName(text)} value={fName}/>
            <TCTextField placeholder={strings.lnameText} onChangeText={(text) => setLName(text)} value={lName} />
            <TCTextField
              placeholder={strings.emailPlaceHolder}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)} value={email}
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
              <TouchableWithoutFeedback onPress={()=>hideShowPassword()}>
              {hidePassword ? <Image source={PATH.showPassword} style={styles.passwordEyes} /> : <Image source={PATH.hidePassword} style={styles.passwordEyes} />}
              </TouchableWithoutFeedback> 
            </View>
            
            <TCTextField
              placeholder={strings.confirmPasswordText}
              autoCapitalize="none"
              secureText={true}
              onChangeText={(text) => setCPassword(text)} value={cPassword}
            />
          </TCKeyboardView>

          <TCButton
            title={strings.signUpCapitalText}
            extraStyle={{marginTop: hp('10%'), marginBottom: hp('4%')}}
            onPress={()=>{
              
              if(checkValidation()){
                signUpUser(fName,lName,email,password);
              }
            }}
            //() => navigation.navigate('ChooseLocationScreen')
          />
       
      </ScrollView>
    </View>
  );
}

export default SignupScreen;
