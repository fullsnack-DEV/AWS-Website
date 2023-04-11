/* eslint-disable default-case */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
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
import Header from '../../../components/Home/Header';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {languageList} from '../../../utils';
import TCTextField from '../../../components/TCTextField';
import TCImage from '../../../components/TCImage';
import uploadImages from '../../../utils/imageAction';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import LocationModal from '../../../components/LocationModal/LocationModal';

export default function PersonalInformationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const isFocused = useIsFocused();

  const actionSheetWithDelete = useRef();
  /* For activity indigator */
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [city, setCity] = useState(
    route?.params?.city ? route.params.city : authContext.entity?.obj?.city,
  );

  const [state, setState] = useState(
    route?.params?.state_abbr
      ? route.params.state_abbr
      : authContext.entity?.obj?.state_abbr,
  );
  const [country, setCountry] = useState(
    route?.params?.country
      ? route.params.country
      : authContext.entity?.obj?.country,
  );

  const [phoneNumbers] = useState(
    authContext.entity.obj.phone_numbers || [
      {
        id: 0,
        phone_number: '',
        country_code: '',
      },
    ],
  );

  const [languageData] = useState(languageList);
  const [languages, setLanguages] = useState(
    authContext?.entity?.obj?.language,
  );
  const [locationPopup, setLocationPopup] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, languages, phoneNumbers, userInfo, city, state, country]);

  useEffect(() => {
    if (isFocused) {
      if (
        route?.params?.city &&
        route?.params?.state_abbr &&
        route?.params?.country
      ) {
        setCity(route?.params?.city);
        setState(route?.params?.state_abbr);
        setCountry(route?.params?.country);
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state_abbr,
  ]);

  useEffect(() => {
    const arr = [];
    for (const temp of languageData) {
      if (userInfo.language) {
        if (userInfo.language.includes(temp.language)) {
          temp.isChecked = true;
        } else {
          temp.isChecked = false;
        }
        arr.push(temp);
      }
    }
    setLanguages(arr);
  }, [userInfo.language]);

  const handleSetLocationOptions = (location) => {
    setCity(location.city);
    setState(location.state);
    setCountry(location.country);
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
      bodyParams.first_name = userInfo.first_name;
      bodyParams.last_name = userInfo.last_name;
      bodyParams.full_name = `${userInfo.first_name} ${userInfo.last_name}`;

      bodyParams.city = city;
      bodyParams.state_abbr = state;
      bodyParams.country = country;

      bodyParams.description = userInfo.description;
      bodyParams.height = userInfo.height;
      bodyParams.weight = userInfo.weight;

      if (userInfo.language) {
        bodyParams.language = userInfo.language;
      }
      if (phoneNumbers) {
        bodyParams.phone_numbers = userInfo.phone_numbers;
      }

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
        // bodyParams.full_image = '';
        // bodyParams.thumbnail = '';
        updateUser(bodyParams);
      }
    }
  };

  const updateUser = (params) => {
    setloading(true);
    updateUserProfile(params, authContext)
      .then((response) => {
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
    setTimeout(() => {
      if (userInfo?.thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
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
            console.log(strings.permissionDenitedText);
            break;
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const deleteImage = () => {
    setUserInfo({...userInfo, thumbnail: '', full_image: ''});
    setProfileImageChanged(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              fontFamily: fonts.RBold,
            }}>
            {route?.params?.isEditProfile
              ? strings.editprofiletitle
              : strings.profile}
          </Text>
        }
        rightComponent={
          <Text
            style={styles.headerRightButton}
            numberOfLines={1}
            onPress={() => {
              // if (!editMode) changeEditMode();
              // else
              onSavePress();
            }}>
            {strings.update}
          </Text>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
      <TCKeyboardView>
        <ActivityLoader visible={loading} />

        <View style={{flex: 1}}>
          <TCImage
            imageStyle={[styles.profileImageStyle, {marginTop: 10}]}
            source={
              userInfo.thumbnail
                ? {uri: userInfo.thumbnail}
                : images.profilePlaceHolder
            }
            defaultSource={images.profilePlaceHolder}
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
        <TCLabel title={strings.nameText} required={true} />
        <View style={{marginHorizontal: 15, flexDirection: 'row'}}>
          <TextInput
            placeholder={strings.fnameText}
            style={{
              ...styles.matchFeeTxt,
              flex: 1,
              marginRight: 5,
              backgroundColor: colors.textFieldBackground,
            }}
            onChangeText={(text) => {
              setUserInfo({...userInfo, first_name: text});
            }}
            value={userInfo.first_name}
          />
          <TextInput
            placeholder={strings.lnameText}
            style={{
              ...styles.matchFeeTxt,
              flex: 1,
              marginLeft: 5,
              backgroundColor: colors.textFieldBackground,
            }}
            onChangeText={(text) => {
              setUserInfo({...userInfo, last_name: text});
            }}
            value={userInfo.last_name}
          />
        </View>

        <View style={styles.fieldView}>
          <TCLabel title={strings.currentCity} required={true} />

          <TouchableOpacity onPress={() => setLocationPopup(true)}>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={{
                ...styles.matchFeeTxt,
                backgroundColor: colors.textFieldBackground,
              }}
              value={[city, state, country].filter((v) => v).join(', ')}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLabel title={strings.slogan} style={{bottom: 5}} />
          <TCTextField
            placeholder={strings.slogan}
            onChangeText={(text) =>
              setUserInfo({...userInfo, description: text})
            }
            multiline
            maxLength={150}
            value={userInfo.description}
            height={120}
            style={{backgroundColor: colors.textFieldBackground}}
          />
        </View>
      </TCKeyboardView>

      {/* import location modal here and give them props */}

      <LocationModal
        visibleLocationModal={locationPopup}
        title={strings.homeCityTitleText}
        onLocationSelect={handleSetLocationOptions}
        setVisibleLocationModalhandler={() => setLocationPopup(false)}
        placeholder={strings.searchByCity}
      />

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
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },

  fieldView: {
    marginBottom: 2,
  },

  headerRightButton: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: 100,
    textAlign: 'right',
  },

  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    fontSize: 16,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
    width: wp('92%'),
  },

  profileImageStyle: {
    height: 71,
    width: 71,
    marginTop: -36,
    borderRadius: 35.5,
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: colors.whiteColor,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -22,
    marginLeft: 48,
    alignSelf: 'center',
  },
  profileImageButtonStyle: {
    height: 22,
    width: 22,
  },
});
