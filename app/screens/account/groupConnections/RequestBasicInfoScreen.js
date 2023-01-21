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
  Dimensions,
  Keyboard,
} from 'react-native';

import Modal from 'react-native-modal';

import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
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

import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCKeyboardView from '../../../components/TCKeyboardView';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import LocationView from '../../../components/LocationView';
import {
  getHitSlop,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';
import {searchAddress, searchCityState} from '../../../api/External';

let entity = {};

export default function RequestBasicInfoScreen({navigation, route}) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [loading, setloading] = useState(false);
  const [memberInfo, setMemberInfo] = useState(route.params.groupObj);
  const [show, setShow] = useState(false);
  const [role, setRole] = useState('');
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

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
  console.log('memberInfo11', memberInfo);

  const [location, setLocation] = useState(
    memberInfo?.city
      ? `${memberInfo?.city}, ${memberInfo?.state_abbr}, ${memberInfo?.country}`
      : '',
  );
  const [setting, setSetting] = useState();

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);

    console.log('Min date', mindate);
    console.log('Max date', maxdate);
  }, []);

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
      console.log('search address:=>', response);
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
        console.log('PROFILE RESPONSE11::', response.payload);
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
  }, [navigation, memberInfo, role, phoneNumber, show, setting]);

  // Form Validation
  const checkValidation = () => {
    if (setting.birthday && memberInfo?.birthday === '') {
      Alert.alert('Towns Cup', 'Please fill birthday.');
      return false;
    }

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
      console.log('filteredNumber', filteredNumber);
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
    setloading(true);
    const bodyParams = {};
    bodyParams.gender = memberInfo?.gender;
    if (setting?.birthday === true) {
      bodyParams.birthday = memberInfo?.birthday;
    }
    if (setting?.height === true) {
      bodyParams.height = memberInfo?.height;
    }
    if (setting?.weight === true) {
      bodyParams.weight = memberInfo?.weight;
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
  const handleDonePress = (date) => {
    setShow(!show);
    if (date !== '') {
      setMemberInfo({
        ...memberInfo,
        birthday: Number((new Date(date).getTime() / 1000).toFixed(0)),
      });
    }
  };
  const handleCancelPress = () => {
    setShow(!show);
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
  const shadowStyle = {
    elevation: 3,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
  };
  const heightView = () => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView, ...shadowStyle}}>
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
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
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
              ...shadowStyle,
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
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView, ...shadowStyle}}>
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
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
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
              ...shadowStyle,
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

  const renderCityStateCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMemberInfo({
          ...memberInfo,
          city: item?.terms?.[0]?.value ?? '',
          state_abbr: item?.terms?.[1]?.value ?? '',
          country: item?.terms?.[2]?.value ?? '',
        });
        setVisibleCityModal(false);
        setCityData([]);
        setLocationData([]);
      }}>
      <Text style={styles.cityList}>{item.description}</Text>
    </TouchableOpacity>
  );

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
          <TCTouchableLabel
            title={
              memberInfo?.birthday &&
              `${`${
                monthNames[new Date(memberInfo?.birthday * 1000).getMonth()]
              } ${new Date(
                memberInfo?.birthday * 1000,
              ).getDate()}`}, ${new Date(
                memberInfo?.birthday * 1000,
              ).getFullYear()}`
            }
            placeholder={strings.birthDatePlaceholder}
            onPress={() => setShow(!show)}
          />
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
            <Text style={styles.checkBoxText}>{strings.Phone}</Text>
          </View>
          <FlatList
            data={phoneNumber}
            renderItem={renderPhoneNumber}
            keyExtractor={(item, index) => index.toString()}
            // style={styles.flateListStyle}
          />
        </View>
        <TCMessageButton
          color={colors.grayColor}
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
        {/* <View>
        <TCTextField
          value={memberInfo?.street_address}
          onChangeText={(text) =>
            setMemberInfo({...memberInfo, street_address: text})
          }
          placeholder={strings.addressPlaceholder}
          keyboardType={'default'}
        />
      </View> */}

        {/* <TouchableOpacity
        onPress={() =>
          navigation.navigate('SearchLocationScreen', {
            comeFrom: 'RequestBasicInfoScreen',
          })
        }>
        <TextInput
          placeholder={strings.searchCityPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
          style={[styles.matchFeeTxt, {marginBottom: 5}]}
          value={location}
          editable={false}
          pointerEvents="none"></TextInput>
      </TouchableOpacity>

      <TCTextField
        value={memberInfo?.postal_code}
        onChangeText={(text) =>
          setMemberInfo({...memberInfo, postal_code: text})
        }
        placeholder={strings.postalCodeText}
        keyboardType={'default'}
      /> */}

        <LocationView
          showTitle={false}
          onPressVisibleLocationPopup={() => setVisibleLocationModal(true)}
          onChangeLocationText={(text) => setLocation(text)}
          locationText={location}
          onChangePostalCodeText={(text) => {
            setMemberInfo({...memberInfo, postal_code: text});
          }}
          postalCodeText={memberInfo.postal_code}
          locationString={locationString()}
          onPressCityPopup={() => setVisibleCityModal(true)}
        />

        <View style={{marginBottom: 20}} />

        {show && (
          <View>
            <DateTimePickerView
              visible={show}
              date={new Date()}
              onDone={handleDonePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={maxDateValue}
              maximumDate={minDateValue}
              mode={'date'}
            />
          </View>
        )}
      </TCKeyboardView>
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.15,
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
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setVisibleLocationModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.addressSearchPlaceHolder}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {locationData.length > 0 && (
              <FlatList
                data={locationData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.15,
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
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setVisibleCityModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.cityPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={(cityData || []).filter((obj) => obj.terms.length === 3)}
              renderItem={renderCityStateCountryItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Keyboard.dismiss}
            />
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

  checkBoxText: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  fieldView: {
    marginTop: 15,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  searchImg: {
    alignSelf: 'center',
    height: heightPercentageToDP('4%'),

    resizeMode: 'contain',
    width: widthPercentageToDP('4%'),
    tintColor: colors.lightBlackColor,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
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
});
