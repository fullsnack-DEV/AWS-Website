import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function CurruentVersionView({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.fieldValue}>Current reservation {'>'}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  fieldValue: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    textAlign: 'right',
    marginRight: 15,
    textDecorationLine: 'underline',
  },
});
