import React from 'react';
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
}) => (
  <View style={{ ...styles.sectionStyle, ...style }} >
    <TextInput
        value={value}
        style={ styles.textInput }
        placeholder={placeHolderText}
        clearButtonMode="always"
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
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    elevation: 2,

  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default TCInputBox;
