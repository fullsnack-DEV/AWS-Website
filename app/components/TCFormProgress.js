import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import colors from '../Constants/Colors';

export default function TCFormProgress({
  totalSteps,
  color = colors.themeColor,
  curruentStep,
  ...props
}) {
  return (
    <View
      style={[
        styles.buttonView,
        {
          backgroundColor: colors.thinDividerColor,
          width: Dimensions.get('window').width,
          height: 5,
        },
        props,
      ]}>
      <View
        style={[
          styles.buttonView,
          {
            backgroundColor: color,
            width: (Dimensions.get('window').width / totalSteps) * curruentStep,
            height: 5,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    backgroundColor: colors.whiteColor,
  },
});
