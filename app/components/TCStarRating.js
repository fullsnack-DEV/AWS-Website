import React from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import TCStar from './TCStar';
import { STAR_COLOR } from '../utils';

const TCStarRating = ({
  startingFrom = 'left',
  totalRatingCount = 5,
  rating = 0,
  starColor = STAR_COLOR.YELLOW,
}) => {
  const getRating = () => (_.isNaN(rating) ? 0 : rating)

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>

      {/* Direction : Right */}

      {startingFrom === 'right' && Array(Math.floor(totalRatingCount - getRating()))
        .fill()
        .map((item, index) => (
          <View key={index?.toString()}>
            <TCStar color={STAR_COLOR.WHITE}/>
          </View>
        ))}
      {/*  Rating */}
      {Array(Math.floor(getRating()))
        .fill()
        .map((item, index) => (
          <View key={index?.toString()}>
            <TCStar color={starColor}/>
          </View>
        ))}

      {/* Direction : LEFT */}
      {startingFrom === 'left'
        && Array(Math.floor(totalRatingCount - getRating()))
          .fill()
          .map((item, index) => (
            <View key={index?.toString()}>
              <TCStar color={STAR_COLOR.WHITE}/>
            </View>))}

    </View>
  )
}
export default TCStarRating;
