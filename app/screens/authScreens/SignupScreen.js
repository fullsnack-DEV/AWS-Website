import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import { uploadImageOnPreSignedUrls } from '../../utils/imageAction';
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
import apiCall from '../../utils/apiCall';

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
  const [profilePic, setProfilePic] = useState(null);
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

  const saveUserDetails = async (user) => {
    if (user) {
      user.getIdTokenResult().then(async (idTokenResult) => {
        const token = {
          token: idTokenResult.token,
          expirationTime: idTokenResult.expirationTime,
        };
        const userConfig = {
          method: 'get',
          url: `${Config.BASE_URL}/users/${user?.uid}`,
          headers: { Authorization: `Bearer ${token?.token}` },
        }

        const userDetail = {
          first_name: fName,
          last_name: lName,
          email,
        };
        const uploadImageConfig = {
          method: 'get',
          url: `${Config.BASE_URL}/pre-signed-url?count=2`,
          headers: { Authorization: `Bearer ${token?.token}` },
        }
        const entity = {
          auth: { token, user_id: user.uid },
          uid: user.uid,
          role: 'user',
        };
        if (profilePic) {
          const apiResponse = await apiCall(uploadImageConfig);
          const preSignedUrls = apiResponse?.payload?.preSignedUrls ?? [];
          Promise.all([
            uploadImageOnPreSignedUrls({
              url: preSignedUrls?.[0],
              uri: profilePic.path,
              type: profilePic.path.split('.')[1] || 'jpeg',
            }),
            uploadImageOnPreSignedUrls({
              url: preSignedUrls?.[1],
              uri: profilePic?.path,
              type: profilePic?.path.split('.')[1] || 'jpeg',
            }),
          ]).then(async ([fullImage, thumbnail]) => {
            userDetail.full_image = fullImage;
            userDetail.thumbnail = thumbnail
            await authContext.setEntity({ ...entity })
            await Utility.setStorage('userInfo', userDetail);
            await Utility.setStorage('loggedInEntity', entity);
          }).catch(async () => {
            await authContext.setEntity({ ...entity })
            await Utility.setStorage('userInfo', userDetail);
            await Utility.setStorage('loggedInEntity', entity);
          })
        } else {
          await authContext.setEntity({ ...entity })
          await Utility.setStorage('userInfo', userDetail);
          await Utility.setStorage('loggedInEntity', entity);
        }
        apiCall(userConfig).then(async () => {
          setloading(false);
          Alert.alert('User is already registered!');
          navigation.navigate('LoginScreen');
        })
          .catch(() => {
            setloading(false);
            navigation.navigate('EmailVerificationScreen', {
              emailAddress: email,
              password,
            });
          });
      }).catch(() => setloading(false));
    }
  };

  const signUpWithNewEmail = (emailAddress, passwordInput) => {
    auth()
      .createUserWithEmailAndPassword(emailAddress, passwordInput)
      .then(async () => {
        const signUpOnAuthChanged = auth().onAuthStateChanged((user) => {
          if (user) {
            user.sendEmailVerification();
            saveUserDetails(user);
          }
        });
        signUpOnAuthChanged();
      })
      .catch((e) => {
        setloading(false);
        let message = '';
        if (e.code === 'auth/user-not-found') {
          message = 'This email address is not registerd';
        }
        if (e.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        }
        if (e.code === 'auth/invalid-email') {
          message = 'That email address is invalid!';
        }
        if (e.code === 'auth/too-many-requests') {
          message = 'Too many request for signup ,try after sometime';
        }
        setTimeout(() => Alert.alert('Towns Cup', message), 50);
      });
  };
  const checkLoginForTownsCup = () => {
    setloading(false);
    setTimeout(() => Alert.alert('This email address is already registerd'), 100);
  }

  const signupUser = (fname, lname, emailAddress, passwordInput) => {
    setloading(true);
    auth().fetchSignInMethodsForEmail(emailAddress).then((isAccountThereInFirebase) => {
      if (isAccountThereInFirebase?.length > 0) {
        checkLoginForTownsCup(emailAddress, passwordInput);
      } else {
        signUpWithNewEmail(emailAddress, passwordInput);
      }
    }).catch((error) => {
      setloading(false);
      console.log(error);
    })
  }
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
        <TCKeyboardView>
          <View style={{ marginVertical: 20 }}>
            <FastImage
                  source={profilePic?.path ? { uri: profilePic?.path } : images.profilePlaceHolder}
                  style={styles.profile}
              />
            <TouchableOpacity
                  style={styles.profileCameraButtonStyle}
                  onPress={() => {
                    ImagePicker.openPicker({
                      width: 300,
                      height: 400,
                      cropping: true,
                    }).then((pickImages) => {
                      setProfilePic(pickImages);
                    });
                  }}>
              <FastImage
                    source={images.certificateUpload}
                    style={styles.cameraIcon}
                />
            </TouchableOpacity>
          </View>
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
                  style={{ ...styles.textInput, zIndex: 100 }}
                  placeholder={strings.passwordText}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholderTextColor={colors.userPostTimeColor}
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

          <TCButton
                title={strings.signUpCapitalText}
                extraStyle={{ marginTop: hp('10%') }}
                onPress={() => {
                  if (validate()) {
                    signupUser(fName, lName, email, password);
                  }
                }}
            />
        </TCKeyboardView>
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
    elevation: 3,
    flexDirection: 'row',
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
    height: 100,
    marginTop: 40,
    marginBottom: 20,
    width: 100,
    borderRadius: 50,
  },
  textInput: {
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    // height: 40,
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
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -40,
    marginLeft: 60,
    alignSelf: 'center',
  },
  cameraIcon: {
    height: 22,
    width: 22,
  },
});
