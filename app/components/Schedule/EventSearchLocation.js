import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function EventSearchLocation({ onChangeText }) {
  return (
    <View style={ styles.sectionStyle }>
      <TextInput
        style={ styles.textInput }
        placeholder={ strings.searchHereText }
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
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    width: wp('92%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8,
    elevation: 2,
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderWidth: 1,
    color: colors.lightBlackColor,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
});
