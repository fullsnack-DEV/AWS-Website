import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

export default function EventView({
  colorView,
  dateMonth,
  date,
  eventTitle,
  title,
  description,
  eventTime,
  eventLocation,
  containerStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={[styles.colorView, colorView]}>
        <Text style={styles.dateMonthText}>{dateMonth}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View>
        <Text style={[styles.eventTitle, eventTitle]} numberOfLines={1}>{title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{description}</Text>
        <View style={styles.bottomView}>
          <Text style={styles.eventTime}>{eventTime}</Text>
          <Text style={[styles.eventTime, { marginHorizontal: 5 }]}> | </Text>
          <Text style={styles.eventTime}>{eventLocation}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
    flexDirection: 'row',
  },
  bottomView: {
    flexDirection: 'row',
    marginLeft: 10,
    paddingVertical: 5,
    marginTop: 15,
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    paddingTop: 10,
    paddingLeft: 5,
    width: wp('12%'),
  },
  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 15,
    marginLeft: 10,
    top: 3,
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,
    marginLeft: 10,
    marginTop: 10,
  },
});
