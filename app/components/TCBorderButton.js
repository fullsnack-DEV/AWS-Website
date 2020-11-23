import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCBorderButton({
  shadow = false, onPress, title = 'title', textColor = colors.themeColor, borderColor = colors.themeColor, fontSize = 14, ...Props
}) {
  return (

    <TouchableOpacity onPress={onPress}>
      <View style={shadow ? [styles.borderButtonView, { borderColor }, styles.shadowView, Props] : [styles.borderButtonView, { borderColor }, Props]}>
        <Text style={[styles.detailButtonText, { color: textColor, fontSize }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  detailButtonText: {
    alignSelf: 'center',
    fontFamily: fonts.RBold,

    textAlign: 'center',

  },
  borderButtonView: {

    backgroundColor: 'white',
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: 20,
    height: 35,
    width: wp('92%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowView: {
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
