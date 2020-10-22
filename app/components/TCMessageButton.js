import React from 'react';
import {
  StyleSheet, Text, TouchableWithoutFeedback, View,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCMessageButton({ title = 'Message', onPress, color = colors.greeColor }) {
  return (

    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.buttonView, { borderColor: color }]}>
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
    width: 75,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
