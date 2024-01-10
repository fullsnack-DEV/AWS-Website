import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCProfileView({
  image,
  name,
  location,
  type = 'large',
  color = colors.lightBlackColor,
  profileImageStyle = {},
  profileContainerStyle = {},
  ...Props
}) {
  return (
    <View style={[styles.topViewContainer, Props]}>
      <View style={[styles.profileView, profileContainerStyle]}>
        <FastImage
          source={image}
          style={[styles.profileImage, profileImageStyle]}
        />
      </View>
      <View style={styles.topTextContainer}>
        {type === 'medium' && name && (
          <Text style={[styles.mediumNameText, {color}]} numberOfLines={1}>
            {name}
          </Text>
        )}
        {type === 'large' && name && (
          <Text style={[styles.nameText, {color}]} numberOfLines={1}>
            {name}
          </Text>
        )}
        {location && (
          <Text style={[styles.locationText, {color}]} numberOfLines={1}>
            {location}
          </Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  profileImage: {
    alignSelf: 'center',
    height: 30,
    width: 30,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.thinDividerColor,
  },
  topTextContainer: {
    marginLeft: 7,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    // width: 200,
  },
  mediumNameText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    width: 200,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
  },
});
