import React from 'react';
import { LinearTextGradient } from 'react-native-text-gradient';
import { Text } from 'react-native';

const TCTextGradiant = ({
  colors = [],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  textStyle = {},
  text,
}) => (
  <LinearTextGradient
            style={textStyle}
            locations={[0, 1]}
            colors={colors}
            start={start}
            end={end}>
    <Text>{text}</Text>
  </LinearTextGradient>
)

export default TCTextGradiant;
