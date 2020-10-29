import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'
import strings from '../Constants/String';

function TCLabel({
  title,
  style,
  required = false,
  ...otherProps
}) {
  return (
    <Text
      style={ [styles.labelText, style] }
      { ...otherProps }
    >
      { title }{required && <Text style={ styles.mendatory }> {strings.star}</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  labelText: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
  },
  mendatory: {
    color: 'red',
  },
});

export default TCLabel;
