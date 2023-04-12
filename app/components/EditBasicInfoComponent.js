// @flow

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

import {heightMesurement, weightMesurement} from '../utils/constant';
import AddressLocationModal from './AddressLocationModal/AddressLocationModal';
import TCCountryCodeModal from './TCCountryCodeModal';

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

  const handleLocation = (_location) => {
    const obj = {...userInfo};
    obj.state_full = _location.state_full;
    obj.city = _location.city;
    obj.state = _location.state;
    obj.country = _location.country;
    obj.formattedAddress = _location.formattedAddress;

    setUserInfo(obj);
  };

  const renderPhoneNumber = () => {
    if (userInfo?.phone_numbers?.length > 0) {
      return userInfo.phone_numbers.map((item, index) => (
        <View style={styles.row} key={index}>
          <Pressable
            style={[styles.inputField, styles.row, {flex: 1, marginRight: 7}]}
            onPress={() => setCountryCodeVisible(true)}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={[
                  styles.titleText,
                  {fontFamily: fonts.RRegular, marginBottom: 0},
                ]}>
                {`${selectedCountryCode.country} (+${selectedCountryCode.code})`}
              </Text>
            </View>
            <View style={{width: 20, height: 20}}>
              <Image
                source={images.dropDownArrow}
                style={{width: '100%', height: '100%', resizeMode: 'contain'}}
              />
            </View>
          </Pressable>
          <View style={{flex: 1, marginLeft: 8}}>
            <TextInput
              placeholder={strings.phoneNumber}
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
              ]}>
              {`${selectedCountryCode.country} (+${selectedCountryCode.code})`}
            </Text>
          </View>
          <View style={{width: 20, height: 20}}>
            <Image
              source={images.dropDownArrow}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          </View>
        </Pressable>
        <View style={{flex: 1, marginLeft: 8}}>
          <TextInput
            placeholder={strings.phoneNumber}
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
    <View style={[styles.parent, containerStyle]}>
      <View style={{marginBottom: 30}}>
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

      <View style={{marginBottom: 30}}>
        <Text style={styles.titleText}>
          {strings.birthDatePlaceholder.toUpperCase()}
        </Text>
        <Text
          style={[
            styles.titleText,
            {fontFamily: fonts.RRegular, marginBottom: 0},
          ]}>
          {userInfo?.birthday}
        </Text>
      </View>

      <View style={{marginBottom: 30}}>
        <Text style={styles.titleText}>{strings.height.toUpperCase()}</Text>
        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 7}}>
            <TextInput
              placeholder={strings.height}
              style={styles.inputField}
              onChangeText={(text) => {
                setUserInfo({
                  ...userInfo,
                  height: {
                    height: text,
                    weight_type: userInfo.height?.height_type,
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
              value={userInfo?.height?.height_type}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.inputField,
                inputAndroid: styles.inputField,
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

      <View style={{marginBottom: 30}}>
        <Text style={styles.titleText}>{strings.weight.toUpperCase()}</Text>
        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 7}}>
            <TextInput
              placeholder={strings.weight}
              style={styles.inputField}
              onChangeText={(text) => {
                setUserInfo({
                  ...userInfo,
                  weight: {
                    weight: text,
                    weight_type: userInfo.weight?.weight_type,
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
              value={userInfo.weight?.weight_type}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.inputField,
                inputAndroid: styles.inputField,
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

      <View style={{marginBottom: 30}}>
        <Text style={styles.titleText}>{strings.phone.toUpperCase()}</Text>
        {renderPhoneNumber()}
      </View>

      <View style={{marginBottom: 30}}>
        <Text style={styles.titleText}>
          {strings.mailingAddressText.toUpperCase()}
        </Text>
        <Pressable
          onPress={() => {
            setVisibleAddressModal(true);
          }}>
          <TextInput
            placeholder={strings.streetAddress}
            pointerEvents="none"
            editable={false}
            value={userInfo.formattedAddress || userInfo.street_address}
            style={styles.inputField}
          />
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

      <AddressLocationModal
        visibleLocationModal={visibleAddressModal}
        setVisibleAddressModalhandler={() => setVisibleAddressModal(false)}
        onAddressSelect={handleLocation}
        handleSetLocationOptions={handleLocation}
        onDonePress={(street, code) => {
          const obj = {...userInfo};
          obj.address_postal_code = code;
          obj.street_address = [
            street,
            userInfo.city,
            userInfo.state,
            userInfo.country,
            code,
          ]
            .filter((w) => w)
            .join(', ');
          setUserInfo(obj);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: colors.textFieldBackground,
    paddingVertical: Platform.OS === 'android' ? 5 : 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default EditBasicInfoComponent;
