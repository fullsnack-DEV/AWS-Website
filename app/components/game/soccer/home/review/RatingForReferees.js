import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCUserRating from '../../../../TCUserRating';

const RatingForReferees = () => (
  <View style={styles.mainContainer}>
    <Text style={styles.titleText}>Ratings for Referees</Text>
    <View style={{ paddingVertical: 10 }}>
      <TCUserRating name={'Mejin Rungminsuikao'} rating={3}/>
      <TCUserRating name={'Gyun Bungsurae'} rating={4} />
      <TCUserRating name={'Eastin Bung'}rating={2} />
    </View>
    <TouchableOpacity>
      <Text style={styles.detailText}>Detail info about ratings</Text>
    </TouchableOpacity>
  </View>)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
  detailText: {
    marginVertical: 5,
    marginRight: 5,
    color: colors.lightBlackColor,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
  },
})
export default RatingForReferees;
