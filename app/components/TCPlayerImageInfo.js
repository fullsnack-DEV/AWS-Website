import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCPlayerImageInfo({
  title,
  player1Image,
  player2Image,
  player1Name,
  player2Name,
  color = colors.lightBlackColor,
  ...Props
}) {
  return (
    <View style={[styles.fieldView, Props]}>
      <Text style={styles.fieldTitle} numberOfLines={2}>
        {title}
      </Text>
      <View style={{flex: 0.68}}>
        <View style={styles.fieldValue}>
          <Image
            source={
              player1Image ? {uri: player1Image} : images.profilePlaceHolder
            }
            style={styles.imageView}
          />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: fonts.RMedium,
              fontSize: 16,
              color,
            }}
            numberOfLines={1}
          >
            {player1Name}
          </Text>
        </View>
        <View style={[styles.fieldValue, {marginTop: 10}]}>
          <Image
            source={
              player2Image ? {uri: player2Image} : images.profilePlaceHolder
            }
            style={styles.imageView}
          />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: fonts.RMedium,
              fontSize: 16,
              color,
            }}
            numberOfLines={1}
          >
            {player2Name}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flex: 0.32,
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginRight: 15,
  },
  imageView: {
    width: 25,
    height: 25,
    borderRadius: 13,
    resizeMode: 'cover',
  },
});
