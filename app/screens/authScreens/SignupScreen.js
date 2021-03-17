import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
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
import { checkTownscupEmail } from '../../api/Users';

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

  useEffect(() => {

  }, [])

  const checkUserIsRegistratedOrNotWithTownscup = (emailAddress) => new Promise((resolve) => {
    checkTownscupEmail(encodeURIComponent(emailAddress)).then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    })
  })

  const checkUserIsRegistratedOrNotWithFirebase = (emailAddress) => new Promise((resolve, reject) => {
    auth().fetchSignInMethodsForEmail(emailAddress).then((isAccountThereInFirebase) => {
      if (isAccountThereInFirebase?.length > 0) {
        resolve(isAccountThereInFirebase);
      } else {
        resolve(false);
      }
    }).catch((error) => {
      reject(error);
      console.log(error);
    })
  })

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
          auth: { user_id: user.uid },
          uid: user.uid,
          role: 'user',
        };
        await authContext.setTokenData(token);
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
        if (e.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '') setTimeout(() => Alert.alert('Towns Cup', message), 50);
      });
  };

  const registerWithAnotherProvider = (param) => new Promise((resolve, reject) => {
    if (param[0].includes('facebook')) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ provider: 'facebook' });
    } if (param[0].includes('google')) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ provider: 'google' });
    }
    resolve(true);
  })
  const signupUser = (fname, lname, emailAddress, passwordInput) => {
    setloading(true);
    checkUserIsRegistratedOrNotWithTownscup(email).then((userExist) => {
      if (userExist) {
        setloading(false);
        setTimeout(() => {
          Alert.alert('User is already registered with townscup!');
        }, 100)
      } else {
        checkUserIsRegistratedOrNotWithFirebase(emailAddress).then((firebaseUserExist) => {
          if (firebaseUserExist) {
            registerWithAnotherProvider(firebaseUserExist).then(() => {
              signUpWithNewEmail(emailAddress, passwordInput);
            }).catch((error) => {
              setloading(false)
              setTimeout(() => {
                Alert.alert('Townscup', `This email is already registrated with ${error?.provider}`)
              }, 100)
            })
          } else {
            signUpWithNewEmail(emailAddress, passwordInput);
          }
        }).catch(() => setloading(false));
      }
    })
  }
  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };
  return (
    <LinearGradient
          colors={[colors.themeColor1, colors.themeColor3]}
          style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />
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
                      cropperCircleOverlay: true,
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
                placeholderTextColor={colors.darkYellowColor}
                style={styles.textFieldStyle}
                placeholder={strings.fnameText}
                onChangeText={(text) => setFName(text)}
                value={fName}
            />
        <TCTextField
                placeholderTextColor={colors.darkYellowColor}
                style={styles.textFieldStyle}
                placeholder={strings.lnameText}
                onChangeText={(text) => setLName(text)}
                value={lName}
            />
        <TCTextField
                placeholderTextColor={colors.darkYellowColor}
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
                  placeholderTextColor={colors.darkYellowColor}
                  secureTextEntry={hidePassword}
                  keyboardType={'default'}
              />
          <TouchableOpacity onPress={() => hideShowPassword()} style={{ alignItems: 'center', justifyContent: 'center' }}>
            {hidePassword ? (
              <Text style={styles.passwordEyes}>SHOW</Text>
            ) : (
              <Text style={styles.passwordEyes}>HIDE</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.passwordView}>
          <TextInput
              autoCapitalize="none"
              style={{ ...styles.textInput, zIndex: 100 }}
              placeholder={strings.confirmPasswordText}
              onChangeText={setCPassword}
              value={cPassword}
              placeholderTextColor={colors.darkYellowColor}
              secureTextEntry={hidePassword}
              keyboardType={'default'}
          />
          <TouchableOpacity onPress={() => hideShowPassword()} style={{ alignItems: 'center', justifyContent: 'center' }}>
            {hidePassword ? (
              <Text style={styles.passwordEyes}>SHOW</Text>
            ) : (
              <Text style={styles.passwordEyes}>HIDE</Text>
            )}
          </TouchableOpacity>
        </View>

        <TCButton
                title={strings.signUpCapitalText}
                extraStyle={{ marginTop: hp('10%') }}
                onPress={() => {
                  if (validate()) {
                    if (authContext.networkConnected) {
                      signupUser(fName, lName, email, password);
                    } else {
                      authContext.showNetworkAlert();
                    }
                  }
                }}
            />
      </TCKeyboardView>
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
  passwordEyes: {
    fontSize: 10,
    color: colors.darkYellowColor,
    textDecorationLine: 'underline',
  },
  passwordView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: wp('85%'),
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
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 17,
    width: wp('75%'),
  },
  textFieldStyle: {
    marginVertical: 5,
    alignSelf: 'center',
    width: wp('85%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
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
