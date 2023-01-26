import React, {useState, useRef, useLayoutEffect} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import ActionSheet from 'react-native-actionsheet';

import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import TCKeyboardView from '../../components/TCKeyboardView';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCTextField from '../../components/TCTextField';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function SignupScreen({navigation, route}) {
  const [fName, setFName] = useState(
    route?.params?.signupInfo?.first_name ?? '',
  );
  const [lName, setLName] = useState(
    route?.params?.signupInfo?.last_name ?? '',
  );
  const [loading] = useState(false);

  const [providerPic, setProviderPic] = useState(
    route?.params?.signupInfo?.uploadedProfilePic?.thumbnail,
  );
  const [profilePic, setProfilePic] = useState();
  const actionSheetWithDelete = useRef();

  const actionSheet = useRef();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Text
          testID="next-signup-button"
          style={styles.nextButtonStyle}
          onPress={() => {
            if (validate()) {
              uploadProfilePicAndGeneratePreSignedUrls();
            }
          }}>
          {strings.next}
        </Text>
      ),
    });
  });
  // For activity indigator
  const uploadProfilePicAndGeneratePreSignedUrls = async () => {
    const userData = {};
    if (profilePic) {
      userData.profilePic = profilePic;
    } else if (providerPic) {
      const uploadedProfilePic = {
        full_image: providerPic,
        thumbnail: providerPic,
      };
      userData.uploadedProfilePic = uploadedProfilePic;
    }
    navigateToAddBirthdayScreen(userData);
  };

  const navigateToAddBirthdayScreen = (userData) => {
    const profileData = {
      ...route?.params?.signupInfo,
      ...userData,
      first_name: fName,
      last_name: lName,
    };
    navigation.navigate('AddBirthdayScreen', {
      signupInfo: {...profileData},
    });
  };
  const validate = () => {
    if (fName === '') {
      Alert.alert(
        strings.appName,
        strings.firstnamevalidation,
        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    if (Utility.validatedName(fName) === false) {
      Alert.alert(
        strings.appName,
        strings.fNameCanNotBlank,
        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    if (lName === '') {
      Alert.alert(
        strings.appName,
        strings.lastnamevalidation,
        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    if (Utility.validatedName(lName) === false) {
      Alert.alert(
        strings.appName,
        strings.lNameCanNotBlank,
        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }

    return true;
  };

  const openImagePicker = (width = 400, height = 400) => {
    const cropCircle = true;
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((pickImages) => {
      setProviderPic('');
      setProfilePic(pickImages);
    });
  };

  const deleteImage = () => {
    setProfilePic('');
    setProviderPic('');
  };

  const openCamera = (width = 400, height = 400) => {
    // check(PERMISSIONS.IOS.CAMERA)
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    )
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert(strings.thisFeaturesNotAvailableText);
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
                  setProviderPic('');
                  setProfilePic(pickImages);
                })
                .catch((e) => {
                  console.log(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            console.log(strings.permissionLimitedText);
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
                  setProviderPic('');
                  setProfilePic(pickImages);
                })
                .catch((e) => {
                  console.log(e);
                });
            }
            break;
          case RESULTS.BLOCKED:
            console.log(strings.permissionDenitedText);
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
        options={[strings.camera, strings.album, strings.cancel]}
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
            Utility.deleteConfirmation(
              strings.appName,
              strings.deleteConfirmationText,
              () => deleteImage(),
            );
          }
        }}
      />
      <LinearGradient
        colors={[colors.themeColor1, colors.themeColor3]}
        style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <FastImage style={styles.background} source={images.loginBg} />
        <Text style={styles.checkEmailText}>{strings.addYourName}</Text>

        <TCKeyboardView>
          <View
            style={{
              marginTop: 61,
            }}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                onProfileImageClicked();
              }}>
              {profilePic ? (
                <FastImage
                  resizeMode={'contain'}
                  source={
                    profilePic?.path
                      ? {uri: profilePic?.path}
                      : images.profilePlaceHolder
                  }
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: '#FED378',
                  }}
                />
              ) : (
                <View>
                  {providerPic ? (
                    <FastImage
                      resizeMode={'contain'}
                      source={
                        providerPic
                          ? {uri: providerPic}
                          : images.profilePlaceHolder
                      }
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#FED378',
                      }}
                    />
                  ) : (
                    <FastImage
                      resizeMode={'contain'}
                      source={images.profilePlaceHolder}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#FED378',
                      }}
                    />
                  )}
                </View>
              )}
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
          <View
            style={{
              marginTop: 35,
              marginLeft: 35,
              marginRight: 35,
            }}>
            <TCTextField
              testID="fname-signup-input"
              placeholderTextColor={colors.darkYellowColor}
              style={styles.textFieldStyle}
              height={40}
              placeholder={strings.fnameText}
              value={fName}
              onChangeText={(text) => setFName(text)}
              autoCapitalize={'words'}
            />
            <TCTextField
              testID="lname-signup-input"
              placeholderTextColor={colors.darkYellowColor}
              style={{...styles.textFieldStyle}}
              placeholder={strings.lnameText}
              onChangeText={(text) => setLName(text)}
              value={lName}
              height={40}
              autoCapitalize={'words'}
            />
          </View>
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

  profile: {
    alignContent: 'center',
    alignSelf: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
  },

  textFieldStyle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 5,
    marginHorizontal: 0,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -61,
    marginLeft: 35,
    alignSelf: 'center',
  },
  cameraIcon: {
    height: 22,
    width: 22,
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    textAlign: 'left',
  },
});
