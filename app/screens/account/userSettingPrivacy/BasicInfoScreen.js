/* eslint-disable no-nested-ternary */
/* eslint-disable default-case */
import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';

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
import TCTextField from '../../../components/TCTextField';
import uploadImages from '../../../utils/imageAction';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';

import TCCountryCodeModal from '../../../components/TCCountryCodeModal';
import {heightMesurement, weightMesurement} from '../../../utils/constant';

import AddressLocationModal from '../../../components/AddressLocationModal/AddressLocationModal';

export default function BasicInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [visibleAddressModal, setVisibleAddressModal] = useState(false);

  // For activity indigator
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj);
  const [profileImageChanged, setProfileImageChanged] = useState(false);

  const [streetAddress, setStreetAddress] = useState(
    authContext.entity.obj?.street_address,
  );

  const [stateFull, setStateFull] = useState();

  const [city, setCity] = useState(
    route?.params?.city ? route?.params?.city : authContext.entity.obj?.city,
  );
  const [state, setState] = useState(
    route?.params?.state
      ? route?.params?.state
      : authContext.entity.obj?.state_abbr,
  );
  const [country, setCountry] = useState(
    route?.params?.country
      ? route?.params?.country
      : authContext.entity.obj?.country,
  );
  const [postalCode, setPostalCode] = useState(
    authContext.entity.obj?.postal_code,
  );

  const [phoneNumbers, setPhoneNumbers] = useState(
    authContext.entity.obj?.phone_numbers?.length > 0
      ? authContext.entity.obj.phone_numbers
      : [
          {
            id: 0,
            phone_number: '',
            country_code: '',
          },
        ],
  );

  const [countryCodeVisible, setCountryCodeVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [
    navigation,
    phoneNumbers,
    userInfo,
    city,
    state,
    country,
    postalCode,
    streetAddress,
  ]);

  // Form Validation
  const checkValidation = () => {
    if (userInfo.email) {
      if (!Utility.validateEmail(userInfo.email)) {
        Alert.alert(strings.appName, strings.validEmailValidation);
        return false;
      }
    }
    if (userInfo.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      return false;
    }
    if (userInfo.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
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

    if (
      userInfo.phone_numbers &&
      userInfo.phone_numbers[0]?.phone_number.length < 10
    ) {
      Alert.alert(strings.appName, strings.phoneNumberValidation);
      return false;
    }
    if (
      userInfo.phone_numbers &&
      !userInfo.phone_numbers[0]?.country_code.length
    ) {
      Alert.alert(strings.appName, strings.phoneCodeValidation);
      return false;
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

      bodyParams.address_city = city;
      bodyParams.address_state_abbr = state;
      bodyParams.address_country = country;
      bodyParams.street_address = streetAddress;
      bodyParams.address_postal_code = postalCode;
      bodyParams.address_state = stateFull;

      bodyParams.description = userInfo.description;
      bodyParams.height = userInfo.height;
      bodyParams.weight = userInfo.weight;

      if (userInfo.language) {
        bodyParams.language = userInfo.language;
      }
      if (phoneNumbers) {
        bodyParams.phone_numbers = userInfo.phone_numbers;
        bodyParams.country_code = userInfo.country_code;
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
        <View
          style={{
            ...styles.halfMatchFeeView,
            backgroundColor: colors.textFieldBackground,
          }}>
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
            label: strings.heightTypeText,
            value: null,
          }}
          items={heightMesurement}
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
              backgroundColor: colors.textFieldBackground,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.textFieldBackground,
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
        <View
          style={{
            ...styles.halfMatchFeeView,
            backgroundColor: colors.textFieldBackground,
          }}>
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
            label: strings.weightTypeText,
            value: null,
          }}
          items={weightMesurement}
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
              backgroundColor: colors.textFieldBackground,
              borderRadius: 5,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.textFieldBackground,
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

  const onSelectAddress = (_location) => {
    setStateFull(_location.state_full);
    setCity(_location.city);
    setState(_location.state);
    setCountry(_location.country);

    setStreetAddress(_location.formattedAddress);
  };

  const setCityandPostal = (street, code) => {
    console.log();
    setPostalCode(code);
    setStreetAddress(
      [street, city, state, country, code].filter((w) => w).join(', '),
    );
  };

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
        <Pressable
          onPress={() => {
            setCountryCodeVisible(true);
          }}>
          <View style={styles.codeContainer}>
            <Text
              style={{
                color:
                  selectedCountryCode || item.country_code
                    ? colors.lightBlackColor
                    : colors.grayColor,
              }}>
              {selectedCountryCode
                ? `${`(+${selectedCountryCode.code})`}`
                : item.country_code
                ? `${`(+${item.country_code})`}`
                : strings.countryCode}
            </Text>
          </View>
        </Pressable>

        <View
          style={{
            ...styles.halfMatchFeeView,
            backgroundColor: colors.textFieldBackground,
          }}>
          <TextInput
            placeholder={strings.phoneNumber}
            maxLength={10}
            style={{
              ...styles.halffeeText,
            }}
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

  return (
    <>
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
            {strings.basicinfotitle}
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

        <View>
          <TCLabel title={strings.gender} />
          <View style={styles.staticTextView}>
            <Text style={styles.staticText}>
              {userInfo.gender.charAt(0).toUpperCase() +
                userInfo.gender.slice(1)}
            </Text>
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

        <TCLabel title={strings.height} />
        {heightView()}

        <TCLabel title={strings.weight} />
        {weightView()}

        <TCLabel title={strings.phone} />
        <FlatList
          scrollEnabled={false}
          data={phoneNumbers}
          keyExtractor={(index) => index.toString()}
          renderItem={renderPhoneNumber}
        />

        <TouchableOpacity
          onPress={() => {
            setVisibleAddressModal(true);
          }}>
          <View>
            <TCLabel
              title={strings.address.toUpperCase()}
              style={{marginBottom: 12}}
            />
            <TCTextField
              value={streetAddress}
              // onChangeText={onChangeLocationText}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={strings.streetAddress}
              pointerEvents="none"
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <AddressLocationModal
          visibleLocationModal={visibleAddressModal}
          setVisibleAddressModalhandler={() => setVisibleAddressModal(false)}
          onAddressSelect={onSelectAddress}
          handleSetLocationOptions={onSelectAddress}
          onDonePress={(street, code) => setCityandPostal(street, code)}
        />

        <View style={{paddingBottom: 20}} />

        <TCCountryCodeModal
          countryCodeVisible={countryCodeVisible}
          onCloseModal={() => {
            setCountryCodeVisible(false);
          }}
          countryCodeObj={(obj) => {
            setSelectedCountryCode(obj);
            setCountryCodeVisible(false);

            const tmpphoneNumbers = [...phoneNumbers];
            tmpphoneNumbers[0].country_code = obj.code;
            setPhoneNumbers(tmpphoneNumbers);

            const filteredNumber = phoneNumbers.filter(
              (o) =>
                ![null, undefined, ''].includes(
                  o.phone_number && o.country_code,
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
        />
      </TCKeyboardView>
    </>
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
    width: 100,
    textAlign: 'right',
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
  staticTextView: {
    marginLeft: 25,
    marginTop: 15,
  },
  staticText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  codeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: wp('45%'),
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
});
