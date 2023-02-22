import React, {memo} from 'react';

import {StyleSheet, Platform, View, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';

import RNPickerSelect from 'react-native-picker-select';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {countryCode, widthPercentageToDP} from '../utils';

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
    // marginLeft: 8,
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

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
    right: 22,
  },
  inputIOS: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 10,
    paddingHorizontal: 10,

    color: colors.lightBlackColor,
    marginHorizontal: 15,
    paddingRight: 30,
    backgroundColor: colors.textFieldBackground,
    width: widthPercentageToDP('45%'),
    borderRadius: 5,
  },
  inputAndroid: {
    height: 40,
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.textFieldBackground,
    width: widthPercentageToDP('45%'),
    borderRadius: 5,
  },
});

export default memo(TCPhoneNumber);
