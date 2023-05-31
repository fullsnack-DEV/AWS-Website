import React from 'react';
import {StyleSheet, Platform, Image, View, Text} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
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
      <View style={{flex: 1}}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    // width: wp('92%'),
    // alignSelf: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: colors.lightGrey,
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    // av
    // width: wp('22'),
    // paddingLeft: 5,
  },
  inputAndroid: {
    borderRadius: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    padding: 10,
    marginLeft: 25,
    marginRight: 10,
  },
  inputIOS: {
    borderRadius: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    padding: 10,
    marginLeft: 25,
    marginRight: 10,
  },
  downArrow: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    top: 5,
    width: 15,
  },
});
