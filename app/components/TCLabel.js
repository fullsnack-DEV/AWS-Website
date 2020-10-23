import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

function TCLabel({
  title,
  style,
  ...otherProps
}) {
  return (
    <Text
      style={ [styles.labelText, style] }
      { ...otherProps }
    >
      { title }
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
});

export default TCLabel;
