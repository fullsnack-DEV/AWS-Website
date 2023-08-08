import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
// import/no-extraneous-dependencies
import RNPickerSelect from 'react-native-picker-select';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function StatsSelectionView({
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
            }}>
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
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 20,
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    paddingRight: 25,
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 15,
  },
});
