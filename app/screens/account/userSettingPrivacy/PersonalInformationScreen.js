/* eslint-disable default-case */
import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import {useIsFocused} from '@react-navigation/native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {updateUserProfile} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import * as Utility from '../../../utils/index';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCLabel from '../../../components/TCLabel';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTextField from '../../../components/TCTextField';
import uploadImages from '../../../utils/imageAction';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import LocationModal from '../../../components/LocationModal/LocationModal';
import ScreenHeader from '../../../components/ScreenHeader';
import BottomSheet from '../../../components/modals/BottomSheet';

export default function PersonalInformationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [profileOptions, setProfileOptions] = useState([
    strings.camera,
    strings.album,
  ]);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj);
  const [profileImageChanged, setProfileImageChanged] = useState(false);

  const [locationPopup, setLocationPopup] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      const obj = {...authContext.entity.obj};
      if (
        route.params?.city &&
        route.params?.state_abbr &&
        route.params?.country
      ) {
        obj.city = route.params.city;
        obj.state_abbr = route.params.state;
        obj.country = route.params.country;
      }
      setUserInfo(obj);
    }
  }, [isFocused, route.params, authContext]);

  const handleSetLocationOptions = (location) => {
    const obj = {...userInfo};
    obj.city = location.city;
    obj.state_abbr = location.state;
    obj.country = location.country;
    setUserInfo(obj);
  };

  // Form Validation
  const checkValidation = () => {
    if (userInfo.email) {
      if (!Utility.validateEmail(userInfo.email)) {
        Alert.alert(strings.appName, strings.validEmailValidation);
        return false;
      }
    }
    if (userInfo.first_name === '') {
      Alert.alert(strings.appName, strings.pleaseaddfirstname);
      return false;
    }
    if (Utility.validatedName(userInfo.first_name) === false) {
      Alert.alert(strings.appName, strings.useOnlyLettersInFnameValidation);
      return false;
    }
    if (userInfo.last_name === '') {
      Alert.alert(strings.appName, strings.pleaseaddlastname);
      return false;
    }
    if (Utility.validatedName(userInfo.last_name) === false) {
      Alert.alert(strings.appName, strings.useOnlyLettersInLnameValidation);
      return false;
    }
    if (userInfo.city && userInfo.state_abbr && userInfo.country === '') {
      Alert.alert(strings.appName, strings.locationvalidation);
      return false;
    }
    if (userInfo.height) {
      if (!userInfo.height.height_type) {
        Alert.alert(strings.appName, strings.heightValidation);
        return false;
      }
      if (userInfo.height.height <= 0 || userInfo.height.height >= 1000) {
        Alert.alert(strings.appName, strings.validHeightValidation);
        return false;
      }
    }
    if (userInfo.weight) {
      if (!userInfo.weight.weight_type) {
        Alert.alert(strings.appName, strings.weightValidation);
        return false;
      }
      if (userInfo.weight.weight <= 0 || userInfo.weight.weight >= 1000) {
        Alert.alert(strings.appName, strings.validWeightValidation);
        return false;
      }
    }
    return true;
  };

  const onSavePress = () => {
    if (checkValidation()) {
      setloading(true);
      const bodyParams = {...userInfo};
      bodyParams.full_name = `${userInfo.first_name} ${userInfo.last_name}`;
      if (profileImageChanged) {
        const imageArray = [];
        imageArray.push({path: userInfo.thumbnail});
        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));
            if (profileImageChanged) {
              setUserInfo({
                ...userInfo,
                thumbnail: attachments[0].thumbnail,
                full_image: attachments[0].url,
              });
              setProfileImageChanged(false);
              bodyParams.full_image = attachments[0].thumbnail;
              bodyParams.thumbnail = attachments[0].url;
            }
            updateUser(bodyParams);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
            setloading(false);
          });
      } else {
        updateUser(bodyParams);
      }
    }
  };

  const updateUser = (params) => {
    setloading(true);

    updateUserProfile(params, authContext)
      .then(async (response) => {
        await Utility.setAuthContextData(response.payload, authContext);
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.goBack();
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
            navigation.goBack();
          });
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.appName, e.messages);
        }, 0.1);
        setloading(false);
      });
  };

  const onProfileImageClicked = () => {
    if (userInfo?.thumbnail) {
      setProfileOptions([...profileOptions, strings.deleteTitle]);
    }
    setShowProfileOptions(true);
  };

  const openImagePicker = (width = 400, height = 400) => {
    const cropCircle = true;

    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((data) => {
      // 1 means profile, 0 - means background

      setUserInfo({...userInfo, thumbnail: data.path});
      setProfileImageChanged(true);
      setShowProfileOptions(false);
    });
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
                .then((data) => {
                  setUserInfo({...userInfo, thumbnail: data.path});
                  setProfileImageChanged(true);
                })
                .catch((e) => {
                  console.log(e);
                });
            });
            break;
          case RESULTS.LIMITED:
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
                .then((data) => {
                  setUserInfo({...userInfo, thumbnail: data.path});
                  setProfileImageChanged(true);
                })
                .catch((e) => {
                  console.log(e);
                });
            }
            break;
          case RESULTS.BLOCKED:
            break;
        }
        setShowProfileOptions(false);
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const deleteImage = () => {
    setUserInfo({...userInfo, thumbnail: '', full_image: ''});
    setProfileImageChanged(false);
    setShowProfileOptions(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={
          route.params?.isEditProfile
            ? strings.editprofiletitle
            : strings.profile
        }
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.updateText}
        onRightButtonPress={() => {
          onSavePress();
        }}
        containerStyle={styles.headerRow}
      />

      <TCKeyboardView>
        <ActivityLoader visible={loading} />

        <View style={styles.container}>
          <View style={styles.profileImageStyle}>
            <Image
              source={
                userInfo?.thumbnail
                  ? {uri: userInfo.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.profileCameraButtonStyle}
              onPress={() => onProfileImageClicked()}>
              <Image
                style={styles.profileImageButtonStyle}
                source={images.certificateUpload}
              />
            </TouchableOpacity>
          </View>
          <TCLabel
            title={strings.nameText.toUpperCase()}
            required={true}
            style={styles.inputLabel}
          />
          <View style={styles.row}>
            <TextInput
              placeholder={strings.fnameText}
              style={[styles.inputField, {marginRight: 7}]}
              onChangeText={(text) => {
                setUserInfo({...userInfo, first_name: text});
              }}
              value={userInfo.first_name}
            />
            <TextInput
              placeholder={strings.lnameText}
              style={[styles.inputField, {marginLeft: 8}]}
              onChangeText={(text) => {
                setUserInfo({...userInfo, last_name: text});
              }}
              value={userInfo.last_name}
            />
          </View>

          <TCLabel
            title={strings.currentCity.toUpperCase()}
            required={true}
            style={styles.inputLabel}
          />

          <TouchableOpacity onPress={() => setLocationPopup(true)}>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={styles.inputField}
              value={[userInfo.city, userInfo.state, userInfo.country]
                .filter((v) => v)
                .join(', ')}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <TCLabel
            title={strings.slogan.toUpperCase()}
            style={styles.inputLabel}
          />
          <TCTextField
            placeholder={strings.whatIsYourSlogan}
            onChangeText={(text) =>
              setUserInfo({...userInfo, description: text})
            }
            multiline
            maxLength={150}
            value={userInfo.description}
            height={120}
            style={{backgroundColor: colors.textFieldBackground, marginLeft: 0}}
          />
        </View>
      </TCKeyboardView>

      <LocationModal
        visibleLocationModal={locationPopup}
        title={strings.homeCityTitleText}
        onLocationSelect={handleSetLocationOptions}
        setVisibleLocationModalhandler={() => setLocationPopup(false)}
        placeholder={strings.searchByCity}
      />

      <BottomSheet
        optionList={profileOptions}
        isVisible={showProfileOptions}
        closeModal={() => setShowProfileOptions(false)}
        onSelect={(option) => {
          if (option === strings.camera) {
            openCamera();
          } else if (option === strings.album) {
            openImagePicker();
          } else if (option === strings.deleteTitle) {
            Utility.deleteConfirmation(
              strings.appName,
              strings.deleteConfirmationText,
              () => deleteImage(),
            );
          }
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingLeft: 10,
    paddingTop: 8,
    paddingRight: 18,
    paddingBottom: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  profileImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.thinDividerColor,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 30,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    backgroundColor: colors.textFieldBackground,
    paddingVertical: Platform.OS === 'android' ? 5 : 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 35,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    flex: 1,
  },
  profileCameraButtonStyle: {
    height: 25,
    width: 25,
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  profileImageButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
});
