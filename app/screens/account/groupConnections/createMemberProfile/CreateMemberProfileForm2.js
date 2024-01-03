import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';

import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';

import TCFormProgress from '../../../../components/TCFormProgress';
import {strings} from '../../../../../Localization/translation';
import TCPicker from '../../../../components/TCPicker';
import DataSource from '../../../../Constants/DataSource';
import TCLabel from '../../../../components/TCLabel';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import {
  countryCode as countryCodeList,
  monthNames,
  widthPercentageToDP,
} from '../../../../utils';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';

import {heightMesurement, weightMesurement} from '../../../../utils/constant';

import Verbs from '../../../../Constants/Verbs';
import TCTextField from '../../../../components/TCTextField';

import AddressLocationModal from '../../../../components/AddressLocationModal/AddressLocationModal';
import ScreenHeader from '../../../../components/ScreenHeader';
import TCCountryCodeModal from '../../../../components/TCCountryCodeModal';

let entity = {};
export default function CreateMemberProfileForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const isFocused = useIsFocused();

  const [gender, setGender] = useState();
  const [dominant, setDominant] = useState('Right');

  const [birthday, setBirthday] = useState();
  const [showDate, setShowDate] = useState(false);
  const [postalCode, setPostalCode] = useState('');

  const [maxDateValue, setMaxDateValue] = useState(new Date());

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
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [countrycode, setCountryCode] = useState();
  const [countryCodeVisible, setCountryCodeVisible] = useState(false);
  const [currenrIndex, setCurrentIndex] = useState();

  const Pickerref = useRef(null);
  const Pickerref2 = useRef(null);

  useEffect(() => {
    const selectedCountryItem = countryCodeList.find(
      (item) =>
        item.name.toLowerCase() === authContext.user?.country.toLowerCase(),
    );

    let dialCode = selectedCountryItem?.dial_code;

    if (dialCode.startsWith('+')) {
      dialCode = dialCode.substring(1);
    }

    const countryOBJ = {
      country: selectedCountryItem.name,
      code: dialCode,
      iso: selectedCountryItem.code,
    };

    setCountryCode(countryOBJ);
    setPhoneNumber([
      {
        id: 0,
        phone_number: {},
        country_code: countryOBJ,
      },
    ]);
  }, [isFocused]);

  const [phoneNumber, setPhoneNumber] = useState();

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      code: '',
      number: '',
      country_code: countrycode,
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    setMaxDateValue(new Date());
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.city) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      } else {
        setCity('');
        setState('');
        setCountry('');
      }
    }
  }, [isFocused]);

  const pressedNext = useCallback(() => {
    const membersAuthority = {
      ...memberInfo,
      ...route.params.form1,
      group_id: entity.uid,
      is_member: true,
      gender,
      mail_street_address: location,
      mail_city: city,
      mail_state_abbr: state,
      mail_country: country,
      mail_postal_code: postalCode,
      birthday,
    };

    const hasEmptyPhoneNumber = membersAuthority.phone_numbers.some(
      (entry) => Object.keys(entry.phone_number).length === 0,
    );

    if (hasEmptyPhoneNumber) {
      membersAuthority.phone_numbers = [];
    }

    if (entity.role === Verbs.entityTypeTeam) {
      navigation.navigate('CreateMemberProfileTeamForm3', {
        form2:
          entity.obj.sport === 'soccer'
            ? {...membersAuthority, dominant_foot: dominant}
            : membersAuthority,
        comeFrom: route.params?.comeFrom ?? '',
        routeParams: {...(route.params?.routeParams ?? {})},
      });
    } else if (entity.role === Verbs.entityTypeClub) {
      navigation.navigate('CreateMemberProfileClubForm3', {
        form2: membersAuthority,
        comeFrom: route.params?.comeFrom ?? '',
        routeParams: {...(route.params?.routeParams ?? {})},
      });
    }
  }, [
    navigation,
    gender,
    location,
    city,
    state,
    country,
    postalCode,
    birthday,
    dominant,
    memberInfo,
    route.params,
  ]);

  const handleDonePress = (date) => {
    setBirthday(new Date(date));
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const changedValue = (val, index) => {
    const tempCode = [...phoneNumber];

    tempCode[index].country_code = val;
    setPhoneNumber(tempCode);
    const filteredNumber = phoneNumber.filter(
      (obj) =>
        ![null, undefined, ''].includes(obj.phone_number && obj.country_code),
    );

    setMemberInfo({
      ...memberInfo,
      phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
        country_code,
        phone_number,
      })),
    });
  };

  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      numberValue={item.phone_number}
      from={true}
      onCountryCodePress={(val) => {
        setCurrentIndex(index);
        if (val) {
          setCountryCodeVisible(val);
        }
      }}
      onValueChange={(val) => {
        changedValue(val, index);
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

  const openPicker = () => {
    if (Platform.OS === 'android') {
      Pickerref?.current?.focus();
    } else {
      Pickerref.current.togglePicker(true);
    }
  };
  const openPicker2 = () => {
    if (Platform.OS === 'android') {
      Pickerref2?.current?.focus();
    } else {
      Pickerref2?.current?.togglePicker(true);
    }
  };

  const heightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
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
          maxLength={3}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => openPicker()}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <RNPickerSelect
            placeholder={{
              label: strings.heightTypeText,
              value: null,
            }}
            pickerProps={{ref: Pickerref}}
            ref={Platform.OS === 'ios' ? Pickerref : null}
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
            fixAndroidTouchableBug={true}
            value={memberInfo?.height?.height_type}
            useNativeAndroidPickerStyle={true}
            style={{
              placeholder: {
                color: colors.blackColor,
              },
              viewContainer: {
                backgroundColor: colors.lightGrey,
                justifyContent: 'center',
                borderRadius: 5,
                width: widthPercentageToDP('45%'),
                height: 40,
                paddingLeft: Platform.OS === 'ios' ? 0 : 60,
              },
              inputIOS: {
                fontSize: widthPercentageToDP('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,
                width: widthPercentageToDP('45%'),
                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.textFieldBackground,
                borderRadius: 5,
                textAlign: 'center',
                height: 40,
                ...styles.shadowStyle,
              },
            }}
            Icon={() => {
              if (Platform.OS === 'ios') {
                return (
                  <TouchableOpacity onPress={() => openPicker()}>
                    <Image
                      source={images.dropDownArrow}
                      style={styles.miniDownArrow}
                    />
                  </TouchableOpacity>
                );
              }
              return null;
            }}
          />
        </Pressable>
      </View>
    </View>
  );

  const weightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView, ...styles.shadowStyle}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
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
          maxLength={3}
          value={memberInfo?.weight?.weight}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => openPicker2()}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <RNPickerSelect
            placeholder={{
              label: strings.weightTypeText,
              value: null,
            }}
            pickerProps={{ref: Pickerref2}}
            ref={Platform.OS === 'ios' ? Pickerref2 : null}
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
            useNativeAndroidPickerStyle={true}
            style={{
              placeholder: {
                color: colors.blackColor,
              },
              viewContainer: {
                backgroundColor: colors.lightGrey,
                justifyContent: 'center',
                borderRadius: 5,
                width: widthPercentageToDP('45%'),
                height: 40,
                paddingLeft: Platform.OS === 'ios' ? 0 : 60,
              },
              inputIOS: {
                fontSize: widthPercentageToDP('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,
                width: widthPercentageToDP('45%'),
                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.textFieldBackground,
                borderRadius: 5,
                textAlign: 'center',
                height: 40,
                ...styles.shadowStyle,
              },
            }}
            Icon={() => {
              if (Platform.OS === 'ios') {
                return (
                  <TouchableOpacity onPress={() => openPicker2()}>
                    <Image
                      source={images.dropDownArrow}
                      style={styles.miniDownArrow}
                    />
                  </TouchableOpacity>
                );
              }
              return null;
            }}
          />
        </Pressable>
      </View>
    </View>
  );

  const onSelectAddress = (_location) => {
    setCity(_location.city);
    setState(_location.state);
    setCountry(_location.country);
    setPostalCode(_location.postalCode);
    setLocation(_location.formattedAddress);
  };

  const setCityandPostal = (street, code) => {
    setLocation(`${street} ${city} ${state} ${country} ${code}`);

    setPostalCode(code);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.createMemberProfileText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        onRightButtonPress={() => pressedNext()}
        isRightIconText
        rightButtonText={strings.next}
      />
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <ScrollView style={styles.mainContainer}>
        <View>
          <TCLabel
            title={strings.gender.toUpperCase()}
            style={{marginBottom: 10, marginTop: 20}}
          />

          <TCPicker
            dataSource={DataSource.Gender}
            placeholder={strings.choose}
            value={gender}
            onValueChange={(value) => {
              setGender(value);
            }}
          />
        </View>
        <View>
          <TCLabel
            title={strings.birthDatePlaceholder.toUpperCase()}
            style={{marginBottom: 10, marginTop: 25}}
          />

          <TCTouchableLabel
            title={
              birthday &&
              `${`${monthNames[new Date(birthday).getMonth()]} ${new Date(
                birthday,
              ).getDate()}`}, ${new Date(birthday).getFullYear()}`
            }
            placeholder={strings.dateFormatPlaceholder}
            onPress={() => setShowDate(!showDate)}
            textStyle={{textAlign: 'center'}}
          />
        </View>

        <TCLabel
          title={strings.height.toUpperCase()}
          style={{marginBottom: 10, marginTop: 25}}
        />
        {heightView()}

        <TCLabel
          title={strings.weight.toUpperCase()}
          style={{marginBottom: 10, marginTop: 25}}
        />
        {weightView()}
        {authContext.entity.obj.sport === 'soccer' &&
          authContext.entity.role === 'team' && (
            <View>
              <TCLabel
                title={strings.dominantFoot.toUpperCase()}
                style={{marginBottom: 12}}
              />
              <TCPicker
                dataSource={DataSource.dominantFoot}
                placeholder={strings.dominantPlaceholder}
                value={dominant}
                onValueChange={(value) => {
                  setDominant(value);
                }}
              />
            </View>
          )}

        <View>
          <TCLabel
            title={strings.phone.toUpperCase()}
            style={{marginBottom: 10, marginTop: 25}}
          />
          <FlatList
            data={phoneNumber}
            style={{marginHorizontal: 10}}
            renderItem={renderPhoneNumber}
            keyExtractor={(item, index) => index.toString()}></FlatList>
        </View>
        {phoneNumber?.length < 5 && (
          <TCMessageButton
            title={strings.addPhone}
            width={120}
            borderColor={colors.whiteColor}
            color={colors.lightBlackColor}
            alignSelf="center"
            marginTop={15}
            onPress={() => addPhoneNumber()}
            elevation={0}
            backgroundColor={colors.lightGrey}
            styletext={{
              fontFamily: fonts.RBold,
            }}
          />
        )}

        <TouchableWithoutFeedback
          onPress={() => {
            setVisibleLocationModal(true);
          }}>
          <View>
            <TCLabel
              title={strings.address.toUpperCase()}
              style={{marginBottom: 10, marginTop: 25}}
            />

            <TCTextField
              value={location}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={strings.address}
              pointerEvents="none"
              editable={false}
              // multiline={true}
              numberOfLines={4}
              placeholderTextColor={colors.userPostTimeColor}
            />
          </View>
        </TouchableWithoutFeedback>

        {showDate && (
          <View>
            <DateTimePickerView
              visible={showDate}
              date={birthday}
              onDone={handleDonePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              maximumDate={maxDateValue}
              mode={'date'}
            />
          </View>
        )}
        {/* address locationModal */}

        <AddressLocationModal
          visibleLocationModal={visibleLocationModal}
          setVisibleAddressModalhandler={() => setVisibleLocationModal(false)}
          onAddressSelect={onSelectAddress}
          handleSetLocationOptions={onSelectAddress}
          onDonePress={(street, code) => setCityandPostal(street, code)}
        />

        <TCCountryCodeModal
          countryCodeVisible={countryCodeVisible}
          onCloseModal={() => {
            setCountryCodeVisible(false);
          }}
          countryCodeObj={(obj) => {
            changedValue(obj, currenrIndex);
            setCountryCodeVisible(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
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
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    fontSize: widthPercentageToDP('3.5%'),
    paddingHorizontal: 15,

    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: widthPercentageToDP('46%'),
    height: 40,
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: widthPercentageToDP('3.8%'),
    width: '90%',
    textAlign: 'center',
  },
});
