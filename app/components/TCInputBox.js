import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCInputBox = ({
  placeHolderText = 'Input here',
  onChangeText,
  onFocus,
  style,
  value,
  multiline = false,
  textInputStyle,
  editable = true,
  isClear = true,
}) => (
  <View style={{ ...styles.sectionStyle, ...style }} >
    <TextInput
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
        style={{ ...styles.textInput, ...textInputStyle }}
        placeholder={placeHolderText}
        clearButtonMode= {isClear ? 'always' : 'never'}
        placeholderTextColor={ colors.userPostTimeColor }
        onChangeText={onChangeText}
        onFocus={onFocus}
    />
  </View>
)

const styles = StyleSheet.create({
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: wp('90%'),
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 1,

  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default memo(TCInputBox);
