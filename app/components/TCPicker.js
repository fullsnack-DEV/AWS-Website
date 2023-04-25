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
  arrowStyle = {},
  Extrastyles = {},
  placeholderColor = colors.userPostTimeColor,
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
        placeholder: {
          color: placeholderColor,
        },
        ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid),
        ...styles,
        inputIOS: {
          ...Extrastyles,
        },
      }}
      value={value}
      Icon={() => (
        <FastImage
          resizeMode="contain"
          source={images.dropDownArrow}
          style={[styles.downArrow, {...arrowStyle}]}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputAndroid: {
    alignSelf: 'center',

    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 10,
    height: 40,

    textAlign: 'center',
    width: '92%',
  },
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,
    paddingHorizontal: 15,

    width: '92%',
    textAlign: 'center',
  },
  downArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',
    right: 30,
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
  },
});
