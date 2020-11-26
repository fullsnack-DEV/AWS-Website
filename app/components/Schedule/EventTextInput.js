import React from 'react';
import {
  StyleSheet, View, TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTextInput({
  onChangeText, value, placeholder, multiline,
}) {
  return (
    <View style={styles.containerStyle}>
      <TextInput
        placeholder={placeholder}
        style={styles.textInputStyle}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
  },
  textInputStyle: {
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0.8,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    maxHeight: hp('12%'),
  },
});

export default EventTextInput;
