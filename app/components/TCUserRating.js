import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCStarRating from './TCStarRating';
import {STAR_COLOR} from '../utils';
import images from '../Constants/ImagePath';

const TCUserRating = ({
  starColor = STAR_COLOR.GREEN,
  name = '',
  profilePic,
  rating,
}) => (
  <View style={styles.mainContainer}>
    {/*  Profile Pic */}
    <View style={{...styles.singleSectionContainer, flex: 0.11}}>
      <FastImage
        source={profilePic ? {uri: profilePic} : images.profilePlaceHolder}
        style={{height: 25, width: 25}}
      />
    </View>

    {/*  Name */}
    <View
      style={{
        ...styles.singleSectionContainer,
        alignItems: 'flex-start',
        flex: 0.52,
      }}>
      <Text style={{...styles.nameText, textAlign: 'left'}}>{name}</Text>
    </View>

    {/* Rating Star */}
    <View style={{...styles.singleSectionContainer, flex: 0.26}}>
      <TCStarRating starColor={starColor} rating={Number(rating)} />
    </View>

    {/* Rating Text */}
    <View style={{...styles.singleSectionContainer, flex: 0.11}}>
      <Text style={styles.ratingNameText}>{Number(rating).toFixed(1)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  singleSectionContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  ratingNameText: {
    textAlign: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
export default TCUserRating;
