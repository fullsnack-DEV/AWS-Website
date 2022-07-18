import {View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

export const ShimmerSeperator = ({
  height = 3,
  color = '#ADADAD',
  style = {},
}) => (
  <View
    style={{
      width: '100%',
      marginVertical: 15,
      height,
      backgroundColor: color,
      borderRadius: 5,
      ...style,
    }}
  />
);

export const ShimmerView = ({
  height,
  width,
  colors = ['#EEEEEE', '#D0D0D0', '#EEEEEE'],
  style,
  borderRadius = 10,
  marginVertical = 5,
}) => (
  <ShimmerPlaceholder
    LinearGradient={LinearGradient}
    height={height}
    shimmerWidthPercent={0.5}
    shimmerColors={colors}
    width={width}
    style={{borderRadius, marginVertical, ...style}}
  />
);
