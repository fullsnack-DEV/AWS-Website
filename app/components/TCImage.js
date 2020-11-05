import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import FastImage from 'react-native-fast-image';

export default function TCImage({
  imageStyle,
  containerStyle,
  defaultSource,
  source,
  resizeMode,
}) {
  return (
    <View style={ containerStyle }>
      <Image
        style={ [{ position: 'absolute' }, imageStyle] }
        defaultSource={ defaultSource }
        resizeMode={ resizeMode }
      />
      <FastImage
          style={ imageStyle }
          source={ source }
          resizeMode={ resizeMode}
        />
    </View>
  );
}

// const styles = StyleSheet.create({
//   containerStyle: {
//     height: 50,
//     width: 50,
//   },
// });
