import React, {
} from 'react';

import {
  StyleSheet, Platform, Image, View, TextInput,

} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'
import images from '../Constants/ImagePath'

export default function TCPhoneNumber({
  placeholder, value, numberValue, onValueChange, onChangeText,
}) {
  console.log('this value', value)

  const onPhoneNumberCountryChanged = async (local_countryCode) => {
    if (onValueChange) {
      onValueChange(local_countryCode);
    }
  }

  return (
    <View
         style={ styles.mainContainer}>
      <RNPickerSelect
           placeholder={ {
             label: placeholder,
           } }
           items={ [
             { label: 'Canada(+1)', value: 'Canada(+1)' },
             { label: 'United States(+1)', value: 'United States(+1)' },
           ] }
           onValueChange={ onPhoneNumberCountryChanged }
           value={ value }
           // disabled={ !editMode }
           useNativeAndroidPickerStyle={ false }
           // eslint-disable-next-line no-sequences
           style={ (Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), { ...styles } }
           Icon={ () => (
             <Image
                 source={ images.dropDownArrow }
                 style={ styles.miniDownArrow }
               />
           ) }
         />
      <View style={ styles.halfMatchFeeView }>
        <TextInput
             placeholder={ 'Phone number' }
             style={ styles.halffeeText }
             keyboardType={ 'phone-pad' }
             onChangeText={ onChangeText }
             // editable={ editMode }
             value={ numberValue }></TextInput>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    justifyContent: 'space-between',

  },
  halfMatchFeeView: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,

    height: 40,
    paddingHorizontal: 15,
    paddingRight: 10,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 3,
    width: '50%',

  },
  halffeeText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height: 40,
    width: '100%',
  },

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    top: 15,
    width: 12,
    right: 15,
  },
  inputIOS: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: 180,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  inputAndroid: {
    height: 40,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    width: 170,
    borderRadius: 5,

    elevation: 3,
  },
});
