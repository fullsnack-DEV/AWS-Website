import React from 'react';
import {
  StyleSheet, Platform, Image, View, Text,

} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function EventMonthlySelection({
  dataSource, placeholder, value, onValueChange, containerStyle, title,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={styles.headerTextStyle}>{title}</Text>
      <View style={{ width: wp('72%') }}>
        <RNPickerSelect
          placeholder={{
            label: placeholder,
            value: '',
          }}
          items={dataSource}
          onValueChange={onValueChange}
          useNativeAndroidPickerStyle={true}
          // eslint-disable-next-line no-sequences
          style={ (Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), { ...styles } }
          value={value}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.downArrow} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    width: wp('20'),
    paddingLeft: 20,
  },
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
    width: '100%',
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
    width: '100%',
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    right: 15,
    tintColor: colors.grayColor,
    top: 12,
    width: 15,
  },
});
