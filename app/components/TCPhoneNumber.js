import React, {memo, useState, useContext, useEffect} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  Image,
} from 'react-native';

import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import countryCodeList from '../utils/countryCode.json';
import AuthContext from '../auth/context';
import TCCountryCodeModal from './TCCountryCodeModal';

const TCPhoneNumber = ({
  // eslint-disable-next-line no-unused-vars
  placeholder,
  value,
  numberValue,
  onValueChange,
  onChangeText,
  from = false,
}) => {
  const authContext = useContext(AuthContext);
  const [countryCodeVisible, setCountryCodeVisible] = useState(false);
  const [countrycode, setCountryCode] = useState({
    country: 'India',
    code: '91',
    iso: 'IN',
  });

  const onPhoneNumberCountryChanged = async (local_countryCode) => {
    if (onValueChange) {
      onValueChange(local_countryCode);
    }
  };

  useEffect(() => {
    const countryIndex = countryCodeList.findIndex(
      (item) => item.country === authContext.user.country,
    );

    if (countryIndex !== -1) {
      const updatedCountryList = [...countryCodeList];
      const selectedCountry = updatedCountryList.splice(countryIndex, 1)[0];
      setCountryCode(
        value === undefined || null || '' ? selectedCountry : value,
      );
      if (from) {
        onPhoneNumberCountryChanged(selectedCountry);
      }
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Pressable
        style={[styles.inputField, styles.row, {flex: 1, marginRight: 7}]}
        onPress={() => setCountryCodeVisible(true)}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
            numberOfLines={1}
            style={[
              styles.titleText,
              {fontFamily: fonts.RRegular, marginBottom: 0},
            ]}>
            {value === undefined || null || ''
              ? `${countrycode.iso} (+${countrycode.code})`
              : `${value.iso} (+${value.code})`}
          </Text>
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

      {/* <RNPickerSelect
        placeholder={{
          label: placeholder,
        }}
        items={countryCode.map((obj) => ({
          label: `${obj.code}(${
            obj.dial_code.includes('+') ? obj.dial_code : `+${obj.dial_code}`
          })`,
          value: `${obj.code}(${
            obj.dial_code.includes('+') ? obj.dial_code : `+${obj.dial_code}`
          })`,
        }))}
        onValueChange={onPhoneNumberCountryChanged}
        value={value}
        // disabled={ !editMode }
        useNativeAndroidPickerStyle={false}
        // eslint-disable-next-line no-sequences
        style={{
          ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid),
          ...styles,
        }}
        Icon={() => (
          <FastImage
            resizeMode="contain"
            source={images.dropDownArrow}
            style={styles.miniDownArrow}
          />
        )}
      /> */}
      <View style={styles.halfMatchFeeView}>
        <TextInput
          placeholder={strings.phoneNumber}
          style={styles.halffeeText}
          keyboardType={'number-pad'}
          onChangeText={onChangeText}
          maxLength={10}
          // editable={ editMode }
          value={numberValue}></TextInput>
      </View>

      <TCCountryCodeModal
        countryCodeVisible={countryCodeVisible}
        onCloseModal={() => {
          setCountryCodeVisible(false);
        }}
        countryCodeObj={(obj) => {
          onPhoneNumberCountryChanged(obj);
          setCountryCode(obj);
          setCountryCodeVisible(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',

    marginRight: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  halfMatchFeeView: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    paddingRight: 10,
    marginLeft: 5,

    width: '48%',
  },
  halffeeText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,
    width: '100%',
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
  titleText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(TCPhoneNumber);
