import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import TCStar from './TCStar';
import {STAR_COLOR} from '../utils';

const TCRatingStarSlider = ({
  totalRating = 5,
  currentRating = 0,
  starSize = 22,
  starColor = STAR_COLOR.YELLOW,
  style = {},
  onPress,
}) => {
  const [rating, setRating] = useState(currentRating);
  useEffect(() => setRating(currentRating), [currentRating]);
  return (
    <View style={{...styles.mainContainer, ...style}}>
      <TouchableOpacity
        style={{width: 25}}
        onPress={() => {
          setRating(0);
          onPress(0);
        }}
      />
      {Array(totalRating)
        .fill()
        .map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              onPress(index + 1);
              setRating(index + 1);
            }}>
            <TCStar
              color={index + 1 <= rating ? starColor : STAR_COLOR.WHITE}
              size={starSize}
            />
          </TouchableOpacity>
        ))}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
export default TCRatingStarSlider;
