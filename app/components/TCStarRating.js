import React from 'react';
import { View } from 'react-native';
import TCStar from './TCStar';
import { STAR_COLOR } from '../utils';

const TCStarRating = ({
  startingFrom = 'left',
  totalRatingCount = 5,
  rating = 0,
  starColor = STAR_COLOR.YELLOW,
}) => (
  <View style={{ flexDirection: 'row', flex: 1 }}>

    {/* Direction : Right */}
    {startingFrom === 'right'
    && Array(Math.floor(totalRatingCount - rating))
      .fill()
      .map((item, index) => (
        <View key={index?.toString()}>
          <TCStar color={STAR_COLOR.WHITE}/>
        </View>
      ))}
    {/*  Rating */}
    {Array(Math.floor(rating))
      .fill()
      .map((item, index) => (
        <View key={index?.toString()}>
          <TCStar color={starColor}/>
        </View>
      ))}

    {/* Direction : LEFT */}
    {startingFrom === 'left'
    && Array(Math.floor(totalRatingCount - rating))
      .fill()
      .map((item, index) => (
        <View key={index?.toString()}>
          <TCStar color={STAR_COLOR.WHITE}/>
        </View>))}

  </View>
)
export default TCStarRating;
