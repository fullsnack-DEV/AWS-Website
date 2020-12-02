import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCSlider from './TCSlider';

const TCAttributeRatingWithSlider = ({
  selectedTrackColors,
  setTeamReview,
  title = '',
  rating = 0,
}) => (
  <View style={styles.mainContainer}>

    {/*    Title */}
    <Text style={styles.titleText}>{_.startCase(title)}</Text>

    {/*  Rating Slider */}
    <View style={styles.ratingContainer}>
      <TCSlider
            value={rating}
            selectedTrackColors={selectedTrackColors}
            setValue={(val) => {
              setTeamReview(title, val)
            }}
        />
    </View>

    {/* Rating Text */}
    <Text style={{ ...styles.ratingText, color: selectedTrackColors[0] }}>
      {rating === 0 ? '-' : rating}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'left',
    flex: 0.3,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  ratingContainer: {
    flex: 0.6,
    paddingHorizontal: 10,
  },
  ratingText: {
    color: colors.lightBlackColor,
    flex: 0.1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.RMedium,
  },

})
export default TCAttributeRatingWithSlider;
