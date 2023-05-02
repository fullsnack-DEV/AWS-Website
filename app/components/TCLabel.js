import React from 'react';
import {StyleSheet, Text} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';

function TCLabel({
  isNew = false,
  title,
  style,
  required = false,
  ...otherProps
}) {
  return (
    <Text style={[styles.labelText, style]} {...otherProps}>
      {title}
      {required && <Text style={styles.mendatory}> {strings.star} </Text>}
      {isNew && <Text style={styles.newText}> {strings.newText} </Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  labelText: {
    marginHorizontal: 15,
    marginTop: 35,
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RBold,
    lineHeight: 17,
  },
  mendatory: {
    color: 'red',
  },
  newText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.newTextColor,
    textAlign: 'right',
  },
});

export default TCLabel;
