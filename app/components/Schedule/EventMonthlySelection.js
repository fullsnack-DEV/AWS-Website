import React from 'react';
import {
  StyleSheet, Platform, Image,

} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function EventMonthlySelection({
  dataSource, placeholder, value, onValueChange,
}) {
  return (
    <RNPickerSelect
              placeholder={{
                label: placeholder,
                value: '',
              }}
              items={dataSource}
              onValueChange={onValueChange}
              useNativeAndroidPickerStyle={false}
            // eslint-disable-next-line no-sequences
            style={ (Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), { ...styles } }
              value={value}
              Icon={() => (
                <Image source={images.dropDownArrow} style={styles.downArrow} />
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
    height: 40,

    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    marginVertical: 8,
    width: '98%',
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
    shadowOpacity: 0.5,
    shadowRadius: 1,
    marginVertical: 8,
    width: '98%',
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    right: 25,
    tintColor: colors.grayColor,
    top: 22,
    width: 15,
  },
});
