import React from 'react';
import {StyleSheet, Platform, Image, View, Text} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function EventMonthlySelection({
  dataSource,
  placeholder,
  value,
  onValueChange,
  containerStyle,
  title,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={styles.headerTextStyle}>{title}</Text>
      <RNPickerSelect
        placeholder={{
          label: placeholder,
          value: 'Never',
        }}
        items={dataSource}
        onValueChange={onValueChange}
        useNativeAndroidPickerStyle={true}
        // eslint-disable-next-line no-sequences
        style={
          (Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid,
          {...styles})
        }
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
    width: wp('92%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginBottom: 15,
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    width: wp('20'),
    paddingLeft: 5,
  },
  inputAndroid: {
    alignSelf: 'center',
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 30,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    width: '100%',
  },
  inputIOS: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 30,
    paddingHorizontal: '30%',
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    top: 10,
    width: 15,
  },
});
