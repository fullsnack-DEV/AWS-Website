import React from 'react';
import {View} from 'react-native';
import _ from 'lodash';
import TCStar from './TCStar';
import {STAR_COLOR} from '../utils';

const TCStarRating = ({
  startingFrom = 'left',
  totalRatingCount = 5,
  rating = 0,
  starColor = STAR_COLOR.YELLOW,
  size = 14,
}) => {
  const getRating = () => (_.isNaN(rating) ? 0 : rating);

  return (
    <View style={{flexDirection: 'row'}}>
      {/* Direction : Right */}

      {startingFrom === 'right' &&
        Array(Math.floor(totalRatingCount - getRating()))
          .fill()
          .map((item, index) => (
            <View key={index?.toString()}>
              <TCStar color={STAR_COLOR.WHITE} size={size} />
            </View>
          ))}
      {/*  Rating */}
      {Array(Math.floor(getRating()))
        .fill()
        .map((item, index) => (
          <View key={index?.toString()}>
            <TCStar color={starColor} size={size} />
          </View>
        ))}

      {/* Direction : LEFT */}
      {startingFrom === 'left' &&
        Array(Math.floor(totalRatingCount - getRating()))
          .fill()
          .map((item, index) => (
            <View key={index?.toString()}>
              <TCStar color={STAR_COLOR.WHITE} size={size} />
            </View>
          ))}
    </View>
  );
};
export default TCStarRating;
