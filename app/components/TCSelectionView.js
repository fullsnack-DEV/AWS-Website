import React from 'react';
import {StyleSheet, Image, View} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCSelectionView({
  dataSource,
  placeholder,
  value,
  onValueChange,
  containerStyle,
  onDonePress = () => {},
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <RNPickerSelect
        doneText={'Close'}
        placeholder={{
          label: placeholder,
          value: '',
        }}
        items={dataSource}
        onValueChange={onValueChange}
        onDonePress={onDonePress}
        useNativeAndroidPickerStyle={false}
        textInputProps={{
          style: {...styles.inputStyle, ...styles},
        }}
        value={value}
        Icon={() => (
          <View
            style={{
              justifyContent: 'center',
              top: '40%',
              paddingRight: 5,
            }}
          >
            <Image source={images.dropDownArrow} style={styles.downArrow} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
  },
  inputStyle: {
    height: 45,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 90,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,

    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    paddingLeft: 15,
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 15,
    marginRight: 15,
    marginTop: 8,
  },
});
