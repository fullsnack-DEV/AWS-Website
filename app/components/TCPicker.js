import React, {useRef} from 'react';
import {StyleSheet, Platform, TouchableOpacity, Pressable} from 'react-native';
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

  placeholderColor = colors.userPostTimeColor,
}) {
  const Pickerref = useRef(null);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      Pickerref?.current?.focus();
    } else {
      Pickerref.current.togglePicker(true);
    }
  };

  return (
    <Pressable onPress={() => openPicker()}>
      <RNPickerSelect
        disabled={disabled}
        onDonePress={onDonePress}
        placeholder={{
          label: placeholder,
          value: placeholderValue,
        }}
        pickerProps={{ref: Pickerref}}
        ref={Platform.OS === 'ios' ? Pickerref : null}
        items={dataSource}
        onValueChange={onValueChange}
        useNativeAndroidPickerStyle={true}
        // eslint-disable-next-line no-sequences
        style={{
          placeholder: {
            color: placeholderColor,
          },

          viewContainer: {
            backgroundColor: colors.lightGrey,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 5,
            width: '92%',
            height: 40,
            paddingLeft: Platform.OS === 'ios' ? 0 : 140,
            ...styles,
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
          // ...styles,
        }}
        value={value}
        Icon={() => {
          if (Platform.OS === 'ios') {
            return (
              <TouchableOpacity onPress={() => openPicker()}>
                <FastImage
                  resizeMode="contain"
                  source={images.dropDownArrow}
                  style={[styles.downArrow, {...arrowStyle}]}
                />
              </TouchableOpacity>
            );
          }
          return null;
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
