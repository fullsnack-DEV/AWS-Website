import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Picker} from '@react-native-picker/picker';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';

export default function EventMonthlySelection({
  dataSource = [],
  placeholder = '',
  value = '',
  onValueChange = () => {},
  containerStyle = {},
  title = '',
  titleStyle = {},
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={{flex: 1}}>
        <Text style={[styles.headerTextStyle, titleStyle]}>{title}</Text>
      </View>
      <View style={{flex: 1}}>
        <Picker
          mode="dropdown"
          placeholder={placeholder}
          selectedValue={value}
          onValueChange={(itemValue) => {
            onValueChange(itemValue);
          }}>
          <Picker.Item
            label={placeholder}
            value={Verbs.eventRecurringEnum.Never}
          />
          {dataSource.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {/* <Picker
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
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: colors.textFieldBackground,
  },
  headerTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
