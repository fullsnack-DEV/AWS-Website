import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';

export default function MonthHeader() {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {moment(new Date()).format('MMMM YYYY')}
        </Text>
      </View>
      <TCThinDivider height={1} width={'100%'} marginBottom={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },

  dateText: {
    fontSize: 15,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
  },
});
