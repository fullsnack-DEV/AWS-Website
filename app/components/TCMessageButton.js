import React from 'react';
import {
  StyleSheet, Text, TouchableWithoutFeedback, View,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCMessageButton({
  title = 'Message', onPress, color = colors.greeColor, width = 75, ...props
}) {
  return (

    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.buttonView, { borderColor: color, width }, props]}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>

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
    height: 25,
    justifyContent: 'center',

    backgroundColor: colors.whiteColor,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.greeColor,
    elevation: 2,
  },
  buttonTitle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
  },

});
