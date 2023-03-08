// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';

const GameCard = ({containerStyle = {}}) => (
  <View style={[styles.parent, containerStyle]}>
    <View style={styles.row}>
      <Text style={styles.dateTime}>
        {moment().format('ddd, MMM DD · HH:mma')}
      </Text>
      <View style={styles.verticalLineSeparator} />
      <View style={{flex: 1}}>
        <Text
          style={[styles.dateTime, {fontFamily: fonts.RRegular}]}
          numberOfLines={1}>
          777 Pacific Blvd, Vdfdffi…Pacific Blvd, Vdfdffi…
        </Text>
      </View>
    </View>
    <View style={[styles.row, {justifyContent: 'space-between', marginTop: 8}]}>
      <View style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
        <View style={styles.logoContainer}>
          <Image
            source={images.teamPH}
            style={[styles.image, {borderRadius: 15}]}
          />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
            numberOfLines={2}>
            Home Team Home Team
          </Text>
        </View>
      </View>

      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={[styles.score, {color: colors.userPostTimeColor}]}>
          120 <Text style={styles.score}>:</Text>{' '}
          <Text style={[styles.score, styles.winnerScore]}>300</Text>
        </Text>
      </View>

      <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
        <View style={{flex: 1}}>
          <Text
            style={[
              styles.dateTime,
              {fontFamily: fonts.RMedium, textAlign: 'right'},
            ]}
            numberOfLines={2}>
            Away Team Away Team
          </Text>
        </View>
        <View style={[styles.logoContainer, {marginLeft: 5}]}>
          <Image
            source={images.teamPH}
            style={[styles.image, {borderRadius: 15}]}
          />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 7,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    marginRight: 5,
  },
  dateTime: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  verticalLineSeparator: {
    width: 1,
    height: 10,
    backgroundColor: colors.darkGrey,
    marginLeft: 8,
    marginRight: 10,
  },
  score: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  winnerScore: {
    fontFamily: fonts.RBold,
    color: colors.tabFontColor,
  },
});
export default GameCard;
