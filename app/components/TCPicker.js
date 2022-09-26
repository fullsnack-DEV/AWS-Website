import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCPicker({
  dataSource,
  placeholder,
  placeholderValue = '',
  value = '',
  onValueChange = () => {},
  onDonePress = () => {},
  disabled = false,
}) {
  return (
    <RNPickerSelect
      disabled={disabled}
      onDonePress={onDonePress}
      placeholder={{
        label: placeholder,
        value: placeholderValue,
      }}
      items={dataSource}
      onValueChange={onValueChange}
      useNativeAndroidPickerStyle={false}
      // eslint-disable-next-line no-sequences
      style={{
        ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid),
        ...styles,
      }}
      value={value}
      Icon={() => (
        <FastImage
          resizeMode="contain"
          source={images.dropDownArrow}
          style={styles.downArrow}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 10,

    width: '92%',
  },
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,
    paddingHorizontal: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    width: '92%',
  },
  downArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',
    right: 25,
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
  },
});
