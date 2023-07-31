// @flow
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import Verbs from '../Constants/Verbs';

// group Icon

const GroupIcon = ({
  imageUrl = '',
  entityType = Verbs.entityTypeTeam,
  groupName = '',
  containerStyle = {},
  grpImageStyle = {},
  textstyle = {},
  placeHolderStyle = {},
  showPlaceholder = true,
}) => {
  const getPlaceholder = () => {
    let background = images.profilePlaceHolder;
    let placeHolder = '';
    if (entityType === Verbs.entityTypeClub) {
      background = images.clubPlaceholderSmall;
      placeHolder = showPlaceholder ? images.newClubIcon : '';
    } else if (entityType === Verbs.entityTypeTeam) {
      background = images.teamBcgPlaceholder;
      placeHolder = showPlaceholder ? images.newTeamIcon : '';
    } else if (
      entityType === Verbs.entityTypePlayer ||
      entityType === Verbs.entityTypeUser ||
      entityType === Verbs.entityTypeGroupMember
    ) {
      background = images.profilePlaceHolder;
      placeHolder = '';
    }
    return {background, placeHolder};
  };

  return imageUrl ? (
    <View style={[styles.parent, containerStyle]}>
      <FastImage
        source={typeof imageUrl === 'string' ? {uri: imageUrl} : imageUrl}
        style={styles.image}
        resizeMode="contain"
      />
      {getPlaceholder().placeHolder ? (
        <View style={styles.placeHolder}>
          <FastImage
            source={getPlaceholder().placeHolder}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </View>
  ) : (
    <View
      style={[
        styles.parent,
        {
          paddingTop:
            entityType === Verbs.entityTypeTeam ||
            entityType === Verbs.entityTypeClub
              ? 5
              : 0,
        },
        containerStyle,
      ]}>
      <FastImage
        source={getPlaceholder().background}
        style={[
          styles.image,
          entityType === Verbs.entityTypeTeam ||
          entityType === Verbs.entityTypeClub
            ? grpImageStyle
            : {},
        ]}
        resizeMode="contain"
      />
      {(entityType === Verbs.entityTypeClub ||
        entityType === Verbs.entityTypeTeam) &&
      groupName ? (
        <View style={styles.name}>
          <Text style={[styles.text, textstyle]}>
            {groupName[0].toUpperCase()}
          </Text>
        </View>
      ) : null}
      {getPlaceholder().placeHolder ? (
        <View style={[styles.placeHolder, placeHolderStyle]}>
          <FastImage
            source={getPlaceholder().placeHolder}
            style={styles.image}
            resizeMode="contain"
          />
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
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.thinDividerColor,
    borderRadius: 30,
    backgroundColor: colors.whiteColor,
    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius:30
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
  },
});
export default GroupIcon;
