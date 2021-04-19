import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import moment from 'moment';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function BlockSlotView({ startDate, endDate, allDay = false }) {
  const getTimeFormat = (dateValue) => moment(new Date(dateValue * 1000)).format('hh:mm A');
  return (
    <View
      style={{
        marginTop: 8,

        marginBottom: 8,
        backgroundColor: colors.whiteColor,
        height: 35,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }}>
      <Text style={styles.fieldValue} numberOfLines={3}>
        {allDay
          ? 'All day'
          : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({

  fieldValue: {
    fontSize: 16,
    color: colors.greenGradientStart,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
});
