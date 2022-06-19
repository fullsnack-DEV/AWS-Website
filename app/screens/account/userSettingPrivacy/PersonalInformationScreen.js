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
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {updateUserProfile} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utils/index';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCLabel from '../../../components/TCLabel';
import TCMessageButton from '../../../components/TCMessageButton';
import Header from '../../../components/Home/Header';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {languageList, getHitSlop, widthPercentageToDP} from '../../../utils';
import TCTextField from '../../../components/TCTextField';
import TCThinDivider from '../../../components/TCThinDivider';
import Separator from '../../../components/Separator';

import TCImage from '../../../components/TCImage';
import uploadImages from '../../../utils/imageAction';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import {
  searchCityState,
  searchLocationPlaceDetail,
  searchLocations,
  getLocationNameWithLatLong,
} from '../../../api/External';
import TCThickDivider from '../../../components/TCThickDivider';

export default function PersonalInformationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const isFocused = useIsFocused();

  const actionSheetWithDelete = useRef();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj);
  const [languagesName, setLanguagesName] = useState('');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [streetAddress, setStreetAddress] = useState(
    authContext?.entity?.obj?.street_address,
  );
  const [city, setCity] = useState(
    route?.params?.city ? route?.params?.city : authContext?.entity?.obj?.city,
  );
  console.log('Current city1', route?.params?.city);
  console.log('Current city2', authContext?.entity?.obj?.city);
  const [state, setState] = useState(
    route?.params?.state
      ? route?.params?.state
      : authContext?.entity?.obj?.state_abbr,
  );
  const [country, setCountry] = useState(
    route?.params?.country
      ? route?.params?.country
      : authContext?.entity?.obj?.country,
  );
  const [postalCode, setPostalCode] = useState(
    authContext?.entity?.obj?.postal_code,
  );

  const [phoneNumbers, setPhoneNumbers] = useState(
    authContext.entity.obj.phone_numbers || [
      {
        id: 0,
        phone_number: '',
        country_code: '',
      },
    ],
  );

  const [languageData, setLanguageData] = useState(languageList);
  const [isModalVisible, setModalVisible] = useState(false);
  const [languages, setLanguages] = useState(
    authContext?.entity?.obj?.language,
  );
  const selectedLanguage = [];

  const [locationPopup, setLocationPopup] = useState(false);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState();
  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);
  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocations(searchLocationText).then((response) => {
        console.log('search response =>', response);
        setNoData(false);
        setCityData(response.predictions);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [
    navigation,
    languages,
    phoneNumbers,
    userInfo,
    city,
    state,
    country,
    postalCode,
    streetAddress,
  ]);

  useEffect(() => {
    let languageText = '';
    if (userInfo?.language) {
      userInfo.language.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [userInfo?.language]);

  useEffect(() => {
    console.log('route?.params?.city', route?.params?.city);
    if (isFocused) {
      if (
        route?.params?.city &&
        route?.params?.state &&
        route?.params?.country
      ) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state,
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
  }, []);
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermission();
    } else {
      console.log('111');
      request(
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );

            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');

            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setloading(true);
            getCurrentLocation();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
          default:
        }
      });
    }
  }, []);

  const getCurrentLocation = async () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        console.log('222');

        getLocationNameWithLatLong(
          position?.coords?.latitude,
          position?.coords?.longitude,
          authContext,
        ).then((res) => {
          console.log(
            'Lat/long to address::=>',
            res.results[0].address_components,
          );
          const userData = {};
          // let stateAbbr, city, country;

          // eslint-disable-next-line array-callback-return
          res.results[0].address_components.map((e) => {
            if (e.types.includes('administrative_area_level_1')) {
              userData.state = e.short_name;
            } else if (e.types.includes('locality')) {
              userData.city = e.short_name;
            } else if (e.types.includes('country')) {
              userData.country = e.long_name;
            }
          });
          console.log('www', userData);
          setCurrentLocation(userData);
          setloading(false);
        });
        console.log('444');
        setloading(false);
      },
      (error) => {
        console.log('555');
        setloading(false);
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const requestPermission = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then((result) => {
        console.log('Data :::::', JSON.stringify(result));
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          getCurrentLocation();
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  };
  const renderItem = ({item, index}) => {
    console.log('Location item:=>', item);
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => getTeamsData(item)}>
        <View>
          <Text style={styles.cityList}>{cityData[index].description}</Text>
          <TCThinDivider
            width={'100%'}
            backgroundColor={colors.grayBackgroundColor}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const getTeamsData = async (item) => {
    searchLocationPlaceDetail(item.place_id, authContext).then((response) => {
      if (response) {
        setCity(item?.terms?.[0]?.value ?? '');
        setState(item?.terms?.[1]?.value ?? '');
        setCountry(item?.terms?.[2]?.value ?? '');
      }
    });
    setLocationPopup(false);
  };
  const getTeamsDataByCurrentLocation = async () => {
    console.log('Curruent location data:=>', currentLocation);
    setCity(currentLocation.city);
    setState(currentLocation.state);
    setCountry(currentLocation.country);
    setLocationPopup(false);
  };
  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumbers.length === 0 ? 0 : phoneNumbers.length,
      code: '',
      number: '',
    };
    setPhoneNumbers([...phoneNumbers, obj]);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Form Validation
  const checkValidation = () => {
    console.log('userInfo', userInfo);
    if (userInfo.email) {
      if (!Utility.validateEmail(userInfo.email)) {
        Alert.alert(strings.appName, 'Please enter valid email address.');
        return false;
      }
    }
    if (userInfo.first_name === '') {
      Alert.alert(strings.appName, strings.pleaseaddfirstname);
      return false;
    }
    if (userInfo.last_name === '') {
      Alert.alert(strings.appName, strings.pleaseaddlastname);
      return false;
    }
    if (userInfo.city && userInfo.state_abbr && userInfo.country === '') {
      Alert.alert(strings.appName, 'Location cannot be blank');
      return false;
    }
    if (userInfo.height) {
      if (!userInfo.height.height_type) {
        Alert.alert(strings.appName, 'Please select height measurement');
        return false;
      }
      if (userInfo.height.height <= 0 || userInfo.height.height >= 1000) {
        Alert.alert(strings.appName, 'Please enter valid height.');
        return false;
      }
    }
    if (userInfo.weight) {
      if (!userInfo.weight.weight_type) {
        Alert.alert('Towns Cup', 'Please select weight measurement.');
        return false;
      }
      if (userInfo.weight.weight <= 0 || userInfo.weight.weight >= 1000) {
        Alert.alert(strings.appName, 'Please enter valid weight.');
        return false;
      }
    }
    return true;
  };

  const isIconCheckedOrNot = ({item, index}) => {
    console.log('SELECTED:::', index);

    languageData[index].isChecked = !item.isChecked;

    setLanguageData([...languageData]);

    for (const temp of languageData) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setUserInfo({...userInfo, language: selectedLanguage});
    // setSelectedLanguages(selectedLanguage);
    console.log('language Checked :::', selectedLanguage);
  };

  const onSavePress = () => {
    // console.log('checkValidation()', checkValidation());

    if (checkValidation()) {
      setloading(true);
      const bodyParams = {...userInfo};
      bodyParams.first_name = userInfo.first_name;
      bodyParams.last_name = userInfo.last_name;
      bodyParams.full_name = `${userInfo.first_name} ${userInfo.last_name}`;

      bodyParams.city = city;
      bodyParams.state_abbr = state;
      bodyParams.country = country;
      bodyParams.street_address = streetAddress;
      bodyParams.postal_code = postalCode;

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
        bodyParams.full_image = '';
        bodyParams.thumbnail = '';
        updateUser(bodyParams);
      }
    }
  };

  const updateUser = (params) => {
    setloading(true);
    console.log('bodyPARAMS:: ', params);
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
  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View>
        <Text style={styles.languageData}>{item.language}</Text>
        <View style={styles.checkbox}>
          {item.isChecked ? (
            <Image
              source={images.checkWhiteLanguage}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
        <View style={styles.shortSeparatorLine}></View>
      </View>
    </TouchableWithoutFeedback>
  );

  const heightView = () => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView}}>
          <TextInput
            placeholder={'Height'}
            style={{...styles.halffeeText}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setUserInfo({
                ...userInfo,
                height: {
                  height: text,
                  height_type: userInfo?.height?.height_type,
                },
              });
            }}
            value={userInfo?.height?.height}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: 'Height type',
            value: null,
          }}
          items={[
            {label: 'cm', value: 'cm'},
            {label: 'ft', value: 'ft'},
          ]}
          onValueChange={(value) => {
            setUserInfo({
              ...userInfo,
              height: {
                height: userInfo?.height?.height,
                height_type: value,
              },
            });
          }}
          value={userInfo?.height?.height_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
      </View>
    </View>
  );

  const weightView = () => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView}}>
          <TextInput
            placeholder={'Weight'}
            style={{...styles.halffeeText}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setUserInfo({
                ...userInfo,
                weight: {
                  weight: text,
                  weight_type: userInfo?.weight?.weight_type,
                },
              });
            }}
            value={userInfo?.weight?.weight}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: 'Weight type',
            value: null,
          }}
          items={[
            {label: 'kg', value: 'kg'},
            {label: 'pound', value: 'pound'},
          ]}
          onValueChange={(value) => {
            setUserInfo({
              ...userInfo,
              weight: {
                weight: userInfo?.weight?.weight,
                weight_type: value,
              },
            });
          }}
          value={userInfo?.weight?.weight_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
      </View>
    </View>
  );

  const renderPhoneNumber = ({item, index}) => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <RNPickerSelect
          placeholder={{
            label: strings.selectCode,
            value: null,
          }}
          items={[
            {label: 'Canada(+1)', value: 'Canada(+1)'},
            {label: 'United States(+1)', value: 'United States(+1)'},
          ]}
          onValueChange={(value) => {
            const tmpphoneNumbers = [...phoneNumbers];
            tmpphoneNumbers[index].country_code = value;
            setPhoneNumbers(tmpphoneNumbers);

            const filteredNumber = phoneNumbers.filter(
              (obj) =>
                ![null, undefined, ''].includes(
                  obj.phone_number && obj.country_code,
                ),
            );
            setUserInfo({
              ...userInfo,
              phone_numbers: filteredNumber.map(
                ({country_code, phone_number}) => ({
                  country_code,
                  phone_number,
                }),
              ),
            });
          }}
          value={item.country_code}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
        <View style={{...styles.halfMatchFeeView}}>
          <TextInput
            placeholder={'Phone number'}
            style={{...styles.halffeeText}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              const tempphoneNumbers = [...phoneNumbers];
              tempphoneNumbers[index].phone_number = text;
              setPhoneNumbers(tempphoneNumbers);
              const filteredNumber = phoneNumbers.filter(
                (obj) =>
                  ![null, undefined, ''].includes(
                    obj.phone_number && obj.country_code,
                  ),
              );
              setUserInfo({
                ...userInfo,
                phone_numbers: filteredNumber.map(
                  ({country_code, phone_number}) => ({
                    country_code,
                    phone_number,
                  }),
                ),
              });
            }}
            value={item.phone_number}
          />
        </View>
      </View>
    </View>
  );

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
                .then((data) => {
                  setUserInfo({...userInfo, thumbnail: data.path});
                  setProfileImageChanged(true);
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
                .then((data) => {
                  setUserInfo({...userInfo, thumbnail: data.path});
                  setProfileImageChanged(true);
                })
                .catch((e) => {
                  Alert.alert(e);
                });
            }
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
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
            Profile
          </Text>
        }
        rightComponent={
          <Text
            style={styles.headerRightButton}
            onPress={() => {
              // if (!editMode) changeEditMode();
              // else
              onSavePress();
            }}>
            Update
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

        <TCLabel title={'Name'} />

        <View style={{marginHorizontal: 15, flexDirection: 'row'}}>
          <TextInput
            placeholder={strings.fnameText}
            style={{
              ...styles.matchFeeTxt,
              flex: 1,
              marginRight: 5,
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
            }}
            onChangeText={(text) => {
              setUserInfo({...userInfo, last_name: text});
            }}
            value={userInfo.last_name}
          />
        </View>

        <View style={styles.fieldView}>
          <TCLabel title={strings.currentCity} />

          <TouchableOpacity
            onPress={() => {
              // eslint-disable-next-line no-unused-expressions

              // navigation.navigate('SearchLocationScreen', {
              //   comeFrom: 'PersonalInformationScreen',
              // });
              setLocationPopup(true);
            }}>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={{...styles.matchFeeTxt}}
              value={`${city}, ${state}, ${country}`}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLabel title={strings.slogan} style={{bottom: 5}} />
          <TCTextField
            placeholder={'Slogan'}
            onChangeText={(text) =>
              setUserInfo({...userInfo, description: text})
            }
            multiline
            maxLength={150}
            value={userInfo.description}
            height={120}
          />
        </View>

        {/* <TCThickDivider marginTop={25} marginBottom={15} />

        <View>
          <TCLabel title={strings.gender} />
          <View style={styles.staticTextView}>
            <Text style={styles.staticText}>{userInfo.gender}</Text>
          </View>
        </View>

        <View>
          <TCLabel title={strings.birthDatePlaceholder} />
          <View style={styles.staticTextView}>
            <Text style={styles.staticText}>
              {moment(userInfo?.birthday * 1000).format('MMM DD,YYYY')}
            </Text>
          </View>
        </View>

        <TCLabel title={'Height'} />
        {heightView()}

        <TCLabel title={'Weight'} />
        {weightView()}

        <TCLabel title={'Phone'} />
        <FlatList
          scrollEnabled={false}
          data={phoneNumbers}
          keyExtractor={(index) => index.toString()}
          renderItem={renderPhoneNumber}
        />

        <TCMessageButton
          title={strings.addPhone}
          width={85}
          alignSelf="center"
          marginTop={15}
          onPress={() => addPhoneNumber()}
        />

        <TCLabel title={strings.languageTitle} />
        <TouchableOpacity
          style={{...styles.searchView}}
          onPress={() => {
            // eslint-disable-next-line no-unused-expressions
            toggleModal();
          }}>
          <TextInput
            style={styles.searchTextField}
            placeholder={strings.languagePlaceholder}
            value={userInfo.language ? languagesName : ''}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        <TCLabel title={'E-mail'} />
        <TextInput
          placeholder={strings.emailPlaceHolder}
          style={{...styles.matchFeeTxt}}
          editable={false}
          value={userInfo.email}
        />

        <View>
          <TCLabel title={'Address'} />
          <TCTextField
            value={streetAddress}
            onChangeText={(text) => setStreetAddress(text)}
            placeholder={strings.addressPlaceholder}
            keyboardType={'default'}
            autoCapitalize="none"
            autoCorrect={false}
            // onFocus={() => setLocationFieldVisible(true)}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchLocationScreen', {
              comeFrom: 'PersonalInformationScreen',
            })
          }>
          <TextInput
            placeholder={strings.searchCityPlaceholder}
            placeholderTextColor={colors.userPostTimeColor}
            style={[styles.matchFeeTxt, {marginBottom: 5}]}
            value={`${city}, ${state}, ${country}`}
            editable={false}
            pointerEvents="none"></TextInput>
        </TouchableOpacity>

        <View>
          <TCTextField
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholder={strings.postalCodeText}
            keyboardType={'default'}
          />
        </View> */}
        {/* <Modal
          isVisible={isModalVisible}
          backdropColor="black"
          hasBackdrop={true}
          onBackdropPress={() => {
            setModalVisible(false);
          }}
          backdropOpacity={0}
          style={{marginLeft: 0, marginRight: 0, marginBottom: 0}}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 2,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 10,
            }}>
            <Header
              mainContainerStyle={{marginTop: 15}}
              centerComponent={
                <Text style={styles.headerCenterStyle}>{'Languages'}</Text>
              }
              rightComponent={
                <TouchableOpacity
                  hitSlop={Utility.getHitSlop(15)}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Image
                    source={images.cancelImage}
                    style={styles.cancelImageStyle}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              }
            />
            <View style={styles.sepratorStyle} />
            <View style={styles.separatorLine}></View>
            <FlatList
              data={languageData}
              keyExtractor={(index) => index.toString()}
              renderItem={renderLanguage}
              style={{marginBottom: '25%'}}
            />
            <View
              style={{
                width: '100%',
                height: '25%',
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                left: 0,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  toggleModal();
                }}>
                <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.languageApplyButton}>
                  <Text style={styles.nextButtonText}>
                    {strings.applyTitle}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
      </TCKeyboardView>
      <Modal
        onBackdropPress={() => setLocationPopup(false)}
        isVisible={locationPopup}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={[
            styles.bottomPopupContainer,
            {height: Dimensions.get('window').height - 50},
          ]}>
          <View style={styles.topHeaderContainer}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setLocationPopup(false);
              }}>
              <Image source={images.crossImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text style={styles.moreText}>Home City</Text>
          </View>
          <TCThinDivider
            width={'100%'}
            marginBottom={15}
            backgroundColor={colors.thinDividerColor}
          />
          <View style={styles.sectionStyle}>
            <TextInput
              // Indiër - For Test
              value={searchText}
              autoCorrect={false}
              spellCheck={false}
              style={styles.textInput}
              placeholder={strings.locationPlaceholderText}
              clearButtonMode="always"
              placeholderTextColor={colors.userPostTimeColor}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
          {noData && searchText?.length > 0 && (
            <Text style={styles.noDataText}>
              Please, enter at least 3 characters to see cities.
            </Text>
          )}
          {noData && searchText?.length === 0 && (
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback
                style={styles.listItem}
                onPress={() => getTeamsDataByCurrentLocation()}>
                <View>
                  <Text style={[styles.cityList, {marginBottom: 3}]}>
                    {currentLocation?.city}, {currentLocation?.state},{' '}
                    {currentLocation?.country}
                  </Text>
                  <Text style={styles.curruentLocationText}>
                    Current Location
                  </Text>

                  <TCThinDivider
                    width={'100%'}
                    backgroundColor={colors.grayBackgroundColor}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          {cityData.length > 0 && (
            <FlatList
              data={cityData}
              renderItem={renderItem}
              keyExtractor={(index) => index.toString()}
            />
          )}
        </View>
      </Modal>
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  fieldView: {
    marginBottom: 2,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: wp('46%'),
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    width: '90%',
  },
  headerRightButton: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: 52,
  },

  languageApplyButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('5%'),
    width: '90%',
  },
  languageData: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
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

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },

  searchTextField: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 12,
    paddingLeft: 15,
    width: wp('92%'),
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },
  cancelImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.lightBlackColor,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  staticTextView: {
    marginLeft: 25,
    marginTop: 15,
  },
  staticText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  topHeaderContainer: {
    height: 60,
    // justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  closeButton: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
    left: 5,
  },
  moreText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthPercentageToDP('36%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: wp('4%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.userPostTimeColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    paddingLeft: 10,
  },
  noDataText: {
    alignSelf: 'center',
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginTop: hp('1%'),

    textAlign: 'center',
    width: wp('90%'),
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.userPostTimeColor,
    fontSize: wp('3%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    marginTop: wp('0%'),
    textAlignVertical: 'center',
  },
});
