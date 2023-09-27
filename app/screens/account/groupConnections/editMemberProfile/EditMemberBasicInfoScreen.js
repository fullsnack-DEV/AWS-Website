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
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';

import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';

import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {patchMember, sendBasicInfoRequest} from '../../../../api/Groups';
import {strings} from '../../../../../Localization/translation';
import images from '../../../../Constants/ImagePath';
import * as Utility from '../../../../utils/index';

import fonts from '../../../../Constants/Fonts';
import TCPicker from '../../../../components/TCPicker';
import TCLabel from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';

import TCMessageButton from '../../../../components/TCMessageButton';
import TCThickDivider from '../../../../components/TCThickDivider';

import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import AuthContext from '../../../../auth/context';
import DataSource from '../../../../Constants/DataSource';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
import {
  heightMesurement,
  monthNames,
  weightMesurement,
} from '../../../../utils/constant';
import AddressLocationModal from '../../../../components/AddressLocationModal/AddressLocationModal';

import TCPhoneNumber from '../../../../components/TCPhoneNumber';

let entity = {};

export default function EditMemberBasicInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [showDate, setShowDate] = useState(false);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [date, setDate] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [maxDateValue] = useState(new Date());

  const [phoneNumber, setPhoneNumber] = useState([]);

  const [memberInfo, setMemberInfo] = useState({
    height: {
      height: 0,
      height_type: 'ft',
    },
    weight: {
      weight: 0,
      weight_type: 'lb',
    },
  });

  const [countrycode, setCountryCode] = useState();
  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
  }, []);

  useEffect(() => {
    const selectedCountryItem = Utility.countryCode.find(
      (item) =>
        item.name.toLowerCase() === authContext.user.country.toLowerCase(),
    );

    let dialCode = selectedCountryItem.dial_code;

    if (dialCode.startsWith('+')) {
      dialCode = dialCode.substring(1);
    }

    const countryOBJ = {
      country: selectedCountryItem.name,
      code: dialCode,
      iso: selectedCountryItem.code,
    };

    setCountryCode(countryOBJ);
  }, []);

  useEffect(() => {
    setPhoneNumber(
      route.params.memberInfo.phone_numbers.length === 0
        ? [
            {
              id: 0,
              phone_number: {},
              country_code: countrycode,
            },
          ]
        : route.params.memberInfo.phone_numbers,
    );

    const getAuthEntity = async () => {
      entity = authContext.entity;
      setRole(entity.role);
    };
    setMemberInfo(route.params.memberInfo);

    if (route.params.memberInfo.birthday === undefined) {
      setDate(new Date());
    } else {
      setDate(new Date(route.params.memberInfo.birthday));
    }

    setCity(route.params.memberInfo?.city);
    setCountry(route.params.memberInfo?.coutry);
    setState(route.params.memberInfo?.state);
    setLocation(route.params.memberInfo?.mail_street_address);

    getAuthEntity();
  }, [route.params.memberInfo, authContext, countrycode]);

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      country_code: countrycode,
      phone_number: {},
    };
    setPhoneNumber([...phoneNumber, obj]);
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
          {strings.save}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, memberInfo, role, phoneNumber, showDate]);

  // Form Validation
  const checkValidation = () => {
    if (memberInfo.email) {
      if (!Utility.validateEmail(memberInfo.email)) {
        Alert.alert(strings.appName, strings.validEmailValidation);
        return false;
      }
    }
    if (memberInfo.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      return false;
    }
    if (memberInfo.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      return false;
    }
    if (memberInfo.city && memberInfo.state_abbr && memberInfo.country === '') {
      Alert.alert(strings.appName, strings.locationvalidation);
      return false;
    }

    if (memberInfo.height) {
      if (
        memberInfo.height.height_type === undefined &&
        memberInfo.height !== ''
      ) {
        memberInfo.height.height_type = 'ft';
      }

      if (!memberInfo.height.height_type) {
        Alert.alert(strings.appName, strings.heightValidation);
        return false;
      }
      if (memberInfo.height.height < 0 || memberInfo.height.height >= 1000) {
        Alert.alert(strings.appName, strings.validHeightValidation);
        return false;
      }
    }

    if (memberInfo.weight) {
      if (
        memberInfo.weight.weight_type === undefined &&
        memberInfo.weight !== ''
      ) {
        memberInfo.weight.weight_type = 'lb';
      }

      if (!memberInfo.weight.weight_type) {
        Alert.alert(strings.appName, strings.weightValidation);
        return false;
      }
      if (memberInfo.weight.weight < 0 || memberInfo.weight.weight >= 1000) {
        Alert.alert(strings.appName, strings.validWeightValidation);
        return false;
      }
    }

    return true;
  };

  const editMemberBasicInfo = () => {
    setloading(true);

    const bodyParams = {...memberInfo};

    bodyParams.last_updatedBy = `${authContext.user?.full_name}`;
    delete bodyParams.group;

    const hasEmptyPhoneNumber = bodyParams.phone_numbers.some(
      (entry) => Object.keys(entry.phone_number).length === 0,
    );

    if (hasEmptyPhoneNumber) {
      bodyParams.phone_numbers = [];
    }

    patchMember(entity?.uid, memberInfo?.user_id, bodyParams, authContext)
      .then((response) => {
        if (response.status) {
          setloading(false);
          navigation.goBack();
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const handleDonePress = (dates) => {
    setShowDate(!showDate);
    setDate(dates);

    if (dates !== '') {
      setMemberInfo({...memberInfo, birthday: new Date(dates).getTime()});
    }
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      from={!(phoneNumber.length > 1)}
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
        <View style={{...styles.halfMatchFeeView, height: 40}}>
          <TextInput
            placeholder={strings.height}
            style={{...styles.halffeeText}}
            keyboardType={'decimal-pad'}
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
          items={heightMesurement}
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
            placeholder: {
              color: colors.userPostTimeColor,
            },
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
              textAlign: 'center',
            },
            inputAndroid: {
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: widthPercentageToDP('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.textFieldBackground,
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
        style={{
          flexDirection: 'row',
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView, height: 40}}>
          <TextInput
            placeholder={strings.weight}
            style={{...styles.halffeeText}}
            keyboardType={'decimal-pad'}
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
              color: colors.userPostTimeColor,
            },
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              backgroundColor: colors.lightGrey,
              borderRadius: 5,
              textAlign: 'center',
            },
            inputAndroid: {
              fontSize: widthPercentageToDP('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: widthPercentageToDP('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.textFieldBackground,
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

  const sendRequestForBasicInfo = () => {
    setloading(true);
    const membersIds = [];
    membersIds.push(memberInfo.user_id);
    sendBasicInfoRequest(entity.uid, membersIds, authContext)
      .then(() => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.requestSentText);
        }, 10);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onSelectAddress = (_location) => {
    setCity(_location.city);
    setState(_location.state);
    setCountry(_location.country);

    setLocation(_location.formattedAddress);

    setMemberInfo({
      ...memberInfo,
      mail_city: _location.city,
      mail_state_abbr: _location.state,
      mail_country: _location.country,
      mail_street_address: _location.formattedAddress,
    });
  };

  const setCityandPostal = (street, code) => {
    setLocation(`${street} ${city} ${state} ${country} ${code}`);
    setMemberInfo({
      ...memberInfo,
      mail_street_address: `${street} ${city} ${state} ${country} ${code}`,
    });

    if (code === '') {
      setMemberInfo({...memberInfo, mail_postal_code: code});
    }
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      {memberInfo.connected && (
        <View>
          <TouchableOpacity
            onPress={() => {
              sendRequestForBasicInfo();
            }}
            style={styles.outerContainerStyle}>
            <LinearGradient
              colors={[colors.lightGrey, colors.lightGrey]}
              style={styles.containerStyle}>
              <Text
                style={[styles.buttonText, {color: colors.lightBlackColor}]}>
                {strings.sendRequestText}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.basicInfoText}>
            {strings.collectMemberInfoText}
          </Text>
          <TCThickDivider />
        </View>
      )}

      <View
        style={{
          marginTop: -10,
        }}>
        <TCLabel
          title={strings.gender}
          style={{
            textTransform: 'uppercase',
            lineHeight: 24,
            marginBottom: 10,
          }}
        />
        <TCPicker
          dataSource={DataSource.Gender}
          color={colors.userPostTimeColor}
          placeholder={strings.selectGenderPlaceholder}
          value={memberInfo?.gender}
          onValueChange={(value) =>
            value !== '' && setMemberInfo({...memberInfo, gender: value})
          }
        />
      </View>
      <View>
        <TCLabel
          title={strings.birthDatePlaceholder}
          style={{
            textTransform: 'uppercase',
            lineHeight: 24,
            marginBottom: 10,
          }}
        />
        <TCTouchableLabel
          title={
            memberInfo.birthday &&
            `${`${
              monthNames[new Date(memberInfo.birthday).getMonth()]
            } ${new Date(memberInfo.birthday).getDate()}`}, ${new Date(
              memberInfo.birthday,
            ).getFullYear()}`
          }
          textStyle={{
            textAlign: 'center',

            fontFamily: fonts.RRegular,
          }}
          placeholderTextColor={'#999999'}
          placeholder={strings.birthDatePlaceholder}
          onPress={() => setShowDate(!showDate)}
        />
      </View>

      <TCLabel
        title={strings.height}
        style={{
          textTransform: 'uppercase',
          lineHeight: 24,
          marginBottom: 10,
        }}
      />
      {heightView()}

      <TCLabel
        title={strings.weight}
        style={{
          textTransform: 'uppercase',
          lineHeight: 24,
          marginBottom: 10,
        }}
      />
      {weightView()}

      <View>
        <TCLabel
          title={strings.emailPlaceHolder}
          required={true}
          style={{
            textTransform: 'uppercase',
            lineHeight: 24,
            marginBottom: 10,
          }}
        />
        <TCTextField
          editable={false}
          value={memberInfo.email}
          onChangeText={(text) => setMemberInfo({...memberInfo, email: text})}
          placeholder={strings.addressPlaceholder}
          keyboardType={'email-address'}
        />
      </View>

      <View>
        <TCLabel
          title={strings.phone}
          style={{
            textTransform: 'uppercase',
            lineHeight: 24,
            marginBottom: 10,
          }}
        />
        <FlatList
          data={phoneNumber}
          style={{marginHorizontal: 10}}
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
        elevation={0}
        width={120}
        height={28}
        alignSelf="center"
        styletext={{
          fontFamily: fonts.RBold,
        }}
        marginTop={20}
        onPress={() => addPhoneNumber()}
      />

      <TouchableOpacity
        onPress={() => {
          setVisibleLocationModal(true);
        }}>
        <View
          style={{
            paddingBottom: 20,
          }}>
          <TCLabel
            title={strings.address.toUpperCase()}
            style={{marginBottom: 10, marginTop: 27}}
          />

          <TCTextField
            value={location}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={strings.address}
            pointerEvents="none"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {showDate && (
        <View>
          <DateTimePickerView
            visible={showDate}
            date={date}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            maximumDate={maxDateValue}
            mode={'date'}
          />
        </View>
      )}

      <AddressLocationModal
        visibleLocationModal={visibleLocationModal}
        setVisibleAddressModalhandler={() => setVisibleLocationModal(false)}
        onAddressSelect={onSelectAddress}
        handleSetLocationOptions={onSelectAddress}
        onDonePress={(street, code) => setCityandPostal(street, code)}
      />
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  basicInfoText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 10,
    marginBottom: 23,
    lineHeight: 23,
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
    textAlign: 'center',
  },

  outerContainerStyle: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',

    marginTop: 20,
    marginBottom: 10,
  },
  containerStyle: {
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    width: '100%',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',
    right: 15,
    tintColor: colors.lightBlackColor,
    top: 15,
    width: 12,
  },
});
