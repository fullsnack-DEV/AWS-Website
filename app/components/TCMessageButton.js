import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCMessageButton({
  title = 'Message',
  onPress,
  color = colors.greeColor,
  width = 75,
  height = 25,
  borderColor,
  styletext,
  ...props
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.buttonView,
          {borderColor: borderColor ?? color, width, height},
          props,
        ]}>
        <Text style={[styles.buttonTitle, {color}, styletext]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,

    justifyContent: 'center',

    backgroundColor: colors.whiteColor,
    shadowColor: colors.grayColor,

    borderWidth: 1,
    borderColor: colors.greeColor,
  },
  buttonTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
  },
});
