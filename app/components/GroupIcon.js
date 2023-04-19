// @flow
import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import Verbs from '../Constants/Verbs';

const GroupIcon = ({
  imageUrl = '',
  entityType = Verbs.entityTypeTeam,
  groupName = '',
  containerStyle = {},
}) => {
  const getPlaceholder = () => {
    let background = null;
    let placeHolder = null;
    if (entityType === Verbs.entityTypeClub) {
      background = images.clubPlaceholderSmall;
      placeHolder = images.newClubIcon;
    } else if (entityType === Verbs.entityTypeTeam) {
      background = images.teamPlaceholderSmall;
      placeHolder = images.newTeamIcon;
    } else if (
      entityType === Verbs.entityTypePlayer ||
      entityType === Verbs.entityTypeUser
    ) {
      background = images.profilePlaceHolder;
      placeHolder = '';
    }
    return {background, placeHolder};
  };
  return imageUrl ? (
    <View style={[styles.parent, containerStyle]}>
      <Image
        source={
          imageUrl && typeof imageUrl === 'string' ? {uri: imageUrl} : imageUrl
        }
        style={styles.image}
      />
      <View style={styles.placeHolder}>
        <Image source={getPlaceholder().placeHolder} style={styles.image} />
      </View>
    </View>
  ) : (
    <View style={[styles.parent, containerStyle]}>
      <Image source={getPlaceholder().background} style={styles.image} />
      {entityType === Verbs.entityTypePlayer ||
      entityType === Verbs.entityTypeUser ? null : (
        <View style={styles.name}>
          <Text style={styles.text}>{groupName[0]}</Text>
        </View>
      )}

      {getPlaceholder().placeHolder ? (
        <View style={styles.placeHolder}>
          <Image source={getPlaceholder().placeHolder} style={styles.image} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.thinDividerColor,
    borderRadius: 30,
    backgroundColor: colors.whiteColor,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 30,
  },
  name: {
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  text: {
    marginTop: -5,
    textAlign: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  placeHolder: {
    width: 15,
    height: 15,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
});
export default GroupIcon;
