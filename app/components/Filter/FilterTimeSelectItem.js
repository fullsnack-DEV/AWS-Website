import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function FilterTimeSelectItem({
  title,
  date,
  time,
  onDatePress,
  onXCirclePress,
  headerTextStyle,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.dateSelectStyle, style]}
      onPress={onDatePress}>
      <Text style={[styles.headerTextStyle, headerTextStyle]}>{title}</Text>
      <Text style={styles.dateTextStyle}>{date}</Text>
      <Text style={[styles.dateTextStyle, {marginLeft: 12}]}>{time}</Text>
      <TouchableOpacity onPress={onXCirclePress}>
        <Image source={images.xCircleImg} style={styles.imageStyle} />
      </TouchableOpacity>
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
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    color: colors.lightBlackColor,
    padding: 10,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
    height: 40,
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  imageStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
});

export default FilterTimeSelectItem;
