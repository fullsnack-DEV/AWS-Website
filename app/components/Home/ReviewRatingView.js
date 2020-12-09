import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function ReviewRatingView({
  title,
  rating,
  ratingCount,
  rateStarSize,
  containerStyle,
  titleStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
      <View style={styles.ratingCountViewStyle}>
        <AirbnbRating
          count={5}
          showRating={false}
          defaultRating={rating}
          size={rateStarSize}
          isDisabled={true}
          selectedColor={'#f49c20'}
        />
        <Text style={styles.ratingCountTextStyle}>{ratingCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  ratingCountViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCountTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    marginLeft: 8,
  },
});

export default ReviewRatingView;
