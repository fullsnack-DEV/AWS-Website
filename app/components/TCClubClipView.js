import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCClubClipView({name, image}) {
  return (
    <View style={styles.clubViewStyle}>
      <Image
        source={image ? {uri: image} : images.clubPlaceholderSmall}
        style={styles.clubImageView}
      />
      <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.textStyle}>
        {name}
      </Text>
      <Image source={images.clubC} style={styles.clubTrademarkStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  clubViewStyle: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 26,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    borderRadius: 10,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.29,
    shadowRadius: 3,
    elevation: 3,
  },
  clubImageView: {
    marginLeft: 10,
    marginRight: 6,
    marginVertical: 3,
    height: 20,
    width: 20,
    borderRadius: 5,
  },
  textStyle: {
    flexShrink: 1,
    fontFamily: fonts.RMedium,
    fontSize: 12,
    alignSelf: 'center',
  },
  clubTrademarkStyle: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    marginHorizontal: 6,
  },
});
