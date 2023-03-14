import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import fonts from '../../Constants/Fonts';

function AddTimeItem({source, addTimeText, onAddTimePress, containerStyle}) {
  return (
    <TouchableOpacity
      style={[styles.containerStyle, containerStyle]}
      onPress={onAddTimePress}>
      <Image source={source} style={styles.imageStyle} resizeMode={'contain'} />
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
    borderColor: '#F5F5F5',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  imageStyle: {
    width: 10,
    height: 10,
    marginRight: 5,
    tintColor: '#333',
  },
  addTimeTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: '#333',
  },
});

export default AddTimeItem;
