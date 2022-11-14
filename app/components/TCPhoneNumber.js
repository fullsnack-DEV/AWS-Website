import React, {memo} from 'react';

import {StyleSheet, Platform, View, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';

import RNPickerSelect from 'react-native-picker-select';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {countryCode} from '../utils';

const TCPhoneNumber = ({
  placeholder,
  value,
  numberValue,
  onValueChange,
  onChangeText,
}) => {
  const onPhoneNumberCountryChanged = async (local_countryCode) => {
    if (onValueChange) {
      onValueChange(local_countryCode);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <RNPickerSelect
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
      />
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
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  halfMatchFeeView: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,

    height: 40,
    paddingHorizontal: 15,
    paddingRight: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 3,
    width: '48%',
  },
  halffeeText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,
    width: '100%',
  },

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
    right: 15,
  },
  inputIOS: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: 175,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  inputAndroid: {
    height: 40,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    width: 170,
    borderRadius: 5,

    elevation: 3,
  },
});

export default memo(TCPhoneNumber);
