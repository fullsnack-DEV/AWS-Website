import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';

import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

function EventColorItem({
  item,
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
      style={[styles.eventColorViewStyle, eventColorViewStyle]}
    >
      {(item?.isSelected || item?.isNew) && (
        <Image
          source={source}
          style={[styles.imageStyle, imageStyle]}
          resizeMode={'contain'}
        />
      )}
      {isNew && item?.color !== '0' && (
        <TouchableOpacity
          onPress={onChangeColorPressed}
          style={{
            position: 'absolute',
            right: -8,
            top: -8,
          }}
        >
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
    width: 30,
    height: 30,
    marginVertical: 8,
    borderRadius: 60,
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
