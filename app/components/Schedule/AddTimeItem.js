import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function AddTimeItem({source, addTimeText, onAddTimePress, containerStyle}) {
  return (
    <TouchableOpacity
      style={[styles.containerStyle, containerStyle]}
      onPress={onAddTimePress}>
      <Image source={source} style={styles.imageStyle} resizeMode={'center'} />
      <Text style={styles.addTimeTextStyle}>{addTimeText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
  },
  imageStyle: {
    width: 10,
    height: 10,
    marginRight: 5,

    marginTop: 2,
  },
  addTimeTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.blackColor,
  },
});

export default AddTimeItem;
