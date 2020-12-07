import React from 'react';
import {
  StyleSheet, View, TextInput, Text,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTextInput({
  onChangeText,
  value,
  placeholder,
  multiline,
  valueEndTitle,
  displayLastTitle,
  keyboardType,
  containerStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        style={styles.textInputStyle}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {displayLastTitle && <Text style={styles.valueAfterTextStyle}>{valueEndTitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '92%',
    marginTop: 8,
    flexDirection: 'row',
  },
  textInputStyle: {
    backgroundColor: colors.offwhite,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    maxHeight: hp('12%'),
  },
  valueAfterTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
});

export default EventTextInput;
