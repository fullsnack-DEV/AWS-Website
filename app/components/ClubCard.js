// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {displayLocation} from '../utils';

const ClubCard = ({item = {}, containerStyle = {}, onPress = () => {}}) => (
  <Pressable style={[styles.parent, containerStyle]} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image
        source={item.thumbnail ? {uri: item.thumbnail} : images.clubPatchIcon}
        style={styles.image}
      />
      <View style={styles.clubIcon}>
        <Image source={images.clubPatchIcon} style={styles.image} />
      </View>
    </View>
    <View>
      <Text style={styles.name} numberOfLines={1}>
        {item.group_name}
      </Text>
      <Text style={styles.location}>{displayLocation(item)}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.greyBorderColor,
    borderRadius: 20,
    padding: 8,
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  location: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  clubIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
});
export default ClubCard;
