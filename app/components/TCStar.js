import React from 'react';
import FastImage from 'react-native-fast-image';
import {STAR_COLOR, STAR_IMAGE} from '../utils';

const TCStar = ({size = 14, color = STAR_COLOR.WHITE}) => (
  <FastImage
    resizeMode={'contain'}
    source={STAR_IMAGE[color]}
    style={{
      flex: 1,
      height: size,
      width: size,
      alignSelf: 'center',
      margin: 1,
    }}
  />
);

export default TCStar;
