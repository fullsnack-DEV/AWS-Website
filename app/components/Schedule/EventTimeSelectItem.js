import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTimeSelectItem({
  title, date, time, onDatePress, toggle, headerTextStyle,
}) {
  return (
    
    <TouchableOpacity style={styles.dateSelectStyle} onPress={onDatePress}>
      <Text style={[styles.headerTextStyle, headerTextStyle]}>{title}</Text>
      <Text style={styles.dateTextStyle}>{date}</Text>
      {toggle && <Text style={[styles.dateTextStyle, { marginLeft: 12 }]}>{time}</Text>}
    </TouchableOpacity>
   
  );
}

const styles = StyleSheet.create({

  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    width: wp('20'),
  },
  dateSelectStyle: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
   
    color: colors.lightBlackColor,
    padding: 10,
   
    fontSize: 16,
    width: wp('92%'),
    fontFamily: fonts.RRegular,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom:15,
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default EventTimeSelectItem;
