// @flow
import React from 'react';
import {View, StyleSheet} from 'react-native';
import ActivityCard from './ActivityCard';
import GameCard from './GameCard';

const ReviewsList = ({onPressMore = () => {}}) => (
  <View style={styles.parent}>
    <GameCard containerStyle={{marginBottom: 15}} />
    <ActivityCard onPressMore={onPressMore} />
  </View>
);

const styles = StyleSheet.create({
  parent: {},
});
export default ReviewsList;
