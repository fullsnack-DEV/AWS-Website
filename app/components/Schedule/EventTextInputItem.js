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
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.userPostTimeColor}
        autoCapitalize="none"
        autoCorrect={false}
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
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginVertical: 3,
  },
  textInputStyle: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
});

export default EventTextInputItem;
