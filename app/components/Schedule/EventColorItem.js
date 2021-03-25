import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

function EventColorItem({
  eventColorViewStyle,
  imageStyle,
  source,
  onItemPress,
  isNew = false,
  onChangeColorPressed,
}) {
  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={[styles.eventColorViewStyle, eventColorViewStyle]}>
      <Image
        source={source}
        style={[styles.imageStyle, imageStyle]}
        resizeMode={'contain'}
      />
      {isNew && (
        <TouchableOpacity
          onPress={onChangeColorPressed}
          style={{
            position: 'absolute',
            right: -8,
            top: -8,
          }}>
          <Image
            source={images.resetColor}
            style={{
              height: 22,
              width: 22,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventColorViewStyle: {
    backgroundColor: colors.offwhite,
    width: wp('12%'),
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
