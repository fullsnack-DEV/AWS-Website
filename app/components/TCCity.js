import React, {memo} from 'react';

import {StyleSheet, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCCity = ({
  cities,
  placeholder,
  value,

  onValueChange,
}) => {
  const onCityChanged = async (local_countryCode) => {
    if (onValueChange) {
      onValueChange(local_countryCode);
    }
  };

  return (
    <RNPickerSelect
      placeholder={{
        label: placeholder,
      }}
      items={cities.map((obj) => ({
        label: `${obj.name}`,
        value: obj,
      }))}
      onValueChange={onCityChanged}
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
  );
};
const styles = StyleSheet.create({
  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
    right: 25,
  },
  inputIOS: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '92%',
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    alignSelf: 'center',
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
    width: '92%',
    alignSelf: 'center',
    borderRadius: 5,

    elevation: 3,
  },
});

export default memo(TCCity);
