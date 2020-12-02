import React, { useEffect, useState } from 'react';
import { LinearTextGradient } from 'react-native-text-gradient';
import { Text } from 'react-native';

const TCTextGradiant = ({
  colors,
  start = { x: 0, y: 1 },
  end = { x: 1, y: 0 },
  textStyle = {},
  text,
}) => {
  const [gradientText, setGradiantText] = useState(text);
  useEffect(() => setGradiantText(text), [text])
  return (
    <LinearTextGradient
          style={textStyle}
          useViewFrame={true}
          colors={colors}
          start={start}
          end={end}
          locations={[0, 1]}
    >
      <Text>{gradientText}</Text>
    </LinearTextGradient>
  )
}

export default TCTextGradiant;
