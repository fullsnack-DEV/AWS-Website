// @flow

import React, {useEffect, useState, useContext} from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Pressable,
  FlatList,
} from 'react-native';

// import/no-extraneous-dependencies
import RNPickerSelect from 'react-native-picker-select';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import LanguagesListModal from '../screens/account/registerPlayer/modals/LanguagesListModal';
import {languageList, getJSDate} from '../utils';
import {heightMesurement, weightMesurement} from '../utils/constant';
import AddressLocationModal from './AddressLocationModal/AddressLocationModal';
import TCKeyboardView from './TCKeyboardView';
import * as Utility from '../utils/index';
import Verbs from '../Constants/Verbs';
import TCPhoneNumber from './TCPhoneNumber';
import AuthContext from '../auth/context';

const EditBasicInfoComponent = ({
  userInfo = {},
  containerStyle = {},
  setUserInfo = () => {},
}) => {
  const [visibleAddressModal, setVisibleAddressModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [countrycode, setCountryCode] = useState();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const arr = languageList.map((item) => ({
      ...item,
      isChecked: false,
    }));
    setLanguages(arr);
  }, []);

  const getLanguageName = (language = []) => {
    let language_name = '';
    if (language.length > 0) {
      language.forEach((item, index) => {
        if (item) {
          language_name += `${item}${
            index === language.length - 1 ? '' : ', '
          }`;
        }
      });
    }
    return language_name;
  };

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
  }, [authContext.user.country]);

  useEffect(() => {
    setPhoneNumber(
      // eslint-disable-next-line no-prototype-builtins
      !userInfo.hasOwnProperty('phone_numbers') ||
        userInfo?.phone_numbers?.length === 0
        ? [
            {
              id: 0,
              phone_number: '',
              country_code: countrycode,
            },
          ]
        : userInfo?.phone_numbers,
    );
  }, [countrycode]);

  useEffect(() => {
    if (userInfo.language?.length > 0) {
      const name = getLanguageName(userInfo.language);
      setLanguageName(name);

      const newList = languageList.map((item) => {
        const lang = userInfo.language.find((ele) => ele === item.language);
        const obj = {...item};
        if (lang) {
          obj.isChecked = true;
        } else {
          obj.isChecked = false;
        }
        return obj;
      });
      setLanguages(newList);

      const list = newList.filter((item) => item.isChecked);
      setSelectedLanguages([...list]);
    }
  }, [userInfo.language]);

  const handleLanguageSelection = (lang) => {
    const newList = languages.map((item) => ({
      ...item,
      isChecked: item.id === lang.id ? !item.isChecked : item.isChecked,
    }));
    setLanguages([...newList]);

    const list = newList.filter((item) => item.isChecked);
    setSelectedLanguages([...list]);
  };

  const handleLocation = (_location) => {
    const obj = {...userInfo};
    obj.mail_state_full = _location.state_full;
    obj.mail_city = _location.city;
    obj.mail_state = _location.state;
    obj.mail_country = _location.country;
    obj.mail_street_address = _location.formattedAddress;

    setUserInfo(obj);
  };

  const renderPhoneNumbers = ({item, index}) => (
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

        setUserInfo({
          ...userInfo,
          phone_numbers: filteredNumber,
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

        setUserInfo({
          ...userInfo,
          phone_numbers: filteredNumber,
        });
      }}
    />
  );

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      country_code: countrycode,
      phone_number: {},
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  return (
    <TCKeyboardView>
      <View style={[styles.parent, containerStyle]}>
        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>{strings.gender.toUpperCase()}</Text>
          <Text
            style={[
              styles.titleText,
              {
                fontFamily: fonts.RRegular,
                marginBottom: 0,
                textTransform: 'capitalize',
              },
            ]}>
            {userInfo.gender}
            {/* {userInfo.gender.charAt(0).toUpperCase() + userInfo.gender.slice(1)} */}
          </Text>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>
            {strings.birthDatePlaceholder.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.titleText,
              {
                fontFamily: fonts.RRegular,
                marginBottom: 0,
                textTransform: 'capitalize',
              },
            ]}>
            {moment(getJSDate(userInfo?.birthday)).format('MMM DD,YYYY')}
          </Text>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>{strings.height.toUpperCase()}</Text>
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 7}}>
              <TextInput
                placeholder={strings.height}
                style={[styles.inputField, {textAlign: 'center'}]}
                onChangeText={(text) => {
                  setUserInfo({
                    ...userInfo,
                    height: {
                      height: text,
                      height_type:
                        userInfo.height?.height_type ?? Verbs.defaultHeightType,
                    },
                  });
                }}
                value={userInfo?.height?.height}
                keyboardType="number-pad"
              />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
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
                      height: userInfo.height?.height,
                      height_type: value,
                    },
                  });
                }}
                value={userInfo?.height?.height_type ?? Verbs.defaultHeightType}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputField,
                  inputAndroid: [styles.inputField, {textAlign: 'center'}],
                }}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>{strings.weight.toUpperCase()}</Text>
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 7}}>
              <TextInput
                placeholder={strings.weight}
                style={[styles.inputField, {textAlign: 'center'}]}
                onChangeText={(text) => {
                  setUserInfo({
                    ...userInfo,
                    weight: {
                      weight: text,
                      weight_type:
                        userInfo.weight?.weight_type ?? Verbs.defaultWeightType,
                    },
                  });
                }}
                value={userInfo.weight?.weight}
                keyboardType="number-pad"
              />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.heightTypeText,
                  value: null,
                }}
                items={weightMesurement}
                onValueChange={(value) => {
                  setUserInfo({
                    ...userInfo,
                    weight: {
                      weight: userInfo.weight?.weight,
                      weight_type: value,
                    },
                  });
                }}
                value={userInfo.weight?.weight_type ?? Verbs.defaultWeightType}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputField,
                  inputAndroid: [styles.inputField, {textAlign: 'center'}],
                }}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>
            {strings.languages.toUpperCase()}
          </Text>
          <Pressable onPress={() => setShowLanguageModal(true)}>
            <TextInput
              placeholder={strings.leaguesPlaceholder}
              style={styles.inputField}
              editable={false}
              pointerEvents={'none'}
              value={languageName}
            />
          </Pressable>
        </View>

        <FlatList
          data={phoneNumber}
          renderItem={renderPhoneNumbers}
          keyExtractor={(item, index) => index.toString()}
        />

        <Pressable
          style={{
            backgroundColor: colors.textFieldBackground,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignSelf: 'center',
            borderRadius: 5,
            marginBottom: 50,
          }}
          onPress={() => {
            addPhoneNumber();
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.RBold,
              fontSize: 12,
              lineHeight: 18,
              color: colors.lightBlackColor,
            }}>
            {strings.addPhone}
          </Text>
        </Pressable>

        <View style={{marginBottom: 35}}>
          <Text style={styles.titleText}>
            {strings.mailingAddressText.toUpperCase()}
          </Text>
          <Pressable
            onPress={() => {
              setVisibleAddressModal(true);
            }}
            style={styles.mailingContainer}>
            <Text
              style={[
                styles.mailingText,
                userInfo.mail_formattedAddress || userInfo.mail_street_address
                  ? {color: colors.lightBlackColor}
                  : {color: colors.userPostTimeColor},
              ]}>
              {userInfo.mail_formattedAddress || userInfo.mail_street_address
                ? userInfo.mail_formattedAddress || userInfo.mail_street_address
                : strings.address}
            </Text>
          </Pressable>
        </View>

        <LanguagesListModal
          isVisible={showLanguageModal}
          closeList={() => setShowLanguageModal(false)}
          languageList={languages}
          onSelect={handleLanguageSelection}
          onApply={() => {
            setShowLanguageModal(false);
            if (selectedLanguages.length > 0) {
              const list = selectedLanguages.map((item) => item.language);
              setUserInfo({...userInfo, language: list});
            }
          }}
        />

        <AddressLocationModal
          visibleLocationModal={visibleAddressModal}
          setVisibleAddressModalhandler={() => setVisibleAddressModal(false)}
          onAddressSelect={handleLocation}
          handleSetLocationOptions={handleLocation}
          onDonePress={(street, code) => {
            const obj = {...userInfo};
            obj.mail_postal_code = code;
            obj.mail_street_address = [
              street,
              userInfo.mail_city,
              userInfo.mail_state,
              userInfo.mail_country,
              code,
            ]
              .filter((w) => w)
              .join(', ');
            setUserInfo(obj);
          }}
        />
      </View>
    </TCKeyboardView>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 14,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    backgroundColor: colors.textFieldBackground,
    // paddingVertical: Platform.OS === 'android' ? 5 : 12,
    // paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  miniDownArrow: {
    height: 10,
    resizeMode: 'contain',
    right: 15,
    tintColor: colors.lightBlackColor,
    top: 15,
    width: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mailingContainer: {
    backgroundColor: colors.textFieldBackground,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  mailingText: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: fonts.RRegular,
  },
});
export default EditBasicInfoComponent;
