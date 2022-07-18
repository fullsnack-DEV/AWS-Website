import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCStarRating from './TCStarRating';
import {STAR_COLOR} from '../utils';

const TCTeamsAttributesRating = ({
  starColor = STAR_COLOR.YELLOW,
  ratingName = '',
  firstTeamRating = 0,
  secondTeamRating = 0,
  style,
}) => (
  <View style={{...styles.mainContainer, ...style}}>
    {/*  First Team Rating */}
    <View style={{...styles.singleSectionContainer, flex: 0.11}}>
      <Text style={styles.ratingText}>
        {Number(firstTeamRating).toFixed(1)}
      </Text>
    </View>

    {/*  First Team Rating Star */}
    <View style={{...styles.singleSectionContainer, flex: 0.26}}>
      <TCStarRating
        starColor={starColor}
        startingFrom={'right'}
        rating={Number(firstTeamRating)}
      />
    </View>

    {/* Rating Name */}
    <View style={{...styles.singleSectionContainer, flex: 0.26}}>
      <Text style={styles.ratingNameText}>{ratingName}</Text>
    </View>

    {/*  Second Team Rating */}
    <View style={{...styles.singleSectionContainer, flex: 0.26}}>
      <TCStarRating
        starColor={starColor}
        startingFrom={'left'}
        rating={Number(secondTeamRating)}
      />
    </View>

    {/*  Second Team Rating Star */}
    <View style={{...styles.singleSectionContainer, flex: 0.11}}>
      <Text style={styles.ratingText}>
        {Number(secondTeamRating).toFixed(1)}
      </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    textAlign: 'center',
    fontFamily: fonts.RRegular,
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
export default TCTeamsAttributesRating;
