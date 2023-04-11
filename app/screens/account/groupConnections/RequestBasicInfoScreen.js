/* eslint-disable  no-unused-vars */
/* eslint-disable  no-else-return */

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
  TouchableWithoutFeedback,
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import moment from 'moment';
import {heightMesurement, weightMesurement} from '../../../utils/constant';
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

import TCPicker from '../../../components/TCPicker';
import DataSource from '../../../Constants/DataSource';
import TCTextField from '../../../components/TCTextField';

import AddressLocationModal from '../../../components/AddressLocationModal/AddressLocationModal';

let entity = {};

export default function RequestBasicInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [memberInfo, setMemberInfo] = useState(
    {
      height: {
        height: 0,
        height_type: 'ft',
      },
      weight: {
        weight: 0,
        weight_type: 'lb',
      },
    },
    route.params.groupObj,
  );
  const [role, setRole] = useState('');

  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  const [postalCode, setPostalCode] = useState('');

  const [setting, setSetting] = useState();
  const [location, setLocation] = useState('');
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
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
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, memberInfo, role, phoneNumber, setting, updateProfile]);

  // Form Validation
  const checkValidation = () => {
    if (setting.address && location === undefined) {
      Alert.alert('Towns Cup', 'Please enter all location parameter.');
      return false;
    }

    if (setting?.weight && memberInfo.weight !== null) {
      if (!memberInfo.weight?.weight_type) {
        Alert.alert('Towns Cup', 'Please select weight measurement');
        return false;
      } else if (
        memberInfo.weight.weight <= 0 ||
        memberInfo.weight.weight >= 1000 ||
        memberInfo.weight.weight === undefined
      ) {
        Alert.alert('Towns Cup', 'Please enter valid weight.');
        return false;
      }
    }

    if (setting?.height && memberInfo.height !== null) {
      if (!memberInfo.height?.height_type) {
        Alert.alert('Towns Cup', 'Please select height measurement');
        return false;
      } else if (
        memberInfo.height.height <= 0 ||
        memberInfo.height.height >= 1000 ||
        memberInfo.height.height === undefined
      ) {
        Alert.alert('Towns Cup', 'Please enter valid height.');
        return false;
      }
    }

    if (setting.phone) {
      if (memberInfo?.phone_numbers?.length == null) {
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
    return true;
  };

  const editMemberBasicInfo = () => {
    const bodyParams = {...memberInfo, update_profile_info: updateProfile};

    setloading(true);

    if (setting?.height === true) {
      bodyParams.height = memberInfo?.height;
    }
    if (setting?.birthday === true) {
      bodyParams.birthday = moment(memberInfo.birthday).format('MMM DD, YYYY');
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
      bodyParams.city = city;
      bodyParams.state_abbr = state;
      bodyParams.country = country;
      bodyParams.postal_code = postalCode;
    }

    approveBasicInfoRequest(
      route?.params?.groupID,
      route?.params?.requestID,
      bodyParams,
      authContext,
    )
      .then(() => {
        setloading(false);

        Alert.alert('The basic info items were  sent', '', [
          {
            text: strings.okTitleText,
            style: 'default',
            onPress: () => navigation.goBack(),
          },
        ]);
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
        pointerEvents={setting?.height ? 'auto' : 'none'}
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 25,
          opacity: setting?.height ? 1 : 0.5,
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
                  height_type:
                    memberInfo?.height?.height_type === undefined
                      ? heightMesurement[1].value
                      : memberInfo?.height?.height_type,
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
          items={heightMesurement}
          value={'ft'}
          onValueChange={(value) => {
            setMemberInfo({
              ...memberInfo,
              height: {
                height: memberInfo?.height?.height,
                height_type: value,
              },
            });
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            placeholder: {
              color: colors.blackColor,
            },
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
              textAlign: 'center',
              height: 40,
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
              textAlign: 'center',
              height: 40,
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
        pointerEvents={setting?.weight ? 'auto' : 'none'}
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 27,
          opacity: setting?.weight ? 1 : 0.5,
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
                  weight_type:
                    memberInfo?.weight?.weight === undefined
                      ? weightMesurement[1].value
                      : memberInfo?.weight?.weight_type,
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
          items={weightMesurement}
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
            placeholder: {
              color: colors.blackColor,
            },
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
              textAlign: 'center',
              height: 40,
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
              textAlign: 'center',
              height: 40,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
      </View>
    </View>
  );

  const locationString = () =>
    [location, city, state, country, postalCode].filter((v) => v).join(', ');

  const addressManualString = () =>
    [location, city, state, country, postalCode].filter((w) => w).join(', ');

  const onSelectAddress = (_location) => {
    setCity(_location.city);
    setState(_location.state);
    setCountry(_location.country);
    setPostalCode(_location.postalCode);
    setLocation(_location.formattedAddress);

    memberInfo.street_address = _location.formattedAddress;
  };

  const setCityandPostal = (street, code) => {
    // setCity(street);
    setPostalCode(code);
    setLocation(street);

    memberInfo.street_address = `${street} ${city} ${state} ${country} ${code} `;
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

        <View
          style={{
            marginTop: 25,
          }}>
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
              <Text style={[styles.fixedText, {textTransform: 'capitalize'}]}>
                {memberInfo.gender}
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
        <View
          style={{
            opacity: setting?.email ? 1 : 0.5,
          }}
          pointerEvents={setting?.email ? 'auto' : 'none'}>
          <TCTextField
            value={memberInfo.email}
            style={{
              marginTop: 12,
              marginBottom: 27,
            }}
            onChangeText={(text) => setMemberInfo({...memberInfo, email: text})}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={strings.email}
          />
        </View>

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
          <View
            pointerEvents={setting?.phone ? 'auto' : 'none'}
            style={{
              opacity: setting?.phone ? 1 : 0.5,
            }}>
            <FlatList
              style={{
                marginTop: 10,
              }}
              data={phoneNumber}
              renderItem={renderPhoneNumber}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <TCMessageButton
            borderColor={colors.whiteColor}
            color={colors.lightBlackColor}
            title={strings.addPhone}
            backgroundColor={colors.lightGrey}
            paddingVertical={5}
            width={120}
            alignSelf="center"
            marginTop={20}
            marginBottom={25}
            onPress={() => addPhoneNumber()}
          />
        </View>
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
        <TouchableOpacity
          disabled={setting?.address ? false : true}
          style={{
            opacity: setting?.address ? 1 : 0.5,
          }}
          onPress={() => {
            setVisibleLocationModal(true);
          }}>
          <TCTextField
            value={
              locationString() ||
              addressManualString() ||
              memberInfo?.street_address
            }
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={strings.streetAddress}
            pointerEvents="none"
            editable={false}
            style={{
              marginTop: 10,
              marginBottom: 27,
            }}
          />
        </TouchableOpacity>

        <AddressLocationModal
          visibleLocationModal={visibleLocationModal}
          setVisibleAddressModalhandler={() => setVisibleLocationModal(false)}
          onAddressSelect={onSelectAddress}
          handleSetLocationOptions={onSelectAddress}
          onDonePress={(street, code) => {
            setCityandPostal(street, code);
          }}
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

        <TouchableOpacity
          onPress={() => {
            if (checkValidation()) {
              editMemberBasicInfo();
            }
          }}
          style={{
            width: 345,
            borderRadius: 25,
            height: 41,
            backgroundColor: colors.orangeColor,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 31,
          }}>
          <Text
            style={{
              fontFamily: fonts.RBold,
              lineHeight: 24,
              fontSize: 16,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            Update
          </Text>
        </TouchableOpacity>

        <View style={{marginBottom: 20}} />
      </TCKeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  basicInfoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 8,
    lineHeight: 24,
    paddingVertical: 20,
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
    height: 40,
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    width: '90%',
  },

  checkBoxText: {
    marginLeft: 15,
    fontFamily: fonts.RBold,
    fontSize: 16,
    textTransform: 'uppercase',
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

    marginLeft: 15,
  },

  fixedText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 8,
    marginBottom: 27,
    lineHeight: 24,
  },
  backArrowStyle: {
    height: 22,
    marginLeft: 10,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
