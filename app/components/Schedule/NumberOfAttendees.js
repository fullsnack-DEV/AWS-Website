/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';

function NumberOfAttendees({onChangeMinText, onChangeMaxText, min, max}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <View
        style={{
          height: 40,
          backgroundColor: colors.textFieldBackground,
          borderRadius: 5,

          flexDirection: 'row',
          alignItems: 'center',
          flex: 0.42,
        }}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.userPostTimeColor,
            marginHorizontal: 10,
          }}></Text>
        <TextInput
          placeholder={strings.min}
          style={styles.minMaxStyle}
          keyboardType={'number-pad'}
          onChangeText={onChangeMinText}
          value={`${min ?? ''}`}
          textAlignVertical={'center'}
          placeholderTextColor={colors.userPostTimeColor}
        />
      </View>
      <Text
        style={{
          alignSelf: 'center',
          flex: 0.16,
          textAlign: 'center',
        }}>
        -
      </Text>
      <View
        style={{
          height: 40,
          backgroundColor: colors.textFieldBackground,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 0.42,
        }}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.userPostTimeColor,
            marginHorizontal: 10,
          }}></Text>
        <TextInput
          placeholder={strings.max}
          style={styles.minMaxStyle}
          keyboardType={'number-pad'}
          onChangeText={onChangeMaxText}
          value={`${max ?? ''}`}
          textAlignVertical={'center'}
          placeholderTextColor={colors.userPostTimeColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  minMaxStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    height: 40,
    width: '63%',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
});

export default NumberOfAttendees;
