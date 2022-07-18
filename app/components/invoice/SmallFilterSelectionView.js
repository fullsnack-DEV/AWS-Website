import React from 'react';
import {StyleSheet, Image, View} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function SmallFilterSelectionView({
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
          style: {...styles.inputStyle},
        }}
        value={value}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.downArrow} />
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
    height: 20,
    width: 150,
    alignSelf: 'flex-end',
    backgroundColor: colors.offwhite,
    borderRadius: 90,
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RMedium,

    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    paddingLeft: 15,
  },
  downArrow: {
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 10,
    marginRight: 8,
    marginTop: 6,
  },
});
