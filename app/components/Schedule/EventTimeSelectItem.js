import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTimeSelectItem({
  title,
  date,
  time,
  onDatePress,
  toggle,
  headerTextStyle,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.dateSelectStyle, style]}
      onPress={onDatePress}>
      <View>
        <Text style={[styles.headerTextStyle, headerTextStyle]}>{title}</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          flex: 1,
        }}>
        <Text style={styles.dateTextStyle}>{date},</Text>
        {toggle && (
          <Text style={[styles.dateTextStyle, {marginLeft: 5}]}>{time}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  dateSelectStyle: {
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    color: colors.lightBlackColor,
    padding: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.completeTextColor,
  },
});

export default EventTimeSelectItem;
