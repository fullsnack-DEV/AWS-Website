import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils/index';
import {strings} from '../../../Localization/translation';

export default function BlockSlotView({
  item = {},
  startDate,
  endDate,
  allDay = false,
  selected,
  index,
  slots,
  onPress = () => {},
}) {
  const getTimeFormat = (dateValue) =>
    moment(Utility.getJSDate(dateValue)).format('h:mm a');

  if (selected) {
    return (
      <LinearGradient
        colors={[colors.greenGradientEnd, colors.greenGradientStart]}
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
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}>
        <Text
          style={[styles.fieldValue, {color: colors.whiteColor}]}
          numberOfLines={3}>
          {allDay
            ? strings.allDay
            : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: item.blocked
              ? colors.lightGrayBackground
              : colors.blockColor,
          },
        ]}>
        <Text
          style={[
            styles.fieldValue,
            {
              color: item.blocked ? colors.medianGrayColor : colors.whiteColor,
            },
          ]}
          numberOfLines={3}>
          {allDay
            ? strings.allDay
            : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
        </Text>
        {slots.length - 1 === index && (
          <Text
            style={[
              styles.fieldValue,
              {
                color: item.blocked
                  ? colors.medianGrayColor
                  : colors.whiteColor,
                fontSize: 10,
                marginTop: -2,
              },
            ]}>
            {' '}
            {strings.plusDayOne}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 1,
    flexDirection: 'row',
  },
});
