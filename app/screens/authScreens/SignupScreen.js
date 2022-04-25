import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import QB from 'quickblox-react-native-sdk';

import firebase from '@react-native-firebase/app';
import ActionSheet from 'react-native-actionsheet';

import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import TCKeyboardView from '../../components/TCKeyboardView';
import ActivityLoader from '../../components/loader/ActivityLoader';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import AuthContext from '../../auth/context';
import apiCall from '../../utils/apiCall';
import {checkTownscupEmail, createUser} from '../../api/Users';
import {getHitSlop} from '../../utils/index';

import {
  QBconnectAndSubscribe,
  QBcreateUser,
  QBlogin,
  QB_ACCOUNT_TYPE,
} from '../../utils/QuickBlox';

export default function SignupScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const dummyAuthContext = {...authContext};
  const [fName, setFName] = useState('Kishan');
  const [lName, setLName] = useState('Makani');
  const [email, setEmail] = useState('makani20@gmail.com');
  const [password, setPassword] = useState('123456');
  const [cPassword, setCPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const actionSheetWithDelete = useRef();
  const actionSheet = useRef();

  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = () => {
    if (fName === '') {
      Alert.alert(strings.appName, 'First name cannot be blank');
      return false;
    }
    if (Utility.validatedName(fName) === false) {
      Alert.alert(
        strings.appName,
        'The first name cannot contain numbers or special characters.',
      );
      return false;
    }
    if (lName === '') {
      Alert.alert(strings.appName, 'Last name cannot be blank');
      return false;
    }
    if (Utility.validatedName(lName) === false) {
      Alert.alert(
        strings.appName,
        'The last name cannot contain numbers or special characters.',
      );
      return false;
    }
    if (email === '') {
      Alert.alert(strings.appName, 'Email cannot be blank');
      return false;
    }
    if (validateEmail(email) === false) {
      Alert.alert('', strings.validEmailMessage);
      return false;
    }
    if (password === '') {
      Alert.alert(strings.appName, strings.passwordCanNotBlank);
      return false;
    }
    if (cPassword === '') {
      Alert.alert(strings.appName, strings.cofirmpPswCanNotBlank);
      return false;
    }
    if (password !== cPassword) {
      Alert.alert(strings.appName, strings.confirmAndPasswordNotMatch);
      return false;
    }
    if (password.length < 6) {
      Alert.alert(strings.appName, strings.passwordWarningMessage);
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

  useEffect(() => {}, []);

  const checkUserIsRegistratedOrNotWithTownscup = () =>
    new Promise((resolve) => {
      checkTownscupEmail(encodeURIComponent(email))
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

  const checkUserIsRegistratedOrNotWithFirebase = () =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((isAccountThereInFirebase) => {
          if (isAccountThereInFirebase?.length > 0) {
            resolve(isAccountThereInFirebase);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });

  const wholeSignUpProcessComplete = async (userData) => {
    const entity = dummyAuthContext?.entity;
    const tokenData = dummyAuthContext?.tokenData;
    entity.auth.user = {...userData};
    entity.obj = {...userData};
    entity.uid = userData?.user_id;
    await Utility.setStorage('loggedInEntity', {...entity});
    await Utility.setStorage('authContextEntity', {...entity});
    await Utility.setStorage('authContextUser', {...userData});
    await authContext.setTokenData(tokenData);
    await authContext.setUser({...userData});
    await authContext.setEntity({...entity});
    setloading(false);
    navigation.navigate('EmailVerificationScreen', {
      emailAddress: email,
      password,
      first_name: fName,
    });
  };

  const signUpWithQB = async (response) => {
    console.log('QB signUpWithQB : ', response);

    let qbEntity = {...dummyAuthContext.entity};
    console.log('QB qbEntity : ', qbEntity);

    const setting = await Utility.getStorage('appSetting');
    console.log('App QB Setting:=>', setting);

    authContext.setQBCredential(setting);
    QB.settings.enableAutoReconnect({enable: true});
    QBlogin(qbEntity.uid, response)
      .then(async (res) => {
        qbEntity = {
          ...qbEntity,
          QB: {...res.user, connected: true, token: res?.session?.token},
        };
        QBconnectAndSubscribe(qbEntity);
        setDummyAuthContext('entity', qbEntity);
        await wholeSignUpProcessComplete(response);
      })
      .catch(async (error) => {
        console.log('QB Login Error : ', error.message);
        qbEntity = {...qbEntity, QB: {connected: false}};
        setDummyAuthContext('entity', qbEntity);
        QBcreateUser(qbEntity.uid, response, QB_ACCOUNT_TYPE.USER)
          .then(() => {
            QBlogin(qbEntity.uid).then((loginRes) => {
              console.log('QB loginRes', loginRes);
            });
          })
          .catch((e) => {
            console.log('QB error', e);
          });
        await wholeSignUpProcessComplete(response);
      });
  };

  const signUpToTownsCup = async (uploadedProfilePic) => {
    setloading(true);
    const data = {
      first_name: fName,
      last_name: lName,
      email,
      thumbnail: uploadedProfilePic?.thumbnail ?? '',
      full_image: uploadedProfilePic?.full_image ?? '',
    };

    createUser(data, dummyAuthContext)
      .then((createdUser) => {
        console.log('QB CreatedUser:', createdUser);
        const authEntity = {...dummyAuthContext.entity};
        authEntity.obj = createdUser?.payload;
        authEntity.auth.user = createdUser?.payload;
        authEntity.role = 'user';
        setDummyAuthContext('entity', authEntity);
        setDummyAuthContext('user', createdUser?.payload);
        signUpWithQB(createdUser?.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const setDummyAuthContext = (key, value) => {
    dummyAuthContext[key] = value;
  };
  const saveUserDetails = async (user) => {
    if (user) {
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          console.log('idTokenResult', idTokenResult);

          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          const uploadImageConfig = {
            method: 'get',
            url: `${Config.BASE_URL}/pre-signed-url?count=2`,
            headers: {Authorization: `Bearer ${token?.token}`},
          };
          const entity = {
            auth: {user_id: user.uid},
            uid: user.uid,
            role: 'user',
          };
          setDummyAuthContext('tokenData', token);
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
            ])
              .then(async ([fullImage, thumbnail]) => {
                setDummyAuthContext('entity', entity);
                const uploadedProfilePic = {full_image: fullImage, thumbnail};
                await signUpToTownsCup(uploadedProfilePic);
              })
              .catch(async () => {
                setDummyAuthContext('entity', entity);
                await signUpToTownsCup();
              });
          } else {
            setDummyAuthContext('entity', entity);
            await signUpToTownsCup();
          }
        })
        .catch(() => setloading(false));
    }
  };

  const signUpWithFirebase = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const signUpOnAuthChanged = firebase
          .auth()
          .onAuthStateChanged((user) => {
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
          message = 'That email address is already registrated! please login';
        }
        if (e.code === 'auth/invalid-email') {
          message = strings.validEmailMessage;
        }
        if (e.code === 'auth/too-many-requests') {
          message = 'Too many request for signup ,try after sometime';
        }
        if (e.code === 'auth/network-request-failed') {
          message = strings.networkConnectivityErrorMessage;
        }
        if (message !== '')
          setTimeout(() => Alert.alert(strings.appName, message), 50);
      });
  };

  const registerWithAnotherProvider = (param) =>
    new Promise((resolve, reject) => {
      if (param[0].includes('facebook')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'facebook'});
      }
      if (param[0].includes('google')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'google'});
      }
      if (param[0].includes('apple.com')) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({provider: 'apple'});
      }
      resolve(true);
    });
  const signupUser = () => {
    setloading(true);
    checkUserIsRegistratedOrNotWithTownscup().then((userExist) => {
      if (userExist) {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alreadyRegisteredMessage);
        }, 100);
      } else {
        checkUserIsRegistratedOrNotWithFirebase()
          .then((firebaseUserExist) => {
            if (firebaseUserExist) {
              registerWithAnotherProvider(firebaseUserExist)
                .then(() => {
                  signUpWithFirebase();
                })
                .catch((error) => {
                  console.log(error);
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(
                      'Townscup',
                      `This email is already registrated with ${error?.provider}`,
                    );
                  }, 100);
                });
            } else {
              signUpWithFirebase();
            }
          })
          .catch(() => {
            signUpWithFirebase();
          });
      }
    });
  };
  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };
  const hideShowConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  const openImagePicker = (width = 400, height = 400) => {
    const cropCircle = true;
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((pickImages) => {
      setProfilePic(pickImages);
    });
  };

  const deleteImage = () => {
    setProfilePic('');
  };

  const openCamera = (width = 400, height = 400) => {
    check(PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.CAMERA).then(() => {
              const cropCircle = true;
              ImagePicker.openCamera({
                width,
                height,
                cropping: true,
                cropperCircleOverlay: cropCircle,
              })
                .then((pickImages) => {
                  setProfilePic(pickImages);
                })
                .catch((e) => {
                  Alert.alert(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            {
              const cropCircle = true;
              ImagePicker.openCamera({
                width,
                height,
                cropping: true,
                cropperCircleOverlay: cropCircle,
              })
                .then((pickImages) => {
                  setProfilePic(pickImages);
                })
                .catch((e) => {
                  Alert.alert(e);
                });
            }
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
          default:
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };
  const onProfileImageClicked = () => {
    setTimeout(() => {
      if (profilePic) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  return (
    <>
      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
        options={[strings.camera, strings.album, strings.cancelTitle]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            openCamera();
          } else if (index === 1) {
            openImagePicker();
          }
        }}
      />
      <ActionSheet
        ref={actionSheetWithDelete}
        // title={'News Feed Post'}
        options={[
          strings.camera,
          strings.album,
          strings.deleteTitle,
          strings.cancelTitle,
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            openCamera();
          } else if (index === 1) {
            openImagePicker();
          } else if (index === 2) {
            deleteImage();
          }
        }}
      />
      <LinearGradient
        colors={[colors.themeColor1, colors.themeColor3]}
        style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <FastImage
          resizeMode={'stretch'}
          style={styles.background}
          source={images.loginBg}
        />
        <TCKeyboardView>
          <View style={{marginVertical: 20}}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                onProfileImageClicked();
              }}>
              <FastImage
                source={
                  profilePic?.path
                    ? {uri: profilePic?.path}
                    : images.profilePlaceHolder
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#FED378',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileCameraButtonStyle}
              onPress={() => {
                onProfileImageClicked();
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
            value={fName}
            // onChangeText={(name) => {
            //   if (Utility.validatedName(name)) {
            //     setFName(name);
            //   }
            // }}
            onChangeText={(text) => setFName(text)}
          />
          <TCTextField
            placeholderTextColor={colors.darkYellowColor}
            style={styles.textFieldStyle}
            placeholder={strings.lnameText}
            onChangeText={(text) => setLName(text)}
            // onChangeText={(lastName) => {
            //   if (Utility.validatedName(lastName) === true) {
            //     setLName(lastName);
            //   }
            // }}
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
              style={{...styles.textInput, zIndex: 100}}
              placeholder={strings.passwordText}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholderTextColor={colors.darkYellowColor}
              secureTextEntry={hidePassword}
              keyboardType={'default'}
            />
            <TouchableOpacity
              onPress={() => hideShowPassword()}
              style={{alignItems: 'center', justifyContent: 'center'}}>
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
              style={{...styles.textInput, zIndex: 100}}
              placeholder={strings.confirmPasswordText}
              onChangeText={setCPassword}
              value={cPassword}
              placeholderTextColor={colors.darkYellowColor}
              secureTextEntry={hideConfirmPassword}
              keyboardType={'default'}
            />
            <TouchableOpacity
              onPress={() => hideShowConfirmPassword()}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              {hideConfirmPassword ? (
                <Text style={styles.passwordEyes}>SHOW</Text>
              ) : (
                <Text style={styles.passwordEyes}>HIDE</Text>
              )}
            </TouchableOpacity>
          </View>
          <TCButton
            title={strings.signUpCapitalText}
            extraStyle={{
              marginTop: hp('2%'),
            }}
            onPress={() => {
              if (validate()) {
                if (authContext.networkConnected) {
                  signupUser();
                } else {
                  authContext.showNetworkAlert();
                }
              }
            }}
          />
          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.alreadyView}>
            <Text style={styles.alreadyMemberText}>
              {strings.alreadyMember}
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.RBold,
                }}>
                Log In
              </Text>
            </Text>
          </TouchableOpacity>
        </TCKeyboardView>
      </LinearGradient>
    </>
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
    height: 40,
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
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

    // borderWidth: 1,
    // borderColor: '#FED378',
  },
  textInput: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: wp('75%'),
  },
  textFieldStyle: {
    marginVertical: 5,
    alignSelf: 'center',
    width: wp('85%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
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
  alreadyMemberText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  alreadyView: {
    marginVertical: 25,
    alignSelf: 'center',
  },
});
