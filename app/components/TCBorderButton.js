import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCBorderButton({
  onPress, title = 'title', color = colors.themeColor, ...Props
}) {
  return (

    <TouchableOpacity onPress={onPress}>
      <View style={[styles.borderButtonView, { color }, Props]}>
        <Text style={[styles.detailButtonText, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  detailButtonText: {
    alignSelf: 'center',
    fontFamily: fonts.RBold,
    fontSize: 14,
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
});
