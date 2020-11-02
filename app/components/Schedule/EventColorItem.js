import React from 'react';
import {
  StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';

function EventColorItem({
  eventColorViewStyle, imageStyle, source, onItemPress,
}) {
  return (
    <TouchableOpacity style={[styles.eventColorViewStyle, eventColorViewStyle]} onPress={onItemPress}>
      <Image source={source} style={[styles.imageStyle, imageStyle]} resizeMode={'contain'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventColorViewStyle: {
    backgroundColor: colors.offwhite,
    width: wp('16%'),
    height: hp('3.5%'),
    marginVertical: 8,
    borderRadius: 6,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    shadowColor: colors.googleColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 15,
    width: 15,
  },
});

export default EventColorItem;
