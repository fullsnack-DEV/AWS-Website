import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function SearchView({
  placeholder,
  onChangeText,
  value,
  sectionStyle,
  textInputStyle,
  cancelViewShow,
  onCancelPress,
}) {
  return (
    <View style={styles.containerStyle}>
      <View style={[styles.sectionStyle, sectionStyle]}>
        <Image source={images.searchLocation} style={styles.searchImageStyle} />
        <TextInput
          placeholder={placeholder}
          style={[styles.textInputStyle, textInputStyle]}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
      {cancelViewShow && (
        <TouchableOpacity
          style={styles.cancelViewStyle}
          onPress={onCancelPress}>
          <Image
            source={images.cancelImage}
            style={styles.cancelImageStyle}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.searchGrayColor,
    width: '100%',
    paddingLeft: wp('4%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionStyle: {
    alignItems: 'center',
    borderRadius: 90,
    flexDirection: 'row',
    height: 45,
    width: wp('92%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 0.8,
    elevation: 2,
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderWidth: 1,
    color: colors.lightBlackColor,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInputStyle: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 10,
    width: wp('72%'),
  },
  searchImageStyle: {
    height: 16,
    width: 16,
    tintColor: colors.magnifyIconColor,
    marginHorizontal: 5,
  },
  cancelViewStyle: {
    width: wp('8%'),
    paddingVertical: 5,
  },
  cancelImageStyle: {
    width: 15,
    height: 15,
    alignSelf: 'flex-end',
  },
});
