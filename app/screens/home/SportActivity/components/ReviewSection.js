// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const ReviewSection = ({onSeeAll = () => {}, ratings = 0}) => (
  <View style={styles.parent}>
    <View style={styles.row}>
      <Text style={styles.title}>{strings.reviews}</Text>
      {/* <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.buttonText}>{strings.seeAllText}</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.nextIcon} onPress={onSeeAll}>
        <Image source={images.rightArrow} style={styles.image} />
      </TouchableOpacity>
    </View>

    <View style={[styles.row, {marginBottom: 0}]}>
      <View>
        <Text style={styles.label}>
          {strings.overallRatingsText} ({ratings})
        </Text>
      </View>
      <View style={[styles.row, {marginBottom: 0}]}>
        <AirbnbRating
          count={5}
          defaultRating={ratings}
          showRating={false}
          size={23}
          isDisabled
          selectedColor={colors.themeColor}
        />
        <Text
          style={[
            styles.label,
            {
              color: colors.userPostTimeColor,
              fontFamily: fonts.RMedium,
              marginLeft: 10,
            },
          ]}>
          {parseFloat(ratings).toFixed(1)}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  // buttonText: {
  //   fontSize: 12,
  //   lineHeight: 18,
  //   color: colors.themeColor,
  //   fontFamily: fonts.RRegular,
  // },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  nextIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 4,
    backgroundColor: colors.grayBackgroundColor,
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default ReviewSection;
