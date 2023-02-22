import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Linking,
} from 'react-native';

import Modal from 'react-native-modal';

import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import moment from 'moment';
import locationModalStyles from '../../../Constants/LocationModalStyle';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {
  approveBasicInfoRequest,
  getGroupMembersInfo,
} from '../../../api/Groups';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';

import fonts from '../../../Constants/Fonts';
import TCPhoneNumber from '../../../components/TCPhoneNumber';
import TCMessageButton from '../../../components/TCMessageButton';
import TCThickDivider from '../../../components/TCThickDivider';

import TCKeyboardView from '../../../components/TCKeyboardView';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import LocationView from '../../../components/LocationView';
import {
  getHitSlop,
  widthPercentageToDP,
  firstLetterCapital,
} from '../../../utils';
import {
  searchAddress,
  searchAddressPredictions,
  searchCityState,
  searchNearByCityState,
} from '../../../api/External';
import TCPicker from '../../../components/TCPicker';
import DataSource from '../../../Constants/DataSource';
import TCTextField from '../../../components/TCTextField';
import {
  getGeocoordinatesWithPlaceName,
  getPlaceNameFromPlaceID,
} from '../../../utils/location';
import Verbs from '../../../Constants/Verbs';

let entity = {};

export default function RequestBasicInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [memberInfo, setMemberInfo] = useState(route.params.groupObj);
  const [role, setRole] = useState('');
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  const [location, setLocation] = useState(
    memberInfo?.city
      ? `${memberInfo?.city}, ${memberInfo?.state_abbr}, ${memberInfo?.country}`
      : '',
  );
  const [setting, setSetting] = useState();

  const [noData, setNoData] = useState(false);
  const [nearbyCities, setNearbyCities] = useState([]);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
  }, []);

  useEffect(() => {
    if (searchText.length >= 3) {
      if (visibleLocationModal) {
        searchAddressPredictions(searchText)
          .then((response) => {
            console.log('search address:=>', response);
            setLocationData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        searchCityState(searchText)
          .then((response) => {
            setNoData(false);
            setCityData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    } else {
      setNoData(true);
      setCityData([]);
      setLocationData([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (isFocused) {
      getMemberInfo();
      if (
        route?.params?.city &&
        route?.params?.state &&
        route?.params?.country
      ) {
        setMemberInfo({
          ...memberInfo,
          city: route?.params?.city,
          state_abbr: route?.params?.state,
          country: route?.params?.country,
        });

        setLocation(
          `${route?.params?.city}, ${route?.params?.state}, ${route?.params?.country}`,
        );
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state,
  ]);

  useEffect(() => {
    setPhoneNumber(
      memberInfo?.phone_numbers || [
        {
          id: 0,
          phone_number: '',
          country_code: '',
        },
      ],
    );
    setMemberInfo(memberInfo);
    getAuthEntity();
  }, []);

  useEffect(() => {
    searchAddress(searchText).then((response) => {
      setLocationData(response.results);
    });
  }, [searchText]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
  }, [searchText]);

  const getMemberInfo = () => {
    setloading(true);
    getGroupMembersInfo(
      route?.params?.groupID,
      route?.params?.memberID,
      authContext,
    )
      .then((response) => {
        setMemberInfo(response?.payload);
        setSetting({
          gender: !!response?.payload?.gender,
          birthday: !!response?.payload?.birthday,
          height: !!response?.payload?.height,
          weight: !!response?.payload?.weight,
          email: !!response?.payload?.email,
          phone: !!response?.payload?.phone_numbers,
          address:
            !!response?.payload?.street_address &&
            !!response?.payload?.city &&
            !!response?.payload?.state_abbr &&
            !!response?.payload?.country &&
            !!response?.payload?.postal_code,
        });
        if (response?.payload?.phone_numbers?.length > 0) {
          setPhoneNumber(response?.payload?.phone_numbers);
        }
        if (response?.payload?.city) {
          setLocation(
            memberInfo?.city &&
              `${memberInfo?.city}, ${memberInfo?.state_abbr}, ${memberInfo?.country}`,
          );
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      country_code: '',
      phone_number: '',
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  const getAuthEntity = async () => {
    entity = authContext.entity;
    setRole(entity.role);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              editMemberBasicInfo();
            }
          }}>
          {strings.done}
        </Text>
      ),
    });
  }, [
    navigation,
    memberInfo,
    role,
    phoneNumber,
    setting,
    updateProfile,
    currentLocation,
    noData,
    cityData,
    locationData,
  ]);

  // Form Validation
  const checkValidation = () => {
    if (setting?.height && memberInfo.height) {
      if (!memberInfo.height.height_type) {
        Alert.alert('Towns Cup', 'Please select height measurement');
        return false;
      }
      if (memberInfo.height.height <= 0 || memberInfo.height.height >= 1000) {
        Alert.alert('Towns Cup', 'Please enter valid height.');
        return false;
      }
    }
    if (setting?.weight && memberInfo.weight) {
      if (!memberInfo.weight.weight_type) {
        Alert.alert('Towns Cup', 'Please select weight measurement');
        return false;
      }
      if (memberInfo.weight.weight <= 0 || memberInfo.weight.weight >= 1000) {
        Alert.alert('Towns Cup', 'Please enter valid weight.');
        return false;
      }
    }

    if (setting.phone) {
      if (memberInfo?.phone_numbers?.length <= 0) {
        Alert.alert('Towns Cup', 'Please enter phone number.');
        return false;
      }
      const filteredNumber = memberInfo?.phone_numbers?.filter(
        (obj) =>
          ![null, undefined, ''].includes(obj.phone_number && obj.country_code),
      );
      if (filteredNumber?.length <= 0) {
        Alert.alert('Towns Cup', 'Please fill all phone number parameter.');
        return false;
      }
    }
    if (
      setting.address &&
      !location &&
      memberInfo?.street_address === '' &&
      memberInfo?.postal_code === ''
    ) {
      Alert.alert('Towns Cup', 'Please enter all location parameter.');
      return false;
    }
    return true;
  };

  const editMemberBasicInfo = () => {
    const bodyParams = {...memberInfo, update_profile_info: updateProfile};

    setloading(true);

    if (setting?.height === true) {
      bodyParams.height = memberInfo?.height;
    }
    if (setting?.weight === true) {
      bodyParams.weight = memberInfo?.weight;
    }
    if (
      setting?.dominant === true &&
      authContext.entity.obj.sport === 'soccer' &&
      authContext.entity.role === 'team'
    ) {
      bodyParams.dominant = memberInfo?.dominant;
    }
    if (setting?.email === true) {
      bodyParams.email = memberInfo?.email;
    }
    if (setting?.phone === true) {
      bodyParams.phone_numbers = memberInfo?.phone_numbers;
    }
    if (setting?.address === true) {
      bodyParams.street_address = memberInfo?.street_address;
      bodyParams.city = memberInfo?.city;
      bodyParams.state_abbr = memberInfo?.state_abbr;
      bodyParams.country = memberInfo?.country;
      bodyParams.postal_code = memberInfo?.postal_code;
    }

    approveBasicInfoRequest(
      route?.params?.groupID,
      route?.params?.requestID,
      bodyParams,
      authContext,
    )
      .then(() => {
        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      numberValue={item.phone_number}
      onValueChange={(value) => {
        const tempCode = [...phoneNumber];
        tempCode[index].country_code = value;
        setPhoneNumber(tempCode);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
      onChangeText={(text) => {
        const tempPhone = [...phoneNumber];
        tempPhone[index].phone_number = text;
        setPhoneNumber(tempPhone);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
    />
  );

  const heightView = () => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView}}>
          <TextInput
            placeholder={strings.height}
            style={{...styles.halffeeText}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setMemberInfo({
                ...memberInfo,
                height: {
                  height: text,
                  height_type: memberInfo?.height?.height_type,
                },
              });
            }}
            value={memberInfo?.height?.height}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: strings.heightTypeText,
            value: null,
          }}
          items={[
            {label: 'cm', value: 'cm'},
            {label: 'ft', value: 'ft'},
          ]}
          onValueChange={(value) => {
            setMemberInfo({
              ...memberInfo,
              height: {
                height: memberInfo?.height?.height,
                height_type: value,
              },
            });
          }}
          value={memberInfo?.height?.height_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
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
    <View>
      <View
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView}}>
          <TextInput
            placeholder={strings.weight}
            style={{...styles.halffeeText}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setMemberInfo({
                ...memberInfo,
                weight: {
                  weight: text,
                  weight_type: memberInfo?.weight?.weight_type,
                },
              });
            }}
            value={memberInfo?.weight?.weight}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: strings.weightTypeText,
            value: null,
          }}
          items={[
            {label: 'kg', value: 'kg'},
            {label: 'pound', value: 'pound'},
          ]}
          onValueChange={(value) => {
            setMemberInfo({
              ...memberInfo,
              weight: {
                weight: memberInfo?.weight?.weight,
                weight_type: value,
              },
            });
          }}
          value={memberInfo?.weight?.weight_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
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

  const locationString = () => {
    let str = '';
    if (memberInfo.city) {
      str += `${memberInfo.city}, `;
    }
    if (memberInfo.state_abbr) {
      str += `${memberInfo.state_abbr}, `;
    }
    if (memberInfo.country) {
      str += `${memberInfo.country}, `;
    }
    return str;
  };

  const toggleCityModal = () => {
    if (!visibleCityModal) {
      setloading(true);
      setUserDeniedLocPerm(false);
      setSearchText('');
      setCityData([]);
      getGeocoordinatesWithPlaceName(Platform.OS)
        .then((_location) => {
          setLocationFetch(true);
          if (_location.position) {
            setCurrentLocation(_location);
            getNearbyCityData(
              _location.position.coords.latitude,
              _location.position.coords.longitude,
              100,
            );
          } else {
            setloading(false);
            setCurrentLocation(null);
            setVisibleCityModal(!visibleCityModal);
          }
        })
        .catch((e) => {
          setloading(false);
          setLocationFetch(true);
          if (e.name === Verbs.gpsErrorDeined) {
            setCurrentLocation(null);
            setUserDeniedLocPerm(true);
          } else {
            setTimeout(() => {
              Alert.alert(
                strings.alertmessagetitle,
                `${e.message}(Location fetch`,
              );
            }, 10);
          }
          setVisibleCityModal(!visibleCityModal);
        });
    } else {
      setVisibleCityModal(!visibleCityModal);
    }
  };

  const getNearbyCityData = (lat, long, radius) => {
    searchNearByCityState(radius, lat, long)
      .then((response) => {
        const list = response.filter(
          (obj) =>
            !(
              obj.city === currentLocation?.city &&
              obj.country === currentLocation?.country
            ),
        );
        setNearbyCities(list);
        setloading(false);
        setVisibleCityModal(!visibleCityModal);
      })
      .catch((e) => {
        setloading(false);
        setNearbyCities([]);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `${e.message}(getNearbyCityData),${lat},${long},${radius}`,
          );
        }, 10);
        setVisibleCityModal(!visibleCityModal);
      });
  };
  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        const pCode = item.address_components.filter((obj) =>
          obj.types.some((p) => p === 'postal_code'),
        );

        setMemberInfo({
          ...memberInfo,
          postal_code: pCode.length && pCode[0].long_name,
        });
        setLocation(item.formatted_address);
        setVisibleLocationModal(false);
      }}>
      <Text style={styles.cityList}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

  const renderAdressItem = ({item}) => (
    <Pressable onPress={() => onSelectAddress(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const onSelectAddress = async (item) => {
    setloading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setloading(false);
      if (_location) {
        setMemberInfo({
          ...memberInfo,
          city: _location.city,
          state_abbr: _location.state,
          country: _location.country,
          postal_code: _location.postalCode,
          street_address: _location.address,
        });
      }
      setVisibleLocationModal(false);
    });
  };

  const onSelectCurrentLocation = async () => {
    setMemberInfo({
      ...memberInfo,
      city: currentLocation.city,
      state_abbr: currentLocation.state,
      country: currentLocation.country,
    });

    toggleCityModal();
  };

  const onSelectNoCurrentLocation = async () => {
    if (userDeniedLocPerm) {
      Alert.alert(
        strings.locationSettingTitleText,
        strings.locationSettingText,
        [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.settingsTitleText,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(strings.noGpsErrorMsg, '', [
        {
          text: strings.OkText,
          style: 'cancel',
        },
      ]);
    }
  };

  const onSelectNearByLocation = async (item) => {
    setMemberInfo({
      ...memberInfo,
      city: item.city,
      state_abbr: item.state,
      country: item.country,
    });

    toggleCityModal();
  };

  const renderCurrentLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        onSelectNearByLocation(item);
      }}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>
          {[item.city, item.state, item.country].filter((v) => v).join(', ')}
        </Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocation = () => {
    let renderData;
    if (currentLocation && currentLocation.city) {
      renderData = (
        <Pressable onPress={() => onSelectCurrentLocation()}>
          <View style={locationModalStyles.listItemCurrentLocation}>
            <Text style={locationModalStyles.cityText}>
              {[
                currentLocation?.city,
                currentLocation?.state,
                currentLocation?.country,
              ]
                .filter((v) => v)
                .join(', ')}
            </Text>
            <Text style={locationModalStyles.curruentLocationText}>
              {strings.currentLocationText}
            </Text>
          </View>
          <View style={locationModalStyles.itemSeprater} />
        </Pressable>
      );
    } else {
      renderData = <View />;
    }
    return renderData;
  };

  return (
    <>
      <TCKeyboardView>
        <ActivityLoader visible={loading} />
        <View>
          <Text style={styles.basicInfoText}>
            {format(
              strings.basicInfoRequestText,
              route.params.groupObj?.group_name,
            )}
          </Text>
          <TCThickDivider />
        </View>

        <View>
          <View>
            <View style={styles.checkBoxContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSetting({
                    ...setting,
                    gender: !setting?.gender,
                  });
                }}>
                <Image
                  source={
                    setting?.gender === true
                      ? images.orangeCheckBox
                      : images.uncheckWhite
                  }
                  style={{height: 22, width: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <Text style={styles.checkBoxText}>{strings.gender}</Text>
            </View>
            <View style={{marginLeft: 50}}>
              <Text style={styles.fixedText}>
                {firstLetterCapital(memberInfo.gender)}
              </Text>
            </View>
          </View>
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setSetting({
                  ...setting,
                  birthday: !setting?.birthday,
                });
              }}>
              <Image
                source={
                  setting?.birthday === true
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxText}>
              {strings.birthDatePlaceholder}
            </Text>
          </View>
          <View style={{marginLeft: 50}}>
            <Text style={styles.fixedText}>
              {moment(memberInfo.birthday).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>

        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                height: !setting?.height,
              });
            }}>
            <Image
              source={
                setting?.height === true
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>{strings.height}</Text>
        </View>
        {heightView()}

        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                weight: !setting?.weight,
              });
            }}>
            <Image
              source={
                setting?.weight ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>{strings.weight}</Text>
        </View>
        {weightView()}

        {authContext.entity.obj.sport === 'soccer' &&
          authContext.entity.role === 'team' && (
            <View>
              <View style={styles.checkBoxContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSetting({
                      ...setting,
                      dominant: !setting?.dominant,
                    });
                  }}>
                  <Image
                    source={
                      setting?.dominant
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <Text style={styles.checkBoxText}>{strings.dominantFoot}</Text>
              </View>
              <TCPicker
                dataSource={DataSource.dominantFoot}
                placeholder={strings.dominantPlaceholder}
                value={memberInfo.dominant}
                onValueChange={(value) => {
                  setMemberInfo({...memberInfo, dominant: value});
                }}
              />
            </View>
          )}

        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                email: !setting?.email,
              });
            }}>
            <Image
              source={
                setting?.email === true
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>{strings.email}</Text>
        </View>
        <TCTextField
          value={memberInfo.email}
          onChangeText={(text) => setMemberInfo({...memberInfo, email: text})}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={strings.email}
        />
        <View>
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setSetting({
                  ...setting,
                  phone: !setting?.phone,
                });
              }}>
              <Image
                source={
                  setting?.phone ? images.orangeCheckBox : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxText}>{strings.phone}</Text>
          </View>
          <FlatList
            data={phoneNumber}
            renderItem={renderPhoneNumber}
            keyExtractor={(item, index) => index.toString()}
            // style={styles.flateListStyle}
          />
        </View>
        <TCMessageButton
          borderColor={colors.whiteColor}
          color={colors.lightBlackColor}
          title={strings.addPhone}
          width={120}
          alignSelf="center"
          marginTop={15}
          onPress={() => addPhoneNumber()}
        />
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                address: !setting?.address,
              });
            }}>
            <Image
              source={
                setting?.address ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>{strings.address}</Text>
        </View>

        <LocationView
          showTitle={false}
          onPressVisibleLocationPopup={() => setVisibleLocationModal(true)}
          onChangeLocationText={(text) =>
            setMemberInfo({...memberInfo, street_address: text})
          }
          locationText={memberInfo.street_address}
          onChangePostalCodeText={(text) =>
            setMemberInfo({...memberInfo, postal_code: text})
          }
          postalCodeText={memberInfo.postal_code}
          locationString={locationString()}
          onPressCityPopup={() => toggleCityModal()}
        />

        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setUpdateProfile(!updateProfile);
            }}>
            <Image
              source={
                updateProfile ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.updateProfile}>{strings.updateMyProfile}</Text>
        </View>

        <View style={{marginBottom: 20}} />
      </TCKeyboardView>

      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => setVisibleLocationModal(false)}
        onRequestClose={() => setVisibleLocationModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.address}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleLocationModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.searchForAddress}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {searchText.length < 3 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.threeCharToSeeAddress}
              </Text>
            )}

            {locationData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={locationData}
                renderItem={renderAdressItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => setVisibleCityModal(false)}
        onRequestClose={() => setVisibleCityModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.cityStateCountryTitle}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleCityModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {searchText.length < 3 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.threeCharToSeeAddress}
              </Text>
            )}
            {noData &&
              searchText.length === 0 &&
              nearbyCities.length >= 0 &&
              cityData.length === 0 && (
                <FlatList
                  style={[
                    locationModalStyles.nearbycitiesflatlist,
                    {marginTop: 25},
                  ]}
                  data={nearbyCities}
                  renderItem={renderCurrentLocationItem}
                  ListHeaderComponent={renderCurrentLocation}
                  keyExtractor={(index) => index.toString()}
                  onScroll={Keyboard.dismiss}
                />
              )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <Pressable
                  style={styles.noLocationViewStyle}
                  onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={locationModalStyles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                  </View>
                  <View style={locationModalStyles.itemSeprater} />
                  <Text
                    style={[
                      locationModalStyles.currentLocationTextStyle,
                      {marginTop: 15},
                    ]}>
                    {strings.noLocationText}
                  </Text>
                </Pressable>
              )}
            {cityData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={cityData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  basicInfoText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
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
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrey,
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

  checkBoxText: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  updateProfile: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },

  listItem: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('10%'),
    width: widthPercentageToDP('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: widthPercentageToDP('70%'),
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },
  fixedText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
