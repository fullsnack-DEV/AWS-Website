/* eslint-disable no-unused-vars */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function NumberOfAttendees({imageURL, isEdit = false}) {
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
            marginLeft: 10,
            marginRight: 15,
          }}>
          Min
        </Text>
        <TextInput
          style={styles.minMaxStyle}
          onChangeText={() => {}}
          value={'0'}
          textAlignVertical={'center'}
          placeholderTextColor={colors.userPostTimeColor}
        />
      </View>
      <Text style={{alignSelf: 'center', flex: 0.16, textAlign: 'center'}}>
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
            marginLeft: 10,
            marginRight: 15,
          }}>
          Max
        </Text>
        <TextInput
          style={styles.minMaxStyle}
          // onChangeText={onChangeText}
          value={'100'}
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
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
});

export default NumberOfAttendees;
