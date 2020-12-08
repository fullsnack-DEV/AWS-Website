import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function BirthSelectItem({
  title,
  onItemPress,
}) {
  return (
    <TouchableOpacity style={styles.dateSelectStyle} onPress={onItemPress}>
      <Text style={styles.dateTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dateSelectStyle: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '92%',
    marginTop: 8,
    flexDirection: 'row',
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default BirthSelectItem;
