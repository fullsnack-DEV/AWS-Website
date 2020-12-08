import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function LanguageViewInInfo({
  title,
  languageName,
}) {
  return (

    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>{title}</Text>
      <Text style={[styles.titleStyle, { fontFamily: fonts.RRegular, marginTop: 3 }]}>{languageName}</Text>
    </View>

  );
}
const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 10,
    marginTop: 15,
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
});
