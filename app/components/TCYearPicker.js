import React, { useEffect, Fragment, useState } from 'react';
import {
  StyleSheet, Platform, Image,

} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'
import images from '../Constants/ImagePath'

export default function TCYearPicker({
  placeholder, value = '', onValueChange = () => {}, onDonePress = () => {},
}) {
  const [yearList, setYearList] = useState([]);
  useEffect(() => {
    const arr = new Array(new Date().getFullYear());
    for (let i = 0; i < new Date().getFullYear(); ++i) arr[i] = { label: (i + 1)?.toString(), value: (i + 1)?.toString() };
    setYearList([...arr]);
  }, [])

  return (
    <Fragment>
      {yearList?.length > 0 && (
        <RNPickerSelect
              onDonePress={onDonePress}
              placeholder={{
                label: placeholder,
                value: '',
              }}
              items={yearList}
              onValueChange={onValueChange}
              useNativeAndroidPickerStyle={false}
              style={{ ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), ...styles }}
              value={value}
              Icon={() => (
                <Image source={images.dropDownArrow} style={styles.downArrow} />
              )}
          />
      )}

    </Fragment>
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
    height: 40,

    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: '92%',
  },
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,

    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.29,
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
