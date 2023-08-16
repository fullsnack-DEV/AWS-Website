// @flow

import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  // Platform,
  Image,
  Pressable,
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
import TCCountryCodeModal from './TCCountryCodeModal';
import TCKeyboardView from './TCKeyboardView';
import Verbs from '../Constants/Verbs';

const EditBasicInfoComponent = ({
  userInfo = {},
  containerStyle = {},
  setUserInfo = () => {},
}) => {
  const [countryCodeVisible, setCountryCodeVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    code: 1,
    country: 'Canada',
  });
  const [visibleAddressModal, setVisibleAddressModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const arr = languageList.map((item) => ({
      ...item,
      isChecked: false,
    }));
    setLanguages(arr);
  }, []);

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

  const renderPhoneNumber = () => {
    if (userInfo?.phone_numbers?.length > 0) {
      return userInfo.phone_numbers.map((item, index) => (
        <View style={[styles.row, {marginBottom: 15}]} key={index}>
          <Pressable
            style={[styles.inputField, styles.row, {flex: 1, marginRight: 7}]}
            onPress={() => setCountryCodeVisible(true)}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={[
                  styles.titleText,
                  {fontFamily: fonts.RRegular, marginBottom: 0},
                ]}>{`${selectedCountryCode.country} (+${selectedCountryCode.code})`}</Text>
            </View>
            <View style={{width: 10, height: 10}}>
              <Image
                source={images.dropDownArrow}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  tintColor: colors.lightBlackColor,
                }}
              />
            </View>
          </Pressable>
          <View style={{flex: 1, marginLeft: 8}}>
            <TextInput
              placeholder={strings.phone}
              placeholderTextColor={colors.userPostTimeColor}
              style={styles.inputField}
              keyboardType={'phone-pad'}
              onChangeText={(text) => {
                const list = [...userInfo.phone_numbers];
                list[index] = {
                  country_code: selectedCountryCode.code,
                  phone_number: text,
                };
                setUserInfo({
                  ...userInfo,
                  phone_numbers: list,
                });
              }}
              value={item.phone_number}
              maxLength={12}
            />
          </View>
        </View>
      ));
    }
    return (
      <View style={styles.row}>
        <Pressable
          style={[styles.inputField, styles.row, {flex: 1, marginRight: 7}]}
          onPress={() => setCountryCodeVisible(true)}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={[
                styles.titleText,
                {fontFamily: fonts.RRegular, marginBottom: 0},
              ]}>{`${selectedCountryCode.country} (+${selectedCountryCode.code})`}</Text>
          </View>
          <View style={{width: 10, height: 10}}>
            <Image
              source={images.dropDownArrow}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                tintColor: colors.lightBlackColor,
              }}
            />
          </View>
        </Pressable>
        <View style={{flex: 1, marginLeft: 8}}>
          <TextInput
            placeholder={strings.phone}
            style={styles.inputField}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setUserInfo({
                ...userInfo,
                phone_numbers: [
                  {
                    country_code: selectedCountryCode.code,
                    phone_number: text,
                  },
                ],
              });
            }}
            value={userInfo.phone_numbers?.[0]?.phone_number}
            maxLength={12}
          />
        </View>
      </View>
    );
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

        <View style={{marginBottom: 24}}>
          <Text style={styles.titleText}>{strings.phone.toUpperCase()}</Text>
          {renderPhoneNumber()}
        </View>

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
            const list = [...userInfo.phone_numbers];
            const obj = {
              country_code: 1,
              phone_number: '',
            };
            list.push(obj);
            setUserInfo({
              ...userInfo,
              phone_numbers: list,
            });
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

        <TCCountryCodeModal
          countryCodeVisible={countryCodeVisible}
          onCloseModal={() => {
            setCountryCodeVisible(false);
          }}
          countryCodeObj={(obj) => {
            setSelectedCountryCode(obj);
            setCountryCodeVisible(false);
          }}
        />

        <LanguagesListModal
          isVisible={showLanguageModal}
          closeList={() => setShowLanguageModal(false)}
          languageList={languages}
          onSelect={handleLanguageSelection}
          onApply={() => {
            setShowLanguageModal(false);
            if (selectedLanguages.length > 0) {
              let name = '';
              selectedLanguages.forEach((item) => {
                name += name ? `, ${item.language}` : item.language;
              });
              setLanguageName(name);
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
