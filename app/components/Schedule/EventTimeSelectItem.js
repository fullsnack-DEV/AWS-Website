import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTimeSelectItem({
  title, date, time, onDatePress, containerStyle, toggle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={styles.headerTextStyle}>{title}</Text>
      <TouchableOpacity style={styles.dateSelectStyle} onPress={onDatePress}>
        <Text style={styles.dateTextStyle}>{date}</Text>
        {toggle && <Text style={[styles.dateTextStyle, { marginLeft: 12 }]}>{time}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    width: wp('20'),
    paddingLeft: 20,
  },
  dateSelectStyle: {
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.lightBlackColor,
    padding: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0.8,
    fontSize: 16,
    width: wp('72%'),
    fontFamily: fonts.RRegular,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default EventTimeSelectItem;
