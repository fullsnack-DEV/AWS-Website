import React from 'react';
import {StyleSheet, View, TextInput, Text, Platform} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTextInput({
  onChangeText,
  value,
  placeholder,
  multiline,
  valueEndTitle,
  valueFirstTitle,
  displayLastTitle,
  displayFirstTitle,
  keyboardType,
  containerStyle,
  textInputStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {displayFirstTitle && (
          <Text style={styles.valueAfterTextStyle}>{valueFirstTitle}</Text>
        )}
        <TextInput
          placeholder={placeholder}
          style={{...styles.textInputStyle, flex: 1, ...textInputStyle}}
          onChangeText={onChangeText}
          value={value}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          right: 10,
          height: '100%',
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: colors.offwhite,
        }}
      >
        {displayLastTitle && (
          <Text style={styles.valueAfterTextStyle}>{valueEndTitle}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
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
