import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import images from '../Constants/ImagePath';
import strings from '../Constants/String';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCSearchBox({
  onChangeText, style, value, placeholderText = strings.searchHereText, editable = true, ...props
}) {
  return (
    <View style={{ ...styles.sectionStyle, ...style } } {...props}>
      <Image source={ images.searchLocation } style={ styles.searchImg } />
      <TextInput
          editable={editable}
          autoCapitalize={'none'}
          autoCompleteType={'off'}
          textContentType={'none'}
          autoCorrect={false}
          value={value}
            style={ styles.textInput }
            placeholder={ placeholderText }
            clearButtonMode="always"
            placeholderTextColor={ colors.userPostTimeColor }
            onChangeText={onChangeText}
           />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: wp('90%'),
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    elevation: 2,

  },
  searchImg: {
    alignSelf: 'center',
    height: 15,
    tintColor: colors.magnifyIconColor,
    resizeMode: 'contain',
    width: 15,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
});
