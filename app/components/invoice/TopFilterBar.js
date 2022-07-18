import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  TextInput,
} from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function TopFilterBar({
  data,
  onFilterPress,
  onChangeText,
  searchValue,
  searchSubmit,
}) {
  console.log(data);
  return (
    <View
      style={{
        backgroundColor: colors.grayBackgroundColor,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      <TextInput
        style={styles.searchTxt}
        returnKeyType="search"
        onChangeText={onChangeText}
        value={searchValue}
        textAlignVertical={'top'}
        onSubmitEditing={searchSubmit}
        placeholder={strings.searchText}
        placeholderTextColor={colors.userPostTimeColor}
      />
      <TouchableOpacity
        onPress={onFilterPress}
        style={{
          marginRight: 30,
          marginTop: 8,
          position: 'absolute',
          right: 0,
        }}
      >
        <Image source={images.settingInvoice} style={styles.settingIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  settingIcon: {
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 20,
  },
  searchTxt: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    paddingLeft: 15,
    paddingRight: 40,

    color: colors.lightBlackColor,

    backgroundColor: colors.offwhite,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
