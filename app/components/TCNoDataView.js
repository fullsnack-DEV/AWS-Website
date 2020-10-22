import React from 'react';
import {
  StyleSheet, Text, View,

} from 'react-native';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCNoDataView({ title }) {
  return (
    <View style={styles.noDataPlaceholderView}>
      <Text style={styles.noDataPlaceholder}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataPlaceholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataPlaceholder: {
    alignSelf: 'center',
    color: colors.veryLightGray,
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
});
