// @flow
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {displayLocation} from '../utils';
import GroupIcon from './GroupIcon';

const TeamCard = ({
  item = {},
  onPress = () => {},
  containerStyle = {},
  // iconStyle = {},
  titleStyle = {},
  locationTextStyle = {},
}) => (
  <Pressable style={[styles.parent, containerStyle]} onPress={onPress}>
    {/* <View style={[styles.iconContainer, iconStyle]}>
      <Image
        source={item.thumbnail ? {uri: item.thumbnail} : images.teamPatchIcon}
        style={styles.image}
      />
      <View style={styles.teamIcon}>
        <Image
          source={
            item.entity_type === Verbs.entityTypeClub
              ? images.newClubIcon
              : images.teamPatchIcon
          }
          style={styles.image}
        />
      </View>
    </View> */}
    <GroupIcon
      imageUrl={item.thumbnil}
      entityType={item.entity_type}
      containerStyle={styles.iconContainer}
      groupName={item.group_name}
      textstyle={{fontSize: 10}}
    />
    <View>
      <Text style={[styles.name, titleStyle]} numberOfLines={1}>
        {item.group_name}
      </Text>
      <Text style={[styles.location, locationTextStyle]}>
        {displayLocation(item)}
      </Text>
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
  // teamIcon: {
  //   width: 15,
  //   height: 15,
  //   alignItems: 'center',
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   position: 'absolute',
  //   right: -3,
  //   bottom: 0,
  // },
  // image: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'contain',
  //   borderRadius: 20,
  // },
});
export default TeamCard;
