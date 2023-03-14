import React from 'react';
import {StyleSheet, Platform, Image, View, Text} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

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
          value: Verbs.eventRecurringEnum.Never,
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
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F5F5F5'
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    // av
    width: wp('22'),
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
    // width: '100%',
    // Add new by av
    width: wp('50'),
    marginLeft: 25,
    marginRight: 10,
  },
  inputIOS: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 30,
    // paddingHorizontal: '30%',
    // Av
    width: wp('50'),
    marginLeft: 41,
    marginRight: 10,
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    top: 10,
    width: 15,
  },
});
