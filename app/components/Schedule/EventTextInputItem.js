import React from 'react';
import {
  StyleSheet, View, Text, TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTextInputItem({
  title, onChangeText, value, placeholder, multiline,
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTextStyle}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.textInputStyle}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
        placeholderTextColor={colors.lightgrayColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    marginBottom: 20,
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
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
  },
});

export default EventTextInputItem;
