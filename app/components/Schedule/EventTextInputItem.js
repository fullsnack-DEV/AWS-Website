import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTextInputItem({
  title,
  onChangeText,
  value,
  placeholder,
  multiline,
  isRequired = false,
  numberOfLines
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTextStyle}>
        {title}{' '}
        {isRequired && <Text style={{color: colors.darkThemeColor}}> *</Text>}{' '}
      </Text>
      <TextInput
        placeholder={placeholder}
        style={multiline ? styles.textAreaStyle : styles.textInputStyle}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.userPostTimeColor}
        autoCapitalize="none"
        autoCorrect={false}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    marginBottom: 10,
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
  textAreaStyle: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    height:150
  }
});

export default EventTextInputItem;
