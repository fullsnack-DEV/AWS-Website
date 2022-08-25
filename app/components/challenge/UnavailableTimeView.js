import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function UnavailableTimeView({
  startDate,
  endDate,
  allDay = false,
}) {
  const getTimeFormat = (dateValue) =>
    moment(new Date(dateValue * 1000)).format('hh:mm A');
  return (
    <View style={{marginLeft: 15, marginRight: 15, marginBottom: 1}}>
      <View style={styles.fieldView}>
        <View
          style={{
            backgroundColor: colors.lightgrayColor,
            flex: 0.4,
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}>
          <Text style={styles.fieldTitle} numberOfLines={1}>
            Blocked zone
          </Text>
        </View>
        <View style={{flex: 0.6}}>
          <Text style={styles.fieldValue} numberOfLines={3}>
            {allDay
              ? 'All day'
              : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginTop: 10,
    height: 25,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 14,
    color: '#8c8c8c',
    fontFamily: fonts.RRegular,
    backgroundColor: '#e2e2e2',
  },
  fieldValue: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
});
